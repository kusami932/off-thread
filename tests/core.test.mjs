import test from 'node:test';
import assert from 'node:assert/strict';
import {CONFIG, FILTERS} from '../js/config.js';
import {PRODUCTS,ADS,CATALOG_ORDER} from '../js/products.js';
import {assessSpend,evaluateCart,normalizeCart,totalCents,productById,inStock,matchesProduct,validPayment} from '../js/core.js';

const tee = {id:'tee',color:'White',size:'M',quantity:2};
const jeans = {id:'jeans',color:'Blue',size:'M',quantity:2};

test('inclusive spending bounds accept 88–100 and reject outside values',()=>{
  for(const cents of [8800,8801,9000,9999,10000])assert.equal(assessSpend(cents).status,'success');
  assert.equal(assessSpend(8799).status,'below-minimum');
  assert.equal(assessSpend(10001).status,'over-budget');
});
test('empty, over-budget, and below-minimum selections have separate outcomes',()=>{
  assert.equal(evaluateCart([]).status,'empty');
  assert.equal(evaluateCart([tee]).status,'below-minimum');
  assert.equal(evaluateCart([{...tee,quantity:6}]).status,'over-budget');
});
test('both 88 and 100 dollar orders have real in-stock product combinations',()=>{
  const washed=productById('jeans-washed');
  const cart=[{...tee,quantity:1},{...jeans,quantity:1},{id:washed.id,color:washed.colors[0],size:'M',quantity:1}];
  assert.equal(totalCents(cart),8800);assert.equal(evaluateCart(cart).status,'success');
  assert.ok(cart.every(line=>inStock(productById(line.id),line.color,line.size)));
  assert.equal(evaluateCart([tee,jeans]).status,'success');
});
test('spend alone decides success, not number of items',()=>{
  const bomber={id:'bomber',color:'Black',size:'M',quantity:1};
  assert.equal(evaluateCart([tee,bomber]).status,'success');
  assert.equal(evaluateCart([tee,jeans]).status,'success');
});
test('cart deletion recalculates exact cents and never preserves a stale total',()=>{
  const cart=[tee,jeans];assert.equal(totalCents(cart),10000);
  assert.equal(totalCents(cart.filter(line=>line.id!=='tee')),6400);
  assert.equal(totalCents([{...tee,quantity:3}]),5400);
});
test('exactly eleven products have fixed stock restrictions with a six/five split',()=>{
  const shoppable=PRODUCTS.filter(p=>!p.isAd);
  const pattern=p=>p.sizes.filter(size=>p.colors.every(color=>!inStock(p,color,size))).join('/');
  assert.equal(shoppable.filter(p=>pattern(p)==='S/M').length,6);
  assert.equal(shoppable.filter(p=>pattern(p)==='L').length,5);
  assert.equal(shoppable.filter(p=>pattern(p)==='').length,11);
  for(const p of shoppable) {
    assert.ok(p.colors.every(color=>p.sizes.some(size=>inStock(p,color,size))),p.id);
    for(const size of p.sizes)assert.equal(new Set(p.colors.map(color=>inStock(p,color,size))).size,1,p.id);
  }
  const graphic=productById('graphic-tee-black');
  for(let i=0;i<5;i++)assert.equal(inStock(graphic,'Black','M'),false);
  assert.equal(inStock(graphic,'Black','S'),false);
  assert.equal(inStock(graphic,'Black','L'),true);
  assert.equal(inStock(productById('tee'),'White','L'),false);
  assert.equal(inStock(productById('tee'),'White','M'),true);
});
test('stored cart data is normalized and invalid variants cannot become purchases',()=>{
  assert.deepEqual(normalizeCart(null),[]);
  assert.deepEqual(normalizeCart([{id:'made-up',color:'White',size:'M',quantity:1}]),[]);
  assert.deepEqual(normalizeCart([{...tee,quantity:-1},{...tee,quantity:1.2},{id:'graphic-tee-black',color:'Black',size:'M',quantity:1}]),[]);
  assert.deepEqual(normalizeCart([tee,{...tee,quantity:3}]),[{...tee,quantity:5}]);
});
test('filter brands combine with OR and different properties with AND',()=>{
  const result=PRODUCTS.filter(p=>matchesProduct(p,'',['nike','puma','green']));
  assert.deepEqual(result.map(p=>p.id),['green-jacket','bomber','polo','knit']);
  assert.ok(result.every(p=>p.colors.includes('Green')));
  assert.deepEqual(PRODUCTS.filter(p=>matchesProduct(p,'',['pants','outer','puma'])).map(p=>p.id),['jeans','bomber']);
});
test('price ranges have approved boundaries, including same-type OR',()=>{
  const p=productById('tee');
  const match=(cents,filters)=>matchesProduct({...p,priceCents:cents},'',filters);
  assert.equal(match(2500,['around30']),true);assert.equal(match(3500,['around30']),true);
  assert.equal(match(2499,['around30']),false);assert.equal(match(3501,['around30']),false);
  assert.equal(match(5000,['under50']),false);assert.equal(match(10000,['over100']),false);
  assert.equal(match(10001,['over100']),true);assert.equal(match(1800,['over100','under50']),true);
});
test('search covers approved fields, ignores case, and composes with filters',()=>{
  const p=productById('jeans');
  assert.equal(matchesProduct(p,'BLUE puma denim',[]),true);
  assert.equal(matchesProduct(p,'pants',['under50']),true);
  assert.equal(matchesProduct(p,'blue',['nike']),false);
  assert.equal(matchesProduct(p,'not-a-product',[]),false);
});
test('only exact test values in the approved field order can pass',()=>{
  assert.equal(validPayment(['968','4871928904556523','12/30']),true);
  assert.equal(validPayment(['4242424242424242','12/30','123']),false);
  assert.equal(validPayment(['123','4242 4242 4242 4242','12/30']),false);
  assert.equal(validPayment(['123','4242424242424242','1230']),false);
  assert.equal(validPayment(['123','4242424242424242','12/31']),false);
});

test('new price filters use strict thresholds, while checkout limits are inclusive',()=>{
  const p=productById('tee');
  for(const [id,threshold,side] of [['under100',10000,-1],['under70',7000,-1],['over10',1000,1],['over30',3000,1]]) {
    assert.equal(matchesProduct({...p,priceCents:threshold},'',[id]),false);
    assert.equal(matchesProduct({...p,priceCents:threshold+side},'',[id]),true);
  }
});
test('new categories OR together and intersect with material, brand, and price',()=>{
  const id=label=>FILTERS.find(f=>f.label===label).id;
  const jeans=productById('jeans-washed');
  assert.equal(matchesProduct(jeans,'',[id('chino'),id('jeans'),id('denim'),id('under 70')]),true);
  assert.equal(matchesProduct(jeans,'',[id('jeans'),id('linen')]),false);
  assert.equal(PRODUCTS.filter(p=>matchesProduct(p,'',[id('Doc-Marten')])).length,0);
});
test('catalog contains the exact requested additions and distinct tee colors',()=>{
  assert.equal(PRODUCTS.length,33);
  const added=PRODUCTS.filter(p=>p.addedIn==='v2');assert.equal(added.length,23);
  const counts={};for(const p of added)counts[p.garmentKind]=(counts[p.garmentKind]||0)+1;
  assert.deepEqual(counts,{'jeans':2,'chino':2,'sweatpants':1,'graphic-tee':5,'plain-tee':5,'long-tee':3,'long-shirt':3,'short-shirt':2});
  const tees=added.filter(p=>['graphic-tee','plain-tee'].includes(p.garmentKind));
  assert.equal(new Set(tees.map(p=>p.colors[0])).size,10);
  assert.equal(FILTERS.length,111);assert.equal(new Set(FILTERS.map(f=>f.id)).size,111);
});
test('new payment values reject old and near-matching numbers',()=>{
  assert.equal(validPayment(['123','4242424242424242','12/30']),false);
  assert.equal(validPayment(['968','4871928904556524','12/30']),false);
  assert.equal(validPayment(['968','4871 9289 0455 6523','12/30']),false);
  assert.equal(validPayment(['968','4871928904556523','12/31']),false);
});

test('four ads lead and seven are mixed below in a fixed 33-card catalog',()=>{
  assert.equal(ADS.length,11);
  assert.equal(PRODUCTS.filter(p=>!p.isAd).length,22);
  assert.equal(new Set(ADS.map(ad=>ad.sourceProductId)).size,11);
  assert.deepEqual(CATALOG_ORDER.slice(0,4),ADS.slice(0,4).map(ad=>ad.sourceProductId));
  assert.equal(CATALOG_ORDER.slice(4).filter(id=>productById(id).isAd).length,7);
  assert.equal(productById(CATALOG_ORDER[4]).isAd,undefined);
  assert.ok(CATALOG_ORDER.slice(22).some(id=>productById(id).isAd));
  assert.equal(CATALOG_ORDER.length,33);
  assert.equal(new Set(CATALOG_ORDER).size,33);
});
test('advertisement-only entries remain filterable but are removed from restored carts',()=>{
  const ad=productById(ADS[0].sourceProductId);
  assert.equal(matchesProduct(ad,ad.brand,[]),true);
  assert.equal(inStock(ad,ad.colors[0],'M'),false);
  const stale={id:ad.id,color:ad.colors[0],size:'M',quantity:2};
  assert.deepEqual(normalizeCart([stale,tee]),[tee]);
});
