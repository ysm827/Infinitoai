(function(root, factory) {
  const exports = factory(
    root.AutoRunFailureStats
  );

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }

  root.SidepanelRunStats = exports;
})(typeof globalThis !== 'undefined' ? globalThis : self, function(AutoRunFailureStats) {
  const {
    normalizeAutoRunStats,
    summarizeAutoRunFailureBuckets,
  } = AutoRunFailureStats || require('./auto-run-failure-stats.js');

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildRunStatsDetailsHtml(stats = {}) {
    const buckets = summarizeAutoRunFailureBuckets(stats);
    if (!buckets.length) {
      return '<div class="run-failure-empty">暂无失败记录</div>';
    }

    return buckets.map((bucket) => {
      const stepLabel = bucket.step > 0 ? `Step ${bucket.step}` : '流程级';
      const recentLogsHtml = bucket.recentLogs.length
        ? `
          <div class="run-failure-logs-label">最近日志</div>
          <div class="run-failure-logs">
            ${bucket.recentLogs.map((entry) => `<div class="run-failure-log">${escapeHtml(entry)}</div>`).join('')}
          </div>
        `
        : '';

      return `
        <details class="run-failure-card">
          <summary class="run-failure-summary">
            <div class="run-failure-head">
              <span class="run-failure-step">${escapeHtml(stepLabel)}</span>
              <span class="run-failure-count">${bucket.count} 次</span>
            </div>
            <div class="run-failure-reason">${escapeHtml(bucket.reason)}</div>
            <div class="run-failure-meta">最近发生：${escapeHtml(bucket.lastRunLabel || '未知轮次')}</div>
          </summary>
          <div class="run-failure-body">
            ${recentLogsHtml}
          </div>
        </details>
      `;
    }).join('');
  }

  function normalizeDisplayedAutoRunStats(stats = {}) {
    return normalizeAutoRunStats(stats);
  }

  return {
    buildRunStatsDetailsHtml,
    normalizeDisplayedAutoRunStats,
  };
});
