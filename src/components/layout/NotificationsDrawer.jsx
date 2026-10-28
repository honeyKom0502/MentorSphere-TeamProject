import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, X, MessageSquare, UserCheck, Briefcase } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const NotificationsDrawer = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'mentor':
        return <UserCheck className="w-4 h-4 text-emerald-400" />;
      case 'placement':
        return <Briefcase className="w-4 h-4 text-orange-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
      />

      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="fixed top-20 right-6 z-50 w-80 sm:w-96 rounded-3xl glass-panel-elevated bg-slate-950/95 light:bg-white/95 border border-slate-800 light:border-slate-200 shadow-2xl p-4 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 light:border-slate-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-400" />
            <h3 className="font-display font-bold text-base text-slate-100 light:text-slate-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-orange-500/20 text-orange-400">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-500/10 flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Read all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 light:hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-2 max-h-96 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No new notifications. You're all caught up!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markAsRead(item.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  item.read
                    ? 'bg-slate-900/40 border-slate-800/40 text-slate-400 light:bg-slate-50 light:border-slate-200 light:text-slate-600'
                    : 'bg-blue-500/10 border-blue-500/30 text-slate-200 light:bg-blue-50 light:border-blue-200 light:text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-slate-800/60 light:bg-slate-200 shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold truncate text-slate-200 light:text-slate-900">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 light:text-slate-600 mt-0.5 leading-snug line-clamp-2">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
