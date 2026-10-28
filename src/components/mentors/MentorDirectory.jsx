import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, ShieldCheck, RefreshCw, Eye, UserPlus, MessageCircle, Check, X, Inbox, UserCheck } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { AnimeAvatar } from '../../data/animeAvatars';
import { RoleBadge } from '../common/Badge';
import { MentorChatModal } from './MentorChatModal';

export const MentorDirectory = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [connectingId, setConnectingId] = useState('');
  const [chatMentor, setChatMentor] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [respondingId, setRespondingId] = useState('');

  const loadMentors = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (selectedRole !== 'all') params.set('role', selectedRole);
      const data = await apiRequest(`/api/mentors?${params.toString()}`);
      const currentId = String(user?.id || user?._id || '');
      const currentName = String(user?.fullName || user?.name || '').trim().toLowerCase();
      const currentRole = String(user?.role || '').toLowerCase();
      const filtered = (data.mentors || []).filter(m => {
        const sameId = currentId && String(m.id) === currentId;
        const sameVisibleIdentity = currentName && String(m.fullName || '').trim().toLowerCase() === currentName
          && String(m.role || '').toLowerCase() === currentRole;
        return !sameId && !sameVisibleIdentity;
      });
      setMentors(filtered);
    } catch (err) {
      setError(err.message || 'Could not load registered mentors.');
      setMentors([]);
    } finally { setLoading(false); }
  }, [search, selectedRole, user?.id, user?._id, user?.fullName, user?.name, user?.role]);

  useEffect(() => { const t = setTimeout(loadMentors, 250); return () => clearTimeout(t); }, [loadMentors]);
  // Refresh statuses so an accepted request changes from Requested to Connected without a manual reload.
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') loadMentors();
    }, 5000);
    return () => clearInterval(timer);
  }, [loadMentors]);

  const loadConnections = useCallback(async () => {
    if (!user) { setIncomingRequests([]); setConnections([]); return; }
    try {
      const requestPromise = ['Senior', 'Alumni'].includes(user.role)
        ? apiRequest('/api/mentors/requests')
        : Promise.resolve({ requests: [] });
      const [requestData, connectionData] = await Promise.all([
        requestPromise,
        apiRequest('/api/mentors/connections')
      ]);
      setIncomingRequests(requestData.requests || []);
      setConnections(connectionData.connections || []);
    } catch (err) {
      showToast(err.message || 'Could not load connection requests.', 'error');
    }
  }, [user?.id, user?.role, showToast]);

  useEffect(() => { loadConnections(); }, [loadConnections]);
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') loadConnections();
    }, 5000);
    return () => clearInterval(timer);
  }, [loadConnections]);

  const respondToRequest = async (person, action) => {
    setRespondingId(person.id);
    try {
      const result = await apiRequest(`/api/mentors/${encodeURIComponent(person.id)}/respond`, {
        method: 'POST', body: { action }
      });
      showToast(result.message, 'success');
      await Promise.all([loadConnections(), loadMentors()]);
    } catch (err) {
      showToast(err.message || 'Could not update request.', 'error');
    } finally {
      setRespondingId('');
    }
  };

  const connect = async (mentor) => {
    setConnectingId(mentor.id);
    try {
      const result = await apiRequest(`/api/mentors/${mentor.id}/connect`, { method: 'POST', body: {} });
      setMentors(prev => prev.map(m => m.id === mentor.id ? { ...m, requestPending: !!result.requestPending, isConnected: !!result.isConnected } : m));
      showToast(result.message || 'Connection request sent.', 'success');
    } catch (err) { showToast(err.message || 'Could not send request.', 'error'); }
    finally { setConnectingId(''); }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 md:p-8 rounded-3xl glass-panel-elevated bg-slate-950/80 light:bg-white/90 border border-slate-800 light:border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1"><Users className="w-4 h-4" /><span>Registered Community</span></div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-slate-100 light:text-slate-900 tracking-tight">Find a Mentor</h2>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-xl">Search real registered Seniors and Alumni by name, skills, interests, company or career domain.</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 text-center light:bg-white light:border-slate-300">
            <span className="font-display font-black text-xl text-orange-400 block">{mentors.length}</span>
            <span className="text-[10px] font-semibold text-slate-400 uppercase">Profiles found</span>
          </div>
        </div>
      </div>

      {['Senior', 'Alumni'].includes(user?.role) && (
        <section className="p-5 rounded-3xl border border-orange-500/30 bg-orange-500/5 space-y-3">
          <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><Inbox className="w-5 h-5 text-orange-400"/><h3 className="font-bold text-slate-100 light:text-slate-900">Connection Requests ({incomingRequests.length})</h3></div><button onClick={loadConnections} className="text-xs font-semibold text-blue-400 hover:text-blue-300">Refresh requests</button></div>
          {incomingRequests.length === 0 && <p className="text-sm text-slate-400">No pending requests yet. New requests will appear here automatically.</p>}
          {incomingRequests.map(person => (
            <div key={person.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-2xl bg-slate-900/70 light:bg-white border border-slate-800 light:border-slate-200">
              <AnimeAvatar avatarId={person.avatar} size="md"/>
              <div className="flex-1 min-w-0"><div className="font-bold text-sm text-slate-100 light:text-slate-900">{person.fullName}</div><div className="text-xs text-slate-400">{person.role} · {(person.skills || []).slice(0, 4).join(', ') || 'Skills not added'}</div></div>
              <div className="flex gap-2">
                <button disabled={respondingId === person.id} onClick={() => respondToRequest(person, 'accept')} className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold disabled:opacity-50"><Check size={14} className="inline mr-1"/>Accept</button>
                <button disabled={respondingId === person.id} onClick={() => respondToRequest(person, 'reject')} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold disabled:opacity-50"><X size={14} className="inline mr-1"/>Reject</button>
              </div>
            </div>
          ))}
        </section>
      )}

      {connections.length > 0 && (
        <section className="p-5 rounded-3xl border border-emerald-500/25 bg-emerald-500/5 space-y-3">
          <div className="flex items-center gap-2"><UserCheck className="w-5 h-5 text-emerald-400"/><h3 className="font-bold text-slate-100 light:text-slate-900">Connected · Live Chat ({connections.length})</h3></div>
          {connections.map(person => (
            <div key={person.id} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/70 light:bg-white border border-slate-800 light:border-slate-200">
              <AnimeAvatar avatarId={person.avatar} size="md"/>
              <div className="flex-1 min-w-0"><div className="font-bold text-sm text-slate-100 light:text-slate-900">{person.fullName}</div><div className="text-xs text-slate-400">{person.role}</div></div>
              <button onClick={() => setChatMentor(person)} className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"><MessageCircle size={14} className="inline mr-1"/>Live Chat</button>
            </div>
          ))}
        </section>
      )}

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, Java, DSA, AI/ML, company..." className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-slate-900/80 border border-slate-800 text-slate-200 light:bg-white light:border-slate-300 light:text-slate-900" />
        </div>
        <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="px-4 py-3 rounded-2xl text-sm bg-slate-900 border border-slate-800 text-slate-200 light:bg-white light:border-slate-300 light:text-slate-900">
          <option value="all">All mentors</option><option value="Senior">Seniors</option><option value="Alumni">Alumni</option>
        </select>
        <button onClick={loadMentors} className="px-4 py-3 rounded-2xl text-sm font-bold bg-blue-600 text-white flex items-center justify-center gap-2"><RefreshCw className="w-4 h-4"/> Refresh</button>
      </div>

      {loading && <div className="p-8 text-center text-slate-400">Searching registered users…</div>}
      {!loading && error && <div className="p-6 rounded-2xl border border-rose-500/30 text-rose-300"><p>{error}</p><p className="text-sm mt-2">Make sure the backend is running, MongoDB is connected, and you are signed in with a real account.</p><button onClick={loadMentors} className="mt-3 underline">Try again</button></div>}
      {!loading && !error && mentors.length === 0 && <div className="p-8 rounded-3xl border border-slate-800 text-center"><Users className="w-8 h-8 mx-auto text-slate-500 mb-3"/><h3 className="font-bold text-slate-200 light:text-slate-800">No registered mentors found</h3><p className="text-sm text-slate-400 mt-1">Try another keyword or ask a Senior/Alumni to create an account and complete their profile.</p></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mentors.map(mentor => (
          <motion.article key={mentor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-3xl glass-panel bg-slate-900/50 light:bg-white/85 border border-slate-800/80 light:border-slate-200 flex flex-col">
            <div className="flex items-start gap-3">
              <AnimeAvatar avatarId={mentor.avatar} size="lg"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap"><h3 className="font-bold text-slate-100 light:text-slate-900">{mentor.fullName || 'Mentor'}</h3><ShieldCheck className="w-4 h-4 text-blue-400"/><RoleBadge role={mentor.role} size="sm"/></div>
                <p className="text-sm text-slate-400 mt-1">{[mentor.companyOrTrack, mentor.department, mentor.graduationYear].filter(Boolean).join(' · ') || 'Career details not added yet'}</p>
              </div>
            </div>
            {mentor.bio && <p className="text-sm text-slate-400 light:text-slate-600 mt-4">{mentor.bio}</p>}
            <div className="mt-4 space-y-2"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Skills</p><div className="flex flex-wrap gap-1.5">{(mentor.skills || []).length ? mentor.skills.map(skill => <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/20">{skill}</span>) : <span className="text-xs text-slate-500">No skills added yet</span>}</div></div>
            {!!mentor.interests?.length && <p className="text-xs text-slate-400 mt-3"><span className="font-semibold">Interests:</span> {mentor.interests.join(', ')}</p>}
            <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-800/60 light:border-slate-200">
              <button onClick={() => setSelectedMentor(mentor)} className="py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 light:bg-slate-100 light:text-slate-800 flex items-center justify-center gap-1.5"><Eye className="w-4 h-4"/> Profile</button>
              <button disabled={connectingId === mentor.id || (mentor.isConnected && !mentor.requestPending) || mentor.requestPending} onClick={() => connect(mentor)} className={`py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 ${(mentor.isConnected && !mentor.requestPending) ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white'}`}><UserPlus className="w-4 h-4"/>{mentor.requestPending ? 'Requested' : (mentor.isConnected ? 'Connected' : connectingId === mentor.id ? 'Sending…' : 'Connect')}</button>
              {(mentor.isConnected && !mentor.requestPending) ? <button onClick={() => setChatMentor(mentor)} className="py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5"><MessageCircle className="w-4 h-4"/> Live Chat</button> : <div className="py-2.5 rounded-xl text-xs font-semibold bg-slate-800/70 text-slate-500 flex items-center justify-center gap-1.5"><MessageCircle className="w-4 h-4"/> Unlock after acceptance</div>}
            </div>
          </motion.article>
        ))}
      </div>

      {chatMentor && <MentorChatModal mentor={chatMentor} onClose={() => setChatMentor(null)} />}

      {selectedMentor && <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedMentor(null)}><div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-3xl p-6 bg-slate-950 light:bg-white border border-slate-700 light:border-slate-200 shadow-2xl"><div className="flex items-center gap-3"><AnimeAvatar avatarId={selectedMentor.avatar} size="lg"/><div><h3 className="font-bold text-lg text-slate-100 light:text-slate-900">{selectedMentor.fullName || 'Mentor'}</h3><RoleBadge role={selectedMentor.role}/></div></div><p className="text-sm text-slate-300 light:text-slate-700 mt-4">{selectedMentor.bio || 'This user has not added a bio yet.'}</p><p className="text-sm text-slate-400 mt-3">{[selectedMentor.companyOrTrack, selectedMentor.department, selectedMentor.graduationYear].filter(Boolean).join(' · ')}</p><p className="text-xs text-slate-400 mt-4"><strong>Skills:</strong> {(selectedMentor.skills || []).join(', ') || 'Not added'}</p><p className="text-xs text-slate-400 mt-2"><strong>Interests:</strong> {(selectedMentor.interests || []).join(', ') || 'Not added'}</p><div className="flex justify-end mt-6"><button onClick={() => setSelectedMentor(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-white">Close</button></div></div></div>}
    </div>
  );
};
