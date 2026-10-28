import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toast } from './components/common/Toast';
import { FloatingSidebar } from './components/layout/FloatingSidebar';
import { TopBar } from './components/layout/TopBar';

// Landing Page Components
import { LandingNav } from './components/landing/LandingNav';
import { HeroCinematic } from './components/landing/HeroCinematic';
import { ScrollStory } from './components/landing/ScrollStory';
import { CinematicFooter } from './components/landing/CinematicFooter';

// Auth Components
import { LoginModal } from './components/auth/LoginModal';
import { SignupModal } from './components/auth/SignupModal';

// Dashboard Views
import { DynamicGreeting } from './components/dashboard/DynamicGreeting';
import { MetricCards } from './components/dashboard/MetricCards';
import { JoinedChannelsGrid } from './components/dashboard/JoinedChannelsGrid';
import { RecentDiscussionsFeed } from './components/dashboard/RecentDiscussionsFeed';

// Channels & Discussions Views
import { ChannelExplorer } from './components/channels/ChannelExplorer';
import { ChannelView } from './components/channels/ChannelView';
import { DiscussionFeed } from './components/discussions/DiscussionFeed';
import { CreateDiscussionModal } from './components/discussions/CreateDiscussionModal';
import { DiscussionDetailModal } from './components/discussions/DiscussionDetailModal';

// Mentors & Placements & Profile Views
import { MentorDirectory } from './components/mentors/MentorDirectory';
import { PlacementAnalytics } from './components/placements/PlacementAnalytics';
import { ProfileView } from './components/profile/ProfileView';
import { SessionsPage } from './components/sessions/SessionsPage';

// Shared discussions (MongoDB-backed, polled)
import { useDiscussions } from './hooks/useDiscussions';

const MainAppContent = () => {
  const { user, isAuthenticated, isDemo } = useAuth();

  // --------------------------------------------------
  // NAVIGATION STATE
  // --------------------------------------------------

  const [viewMode, setViewMode] = useState(
    isAuthenticated ? 'app' : 'landing'
  );

  const [activeTab, setActiveTab] = useState('dashboard');

  const [activeChannelId, setActiveChannelId] = useState(null);

  const [selectedDiscussion, setSelectedDiscussion] = useState(null);

  // --------------------------------------------------
  // AUTH STATE → VIEW MODE
  // --------------------------------------------------

  useEffect(() => {
    if (isAuthenticated) {
      setViewMode('app');
    } else {
      setViewMode('landing');
    }
  }, [isAuthenticated]);

  // --------------------------------------------------
  // MODALS
  // --------------------------------------------------

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const [isCreateDiscussionOpen, setIsCreateDiscussionOpen] =
    useState(false);

  const [createDiscussionChannelId, setCreateDiscussionChannelId] =
    useState('dsa');

  // --------------------------------------------------
  // SIDEBAR & LAYOUT STATE
  // --------------------------------------------------

  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  // --------------------------------------------------
  // LIVE DISCUSSIONS STATE
  // --------------------------------------------------

  // Questions & replies live in MongoDB. This hook loads them from the
  // backend and polls every few seconds so other users' posts appear
  // without a manual refresh. Demo (browser-only) accounts have no backend identity.
  const {
    discussions: discussionsList,
    loading: discussionsLoading,
    error: discussionsFetchError,
    refresh: refreshDiscussions,
    upsert: upsertDiscussion
  } = useDiscussions({
    enabled: isAuthenticated && viewMode === 'app' && !isDemo
  });

  const discussionsError = isDemo
    ? 'You are using a built-in demo account. Sign in with a real account to see and post shared questions.'
    : discussionsFetchError;

  const discussionListProps = {
    discussionsList,
    loading: discussionsLoading,
    error: discussionsError,
    onRetry: refreshDiscussions
  };

  // Keep the open discussion modal in sync with the latest data from the server
  // (e.g. a reply posted by someone else while it is open).
  const liveSelectedDiscussion = selectedDiscussion
    ? discussionsList.find(d => d.id === selectedDiscussion.id) ||
      selectedDiscussion
    : null;

  // --------------------------------------------------
  // DISCUSSION HANDLERS
  // --------------------------------------------------

  // Both receive the discussion exactly as saved by the server.
  const handleDiscussionCreated = (savedDisc) => {
    upsertDiscussion(savedDisc);
  };

  const handleUpdateDiscussion = (savedDisc) => {
    upsertDiscussion(savedDisc);
  };

  // --------------------------------------------------
  // CREATE DISCUSSION
  // --------------------------------------------------

  const handleOpenCreateDiscussion = (
    channelId = 'dsa'
  ) => {
    setCreateDiscussionChannelId(channelId);
    setIsCreateDiscussionOpen(true);
  };

  // --------------------------------------------------
  // CHANNEL
  // --------------------------------------------------

  const handleOpenChannel = (channelId) => {
    setActiveChannelId(channelId);
    setActiveTab('channel-detail');
  };

  // --------------------------------------------------
  // AUTH SUCCESS
  // --------------------------------------------------

  const handleAuthSuccess = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(false);
    setViewMode('app');
  };

  // --------------------------------------------------
  // LANDING / AUTH SCREEN
  // --------------------------------------------------

  if (viewMode === 'landing' || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 selection:bg-orange-500/30 selection:text-orange-200">

        {/* Landing Navigation */}
        <LandingNav
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenSignup={() => setIsSignupOpen(true)}
          onEnterDemoApp={() => setIsSignupOpen(true)}
        />

        {/* Hero */}
        <HeroCinematic
          onOpenSignup={() => setIsSignupOpen(true)}
          onExploreApp={() => setIsSignupOpen(true)}
        />

        {/* Scroll Story */}
        <ScrollStory
          onOpenSignup={() => setIsSignupOpen(true)}
        />

        {/* Footer */}
        <CinematicFooter
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenSignup={() => setIsSignupOpen(true)}
        />

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleAuthSuccess}
          onSwitchToSignup={() => {
            setIsLoginOpen(false);
            setIsSignupOpen(true);
          }}
        />

        {/* Signup Modal */}
        <SignupModal
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          onSignupSuccess={handleAuthSuccess}
          onSwitchToLogin={() => {
            setIsSignupOpen(false);
            setIsLoginOpen(true);
          }}
        />

        <Toast />

      </div>
    );
  }

  // --------------------------------------------------
  // AUTHENTICATED SAAS DASHBOARD
  // --------------------------------------------------

  return (
    <div className="min-h-screen flex bg-slate-950 light:bg-slate-50 text-slate-100 light:text-slate-900 transition-colors duration-300">

      {/* Floating Sidebar */}
      <FloatingSidebar
        activeTab={
          activeTab === 'channel-detail'
            ? 'channels'
            : activeTab
        }

        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveChannelId(null);
        }}

        isCollapsed={isSidebarCollapsed}

        setIsCollapsed={setIsSidebarCollapsed}

        isMobileOpen={isMobileDrawerOpen}

        setIsMobileOpen={setIsMobileDrawerOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed
            ? 'md:pl-24'
            : 'md:pl-72'
        }`}
      >

        {/* Top Bar */}
        <TopBar
          activeTab={
            activeTab === 'channel-detail'
              ? 'channels'
              : activeTab
          }

          setIsMobileOpen={setIsMobileDrawerOpen}

          searchQuery={searchQuery}

          setSearchQuery={setSearchQuery}
        />

        {/* Main */}
        <main className="flex-1 w-full min-w-0 p-4 md:p-8 space-y-6">

          {/* =========================================
              DASHBOARD TAB
          ========================================= */}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">

              <DynamicGreeting
                onOpenCreateDiscussion={() =>
                  handleOpenCreateDiscussion()
                }

                onExploreChannels={() =>
                  setActiveTab('channels')
                }

                onFindMentors={() =>
                  setActiveTab('mentors')
                }
              />

              <MetricCards
                onSelectTab={(tab) =>
                  setActiveTab(tab)
                }
              />

              <div className="w-full min-w-0 space-y-6">

                <JoinedChannelsGrid
                  onOpenChannel={handleOpenChannel}

                  onExploreAll={() =>
                    setActiveTab('channels')
                  }
                />

                <RecentDiscussionsFeed
                  onSelectDiscussion={(disc) =>
                    setSelectedDiscussion(disc)
                  }

                  onExploreDiscussions={() =>
                    setActiveTab('discussions')
                  }

                  discussions={discussionsList}
                  loading={discussionsLoading}
                  error={discussionsError}
                  onRetry={refreshDiscussions}
                />

              </div>

            </div>
          )}

          {/* =========================================
              CHANNELS TAB
          ========================================= */}

          {activeTab === 'channels' && (
            <ChannelExplorer
              onOpenChannel={handleOpenChannel}
            />
          )}

          {/* =========================================
              SINGLE CHANNEL DETAIL
          ========================================= */}

          {activeTab === 'channel-detail' &&
            activeChannelId && (
              <ChannelView
                channelId={activeChannelId}

                onBack={() =>
                  setActiveTab('channels')
                }

                onOpenCreateDiscussion={
                  handleOpenCreateDiscussion
                }

                onSelectDiscussion={(disc) =>
                  setSelectedDiscussion(disc)
                }

                {...discussionListProps}
              />
            )}

          {/* =========================================
              DISCUSSIONS TAB
          ========================================= */}

          {activeTab === 'discussions' && (
            <DiscussionFeed
              onSelectDiscussion={(disc) =>
                setSelectedDiscussion(disc)
              }

              onOpenCreateDiscussion={
                handleOpenCreateDiscussion
              }

              onDeleteDiscussion={async () => {
                await refreshDiscussions();
              }}

              {...discussionListProps}
            />
          )}

          {/* =========================================
              MENTORS DIRECTORY
          ========================================= */}

          {activeTab === 'mentors' && (
            <MentorDirectory />
          )}

          {/* MENTORSHIP SESSIONS + SHARED ROADMAP WORKSPACE */}
          {activeTab === 'sessions' && <SessionsPage />}

          {/* =========================================
              PLACEMENTS
          ========================================= */}

          {activeTab === 'placements' && (
            <PlacementAnalytics />
          )}

          {/* =========================================
              MY PROFILE
          ========================================= */}

          {activeTab === 'profile' && (
            <ProfileView />
          )}

          {/* =========================================
              NOTIFICATIONS
          ========================================= */}

          {activeTab === 'notifications' && (
            <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated bg-slate-950/80 light:bg-white/90 border border-slate-800 light:border-slate-200">

              <h2 className="font-display font-black text-2xl text-slate-100 light:text-slate-900 mb-2">
                All College Notifications
              </h2>

              <p className="text-xs text-slate-400 mb-6">
                Activity alerts from discussion replies,
                mentor connections, and campus placements.
              </p>

              <RecentDiscussionsFeed
                onSelectDiscussion={(disc) =>
                  setSelectedDiscussion(disc)
                }

                onExploreDiscussions={() =>
                  setActiveTab('discussions')
                }

                discussions={discussionsList}
                loading={discussionsLoading}
                error={discussionsError}
                onRetry={refreshDiscussions}
              />

            </div>
          )}

        </main>
      </div>

      {/* =========================================
          GLOBAL MODALS
      ========================================= */}

      <CreateDiscussionModal
        isOpen={isCreateDiscussionOpen}

        onClose={() =>
          setIsCreateDiscussionOpen(false)
        }

        defaultChannelId={
          createDiscussionChannelId
        }

        onDiscussionCreated={
          handleDiscussionCreated
        }
      />

      <DiscussionDetailModal
        discussion={liveSelectedDiscussion}

        isOpen={!!liveSelectedDiscussion}

        onClose={() =>
          setSelectedDiscussion(null)
        }

        onUpdateDiscussion={
          handleUpdateDiscussion
        }

        onDeleteDiscussion={async () => {
          setSelectedDiscussion(null);
          await refreshDiscussions();
        }}
      />

      <Toast />

    </div>
  );
};

// ==================================================
// APP
// ==================================================

export default function App() {
  return (
    <ThemeProvider>

      <AuthProvider>

        <NotificationProvider>

          <MainAppContent />

        </NotificationProvider>

      </AuthProvider>

    </ThemeProvider>
  );
}