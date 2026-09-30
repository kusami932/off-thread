// Documentation utility only. No storage, network requests, analytics, or payments.
const records = [];
const fields = {
  participant: '', dateBuild: '', taskVersion: '2', condition: 'Anti-UX',
  priorExposure: '', browserViewport: '', start: '', end: '', recognized: '',
  stopwatchSeconds: '', interruption: '0', outcome: 'unmeasured', rejectedAdds: '',
  invalidPayments: '', resetErrors: '', budgetRejects: '', belowMinimumRejects: '',
  retries: '', observerHelp: false, cheatsheet: false, siteHelp: false,
  calculationAid: '', notes: '',
};
const outcomes = ['unmeasured', 'independent success', 'assisted success', 'abandoned', 'technical interruption'];
const el = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function input(row, key, label, type = 'text') {
  return `<label>${label}<input data-key="${key}" type="${type}" ${type === 'number' ? 'min="0" step="1"' : ''} ${type === 'datetime-local' ? 'step="1"' : ''} value="${escape(row[key])}"></label>`;
}
function select(row, key, label, options) {
  return `<label>${label}<select data-key="${key}">${options.map(([value, text]) => `<option value="${value}" ${row[key] === value ? 'selected' : ''}>${text}</option>`).join('')}</select></label>`;
}
function render() {
  el('records').innerHTML = records.map((r, i) => `<section class="record" data-index="${i}"><h2>Participant record ${i + 1}</h2><div class="record-grid">
    ${input(r, 'participant', 'Anonymous participant ID')}
    ${input(r, 'dateBuild', 'Date / build / condition order')}
    ${select(r, 'taskVersion', 'Task revision', [['2', '2 — $88–$100 inclusive'], ['1', '1 — legacy maximum-spending task']])}
    ${select(r, 'condition', 'Condition', [['Anti-UX', 'Anti-UX'], ['Normal UI', 'Normal UI']])}
    ${input(r, 'priorExposure', 'Prior exposure to site / solution')}
    ${input(r, 'browserViewport', 'Browser / viewport / zoom')}
    ${input(r, 'calculationAid', 'Calculation aids used')}
    ${input(r, 'start', 'App opening / attempt start', 'datetime-local')}
    ${input(r, 'end', 'System completion / stopped', 'datetime-local')}
    ${input(r, 'recognized', 'Recognition time, optional and separate', 'datetime-local')}
    ${input(r, 'stopwatchSeconds', 'Observed app duration in seconds, optional', 'number')}
    ${input(r, 'interruption', 'External interruption (seconds)', 'number')}
    ${select(r, 'outcome', 'Outcome', outcomes.map(v => [v, v]))}
    ${input(r, 'rejectedAdds', 'Rejected adds', 'number')}
    ${input(r, 'invalidPayments', 'Invalid payment attempts', 'number')}
    ${input(r, 'resetErrors', 'Unintended third-Yes resets', 'number')}
    ${input(r, 'budgetRejects', 'Above-$100 rejections', 'number')}
    ${input(r, 'belowMinimumRejects', 'Below-$88 rejections (revision 2)', 'number')}
    ${input(r, 'retries', 'Checkout retries', 'number')}
    ${['observerHelp', 'cheatsheet', 'siteHelp'].map((key, j) => `<label class="check"><input data-key="${key}" type="checkbox" ${r[key] ? 'checked' : ''}>${['Observer hint used', 'Separate cheatsheet used', 'Site Payment help used'][j]}</label>`).join('')}
    <label>Notes / assistance / timing source<textarea data-key="notes" rows="3">${escape(r.notes)}</textarea></label>
    </div><p class="record-result" id="record-result-${i}"></p><button class="remove-record" data-remove="${i}">Remove record</button></section>`).join('');
  document.querySelectorAll('.record').forEach(section => section.querySelectorAll('[data-key]').forEach(field => field.addEventListener('input', () => {
    records[Number(section.dataset.index)][field.dataset.key] = field.type === 'checkbox' ? field.checked : field.value;
    summarize();
  })));
  document.querySelectorAll('[data-remove]').forEach(button => button.onclick = () => { records.splice(Number(button.dataset.remove), 1); render(); });
  summarize();
}
function duration(r) {
  let raw, source;
  if (r.stopwatchSeconds !== '') {
    raw = Number(r.stopwatchSeconds);
    source = 'observed app stopwatch';
  } else {
    if (!r.start || !r.end) return null;
    raw = (new Date(r.end) - new Date(r.start)) / 1000;
    source = 'opening/completion timestamps';
  }
  const interruption = Number(r.interruption);
  if (!Number.isFinite(raw) || raw < 0 || !Number.isFinite(interruption) || interruption < 0 || interruption > raw) return { error: true };
  return { raw, adjusted: raw - interruption, source };
}
function classification(r) { return r.outcome === 'independent success' && (r.observerHelp || r.cheatsheet) ? 'assisted success' : r.outcome; }
function mean(items) { return items.length ? items.reduce((a, b) => a + b, 0) / items.length : null; }
function summarize() {
  const valid = [];
  records.forEach((r, i) => {
    const time = duration(r), result = el('record-result-' + i);
    if (!time || r.outcome === 'unmeasured') result.textContent = 'UNMEASURED — enter observed duration or timestamps, and outcome.';
    else if (time.error) result.textContent = 'INVALID — check duration, timestamps, and interruption length.';
    else {
      result.textContent = `Raw: ${time.raw}s · Adjusted: ${time.adjusted}s · ${classification(r)} · ${time.source}${r.taskVersion !== '2' ? ' · LEGACY: excluded from revision-2 results' : ''}`;
      if (r.taskVersion === '2') valid.push({ r, time });
    }
  });
  const anti = valid.filter(x => x.r.condition === 'Anti-UX');
  const independent = anti.filter(x => classification(x.r) === 'independent success').map(x => x.time.adjusted);
  const assisted = anti.filter(x => classification(x.r) === 'assisted success').map(x => x.time.adjusted);
  const attempts = anti.filter(x => classification(x.r) !== 'technical interruption');
  const average = mean(independent), baseline = Number(el('baseline').value);
  const baselineValid = Number.isFinite(baseline) && baseline > 0;
  const reviewed = el('baseline-revalidated').checked;
  const fmt = x => x === null ? 'UNMEASURED' : x.toFixed(1) + ' seconds';
  const ratio = average !== null && baselineValid ? average / baseline : null;
  const normal = valid.filter(x => x.r.condition === 'Normal UI' && classification(x.r) === 'independent success').map(x => x.time.adjusted);
  const metrics = [
    ['Independent Anti-UX mean', fmt(average)],
    ['Independent completions / attempts', anti.length ? `${independent.length} / ${attempts.length}` : 'UNMEASURED'],
    ['Assisted mean / count', assisted.length ? `${fmt(mean(assisted))} / ${assisted.length}` : 'UNMEASURED'],
    ['Abandoned trials', anti.length ? String(anti.filter(x => classification(x.r) === 'abandoned').length) : 'UNMEASURED'],
    ['Technical interruptions', anti.length ? String(anti.filter(x => classification(x.r) === 'technical interruption').length) : 'UNMEASURED'],
    ['Legacy revision-1 records excluded', String(records.filter(r => r.taskVersion !== '2').length)],
    ['Normal UI measured mean', fmt(mean(normal))],
    ['Selected baseline', baselineValid ? `${baseline} seconds (${el('basis').value}; ${reviewed ? 'revalidated' : 'revalidation pending'})` : 'INVALID'],
    ['Anti-UX mean / selected baseline', ratio === null ? 'UNMEASURED' : ratio.toFixed(2) + '×' + (reviewed ? '' : ' — provisional')],
    ['At least fivefold?', ratio === null ? 'NOT YET DETERMINED' : !reviewed ? 'NOT ESTABLISHED — revalidate baseline first' : ratio >= 5 ? 'YES — for this recorded sample' : 'NO — for this recorded sample'],
  ];
  el('results').innerHTML = metrics.map(([a, b]) => `<div class="metric"><span>${a}</span><strong>${escape(b)}</strong></div>`).join('');
}
el('add').onclick = () => { records.push({ ...fields }); render(); };
el('baseline').oninput = summarize;
el('basis').onchange = summarize;
el('baseline-revalidated').onchange = summarize;
el('export').onclick = () => {
  const payload = { version: 2, taskRevision: 2, baselineSeconds: el('baseline').value, baselineBasis: el('basis').value, baselineRevalidated: el('baseline-revalidated').checked, rationale: el('rationale').value, records };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const a = document.createElement('a'); a.href = url; a.download = 'off-thread-human-study-revision-2.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
};
el('import').onchange = async event => {
  try {
    const payload = JSON.parse(await event.target.files[0].text());
    if (![1, 2].includes(payload.version) || !Array.isArray(payload.records) || !Number.isFinite(Number(payload.baselineSeconds)) || Number(payload.baselineSeconds) <= 0) throw Error('Invalid study file.');
    const imported = payload.records.map(r => {
      if (!r || typeof r !== 'object') throw Error('Invalid record.');
      const clean = { ...fields };
      for (const key of Object.keys(fields)) if (typeof r[key] === typeof fields[key]) clean[key] = r[key];
      clean.taskVersion = payload.version === 1 ? '1' : clean.taskVersion === '1' ? '1' : '2';
      clean.condition = clean.condition === 'Normal UI' ? 'Normal UI' : 'Anti-UX';
      if (!outcomes.includes(clean.outcome)) clean.outcome = 'unmeasured';
      if (payload.version === 1 && r.suboptimalRejects) clean.notes += `\nLegacy below-maximum rejection count: ${String(r.suboptimalRejects)}. This is not a revision-2 below-$88 count.`;
      return clean;
    });
    records.splice(0, records.length, ...imported);
    el('baseline').value = payload.baselineSeconds;
    el('basis').value = payload.baselineBasis === 'measured' ? 'measured' : 'estimated';
    el('baseline-revalidated').checked = payload.version === 2 && payload.baselineRevalidated === true;
    el('rationale').value = String(payload.rationale || '');
    el('import-error').textContent = payload.version === 1 ? 'Imported legacy revision-1 records; they are excluded from revision-2 results.' : '';
    render();
  } catch { el('import-error').textContent = 'Unable to import. Choose a valid exported study JSON file.'; }
};
render();
