import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import {
  API_BASE,
  apiRequest,
  getToken,
  setToken,
  clearToken,
  isDemoUser,
  UNAUTHORIZED_EVENT
} from '../services/api';

const AuthContext = createContext();

const DEMO_ACCOUNTS = {
  junior: {
    id: 'usr-1',
    fullName: 'Bhavini Singh',
    email: 'bhavini.singh@college.edu',
    role: 'Junior',
    publicId: 'PixelNinja',
    avatar: 'avatar-1',
    skills: ['DSA', 'Python', 'C++', 'React'],
    interests: [
      'DSA & Problem Solving',
      'Placements Preparation',
      'AI / ML'
    ],
    joinedChannels: [
      'dsa',
      'web-dev',
      'placements',
      'college-life',
      'projects'
    ],
    connectedMentors: ['mentor-1', 'mentor-2', 'mentor-5'],
    savedResources: ['res-1', 'res-2', 'res-3', 'res-4'],
    helpedCount: 14,
    questionsAsked: 8,
    discussionsParticipated: 23,
    createdAt: '2025-09-01'
  },

  senior: {
    id: 'usr-2',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    role: 'Senior',
    publicId: 'KnightRider',
    avatar: 'avatar-2',
    skills: ['DSA', 'Java', 'Spring Boot', 'System Design', 'C++'],
    interests: [
      'Placements Preparation',
      'Competitive Programming',
      'Mock Interviews'
    ],
    joinedChannels: [
      'dsa',
      'placements',
      'cp',
      'cloud-devops',
      'projects',
      'web-dev',
      'internships'
    ],
    connectedMentors: ['mentor-2', 'mentor-6'],
    savedResources: ['res-1', 'res-5', 'res-8'],
    helpedCount: 142,
    questionsAsked: 3,
    discussionsParticipated: 89,
    createdAt: '2023-08-15'
  },

  alumni: {
    id: 'usr-3',
    fullName: 'Ananya Rao',
    email: 'ananya.rao@alumni.college.edu',
    role: 'Alumni',
    publicId: 'SolarPriestess',
    avatar: 'avatar-3',
    skills: [
      'Machine Learning',
      'PyTorch',
      'Distributed Systems',
      'Python',
      'Azure'
    ],
    interests: [
      'AI / ML',
      'Higher Studies (MS/GATE)',
      'Research & Papers'
    ],
    joinedChannels: [
      'ai-ml',
      'placements',
      'higher-studies',
      'projects'
    ],
    connectedMentors: [],
    savedResources: ['res-2', 'res-4'],
    helpedCount: 230,
    questionsAsked: 1,
    discussionsParticipated: 145,
    createdAt: '2021-08-10'
  }
};

export const AuthProvider = ({ children }) => {

  // --------------------------------------------------
  // USER STATE
  // --------------------------------------------------

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mentorsphere-user');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // A real account without a session token (e.g. logged in before tokens
        // existed) cannot call protected APIs: ask the person to log in again.
        if (parsed && !isDemoUser(parsed) && !getToken()) {
          return null;
        }

        return parsed;
      } catch (error) {
        console.error('Invalid saved user:', error);
        return null;
      }
    }

    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem('mentorsphere-user');
    if (!saved) return false;

    try {
      const parsed = JSON.parse(saved);
      return !!parsed && (isDemoUser(parsed) || !!getToken());
    } catch {
      return false;
    }
  });

  // --------------------------------------------------
  // SAVE USER TO LOCAL STORAGE
  // --------------------------------------------------

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        'mentorsphere-user',
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem('mentorsphere-user');
    }
  }, [user]);

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------

  const login = async (email, password) => {
    try {
      // Basic validation
      if (!email?.trim() || !password?.trim()) {
        return {
          success: false,
          message: 'Please enter both email and password.'
        };
      }

      // ------------------------------------------------
      // DEMO ACCOUNT LOGIN
      // ------------------------------------------------

      const demoAccount = Object.values(DEMO_ACCOUNTS).find(
        account =>
          account.email.toLowerCase() ===
          email.trim().toLowerCase()
      );

      if (demoAccount) {
        clearToken();
        setUser(demoAccount);
        setIsAuthenticated(true);

        return {
          success: true,
          user: demoAccount
        };
      }

      // ------------------------------------------------
      // REAL BACKEND LOGIN
      // ------------------------------------------------

      const response = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password
          })
        }
      );

      const data = await response.json();

      // ------------------------------------------------
      // LOGIN FAILED
      // ------------------------------------------------

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            'Invalid email or password.'
        };
      }

      // ------------------------------------------------
      // LOGIN SUCCESSFUL
      // ------------------------------------------------

      const loggedInUser = data.user;

      if (!loggedInUser) {
        return {
          success: false,
          message: 'Login successful but user data was not received.'
        };
      }

      if (!data.token) {
        return {
          success: false,
          message: 'Login succeeded but no session was issued by the server. Please try again.'
        };
      }

      setToken(data.token);
      setUser(loggedInUser);
      setIsAuthenticated(true);

      return {
        success: true,
        user: loggedInUser,
        message: data.message || 'Login successful'
      };

    } catch (error) {
      console.error('Login Error:', error);

      return {
        success: false,
        message:
          'Unable to connect to the server. Please make sure the backend is running.'
      };
    }
  };

  // --------------------------------------------------
  // SIGNUP
  // --------------------------------------------------

  const signup = async (userData) => {
    try {
      const response = await fetch(
        `${API_BASE}/api/auth/signup`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            fullName: userData.fullName,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            skills: userData.skills,
            interests: userData.interests,
            avatar: userData.avatar,
            publicId: userData.publicId
          })
        }
      );

      const data = await response.json();

      // ----------------------------------------------
      // SIGNUP ERROR
      // ----------------------------------------------

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            'Signup failed. Please try again.'
        };
      }

      // ----------------------------------------------
      // IMPORTANT:
      // Signup only sends OTP.
      // User is NOT logged in yet.
      // ----------------------------------------------

      return {
        success: true,
        message:
          data.message ||
          'Verification OTP sent to your email.',

        email: data.email,

        requiresVerification:
          data.requiresVerification
      };

    } catch (error) {
      console.error('Signup Error:', error);

      return {
        success: false,
        message:
          'Unable to connect to the server. Please make sure the backend is running.'
      };
    }
  };

  // --------------------------------------------------
  // VERIFY OTP
  // --------------------------------------------------

  const verifyOTP = async (email, otp) => {
    try {
      if (!email?.trim() || !otp?.trim()) {
        return {
          success: false,
          message: 'Email and OTP are required.'
        };
      }

      const response = await fetch(
        `${API_BASE}/api/auth/verify-otp`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message ||
            'OTP verification failed.'
        };
      }

      // Backend returns verified user
      const verifiedUser = data.user;

      if (verifiedUser && data.token) {
        setToken(data.token);
        setUser(verifiedUser);
        setIsAuthenticated(true);
      }

      return {
        success: true,
        message:
          data.message ||
          'Email verified successfully.',
        user: verifiedUser
      };

    } catch (error) {
      console.error('OTP Verification Error:', error);

      return {
        success: false,
        message:
          'Unable to connect to the server. Please make sure the backend is running.'
      };
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setIsAuthenticated(false);

    localStorage.removeItem(
      'mentorsphere-user'
    );
  }, []);

  // --------------------------------------------------
  // SESSION VALIDATION
  // --------------------------------------------------

  // If the server rejects our token (expired / invalid), return to the login screen.
  useEffect(() => {
    const onUnauthorized = () => logout();
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [logout]);

  // On app load, the backend token is the source of truth for real-account identity.
  // This prevents a stale demo/localStorage profile (e.g. Bhavini) from being shown
  // while the backend token is actually signed in as another user (e.g. Appu).
  useEffect(() => {
    if (!getToken()) return;

    let cancelled = false;
    apiRequest('/api/auth/me')
      .then((data) => {
        if (!cancelled && data?.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        // A 401 triggers logout via UNAUTHORIZED_EVENT; transient network errors are ignored.
      });

    return () => { cancelled = true; };
    // Run once on first load only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // SWITCH DEMO ROLE
  // --------------------------------------------------

  const switchDemoRole = (roleKey) => {
    const demoUser = DEMO_ACCOUNTS[roleKey];

    if (!demoUser) {
      return {
        success: false,
        message: 'Invalid demo role.'
      };
    }

    clearToken();
    setUser(demoUser);
    setIsAuthenticated(true);

    return {
      success: true,
      user: demoUser
    };
  };

  // --------------------------------------------------
  // UPDATE PROFILE
  // --------------------------------------------------

  const updateProfile = async (updates) => {
    const current = user;
    if (!current) return { success: false, message: 'Please sign in first.' };
    try {
      if (!isDemoUser(current) && getToken()) {
        const data = await apiRequest('/api/auth/profile', { method: 'PATCH', body: updates });
        setUser(prev => ({ ...prev, ...(data.user || updates) }));
        return { success: true, user: data.user };
      }
      setUser(prev => prev ? { ...prev, ...updates } : prev);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Unable to save profile.' };
    }
  };

  // --------------------------------------------------
  // JOIN / LEAVE CHANNEL
  // --------------------------------------------------

  const toggleJoinChannel = (channelId) => {
    setUser(prev => {
      if (!prev) return prev;

      const isJoined =
        prev.joinedChannels.includes(channelId);

      const newJoined = isJoined
        ? prev.joinedChannels.filter(
            id => id !== channelId
          )
        : [
            ...prev.joinedChannels,
            channelId
          ];

      return {
        ...prev,
        joinedChannels: newJoined
      };
    });
  };

  // --------------------------------------------------
  // CONNECT / DISCONNECT MENTOR
  // --------------------------------------------------

  const toggleConnectMentor = (mentorId) => {
    setUser(prev => {
      if (!prev) return prev;

      const isConnected =
        prev.connectedMentors.includes(mentorId);

      const newConnected = isConnected
        ? prev.connectedMentors.filter(
            id => id !== mentorId
          )
        : [
            ...prev.connectedMentors,
            mentorId
          ];

      return {
        ...prev,
        connectedMentors: newConnected
      };
    });
  };

  // --------------------------------------------------
  // PROVIDER
  // --------------------------------------------------

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isDemo: isDemoUser(user),
        login,
        signup,
        verifyOTP,
        logout,
        switchDemoRole,
        updateProfile,
        toggleJoinChannel,
        toggleConnectMentor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// --------------------------------------------------
// CUSTOM HOOK
// --------------------------------------------------

export const useAuth = () =>
  useContext(AuthContext);