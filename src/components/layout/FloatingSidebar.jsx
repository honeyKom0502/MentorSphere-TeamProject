import React from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Hash,
  MessageSquare,
  Users,
  TrendingUp,
  UserCheck,
  CalendarClock,
  Bell,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnimeAvatar } from '../../data/animeAvatars';
import acharyaLogo from '../../assets/acharya-logo.jpg';

export const FloatingSidebar = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'channels', label: 'Channels', icon: Hash, badge: user?.joinedChannels?.length },
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'mentors', label: 'Find Mentors', icon: Users },
    { id: 'sessions', label: 'Mentor Sessions', icon: CalendarClock },
    { id: 'placements', label: 'Placements', icon: TrendingUp },
    { id: 'profile', label: 'My Profile', icon: UserCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-3 select-none bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div>
        <div className="flex items-center justify-between px-2 py-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-md shrink-0 border border-slate-200 dark:border-slate-700">
              <img
                src={acharyaLogo}
                alt="Acharya Logo"
                className="w-full h-full object-cover"
              />
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <span className="font-display font-black text-lg tracking-tight text-slate-900 dark:text-slate-100">
                  Mentor<span className="text-orange-500">Sphere</span>
                </span>
                <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                  LEARN • BUILD • GROW
                </p>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (setIsMobileOpen) setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all relative ${
                  isActive
                    ? 'text-white bg-blue-600 shadow-md shadow-blue-600/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                />

                {!isCollapsed && <span className="truncate">{item.label}</span>}

                {item.badge != null && (
                  <span
                    className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute left-0 w-1 h-5 bg-orange-400 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/30">
          <AnimeAvatar avatarId={user?.avatar || 'avatar-1'} size="sm" />

          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">
                  {user?.publicId || 'Student'}
                </span>
                <ShieldCheck
                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                  title="Verified College ID"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {user?.fullName}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-1 pt-1">
          <button
            onClick={toggleTheme}
            className="flex-1 flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
            {!isCollapsed && <span>{isDark ? 'Light' : 'Dark'}</span>}
          </button>

          <button
            onClick={logout}
            className="flex items-center justify-center p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block fixed top-4 left-4 bottom-4 z-40 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl backdrop-blur-2xl"
      >
        {sidebarContent}
      </motion.aside>

      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}

      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};