// Moderation Service — Pluggable AI / Rule-based moderation engine
// Designed to keep MentorSphere discussions safe, constructive, and anti-bullying.

const SENSITIVE_PATTERNS = [
  /\b(idiot|stupid|moron|loser|dumbass|retard|noob|trash|useless|stfu)\b/i,
  /\b(fuck|shit|bitch|bastard|asshole|dick|crap|piss)\b/i,
  /\b(kill yourself|kys|die|threat|punch|beat you up|destroy you)\b/i,
  /\b(hate you|go to hell|shut up|worthless)\b/i
];

export const moderationService = {
  /**
   * Evaluates text for safety, toxicity, profanity, and harassment.
   * @param {string} text 
   * @returns {Promise<{ isClean: boolean, flaggedReason?: string, friendlyMessage: string }>}
   */
  async evaluateMessage(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true, friendlyMessage: '' };
    }

    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return { isClean: true, friendlyMessage: '' };
    }

    // 1. Check sensitive & toxic patterns
    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isClean: false,
          flaggedReason: 'Disrespectful or abusive language detected.',
          friendlyMessage: "Let's keep MentorSphere respectful. Please rephrase your message."
        };
      }
    }

    // 2. Check for excessive aggressive shouting (e.g. all caps rage with exclamation)
    const upperCount = (trimmed.match(/[A-Z]/g) || []).length;
    const letterCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
    if (letterCount > 15 && upperCount / letterCount > 0.8 && trimmed.includes('!')) {
      return {
        isClean: false,
        flaggedReason: 'Aggressive / shouting tone detected.',
        friendlyMessage: "Please keep your tone constructive and avoid excessive shouting. Rephrase gently!"
      };
    }

    // In a full production deployment with backend API key:
    // await fetch('/api/moderation/check', { method: 'POST', body: JSON.stringify({ text }) });

    return {
      isClean: true,
      friendlyMessage: ''
    };
  }
};
