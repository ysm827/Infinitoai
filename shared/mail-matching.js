(function(root, factory) {
  const exports = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exports;
  }

  root.MailMatching = exports;
})(typeof globalThis !== 'undefined' ? globalThis : self, function() {
  const BRAND_PATTERN = '(?:chatgpt|openai)';
  const REGISTRATION_CN_SUBJECT = new RegExp(`你的\\s*${BRAND_PATTERN}\\s*代码为`, 'i');
  const VERIFICATION_EN_SUBJECT = new RegExp(`your\\s*${BRAND_PATTERN}\\s*code\\s*is`, 'i');

  const STEP_MAIL_MATCH_PROFILES = {
    4: {
      include: [REGISTRATION_CN_SUBJECT, VERIFICATION_EN_SUBJECT],
      exclude: [],
    },
    7: {
      include: [REGISTRATION_CN_SUBJECT, VERIFICATION_EN_SUBJECT],
      exclude: [],
    },
    9: {
      include: [REGISTRATION_CN_SUBJECT, VERIFICATION_EN_SUBJECT],
      exclude: [],
    },
  };

  function normalizeText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function getStepMailMatchProfile(step) {
    return STEP_MAIL_MATCH_PROFILES[step] || null;
  }

  function matchesSubjectPatterns(subject, profile) {
    if (!profile) {
      return true;
    }

    const text = normalizeText(subject);
    if (!text) {
      return false;
    }

    const includeMatched = (profile.include || []).length === 0
      || profile.include.some((pattern) => pattern.test(text));
    if (!includeMatched) {
      return false;
    }

    const excluded = (profile.exclude || []).some((pattern) => pattern.test(text));
    return !excluded;
  }

  return {
    getStepMailMatchProfile,
    matchesSubjectPatterns,
    normalizeText,
  };
});
