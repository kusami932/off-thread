// The user-approved task rules and deliberate Anti-UX settings live here.
export const CONFIG = Object.freeze({
  budgetCents: 10000,
  minimumSpendCents: 8800,
  objective: 'spend-range',
  repeatedPurchases: true,
  quantityLimit: null,
  shippingCents: 0,
  taxCents: 0,
  storageKey: 'offthread.cart.v1',
  receiptKey: 'offthread.receipt.v2',
  timerKey: 'offthread.timer.v2',
  around30MinCents: 2500,
  around30MaxCents: 3500,
  motionDistancePx: 24,
  motionSpeedPxPerSecond: 4,
  testPayment: Object.freeze(['968', '4871928904556523', '12/30']),
  paymentError: 'Please check the test payment information. See Payment help.',
});

export {FILTERS} from './filters.js';
