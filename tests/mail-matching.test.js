const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getStepMailMatchProfile,
  matchesSubjectPatterns,
} = require('../shared/mail-matching.js');

test('step 4 mail profile accepts the Chinese registration title', () => {
  const profile = getStepMailMatchProfile(4);

  assert.equal(matchesSubjectPatterns('你的 ChatGPT 代码为 040535', profile), true);
});

test('step 4 mail profile also accepts the Chinese OpenAI title', () => {
  const profile = getStepMailMatchProfile(4);

  assert.equal(matchesSubjectPatterns('你的 OpenAI 代码为 040535', profile), true);
});

test('step 4 mail profile also accepts the English verification title', () => {
  const profile = getStepMailMatchProfile(4);

  assert.equal(matchesSubjectPatterns('Your ChatGPT code is 281878', profile), true);
});

test('step 4 mail profile also accepts the English OpenAI verification title', () => {
  const profile = getStepMailMatchProfile(4);

  assert.equal(matchesSubjectPatterns('Your OpenAI code is 281878', profile), true);
});

test('step 7 mail profile accepts both English and Chinese OpenAI verification titles', () => {
  const profile = getStepMailMatchProfile(7);

  assert.equal(matchesSubjectPatterns('Your ChatGPT code is 281878', profile), true);
  assert.equal(matchesSubjectPatterns('Your OpenAI code is 281878', profile), true);
  assert.equal(matchesSubjectPatterns('你的 ChatGPT 代码为 040535', profile), true);
  assert.equal(matchesSubjectPatterns('你的 OpenAI 代码为 040535', profile), true);
});

test('step 9 reuses the later verification title profile for both English and Chinese verification titles', () => {
  const profile = getStepMailMatchProfile(9);

  assert.equal(matchesSubjectPatterns('Your ChatGPT code is 774992', profile), true);
  assert.equal(matchesSubjectPatterns('Your OpenAI code is 774992', profile), true);
  assert.equal(matchesSubjectPatterns('你的 ChatGPT 代码为 490239', profile), true);
  assert.equal(matchesSubjectPatterns('你的 OpenAI 代码为 490239', profile), true);
});
