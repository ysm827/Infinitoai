const test = require('node:test');
const assert = require('node:assert/strict');

const {
  isLogNearBottom,
  shouldShowScrollToBottomButton,
} = require('../shared/sidepanel-log-scroll.js');

test('log is near bottom when the viewport is already close to the latest entries', () => {
  assert.equal(
    isLogNearBottom({
      scrollTop: 170,
      clientHeight: 200,
      scrollHeight: 380,
    }),
    true
  );
});

test('log is not near bottom when the user is browsing older entries', () => {
  assert.equal(
    isLogNearBottom({
      scrollTop: 20,
      clientHeight: 200,
      scrollHeight: 500,
    }),
    false
  );
});

test('scroll-to-bottom button only shows when logs exist and the user is away from the bottom', () => {
  assert.equal(
    shouldShowScrollToBottomButton({
      scrollTop: 20,
      clientHeight: 200,
      scrollHeight: 500,
      hasLogs: true,
    }),
    true
  );
  assert.equal(
    shouldShowScrollToBottomButton({
      scrollTop: 280,
      clientHeight: 200,
      scrollHeight: 500,
      hasLogs: true,
    }),
    false
  );
  assert.equal(
    shouldShowScrollToBottomButton({
      scrollTop: 20,
      clientHeight: 200,
      scrollHeight: 500,
      hasLogs: false,
    }),
    false
  );
});
