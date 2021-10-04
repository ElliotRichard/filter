// import { scanApple } from './filter.js';
const filter = require('./filter');

test('scans markup for class apple and prints that class', () => {
  expect(filter()).toBe('Apple');
});
