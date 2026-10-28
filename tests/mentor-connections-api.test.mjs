import { pathToFileURL } from 'node:url';

process.env.NODE_ENV = 'test';
process.env.AUTH_SECRET = 'mentor-test-secret-mentor-test-secret';
const root = new URL('../server', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const { default: mongoose } = await import('mongoose');
mongoose.connect = async () => mongoose;
Object.defineProperty(mongoose.connection, 'readyState', { get: () => 1, configurable: true });

const { default: User } = await import(pathToFileURL(`${root}/models/User.js`).href);
const { default: Conversation } = await import(pathToFileURL(`${root}/models/Conversation.js`).href);
const { signAuthToken } = await import(pathToFileURL(`${root}/utils/authToken.js`).href);
const id = () => new mongoose.Types.ObjectId();
const junior = {
  _id: id(), fullName: 'Bhavini Junior', email: 'junior@test.local', role: 'Junior',
  publicId: 'BhaviniID', avatar: 'avatar-1', profileVisibility: 'public',
  emailVerified: true, connectionRequests: [], connectedUsers: [], connectedMentors: [],
  save: async function () {}
};
const senior = {
  _id: id(), fullName: 'Appu Senior', email: 'senior@test.local', role: 'Alumni',
  publicId: 'AppuID', avatar: 'avatar-2', profileVisibility: 'public',
  emailVerified: true, connectionRequests: [], connectedUsers: [], connectedMentors: [],
  save: async function () {}
};
const users = [junior, senior];
const byId = value => users.find(u => String(u._id) === String(value));
const matches = (u, f) => {
  if (f._id && typeof f._id === 'object' && f._id.$in && !f._id.$in.some(x => String(x) === String(u._id))) return false;
  else if (f._id && typeof f._id !== 'object' && String(f._id) !== String(u._id)) return false;
  if (f.role?.$in && !f.role.$in.includes(u.role)) return false;
  if (f.emailVerified?.$ne === false && u.emailVerified === false) return false;
  if (f.profileVisibility?.$ne === 'private' && u.profileVisibility === 'private') return false;
  if (f.connectionRequests && !u.connectionRequests.some(x => String(x) === String(f.connectionRequests))) return false;
  return true;
};
const query = (get) => ({
  select() { return this; },
  lean() { return Promise.resolve(get()); },
  then(resolve, reject) { return Promise.resolve(get()).then(resolve, reject); }
});
User.findById = value => query(() => byId(value) || null);
User.findOne = filter => query(() => users.find(u => matches(u, filter)) || null);
User.find = filter => query(() => users.filter(u => matches(u, filter)));

const conversations = [];
Conversation.findOne = filter => query(() => conversations.find(c => c.participantKey === filter.participantKey) || null);
Conversation.create = async data => {
  const conversation = {
    _id: id(), ...data,
    save: async function () {
      for (const message of this.messages) if (!message.createdAt) message.createdAt = new Date();
    },
    toObject() { return this; }
  };
  conversations.push(conversation);
  return conversation;
};

const { default: app } = await import(pathToFileURL(`${root}/server.js`).href);
const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}`;
const tokens = { junior: signAuthToken(junior._id), senior: signAuthToken(senior._id) };
const call = async (path, { method = 'GET', as = 'junior', body } = {}) => {
  const response = await fetch(base + path, {
    method,
    headers: { Authorization: `Bearer ${tokens[as]}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  let json = null;
  try { json = await response.json(); } catch {}
  return { status: response.status, json };
};
let failed = 0, passed = 0;
const check = (name, ok, detail) => { if (ok) passed++; else failed++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` -> ${JSON.stringify(detail)}`}`); };

try {
  let r = await call(`/api/mentors/${senior._id}/connect`, { method: 'POST', as: 'junior', body: {} });
  check('junior sends connection request', r.status === 200 && r.json.requestPending === true && senior.connectionRequests.some(x => String(x) === String(junior._id)), r);

  r = await call('/api/mentors/requests', { as: 'senior' });
  check('recipient sees request in their own inbox', r.status === 200 && r.json.requests.length === 1 && r.json.requests[0].id === String(junior._id), r);

  r = await call(`/api/chats/with/${senior._id}`, { as: 'junior' });
  check('private chat is blocked before acceptance', r.status === 403, r);

  r = await call(`/api/mentors/${junior._id}/respond`, { method: 'POST', as: 'senior', body: { action: 'accept' } });
  check('recipient can accept request', r.status === 200 && r.json.isConnected === true, r);
  check('acceptance creates a mutual connection', junior.connectedUsers.some(x => String(x) === String(senior._id)) && senior.connectedUsers.some(x => String(x) === String(junior._id)), { junior: junior.connectedUsers, senior: senior.connectedUsers });

  r = await call('/api/mentors/requests', { as: 'senior' });
  check('accepted request disappears from pending inbox', r.status === 200 && r.json.requests.length === 0, r);
  r = await call(`/api/mentors/${senior._id}/connect`, { method: 'POST', as: 'junior', body: {} });
  check('already-connected person is not re-requested', r.status === 200 && r.json.isConnected === true, r);

  r = await call(`/api/chats/with/${senior._id}`, { as: 'junior' });
  check('private chat opens after acceptance', r.status === 200 && r.json.conversation && r.json.otherUser.role === 'Alumni', r);
  r = await call(`/api/chats/with/${senior._id}/messages`, { method: 'POST', as: 'junior', body: { content: 'Hi Appu, this is Bhavini.' } });
  check('message identity comes from logged-in junior token', r.status === 201 && r.json.conversation.messages[0].authorName === 'Bhavini Junior' && r.json.conversation.messages[0].authorRole === 'Junior' && r.json.conversation.messages[0].isMine === true, r);
  r = await call(`/api/chats/with/${junior._id}`, { as: 'senior' });
  check('recipient loads same two-sided conversation', r.status === 200 && r.json.conversation.messages.length === 1 && r.json.conversation.messages[0].isMine === false, r);
} finally {
  server.close();
}
console.log(`\n${passed} passed, ${failed} failed`);
if (failed) process.exitCode = 1;
