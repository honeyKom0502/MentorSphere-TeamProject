// Backend Moderation Service
// Pluggable AI / Rule-based moderation engine to prevent abuse and harassment.

const SENSITIVE_PATTERNS = [
  /\b(idiot|stupid|moron|loser|dumbass|retard|noob|trash|useless|stfu)\b/i,
  /\b(fuck|shit|bitch|bastard|asshole|dick|crap|piss)\b/i,
  /\b(kill yourself|kys|die|threat|punch|beat you up|destroy you)\b/i,
  /\b(hate you|go to hell|shut up|worthless)\b/i
];

export const moderationService = {
  async evaluateMessage(text) {
    if (!text || typeof text !== 'string') {
      return { isClean: true, friendlyMessage: '' };
    }

    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return { isClean: true, friendlyMessage: '' };
    }

    for (const pattern of SENSITIVE_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isClean: false,
          flaggedReason: 'Disrespectful or abusive language detected.',
          friendlyMessage: "Let's keep MentorSphere respectful. Please rephrase your message."
        };
      }
    }

    return {
      isClean: true,
      friendlyMessage: ''
    };
  }
};
