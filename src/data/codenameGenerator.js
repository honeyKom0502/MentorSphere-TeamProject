const PREFIXES = [
  'Knight', 'Shadow', 'Pixel', 'Neon', 'Code', 'Byte', 'Aether', 'Nova', 
  'Zero', 'Chrono', 'Glitch', 'Hyper', 'Apex', 'Cyber', 'Quantum', 'Vortex',
  'Solar', 'Lunar', 'Iron', 'Echo', 'Frost', 'Storm', 'Ghost', 'Zen',
  'Rune', 'Matrix', 'Pulse', 'Vector', 'Titan', 'Aero', 'Prism', 'Synth'
];

const SUFFIXES = [
  'Rider', 'Coder', 'Ninja', 'Wolf', 'Phantom', 'Knight', 'Spark', 'Valkyrie',
  'Cipher', 'Samurai', 'Spectre', 'Phoenix', 'Sensei', 'Hacker', 'Ronin', 'Pilot',
  'Blade', 'Titan', 'Mage', 'Architect', 'Sage', 'Hunter', 'Drifter', 'Falcon',
  'Nexus', 'Striker', 'Shinobi', 'Seer', 'Voyager', 'Warden', 'Forge', 'Rebel'
];

export const generateUniquePublicId = () => {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  const num = Math.floor(Math.random() * 90 + 10); // optional 2-digit tag e.g. KnightRider or KnightRider42
  const useNumber = Math.random() > 0.6;
  return `${prefix}${suffix}${useNumber ? num : ''}`;
};

export const generateSuggestedIds = (count = 4) => {
  const suggestions = new Set();
  while (suggestions.size < count) {
    suggestions.add(generateUniquePublicId());
  }
  return Array.from(suggestions);
};

export const isValidPublicId = (id) => {
  if (!id) return false;
  // Alphanumeric with underscores or hyphens, between 3 and 20 chars
  const regex = /^[a-zA-Z0-9_-]{3,20}$/;
  return regex.test(id);
};
