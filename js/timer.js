// Wall-clock timestamps include navigation, refreshes, and time in the background.
export function restoreTimer(value, now = Date.now()) {
  if (!value || !Number.isFinite(value.startedAt) || value.startedAt < 0 || value.startedAt > now) return {startedAt:now, completedAt:null};
  const completedAt = Number.isFinite(value.completedAt) && value.completedAt >= value.startedAt && value.completedAt <= now ? value.completedAt : null;
  return {startedAt:value.startedAt, completedAt};
}

export function elapsedMilliseconds(timer, now = Date.now()) {
  return Math.max(0, (timer.completedAt ?? now) - timer.startedAt);
}

export function stopTimer(timer, now = Date.now()) {
  return {...timer, completedAt:timer.completedAt ?? Math.max(timer.startedAt, now)};
}

export function elapsedParts(milliseconds) {
  const seconds = Math.floor(Math.max(0, milliseconds) / 1000);
  return {minutes:Math.floor(seconds / 60), seconds:seconds % 60};
}

export function clockText(milliseconds) {
  const parts = elapsedParts(milliseconds);
  return `${String(parts.minutes).padStart(2,'0')}:${String(parts.seconds).padStart(2,'0')}`;
}

export function durationText(milliseconds) {
  const {minutes, seconds} = elapsedParts(milliseconds);
  return `${minutes} minute${minutes === 1 ? '' : 's'} ${seconds} second${seconds === 1 ? '' : 's'}`;
}
