/**
 * @jest-environment jsdom
 */

const filter = require('./filter');

test('Checks that file is running', () => {
  expect(filter).toBe(true);
});

test('toTitleCase converts string to titlecase', () => {
  let normalcase = 'string';
  expect(normalcase.toTitleCase()).toEqual('String');
});
