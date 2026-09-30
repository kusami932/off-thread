import test from 'node:test';
import assert from 'node:assert/strict';
import {restoreTimer,elapsedMilliseconds,stopTimer,clockText,durationText} from '../js/timer.js';

test('first visit starts automatically; reload preserves the initial timestamp',()=>{
  const first=restoreTimer(null,10000);
  assert.deepEqual(first,{startedAt:10000,completedAt:null});
  const reloaded=restoreTimer(JSON.parse(JSON.stringify(first)),25000);
  assert.equal(elapsedMilliseconds(reloaded,75000),65000);
});
test('wall-clock elapsed time includes background time and stops only once',()=>{
  const first=restoreTimer(null,10000);
  const stopped=stopTimer(first,131999);
  assert.equal(elapsedMilliseconds(stopped,999999),121999);
  assert.deepEqual(stopTimer(stopped,200000),stopped);
  assert.deepEqual(restoreTimer(stopped,200000),stopped);
});
test('new attempt starts fresh; invalid saved timers recover',()=>{
  assert.equal(elapsedMilliseconds(restoreTimer(null,90000),91000),1000);
  for(const invalid of [null,{}, {startedAt:-1}, {startedAt:'5'}, {startedAt:Infinity}, {startedAt:100001}])assert.equal(restoreTimer(invalid,100000).startedAt,100000);
  assert.equal(restoreTimer({startedAt:10000,completedAt:9999},100000).completedAt,null);
});
test('header and congratulations share whole minutes and seconds, including over an hour',()=>{
  assert.equal(clockText(0),'00:00');assert.equal(durationText(0),'0 minutes 0 seconds');
  assert.equal(clockText(61999),'01:01');assert.equal(durationText(61999),'1 minute 1 second');
  assert.equal(clockText(3662000),'61:02');assert.equal(durationText(3662000),'61 minutes 2 seconds');
});
