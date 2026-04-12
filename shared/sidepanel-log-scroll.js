(function(root, factory) {
  const exports = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }

  root.SidepanelLogScroll = exports;
})(typeof globalThis !== 'undefined' ? globalThis : self, function() {
  function isLogNearBottom({ scrollTop = 0, clientHeight = 0, scrollHeight = 0, threshold = 32 } = {}) {
    return scrollTop + clientHeight >= scrollHeight - threshold;
  }

  function shouldShowScrollToBottomButton({ scrollTop = 0, clientHeight = 0, scrollHeight = 0, hasLogs = false, threshold = 32 } = {}) {
    if (!hasLogs) {
      return false;
    }
    return !isLogNearBottom({ scrollTop, clientHeight, scrollHeight, threshold });
  }

  return {
    isLogNearBottom,
    shouldShowScrollToBottomButton,
  };
});
