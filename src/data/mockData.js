export const PRESET_SKILLS = [
  'DSA', 'Java', 'Python', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'Next.js', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow',
  'SQL', 'MongoDB', 'PostgreSQL', 'Cloud / AWS', 'Docker', 'Kubernetes',
  'UI/UX Design', 'System Design', 'Git & GitHub', 'Cyber Security', 'Web3'
];

export const PRESET_INTERESTS = [
  'DSA & Problem Solving', 'Web Development', 'AI / ML', 'Placements Preparation',
  'Internships', 'Competitive Programming', 'Startups & Product', 'Open Source / GSoC',
  'Cyber Security', 'Cloud & DevOps', 'Research & Papers', 'Higher Studies (MS/GATE)'
];

export const CHANNELS_DATA = [
  {
    id: 'dsa',
    name: 'DSA & Algorithms',
    slug: 'dsa',
    category: 'Tech & Coding',
    icon: 'Code2',
    color: '#3B82F6',
    description: 'Master Data Structures, LeetCode patterns, Dynamic Programming, and Graph algorithms.',
    memberCount: 842,
    discussionCount: 328,
    isPopular: true,
    tags: ['LeetCode', 'Trees', 'DP', 'Sliding Window', 'Graphs']
  },
  {
    id: 'web-dev',
    name: 'Full Stack & Web Dev',
    slug: 'web-dev',
    category: 'Tech & Coding',
    icon: 'Globe',
    color: '#FF6B00',
    description: 'Modern web development with React, Node.js, Next.js, Tailwind, databases, and microservices.',
    memberCount: 760,
    discussionCount: 290,
    isPopular: true,
    tags: ['React', 'NodeJS', 'FullStack', 'Tailwind', 'NextJS']
  },
  {
    id: 'ai-ml',
    name: 'AI & Data Science',
    slug: 'ai-ml',
    category: 'Tech & Coding',
    icon: 'Cpu',
    color: '#8B5CF6',
    description: 'Explore generative AI, LLMs, Computer Vision, PyTorch, research papers, and Kaggle competitions.',
    memberCount: 690,
    discussionCount: 215,
    isPopular: true,
    tags: ['PyTorch', 'LLMs', 'DeepLearning', 'Vision', 'Kaggle']
  },
  {
    id: 'placements',
    name: 'Placement Command Center',
    slug: 'placements',
    category: 'Careers & Hiring',
    icon: 'Briefcase',
    color: '#10B981',
    description: 'On-campus & off-campus hiring drives, interview experiences, OA questions, and compensation trends.',
    memberCount: 1120,
    discussionCount: 540,
    isPopular: true,
    tags: ['Interviews', 'OA', 'Resume', 'HR Round', 'Offers']
  },
  {
    id: 'internships',
    name: 'Internship Tracker',
    slug: 'internships',
    category: 'Careers & Hiring',
    icon: 'Compass',
    color: '#F59E0B',
    description: 'Summer and winter 2-month & 6-month internship opportunities, referrals, and application timelines.',
    memberCount: 630,
    discussionCount: 180,
    isPopular: false,
    tags: ['SummerIntern', 'Referrals', 'Stipend', 'Shortlisting']
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & Infrastructure',
    slug: 'cloud-devops',
    category: 'Tech & Coding',
    icon: 'Cloud',
    color: '#06B6D4',
    description: 'AWS, GCP, Docker, Kubernetes, CI/CD pipelines, and cloud architecture certifications.',
    memberCount: 420,
    discussionCount: 110,
    isPopular: false,
    tags: ['AWS', 'Docker', 'K8s', 'DevOps', 'Terraform']
  },
  {
    id: 'cyber-sec',
    name: 'Cyber Security & CTFs',
    slug: 'cyber-sec',
    category: 'Tech & Coding',
    icon: 'Shield',
    color: '#EC4899',
    description: 'Ethical hacking, CTF writeups, cryptography, network security, and bug bounties.',
    memberCount: 380,
    discussionCount: 95,
    isPopular: false,
    tags: ['CTF', 'BugBounty', 'NetworkSec', 'Cryptography']
  },
  {
    id: 'cp',
    name: 'Competitive Programming',
    slug: 'cp',
    category: 'Tech & Coding',
    icon: 'Trophy',
    color: '#E11D48',
    description: 'Codeforces contests, CodeChef divisiveness, ICPC training, and mathematical problem-solving.',
    memberCount: 510,
    discussionCount: 165,
    isPopular: false,
    tags: ['Codeforces', 'ICPC', 'Math', 'SpeedCoding']
  },
  {
    id: 'projects',
    name: 'Project Forge & Teaming',
    slug: 'projects',
    category: 'Collaboration',
    icon: 'FolderGit2',
    color: '#6366F1',
    description: 'Find teammates for hackathons, capstone projects, startup ideas, and open source building.',
    memberCount: 580,
    discussionCount: 140,
    isPopular: false,
    tags: ['Hackathons', 'Teammates', 'Capstone', 'Startup']
  },
  {
    id: 'college-life',
    name: 'Campus Life & Events',
    slug: 'college-life',
    category: 'General',
    icon: 'Sparkles',
    color: '#14B8A6',
    description: 'Clubs, cultural fests, tech symposiums, hostel tips, and general peer camaraderie.',
    memberCount: 890,
    discussionCount: 220,
    isPopular: false,
    tags: ['Fests', 'Clubs', 'Hostel', 'Campus']
  },
  {
    id: 'higher-studies',
    name: 'Higher Studies & Research',
    slug: 'higher-studies',
    category: 'Careers & Hiring',
    icon: 'GraduationCap',
    color: '#A855F7',
    description: 'GRE, TOEFL, GATE, MS in US/Europe/Singapore, SOP reviews, and professor research assistantships.',
    memberCount: 340,
    discussionCount: 80,
    isPopular: false,
    tags: ['MSAbroad', 'GATE', 'SOP', 'GRE', 'Research']
  }
];

export const DISCUSSIONS_DATA = [
  {
    id: 'disc-1',
    channelId: 'dsa',
    title: 'Can someone explain the intuition behind Monotonic Stack for Next Greater Element?',
    content: "I'm practicing stack problems and while I memorized the template, I want to truly understand *why* we maintain decreasing order in the stack. What happens when a larger element arrives?",
    authorPublicId: 'PixelNinja',
    authorAvatar: 'avatar-1',
    authorRole: 'Junior',
    createdAt: '2 hours ago',
    upvotes: 24,
    tags: ['Stack', 'Intuition', 'DSA'],
    replies: [
      {
        id: 'rep-1',
        authorPublicId: 'KnightRider',
        authorAvatar: 'avatar-2',
        authorRole: 'Senior',
        createdAt: '1 hour ago',
        content: "Think of it like looking down a line of people: each taller person obscures everyone shorter behind them. The stack acts as an 'unresolved waiting room' for elements looking for someone taller to claim them! Once a taller number arrives, it resolves all the pending smaller numbers.",
        upvotes: 18,
        isAccepted: true
      },
      {
        id: 'rep-2',
        authorPublicId: 'ZeroValkyrie',
        authorAvatar: 'avatar-8',
        authorRole: 'Alumni',
        createdAt: '45 mins ago',
        content: "Pro-tip: This exact pattern comes up in 'Daily Temperatures' and 'Largest Rectangle in Histogram'. Solve those two in order to cement the intuition.",
        upvotes: 9
      }
    ]
  },
  {
    id: 'disc-2',
    channelId: 'placements',
    title: 'Google & Atlassian On-Campus OA Experience & Topic Distribution (2026 Batch)',
    content: "Sharing the breakdown of questions asked in yesterday's round: 3 Questions (70 mins). Q1 was a Greedy + Priority Queue problem, Q2 was Tree DP with Bitmask, Q3 was a Graph BFS with shortest path constraint. Here are the key edge cases to look out for!",
    authorPublicId: 'KnightRider',
    authorAvatar: 'avatar-2',
    authorRole: 'Senior',
    createdAt: '5 hours ago',
    upvotes: 92,
    tags: ['Google', 'Atlassian', 'OA', 'TreeDP'],
    replies: [
      {
        id: 'rep-3',
        authorPublicId: 'ShadowShinobi',
        authorAvatar: 'avatar-4',
        authorRole: 'Junior',
        createdAt: '4 hours ago',
        content: "Thank you so much! Was Q2 solvable with regular memoization or did it time out without bitwise optimization?",
        upvotes: 7
      },
      {
        id: 'rep-4',
        authorPublicId: 'KnightRider',
        authorAvatar: 'avatar-2',
        authorRole: 'Senior',
        createdAt: '3 hours ago',
        content: "Standard memoization had TLE on test case 14 because N was up to 18. Bitmask state compression passed with 0.12s.",
        upvotes: 14
      }
    ]
  },
  {
    id: 'disc-3',
    channelId: 'web-dev',
    title: 'Which state management should a 2nd year student learn in 2026? Redux Toolkit vs Zustand vs TanStack Query',
    content: "I am building my full-stack MERN portfolio project. Every tutorial says something different. Is Redux still relevant or is Zustand + React Query the new industry standard?",
    authorPublicId: 'AetherSpark',
    authorAvatar: 'avatar-7',
    authorRole: 'Junior',
    createdAt: '1 day ago',
    upvotes: 45,
    tags: ['React', 'Zustand', 'WebDev'],
    replies: [
      {
        id: 'rep-5',
        authorPublicId: 'SolarPriestess',
        authorAvatar: 'avatar-3',
        authorRole: 'Alumni',
        createdAt: '18 hours ago',
        content: "Separate Server State from Client State! Use TanStack Query (React Query) for fetching/caching data from backend. Use Zustand for small global UI state (auth token, dark mode, cart). Redux is heavy unless you join a legacy enterprise codebase.",
        upvotes: 36,
        isAccepted: true
      }
    ]
  },
  {
    id: 'disc-4',
    channelId: 'ai-ml',
    title: 'Roadmap to transition from basic Scikit-Learn to building production RAG systems with LangChain/LlamaIndex',
    content: "I have finished basic ML (Linear Regression, SVMs, Random Forest). What are the exact steps to build real LLM agents and embeddings search pipelines without getting lost in hype tutorials?",
    authorPublicId: 'KitsuneCoder',
    authorAvatar: 'avatar-9',
    authorRole: 'Junior',
    createdAt: '2 days ago',
    upvotes: 68,
    tags: ['RAG', 'LLMs', 'Roadmap'],
    replies: [
      {
        id: 'rep-6',
        authorPublicId: 'ZenRonin',
        authorAvatar: 'avatar-10',
        authorRole: 'Alumni',
        createdAt: '1 day ago',
        content: "Start with pure vector embeddings (ChromaDB / Pinecone) + OpenAI/Gemini API calls before touching frameworks. Understanding chunking, cosine distance, and re-ranking gives you 90% of the value.",
        upvotes: 28
      }
    ]
  }
];

export const MENTORS_DATA = [
  {
    id: 'mentor-1',
    publicId: 'KnightRider',
    avatar: 'avatar-2',
    role: 'Senior',
    department: 'Computer Science (4th Year)',
    companyOrTrack: 'Placed @ Google & Atlassian (SDE-1)',
    skills: ['DSA', 'Java', 'System Design', 'C++', 'Spring Boot'],
    interests: ['Placements', 'Competitive Programming', 'Mock Interviews'],
    channelsJoined: 8,
    helpedCount: 142,
    rating: '4.98',
    bio: 'Cleared 4 tier-1 tech OAs and interviews. Happy to help juniors with DSA roadmap, resume roasts, and mock interviews.',
    availability: 'Available for Mocks'
  },
  {
    id: 'mentor-2',
    publicId: 'SolarPriestess',
    avatar: 'avatar-3',
    role: 'Alumni',
    department: 'Graduated 2024 (Now SDE-2 @ Microsoft)',
    companyOrTrack: 'Microsoft Cloud & AI',
    skills: ['Machine Learning', 'PyTorch', 'Distributed Systems', 'Python', 'Azure'],
    interests: ['AI / ML', 'Higher Studies', 'System Design'],
    channelsJoined: 10,
    helpedCount: 230,
    rating: '5.00',
    bio: 'Working on large-scale distributed inference. Passionate about guiding students in research publications and off-campus tech applications.',
    availability: 'Weekend Sessions'
  },
  {
    id: 'mentor-3',
    publicId: 'ZeroValkyrie',
    avatar: 'avatar-8',
    role: 'Senior',
    department: 'Information Technology (4th Year)',
    companyOrTrack: 'Interned @ Uber | Placed @ Cisco',
    skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker'],
    interests: ['Web Development', 'Hackathons', 'Startups'],
    channelsJoined: 6,
    helpedCount: 98,
    rating: '4.95',
    bio: 'Won 5 national hackathons (Smart India Hackathon, EthIndia). Let me review your portfolio and help you win hackathons.',
    availability: 'Available for Questions'
  },
  {
    id: 'mentor-4',
    publicId: 'CipherPhantom',
    avatar: 'avatar-4',
    role: 'Alumni',
    department: 'Graduated 2025 (Security Engineer @ Goldman Sachs)',
    companyOrTrack: 'Goldman Sachs Cyber & Risk',
    skills: ['Cyber Security', 'Python', 'CTF', 'Linux', 'Network Security'],
    interests: ['Cyber Security', 'Placements', 'Certifications'],
    channelsJoined: 5,
    helpedCount: 84,
    rating: '4.92',
    bio: 'OSCP certified. Breaking down ethical hacking, cloud security certifications, and fintech security roles.',
    availability: 'Async Chat'
  },
  {
    id: 'mentor-5',
    publicId: 'AetherMage',
    avatar: 'avatar-5',
    role: 'Senior',
    department: 'Computer Science (3rd Year)',
    companyOrTrack: 'Incoming Summer Intern @ Amazon',
    skills: ['DSA', 'C++', 'Competitive Programming', 'SQL'],
    interests: ['DSA & Problem Solving', 'Internships', 'College Life'],
    channelsJoined: 7,
    helpedCount: 76,
    rating: '4.89',
    bio: 'Knight on LeetCode (2050+ rating). I can help you solve the fear of Dynamic Programming and recursion.',
    availability: 'Daily 7-9 PM'
  },
  {
    id: 'mentor-6',
    publicId: 'ZenRonin',
    avatar: 'avatar-10',
    role: 'Alumni',
    department: 'MS in CS @ Purdue University (Alumni 2023)',
    companyOrTrack: 'Purdue AI Lab & Research Fellow',
    skills: ['Research Papers', 'GRE', 'Machine Learning', 'Computer Vision'],
    interests: ['Higher Studies (MS/GATE)', 'Research & Papers'],
    channelsJoined: 9,
    helpedCount: 165,
    rating: '4.97',
    bio: 'Guiding college students for MS in USA, drafting winning SOPs, LOR strategies, and cold emailing professors.',
    availability: 'SOP Reviews'
  }
];

export const PLACEMENT_STATS = {
  highestPackage: '48.5 LPA',
  highestCompany: 'Atlassian & Google',
  averagePackage: '14.2 LPA',
  medianPackage: '11.5 LPA',
  totalOffers: 684,
  placementPercentage: '91.4%',
  companiesVisited: 72,
  tier1Offers: 148,
  topCompanies: [
    { name: 'Google', roles: 'Software Engineer, Cloud Associate', avgCTC: '38-45 LPA', hires: 6, logo: 'Code' },
    { name: 'Microsoft', roles: 'Software Development Engineer (SDE-1)', avgCTC: '42 LPA', hires: 12, logo: 'Cpu' },
    { name: 'Atlassian', roles: 'Software Engineer', avgCTC: '48.5 LPA', hires: 4, logo: 'Layers' },
    { name: 'Amazon', roles: 'SDE-1 & Systems Engineer', avgCTC: '32-44 LPA', hires: 18, logo: 'Box' },
    { name: 'Uber', roles: 'Software Engineer Backend', avgCTC: '36 LPA', hires: 5, logo: 'Compass' },
    { name: 'Goldman Sachs', roles: 'Analyst Technology', avgCTC: '28-32 LPA', hires: 9, logo: 'ShieldCheck' },
    { name: 'Cisco', roles: 'Software / Network Engineer', avgCTC: '18-24 LPA', hires: 22, logo: 'Wifi' },
    { name: 'Oracle', roles: 'Server Technology Associate', avgCTC: '20-22 LPA', hires: 15, logo: 'Database' }
  ],
  trends: [
    { year: '2023', avg: 11.2, highest: 36.0, placed: 580 },
    { year: '2024', avg: 12.8, highest: 42.0, placed: 620 },
    { year: '2025', avg: 13.9, highest: 45.0, placed: 650 },
    { year: '2026 (Current)', avg: 14.2, highest: 48.5, placed: 684 }
  ]
};

export const NOTIFICATIONS_DATA = [
  {
    id: 'notif-1',
    type: 'reply',
    title: 'New Reply in DSA Channel',
    message: 'KnightRider (Senior) replied to your question on Monotonic Stack.',
    time: '1 hour ago',
    read: false
  },
  {
    id: 'notif-2',
    type: 'mentor',
    title: 'Mentor Connection Accepted',
    message: 'SolarPriestess (Alumni) accepted your mentorship request.',
    time: '3 hours ago',
    read: false
  },
  {
    id: 'notif-3',
    type: 'placement',
    title: 'New On-Campus Drive Announced',
    message: 'Atlassian 2026 Campus Drive registrations open. Check Placement Center.',
    time: '1 day ago',
    read: true
  }
];
