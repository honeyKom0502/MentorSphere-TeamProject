import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Trash2, X, RefreshCw } from 'lucide-react';
import { apiRequest, isDemoUser } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';

const timeLabel = value => {
  try { return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
};

export const MentorChatModal = ({ mentor, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [conversation, setConversation] = useState(null);
  const [otherUser, setOtherUser] = useState(mentor);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);
  const busyRef = useRef(false);

  const loadChat = useCallback(async (quiet = false) => {
    if (isDemoUser(user)) {
      setError('Live chat needs a registered account. Please log out of the demo account and sign in with your real account.');
      setLoading(false);
      return;
    }
    try {
      if (!quiet) setLoading(true);
      const data = await apiRequest(`/api/chats/with/${encodeURIComponent(mentor.id)}`);
      setConversation(data.conversation);
      setOtherUser(data.otherUser || mentor);
      setError('');
    } catch (e) {
      setError(e.message || 'Could not load this chat.');
    } finally {
      setLoading(false);
    }
  }, [mentor, user]);

  useEffect(() => { loadChat(); }, [loadChat]);
  useEffect(() => {
    if (isDemoUser(user)) return undefined;
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') loadChat(true);
    }, 2500);
    return () => clearInterval(timer);
  }, [loadChat, user]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [conversation?.messages?.length]);

  const sendMessage = async e => {
    e.preventDefault();
    const content = message.trim();
    if (!content || sending || busyRef.current) return;
    busyRef.current = true;
    setSending(true);
    try {
      const data = await apiRequest(`/api/chats/with/${encodeURIComponent(mentor.id)}/messages`, {
        method: 'POST', body: { content }
      });
      setConversation(data.conversation);
      setMessage('');
      setError('');
    } catch (e) {
      setError(e.message || 'Message could not be sent.');
    } finally {
      busyRef.current = false;
      setSending(false);
    }
  };

  const deleteMessage = async msg => {
    if (!msg.isMine || !conversation?.id) return;
    if (!window.confirm('Delete this message for both participants?')) return;
    try {
      const data = await apiRequest(`/api/chats/${encodeURIComponent(conversation.id)}/messages/${encodeURIComponent(msg.id)}`, { method: 'DELETE' });
      setConversation(data.conversation);
      showToast('Message deleted.', 'success');
    } catch (e) {
      showToast(e.message || 'Could not delete message.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5" onClick={onClose}>
      <section onClick={e => e.stopPropagation()} className="w-full max-w-2xl h-[min(82vh,760px)] rounded-3xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl flex flex-col">
        <header className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900/90">
          <AnimeAvatar avatarId={otherUser?.avatar || mentor.avatar} size="md"/>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold truncate">{otherUser?.fullName || mentor.fullName || 'Mentor'}</h3>
              <RoleBadge role={otherUser?.role || mentor.role} size="sm"/>
            </div>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400"/> Private mentorship chat · refreshes automatically</p>
          </div>
          <button onClick={() => loadChat()} title="Refresh chat" className="p-2 rounded-xl text-slate-400 hover:bg-slate-800"><RefreshCw size={17}/></button>
          <button onClick={onClose} title="Close chat" className="p-2 rounded-xl text-slate-400 hover:bg-slate-800"><X size={19}/></button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
          {loading && <p className="text-center text-sm text-slate-400 py-8">Loading conversation…</p>}
          {!loading && !error && !(conversation?.messages?.length) && (
            <div className="max-w-sm mx-auto mt-10 p-5 rounded-2xl border border-slate-800 bg-slate-900/70 text-center">
              <MessageCircle className="mx-auto mb-2 text-emerald-400" size={28}/>
              <p className="font-semibold">Start the conversation</p>
              <p className="text-xs text-slate-400 mt-1">Ask about skills, placements, projects or career guidance.</p>
            </div>
          )}
          {(conversation?.messages || []).map(msg => (
            <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`group relative max-w-[88%] sm:max-w-[75%] px-3.5 py-2.5 rounded-2xl shadow-sm ${msg.isMine ? 'bg-emerald-700/90 rounded-br-sm' : 'bg-slate-800 border border-slate-700 rounded-bl-sm'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-white/90">{msg.isMine ? 'You' : msg.authorName}</span>
                  {!msg.isMine && msg.authorRole && <span className="text-[9px] text-slate-300">{msg.authorRole}</span>}
                </div>
                <p className="text-sm whitespace-pre-wrap break-words pr-1">{msg.content}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className="text-[9px] text-white/60">{timeLabel(msg.createdAt)}</span>
                  {msg.isMine && <button onClick={() => deleteMessage(msg)} aria-label="Delete message" title="Delete for both" className="opacity-70 hover:opacity-100 text-white/80"><Trash2 size={12}/></button>}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef}/>
        </div>

        {error && <div className="px-4 py-2 text-xs text-rose-300 bg-rose-950/40 border-t border-rose-900/50">{error}</div>}
        <form onSubmit={sendMessage} className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900 flex items-end gap-2">
          <textarea rows={1} maxLength={2000} value={message} onChange={e => setMessage(e.target.value)} placeholder={`Message ${otherUser?.fullName || mentor.fullName || 'mentor'}…`} className="min-h-11 max-h-28 flex-1 resize-y rounded-2xl bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"/>
          <button disabled={sending || !message.trim() || isDemoUser(user)} type="submit" className="h-11 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm flex items-center gap-2"><Send size={16}/><span className="hidden sm:inline">{sending ? 'Sending…' : 'Send'}</span></button>
        </form>
      </section>
    </div>
  );
};
