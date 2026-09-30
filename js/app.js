import {CONFIG, FILTERS} from './config.js';
import {PRODUCTS, CATALOG_ORDER, ADS} from './products.js';
import {productById, money, inStock, lineKey, normalizeCart, evaluateCart, matchesProduct, validPayment} from './core.js';
import {restoreTimer, elapsedMilliseconds, stopTimer, clockText, durationText} from './timer.js';

const app = document.querySelector('#app');
const modal = document.querySelector('#modal');
const modalContent = document.querySelector('#modal-content');
const feedback = document.querySelector('#add-feedback');
let cart = readSession(CONFIG.storageKey, []);
cart = normalizeCart(cart);
saveSession(CONFIG.storageKey,cart);
let receipt = readSession(CONFIG.receiptKey, null);
let timer = restoreTimer(readSession(CONFIG.timerKey, null));
saveSession(CONFIG.timerKey, timer);
let query = '';
let selectedFilters = [];
let selection = {color:'',size:''};
let payment = ['', '', ''];
let confirmStep = 0;
let modalReturnFocus = null;
let browseScroll = 0;
let currentRoute = '';

function readSession(key, fallback) {
  try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveSession(key, value) {
  try {sessionStorage.setItem(key,JSON.stringify(value));} catch { /* Browsing still works if storage is disabled. */ }
}
function updateStopwatch() {
  const elapsed = elapsedMilliseconds(timer);
  const clock = document.querySelector('#task-time');
  clock.textContent = clockText(elapsed);
  clock.setAttribute('datetime', `PT${Math.floor(elapsed / 1000)}S`);
  clock.setAttribute('aria-label', durationText(elapsed));
}
function resetAttempt() {
  cart=[];persistCart();receipt=null;saveSession(CONFIG.receiptKey,null);
  timer=restoreTimer(null);saveSession(CONFIG.timerKey,timer);updateStopwatch();
  payment=['','',''];query='';selectedFilters=[];browseScroll=0;
}
updateStopwatch();
// Display updates do not gate or delay any action.
setInterval(updateStopwatch, 250);
function persistCart() {saveSession(CONFIG.storageKey,cart);}
function escapeHTML(value) {return String(value).replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function photo(p, extra = '') {return `<img src="./assets/${p.image}" alt="${escapeHTML(p.name)}" ${extra}>`;}
function go(route) {if(location.hash === route) render(); else location.hash=route;}

document.documentElement.style.setProperty('--motion-distance',CONFIG.motionDistancePx+'px');
document.documentElement.style.setProperty('--motion-duration',(CONFIG.motionDistancePx/CONFIG.motionSpeedPxPerSecond)+'s');

function shop() {
  app.innerHTML = `<section class="collection-intro"><div><p class="eyebrow">Collection 01 / Fall 2026</p><h1>The everyday <em>edit.</em></h1><p class="intro-copy">Familiar pieces. A different point of view.</p></div><aside class="task-box"><div class="task-label">YOUR TASK <strong>$100 BUDGET</strong></div><p>Complete an order with a product total between $88 and $100, inclusive.</p><small>Spend matters, not item count. Repeat purchases allowed; no quantity limit. Shipping and tax: $0.</small></aside></section>
  <form class="search-form" id="search-form"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input id="search" aria-label="Search the collection" placeholder="Search the collection" autocomplete="off" value="${escapeHTML(query)}"><button type="submit">Search</button></form>
  <div class="filter-box" aria-label="Collection filters">${FILTERS.map(f => `<button class="filter-chip" data-filter="${f.id}" aria-pressed="${selectedFilters.includes(f.id)}">${f.label}</button>`).join('')}</div>
  <div class="collection-meta"><span>Explore the collection</span><button class="text-button" id="clear-filters">Clear search & filters</button></div><div id="catalog"></div>`;
  drawCatalog();
  document.querySelector('#search-form').addEventListener('submit',event=>{event.preventDefault();query=document.querySelector('#search').value;drawCatalog();});
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.filter;selectedFilters=selectedFilters.includes(id)?selectedFilters.filter(x=>x!==id):[...selectedFilters,id];button.setAttribute('aria-pressed',String(selectedFilters.includes(id)));drawCatalog();
  }));
  document.querySelector('#clear-filters').addEventListener('click',resetSearch);
}

function resetSearch(){query='';selectedFilters=[];shop();}
function drawCatalog() {
  const products=CATALOG_ORDER.map(productById).filter(p=>matchesProduct(p,query,selectedFilters));
  const container=document.querySelector('#catalog');
  if(!products.length){container.className='empty';container.innerHTML='<p class="eyebrow">No matches</p><h2>Nothing in this selection.</h2><p>Try another search or clear the filters to return to the collection.</p><button class="button secondary" id="recover-search">Clear search & filters</button>';document.querySelector('#recover-search').onclick=resetSearch;return;}
  container.className='catalog';
  const columnCount=Number(getComputedStyle(container).getPropertyValue('--catalog-columns')) || 4;
  const columns=Array.from({length:columnCount},()=>[]);
  const heights=Array(columnCount).fill(0);
  const gap=parseFloat(getComputedStyle(container).columnGap) || 17;
  const width=(container.clientWidth-(columnCount-1)*gap)/columnCount;
  container.dataset.columns=columnCount;
  products.forEach((p,index)=>{
    // A-2/A-4: ads and products retain identical photo-only styling.
    const ad=ADS.find(a=>a.sourceProductId===p.id);
    const image=`<img src="./assets/${p.image}" alt="" draggable="false" decoding="async">`;
    const card=ad
      ? `<button class="product-card ${p.shape}" data-ad="${ad.id}" aria-label="View collection item ${index+1}">${image}</button>`
      : `<a class="product-card ${p.shape}" href="#/product/${p.id}" aria-label="View collection item ${index+1}" data-product="${p.id}">${image}</a>`;
    // Fill the shortest column, keeping the first four ads at the top and
    // preserving the mixed order of subsequent ads and products.
    const column=heights.indexOf(Math.min(...heights));
    columns[column].push(card);
    heights[column]+=width*({short:1.03,medium:1.22,tall:1.48}[p.shape] || 1.22)+gap;
  });
  container.innerHTML=columns.map(cards=>`<div class="catalog-column">${cards.join('')}</div>`).join('');
  container.querySelectorAll('[data-ad]').forEach(button=>button.onclick=()=>showAd(button.dataset.ad));
}

function showDialog(title, body, {kind='notice', actions='', closeButton=true}={}) {
  if(modal.open)modal.close();
  modalReturnFocus=document.activeElement;
  modal.dataset.kind=kind;
  modalContent.innerHTML=`<div class="modal-inner ${kind==='confirmation'?'confirmation':''}">${closeButton?'<button class="modal-close" aria-label="Close dialog">×</button>':''}<p class="eyebrow">OFF/THREAD</p><h2 id="modal-title">${title}</h2>${body}${actions}</div>`;
  const close=modalContent.querySelector('.modal-close');
  if(close)close.onclick=closeDialog;
  modal.showModal();
}
function closeDialog(){
  modal.close();confirmStep=0;
  if(modalReturnFocus?.isConnected)modalReturnFocus.focus();
}
for(const type of ['copy','cut','dragstart','contextmenu'])modal.addEventListener(type,event=>{
  if(modal.dataset.kind==='payment-help')event.preventDefault();
});
modal.addEventListener('cancel',event=>{
  // Escape always cancels safely. On the third question it must NOT mean No/pay.
  event.preventDefault();closeDialog();
});

function showAd(id){
  const ad=ADS.find(a=>a.id===id);
  if(!ad)return;
  showDialog(ad.title,`<p class="eyebrow">Simulated advertisement</p>${photo(productById(ad.sourceProductId),'class="ad-image"')}<p>${ad.body}</p>`,{kind:'advertisement'});
}

function detail(id){
  const p=productById(id);
  if(!p||p.isAd){go('#/shop');return;}
  selection={color:'',size:''};
  app.innerHTML=`<a class="back-link" href="#/shop">Back to collection</a><section class="detail"><div class="detail-image">${photo(p)}</div><div class="detail-info"><p class="eyebrow">${p.brand} / ${p.type}</p><h1>${p.name}</h1><p class="price">${money(p.priceCents)}</p><p class="product-description">${p.description}</p><fieldset class="option-group"><legend>Color</legend><div class="option-buttons">${p.colors.map(color=>`<button class="option" data-color="${color}" aria-pressed="false">${color}</button>`).join('')}</div></fieldset><fieldset class="option-group"><legend>Size</legend><div class="option-buttons">${p.sizes.map(size=>`<button class="option" data-size="${size}" aria-pressed="false">${size}</button>`).join('')}</div></fieldset><button class="button add-button" id="add-to-bag">Add to bag</button><div class="detail-meta">${p.id.toUpperCase()} / ONE ITEM PER ADDITION<br>Fictional catalog item. Product photo is illustrative.</div></div></section>`;
  for(const type of ['color','size'])document.querySelectorAll(`[data-${type}]`).forEach(button=>button.onclick=()=>{
    selection[type]=button.dataset[type];
    document.querySelectorAll(`[data-${type}]`).forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  });
  document.querySelector('#add-to-bag').onclick=()=>{
    feedback.textContent='';
    if(!selection.color||!selection.size){showDialog('Choose your options.','<p>Select a color and a size before adding this item to your bag.</p>');return;}
    if(!inStock(p,selection.color,selection.size)){
      showDialog('This option is sold out.','<p>The color and size you selected are unavailable. Choose another combination or return to the collection.</p>',{kind:'sold-out'});return;
    }
    const newLine={id:p.id,...selection,quantity:1};
    const existing=cart.find(line=>lineKey(line)===lineKey(newLine));
    if(existing)existing.quantity++;else cart.push(newLine);
    persistCart();
    // B-2: the only success signal is the tiny remote red strip. No navigation.
    feedback.textContent=`Added to bag: ${p.name} / ${selection.color} / ${selection.size}.`;
  };
}

function renderCart(){
  app.innerHTML=`<a class="back-link" href="#/shop">Back to collection</a><div class="page-heading"><div><p class="eyebrow">Your selection / Checkout</p><h1>The shopping bag.</h1></div></div><div class="cart-layout"><section><div class="cart-list">${cart.length?cart.map(line=>{
    const p=productById(line.id);
    return `<article class="cart-item" data-line="${escapeHTML(lineKey(line))}">${photo(p)}<div><p class="eyebrow">${p.brand}</p><h2>${p.name}</h2><p class="item-options">${line.color} / ${line.size}<br>Quantity: ${line.quantity}</p><button class="text-button remove" data-remove="${escapeHTML(lineKey(line))}">Remove</button></div><div class="item-price">${money(p.priceCents)}<small>PER ITEM</small></div></article>`;
  }).join(''):'<div class="empty"><h2>Your bag is empty.</h2><p>Choose an item from the collection to begin.</p><a class="button secondary" href="#/shop">Explore the collection</a></div>'}</div><a class="text-button cart-return" href="#/shop">Continue browsing</a></section><aside class="checkout"><p class="eyebrow">The last details</p><h2>Payment information</h2><p class="checkout-note">Fill in your card information. For guidance, check below for help.</p><form id="payment-form" autocomplete="off" novalidate><div class="payment-inputs">${payment.map((value,i)=>`<input type="text" id="payment-${i+1}" aria-label="Payment input ${i+1}" autocomplete="off" spellcheck="false" autocapitalize="off" value="${escapeHTML(value)}">`).join('')}</div><button type="button" class="text-button payment-help" id="payment-help">Payment help</button><button type="submit" class="button" id="pay" ${cart.length?'':'disabled'}>Pay</button><p class="field-error" id="payment-error" role="alert"></p></form><p class="checkout-footnote">No real payment is processed.<br>Your test payment values are never saved or sent.</p></aside></div>`;
  document.querySelectorAll('[data-remove]').forEach(button=>button.onclick=()=>{
    cart=cart.filter(line=>lineKey(line)!==button.dataset.remove);persistCart();renderCart();
  });
  payment.forEach((_,i)=>{
    const field=document.querySelector(`#payment-${i+1}`);
    field.addEventListener('input',event=>payment[i]=event.target.value);
    // C-1: payment values must be transcribed manually, without paste/drop shortcuts.
    for(const type of ['paste','drop'])field.addEventListener(type,event=>event.preventDefault());
    field.addEventListener('beforeinput',event=>{
      if(['insertFromPaste','insertFromPasteAsQuotation','insertFromDrop'].includes(event.inputType))event.preventDefault();
    });
  });
  document.querySelector('#payment-help').onclick=()=>showDialog('Test payment guide.',`<p>Enter these exact values, from top to bottom. Do not add spaces.</p><ol class="modal-help"><li>CVC — three digits<code>${CONFIG.testPayment[0]}</code></li><li>Card number — sixteen digits, no spaces<code>${CONFIG.testPayment[1]}</code></li><li>Expiration — MM/YY, including the slash<code>${CONFIG.testPayment[2]}</code></li></ol><p>These are fixed simulation values. Only these values are accepted.</p>`,{kind:'payment-help'});
  document.querySelector('#payment-form').onsubmit=event=>{
    event.preventDefault();
    const error=document.querySelector('#payment-error');
    if(!cart.length){error.textContent='Your bag is empty. Add an item before paying.';return;}
    if(!validPayment(payment)){error.textContent=CONFIG.paymentError;return;}
    error.textContent='';showConfirmation(1);
  };
}

function showConfirmation(step){
  const titles=['Are you sure you want to pay?','You sure?','Change Information?'];
  showDialog(titles[step-1],'',{
    kind:'confirmation',closeButton:false,
    actions:'<div class="modal-actions"><button class="button" id="confirm-yes">Yes</button><button class="button secondary" id="confirm-no">No</button></div>'
  });
  confirmStep=step;
  document.querySelector('#confirm-yes').onclick=()=>{
    if(confirmStep<3){showConfirmation(confirmStep+1);return;}
    closeDialog();payment=['','',''];renderCart();document.querySelector('#payment-1').focus();
  };
  document.querySelector('#confirm-no').onclick=()=>{
    const final=confirmStep===3;
    closeDialog();
    if(final)finishOrder();
  };
}

function finishOrder(){
  const result=evaluateCart(cart);
  if(result.status==='empty'){showDialog('Your bag is empty.','<p>Add an item before placing an order.</p>');return;}
  if(result.status==='over-budget'){
    payment=['','',''];renderCart();
    showDialog('Your selection exceeds the budget.','<p>Remove items from your bag, then re-enter the test payment information and try again.</p>',{kind:'over-budget'});return;
  }
  if(result.status==='below-minimum'){
    showDialog('Your selection is below the target.','<p>Choose products totaling at least $88 and no more than $100, then try again.</p>',{kind:'below-minimum'});return;
  }
  timer=stopTimer(timer);saveSession(CONFIG.timerKey,timer);updateStopwatch();
  receipt={items:cart.map(line=>({...line})),completedAt:new Date(timer.completedAt).toISOString(),elapsedMs:elapsedMilliseconds(timer)};
  saveSession(CONFIG.receiptKey,receipt);
  cart=[];persistCart();payment=['','',''];
  go('#/complete');
}

function complete(){
  if(!receipt||!Number.isFinite(receipt.elapsedMs)||evaluateCart(normalizeCart(receipt.items)).status!=='success'){go('#/shop');return;}
  app.innerHTML=`<section class="success"><div class="success-mark" aria-hidden="true">✓</div><p class="eyebrow">Order complete / Task accomplished</p><h1>Congratulations!</h1><p>You completed your order within the $88–$100 target.<br>Your simulated order is complete. No payment was taken.</p><p class="completion-time">You completed the task in<br><strong>${durationText(receipt.elapsedMs)}</strong>.</p><div class="receipt">${normalizeCart(receipt.items).map(line=>`<p><span>${productById(line.id).name}<br><small>${line.color} / ${line.size} · Quantity: ${line.quantity}</small></span><span>${money(productById(line.id).priceCents)} each</span></p>`).join('')}</div><button class="button" id="new-attempt">Start a new attempt</button></section>`;
  document.querySelector('#new-attempt').onclick=()=>{resetAttempt();go('#/shop');};
}

function render(){
  const route=location.hash||'#/shop';
  // Returning to shopping after completion begins timing before any browsing.
  if(timer.completedAt !== null && route !== '#/complete') resetAttempt();
  if(currentRoute==='#/shop')browseScroll=window.scrollY;
  if(modal.open)modal.close();
  feedback.textContent='';
  if(currentRoute==='#/cart'&&route!=='#/cart')payment=['','',''];
  currentRoute=route;
  if(route==='#/shop'){shop();window.scrollTo(0,browseScroll);document.title='OFF/THREAD — The everyday edit';}
  else if(route.startsWith('#/product/')){detail(route.slice('#/product/'.length));window.scrollTo(0,0);document.title='OFF/THREAD — Item details';}
  else if(route==='#/cart'){renderCart();window.scrollTo(0,0);document.title='OFF/THREAD — Your bag';}
  else if(route==='#/complete'){complete();window.scrollTo(0,0);document.title='OFF/THREAD — Order complete';}
  else go('#/shop');
}

window.addEventListener('resize',()=>{
  const catalog=document.querySelector('#catalog.catalog');
  if(catalog && Number(catalog.dataset.columns)!==Number(getComputedStyle(catalog).getPropertyValue('--catalog-columns'))) drawCatalog();
});
window.addEventListener('hashchange',render);
window.addEventListener('pageshow',event=>{if(event.persisted){payment=['','',''];render();}});
render();
