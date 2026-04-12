const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildRunStatsDetailsHtml,
  normalizeDisplayedAutoRunStats,
} = require('../shared/sidepanel-run-stats.js');

test('buildRunStatsDetailsHtml renders an empty state when there are no failure buckets', () => {
  const html = buildRunStatsDetailsHtml({ successfulRuns: 3, failedRuns: 0, failureBuckets: [] });
  assert.match(html, /暂无失败记录/);
});

test('buildRunStatsDetailsHtml renders grouped failure stats with recent logs', () => {
  const html = buildRunStatsDetailsHtml({
    successfulRuns: 1,
    failedRuns: 3,
    failureBuckets: [
      {
        key: 'step-7::code',
        step: 7,
        reason: 'Could not find verification code input',
        count: 2,
        lastRunLabel: '8/∞',
        lastSeenAt: 200,
        recentLogs: [
          'Run 8 failed: Step 7 failed: Could not find verification code input.',
          'Run 5 failed: Step 7 failed: Could not find verification code input.',
        ],
      },
      {
        key: 'step-4::mail',
        step: 4,
        reason: 'No matching verification email found on TMailor after 20 attempts',
        count: 1,
        lastRunLabel: '4/∞',
        lastSeenAt: 100,
        recentLogs: [
          'Run 4 failed: Step 4 failed: No matching verification email found on TMailor after 20 attempts.',
        ],
      },
    ],
  });

  assert.match(html, /Step 7/);
  assert.match(html, /Could not find verification code input/);
  assert.match(html, /2 次/);
  assert.match(html, /最近日志/);
  assert.match(html, /Run 8 failed/);
  assert.match(html, /Step 4/);
});

test('buildRunStatsDetailsHtml renders run-level failures as collapsible cards without Step question marks', () => {
  const html = buildRunStatsDetailsHtml({
    successfulRuns: 0,
    failedRuns: 2,
    failureBuckets: [
      {
        key: 'step-unknown::content-script-timeout',
        step: 0,
        reason: 'Content script on tmailor-mail did not respond in 25s. Try refreshing the tab and retry',
        count: 2,
        lastRunLabel: '4/∞',
        lastSeenAt: 300,
        recentLogs: [
          'Run 4/∞ failed: Content script on tmailor-mail did not respond in 25s. Try refreshing the tab and retry.',
        ],
      },
    ],
  });

  assert.match(html, /<details class="run-failure-card"/);
  assert.match(html, /流程级/);
  assert.doesNotMatch(html, /Step \?/);
  assert.match(html, /run-failure-summary/);
  assert.match(html, /最近日志/);
});

test('normalizeDisplayedAutoRunStats keeps grouped failure buckets from auto-run status payloads', () => {
  const stats = normalizeDisplayedAutoRunStats({
    successfulRuns: '2',
    failedRuns: '1',
    failureBuckets: [
      {
        key: 'step-4::mail',
        step: 4,
        reason: 'No matching verification email found on TMailor after N attempts',
        count: 1,
        lastRunLabel: '2/∞',
        lastSeenAt: 1710000000000,
        recentLogs: ['Run 2/∞ failed: Step 4 failed: No matching verification email found on TMailor after 20 attempts.'],
      },
    ],
  });

  assert.deepEqual(stats, {
    successfulRuns: 2,
    failedRuns: 1,
    failureBuckets: [
      {
        key: 'step-4::mail',
        step: 4,
        reason: 'No matching verification email found on TMailor after N attempts',
        count: 1,
        lastRunLabel: '2/∞',
        lastSeenAt: 1710000000000,
        recentLogs: ['Run 2/∞ failed: Step 4 failed: No matching verification email found on TMailor after 20 attempts.'],
      },
    ],
  });
});
