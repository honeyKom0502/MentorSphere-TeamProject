import React from 'react';

export const ANIME_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Neon Valkyrie',
    gender: 'female',
    vibe: 'Cyber / Futuristic',
    accent: '#3B82F6',
    secondary: '#8B5CF6',
    description: 'Cyan gradient hair with neural headset and sleek cyber-collar.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#0B132B" stroke="#3B82F6" strokeWidth="2" />
        <path d="M20 85 C30 65 70 65 80 85" fill="#1C2541" />
        <path d="M35 70 L50 82 L65 70" fill="#3B82F6" opacity="0.8" />
        <circle cx="50" cy="48" r="22" fill="#FFE5D9" />
        {/* Hair Back */}
        <path d="M22 45 C18 68 28 80 32 82 C28 65 30 50 35 42 Z" fill="#38BDF8" />
        <path d="M78 45 C82 68 72 80 68 82 C72 65 70 50 65 42 Z" fill="#38BDF8" />
        {/* Anime Eyes */}
        <ellipse cx="42" cy="48" rx="3.5" ry="4.5" fill="#0284C7" />
        <ellipse cx="58" cy="48" rx="3.5" ry="4.5" fill="#0284C7" />
        <circle cx="43" cy="46.5" r="1.5" fill="#FFFFFF" />
        <circle cx="59" cy="46.5" r="1.5" fill="#FFFFFF" />
        <path d="M38 42 Q42 40 46 43" stroke="#0369A1" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M54 43 Q58 40 62 42" stroke="#0369A1" strokeWidth="1.2" strokeLinecap="round" />
        {/* Blush & Mouth */}
        <ellipse cx="38" cy="53" rx="3" ry="1.5" fill="#FDA4AF" opacity="0.6" />
        <ellipse cx="62" cy="53" rx="3" ry="1.5" fill="#FDA4AF" opacity="0.6" />
        <path d="M48 55 Q50 57 52 55" stroke="#E11D48" strokeWidth="1" strokeLinecap="round" fill="none" />
        {/* Anime Bangs */}
        <path d="M28 35 C32 20 68 20 72 35 C65 28 58 35 50 28 C45 34 38 28 28 35 Z" fill="#38BDF8" />
        <path d="M42 28 L46 40 L50 30 L54 41 L58 29" fill="#0284C7" />
        {/* Neural Visor / Headset */}
        <path d="M24 40 C24 35 28 30 32 30" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="20" y="38" width="6" height="12" rx="3" fill="#FF6B00" />
        <rect x="74" y="38" width="6" height="12" rx="3" fill="#FF6B00" />
        <circle cx="23" cy="44" r="1.5" fill="#FFFFFF" />
      </svg>
    )
  },
  {
    id: 'avatar-2',
    name: 'Shadow Shinobi',
    gender: 'male',
    vibe: 'Edgy / Stealth',
    accent: '#FF6B00',
    secondary: '#0F172A',
    description: 'Dark spiky anime hair with glowing amber scarf and sharp ninja gaze.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#0F172A" stroke="#FF6B00" strokeWidth="2" />
        <path d="M18 85 C28 62 72 62 82 85" fill="#1E293B" />
        {/* Face */}
        <circle cx="50" cy="46" r="21" fill="#FFD7BA" />
        {/* Glowing High Collar / Scarf */}
        <path d="M30 58 Q50 68 70 58 L72 75 Q50 82 28 75 Z" fill="#EA580C" />
        <path d="M36 62 Q50 70 64 62" stroke="#FED7AA" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Sharp Anime Eyes */}
        <path d="M37 45 L47 47 L44 50 L37 47 Z" fill="#EA580C" />
        <path d="M63 45 L53 47 L56 50 L63 47 Z" fill="#EA580C" />
        <circle cx="43" cy="47" r="1.2" fill="#FFFFFF" />
        <circle cx="57" cy="47" r="1.2" fill="#FFFFFF" />
        {/* Forehead Protector / Cyber Plate */}
        <rect x="34" y="27" width="32" height="7" rx="2" fill="#334155" stroke="#FF6B00" strokeWidth="1" />
        <circle cx="50" cy="30.5" r="1.5" fill="#FF6B00" />
        {/* Spiky Dark Hair */}
        <path d="M24 35 L32 20 L38 28 L48 14 L54 26 L64 16 L68 28 L78 26 L74 42 L66 32 L56 40 L50 32 L40 40 L30 35 Z" fill="#020617" />
        <path d="M48 14 L50 28 L40 24" fill="#1E293B" />
      </svg>
    )
  },
  {
    id: 'avatar-3',
    name: 'Solar Priestess',
    gender: 'female',
    vibe: 'Warm / Radiant',
    accent: '#F59E0B',
    secondary: '#EA580C',
    description: 'Twin-tail anime hair with warm golden glow and celestial earrings.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#1E1B4B" stroke="#F59E0B" strokeWidth="2" />
        <path d="M20 85 C30 65 70 65 80 85" fill="#312E81" />
        <path d="M38 72 L50 84 L62 72" fill="#F59E0B" />
        {/* Twin Tails */}
        <path d="M16 35 C12 60 18 78 28 80 C18 65 24 45 28 38 Z" fill="#F59E0B" />
        <path d="M84 35 C88 60 82 78 72 80 C82 65 76 45 72 38 Z" fill="#F59E0B" />
        <circle cx="50" cy="47" r="21" fill="#FFE5D9" />
        {/* Eyes */}
        <ellipse cx="41" cy="46" rx="4" ry="5" fill="#D97706" />
        <ellipse cx="59" cy="46" rx="4" ry="5" fill="#D97706" />
        <circle cx="42" cy="44.5" r="1.5" fill="#FFFFFF" />
        <circle cx="60" cy="44.5" r="1.5" fill="#FFFFFF" />
        <path d="M37 39 Q41 37 45 40" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M55 40 Q59 37 63 39" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="38" cy="52" rx="3" ry="1.5" fill="#F43F5E" opacity="0.5" />
        <ellipse cx="62" cy="52" rx="3" ry="1.5" fill="#F43F5E" opacity="0.5" />
        <path d="M47 54 Q50 56.5 53 54" stroke="#BE123C" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Front Bangs */}
        <path d="M28 34 C35 22 65 22 72 34 C64 28 56 36 50 30 C44 36 36 28 28 34 Z" fill="#FBBF24" />
        {/* Celestial Hairpins */}
        <circle cx="28" cy="32" r="3" fill="#EF4444" />
        <circle cx="72" cy="32" r="3" fill="#EF4444" />
      </svg>
    )
  },
  {
    id: 'avatar-4',
    name: 'Cipher Phantom',
    gender: 'male',
    vibe: 'Tech / Hacker',
    accent: '#10B981',
    secondary: '#064E3B',
    description: 'Cyberpunk anime hacker with over-ear holographic headset and tech visor.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#042F2E" stroke="#10B981" strokeWidth="2" />
        <path d="M18 85 C28 65 72 65 82 85" fill="#064E3B" />
        <circle cx="50" cy="46" r="21" fill="#F8D7DA" />
        {/* Tech Eyepiece / Monocle */}
        <circle cx="40" cy="46" r="8" fill="none" stroke="#10B981" strokeWidth="2" />
        <circle cx="40" cy="46" r="3" fill="#10B981" />
        <path d="M32 46 L22 44" stroke="#10B981" strokeWidth="1.5" />
        {/* Regular Right Eye */}
        <ellipse cx="60" cy="46" rx="3.5" ry="4" fill="#047857" />
        <circle cx="61" cy="44.5" r="1.5" fill="#FFFFFF" />
        <path d="M56 40 Q60 38 64 40" stroke="#064E3B" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M47 55 Q50 56 53 55" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Silver Hair */}
        <path d="M26 36 C28 20 72 18 76 34 C68 28 60 38 52 28 C45 36 36 28 26 36 Z" fill="#E2E8F0" />
        <path d="M45 28 L48 42 L52 32" fill="#94A3B8" />
        {/* Neon Headset */}
        <path d="M22 46 C22 30 78 30 78 46" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="18" y="42" width="7" height="14" rx="3" fill="#10B981" />
        <rect x="75" y="42" width="7" height="14" rx="3" fill="#10B981" />
      </svg>
    )
  },
  {
    id: 'avatar-5',
    name: 'Aether Mage',
    gender: 'female',
    vibe: 'Mystic / Ethereal',
    accent: '#6366F1',
    secondary: '#312E81',
    description: 'Silver-lavender hair with ethereal glowing crown and wise anime expression.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2" />
        <path d="M20 85 C30 65 70 65 80 85" fill="#312E81" />
        <circle cx="50" cy="47" r="21" fill="#FFE5D9" />
        {/* Hair flowing back */}
        <path d="M22 45 C15 70 30 85 35 85 C25 65 28 50 32 45 Z" fill="#C7D2FE" />
        <path d="M78 45 C85 70 70 85 65 85 C75 65 72 50 68 45 Z" fill="#C7D2FE" />
        {/* Violet Anime Eyes */}
        <ellipse cx="42" cy="47" rx="3.5" ry="4.5" fill="#6366F1" />
        <ellipse cx="58" cy="47" rx="3.5" ry="4.5" fill="#6366F1" />
        <circle cx="43" cy="45.5" r="1.5" fill="#FFFFFF" />
        <circle cx="59" cy="45.5" r="1.5" fill="#FFFFFF" />
        <path d="M38 41 Q42 39 46 41" stroke="#4338CA" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M54 41 Q58 39 62 41" stroke="#4338CA" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M48 55 Q50 56.5 52 55" stroke="#E11D48" strokeWidth="1" strokeLinecap="round" fill="none" />
        {/* Bangs */}
        <path d="M28 35 C32 20 68 20 72 35 C64 28 58 36 50 28 C44 36 36 28 28 35 Z" fill="#E0E7FF" />
        {/* Ethereal Diadem */}
        <polygon points="50,22 54,28 46,28" fill="#F59E0B" />
        <circle cx="50" cy="25" r="1.5" fill="#FFFFFF" />
        <path d="M38 28 Q50 25 62 28" stroke="#F59E0B" strokeWidth="1.2" fill="none" />
      </svg>
    )
  },
  {
    id: 'avatar-6',
    name: 'Blade Runner',
    gender: 'male',
    vibe: 'Leader / Confident',
    accent: '#3B82F6',
    secondary: '#1D4ED8',
    description: 'Modern undercut with deep blue highlights, sharp jawline, and confident gaze.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#0F172A" stroke="#3B82F6" strokeWidth="2" />
        <path d="M18 85 C28 65 72 65 82 85" fill="#1E293B" />
        <path d="M38 72 L50 82 L62 72" fill="#3B82F6" />
        <circle cx="50" cy="46" r="21" fill="#FFDFC4" />
        {/* Sharp Eyes */}
        <ellipse cx="42" cy="46" rx="3.5" ry="4" fill="#1D4ED8" />
        <ellipse cx="58" cy="46" rx="3.5" ry="4" fill="#1D4ED8" />
        <circle cx="43" cy="45" r="1.5" fill="#FFFFFF" />
        <circle cx="59" cy="45" r="1.5" fill="#FFFFFF" />
        <path d="M37 40 L46 41" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M54 41 L63 40" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M47 55 Q50 56.5 53 55" stroke="#334155" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Hair with Undercut & Blue Streak */}
        <path d="M28 35 C30 18 68 18 74 30 L74 38 L68 32 C60 26 50 34 40 28 L28 35 Z" fill="#1E293B" />
        <path d="M38 20 C46 14 62 18 68 28 C56 22 46 26 38 20 Z" fill="#3B82F6" />
      </svg>
    )
  },
  {
    id: 'avatar-7',
    name: 'Starlight Idol',
    gender: 'female',
    vibe: 'Playful / Creative',
    accent: '#EC4899',
    secondary: '#FF6B00',
    description: 'Bubblegum pastel anime style with warm orange highlights and star accessories.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#3B0764" stroke="#EC4899" strokeWidth="2" />
        <path d="M20 85 C30 65 70 65 80 85" fill="#581C87" />
        <circle cx="50" cy="47" r="21" fill="#FFE5D9" />
        {/* Big Bright Eyes */}
        <ellipse cx="41" cy="46" rx="4.5" ry="5.5" fill="#DB2777" />
        <ellipse cx="59" cy="46" rx="4.5" ry="5.5" fill="#DB2777" />
        <circle cx="42.5" cy="44" r="2" fill="#FFFFFF" />
        <circle cx="60.5" cy="44" r="2" fill="#FFFFFF" />
        <circle cx="40" cy="48" r="1" fill="#FFFFFF" />
        <circle cx="58" cy="48" r="1" fill="#FFFFFF" />
        <ellipse cx="37" cy="53" rx="3.5" ry="1.5" fill="#FB7185" opacity="0.7" />
        <ellipse cx="63" cy="53" rx="3.5" ry="1.5" fill="#FB7185" opacity="0.7" />
        <path d="M47 54 Q50 58 53 54" fill="#BE123C" stroke="#9F1239" strokeWidth="0.8" />
        {/* Pink & Orange Bangs */}
        <path d="M26 35 C32 20 68 20 74 35 C66 28 58 38 50 30 C44 38 36 28 26 35 Z" fill="#F472B6" />
        <path d="M48 24 L52 34 L56 26" fill="#FB923C" />
        {/* Star Pin */}
        <polygon points="30,28 32,32 36,32 33,35 34,39 30,37 26,39 27,35 24,32 28,32" fill="#FBBF24" />
      </svg>
    )
  },
  {
    id: 'avatar-8',
    name: 'Titan Mech',
    gender: 'male',
    vibe: 'Power / Heavy Cyber',
    accent: '#06B6D4',
    secondary: '#0E7490',
    description: 'Armored engineering cyber-warrior with cheek implant and deep electric blue spikes.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#083344" stroke="#06B6D4" strokeWidth="2" />
        <path d="M18 85 C26 62 74 62 82 85" fill="#164E63" />
        <polygon points="50,68 40,84 60,84" fill="#06B6D4" opacity="0.9" />
        <circle cx="50" cy="46" r="21" fill="#FED7AA" />
        {/* Cyber Cheek Plate */}
        <path d="M62 48 L70 46 L68 54 L60 52 Z" fill="#0891B2" stroke="#67E8F9" strokeWidth="0.8" />
        <circle cx="65" cy="50" r="1" fill="#FFFFFF" />
        {/* Cyan Eyes */}
        <ellipse cx="42" cy="46" rx="3.5" ry="4" fill="#0891B2" />
        <ellipse cx="58" cy="46" rx="3.5" ry="4" fill="#0891B2" />
        <circle cx="43" cy="45" r="1.5" fill="#FFFFFF" />
        <circle cx="59" cy="45" r="1.5" fill="#FFFFFF" />
        <path d="M37 40 L46 41" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M54 41 L63 40" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M47 55 L53 55" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />
        {/* Hair */}
        <path d="M26 34 L34 16 L42 26 L52 14 L60 24 L72 18 L74 36 L66 30 L54 38 L48 30 L38 38 Z" fill="#0284C7" />
      </svg>
    )
  },
  {
    id: 'avatar-9',
    name: 'Kitsune Coder',
    gender: 'female',
    vibe: 'Mythic / Agile',
    accent: '#FF6B00',
    secondary: '#F59E0B',
    description: 'Fox-spirit anime programmer with glowing ear ribbons and golden amber eyes.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#1C1917" stroke="#FF6B00" strokeWidth="2" />
        <path d="M20 85 C30 65 70 65 80 85" fill="#292524" />
        {/* Fox Ears */}
        <polygon points="30,30 20,12 40,24" fill="#EA580C" />
        <polygon points="28,28 22,16 36,24" fill="#FFEDD5" />
        <polygon points="70,30 80,12 60,24" fill="#EA580C" />
        <polygon points="72,28 78,16 64,24" fill="#FFEDD5" />
        <circle cx="50" cy="48" r="21" fill="#FFE5D9" />
        {/* Golden Eyes */}
        <ellipse cx="42" cy="48" rx="3.5" ry="4.5" fill="#D97706" />
        <ellipse cx="58" cy="48" rx="3.5" ry="4.5" fill="#D97706" />
        <circle cx="43" cy="46.5" r="1.5" fill="#FFFFFF" />
        <circle cx="59" cy="46.5" r="1.5" fill="#FFFFFF" />
        <path d="M37 42 Q42 40 46 43" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
        <path d="M54 43 Q58 40 63 42" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
        <ellipse cx="38" cy="54" rx="3" ry="1.5" fill="#FB923C" opacity="0.6" />
        <ellipse cx="62" cy="54" rx="3" ry="1.5" fill="#FB923C" opacity="0.6" />
        <path d="M47 56 Q50 58 53 56" stroke="#9A3412" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        {/* Flowing White-Orange Hair */}
        <path d="M28 36 C34 22 66 22 72 36 C64 30 58 38 50 30 C44 38 36 30 28 36 Z" fill="#FFF7ED" />
        <path d="M48 24 L52 38 L56 26" fill="#F97316" />
      </svg>
    )
  },
  {
    id: 'avatar-10',
    name: 'Zen Ronin',
    gender: 'male',
    vibe: 'Stoic / Disciplined',
    accent: '#8B5CF6',
    secondary: '#4C1D95',
    description: 'Anime samurai with topknot, crest collar, and focused calm expression.',
    svg: ({ className = "w-full h-full" }) => (
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="48" fill="#1E1B4B" stroke="#8B5CF6" strokeWidth="2" />
        <path d="M18 85 C28 65 72 65 82 85" fill="#312E81" />
        <circle cx="50" cy="46" r="21" fill="#FFDFC4" />
        {/* Topknot */}
        <circle cx="50" cy="16" r="6" fill="#0F172A" />
        <rect x="47" y="19" width="6" height="6" fill="#8B5CF6" />
        {/* Calm Sharp Eyes */}
        <path d="M38 46 L46 47" stroke="#312E81" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M54 47 L62 46" stroke="#312E81" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="42" cy="48" r="1.5" fill="#6366F1" />
        <circle cx="58" cy="48" r="1.5" fill="#6366F1" />
        <path d="M47 55 L53 55" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />
        {/* Hair */}
        <path d="M26 34 C30 20 70 20 74 34 C66 28 58 36 50 28 C42 36 34 28 26 34 Z" fill="#0F172A" />
      </svg>
    )
  }
];

export const getAvatarById = (id) => {
  return ANIME_AVATARS.find(a => a.id === id) || ANIME_AVATARS[0];
};

export const AnimeAvatar = ({ avatarId, size = "md", className = "", showRing = true }) => {
  const avatar = getAvatarById(avatarId);
  const sizeMap = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    '2xl': "w-32 h-32"
  };

  const SvgComponent = avatar.svg;

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 transition-transform duration-300 hover:scale-105 ${sizeMap[size] || sizeMap.md} ${className}`}>
      <SvgComponent className="w-full h-full drop-shadow-sm" />
      {showRing && (
        <div 
          className="absolute inset-0 rounded-full border border-white/20 pointer-events-none"
          style={{ borderColor: avatar.accent + '40' }}
        />
      )}
    </div>
  );
};
