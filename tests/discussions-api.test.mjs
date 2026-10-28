import { pathToFileURL } from 'node:url';
// Run from the project root:  node tests/discussions-api.test.mjs
// Route-level tests with the Mongoose models stubbed in memory.
// Verifies auth, validation, moderation, privacy, dedupe and sharing LOGIC.
// It does NOT exercise a real MongoDB server.
process.env.NODE_ENV = 'test';
process.env.AUTH_SECRET = 'test-secret-test-secret-test-secret';
const root = new URL('../server', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const { default: mongoose } = await import('mongoose');
mongoose.connect = async () => mongoose;
Object.defineProperty(mongoose.connection, 'readyState', { get: () => globalThis.__dbState ?? 1, configurable: true });
globalThis.__dbState = 1;

const { default: User } = await import(pathToFileURL(`${root}/models/User.js`).href);
const { default: Discussion } = await import(pathToFileURL(`${root}/models/Discussion.js`).href);
const { signAuthToken, verifyAuthToken } = await import(pathToFileURL(`${root}/utils/authToken.js`).href);
const oid = () => new mongoose.Types.ObjectId();

const users = [
  { _id: oid(), fullName: 'Alice Real', email: 'alice@x.edu', role: 'Junior', publicId: 'PixelAlice', avatar: 'avatar-1', emailVerified: true },
  { _id: oid(), fullName: 'Bob Real', email: 'bob@x.edu', role: 'Senior', publicId: 'KnightBob', avatar: 'avatar-2', emailVerified: true },
  { _id: oid(), fullName: 'Unverified', email: 'u@x.edu', role: 'Junior', publicId: 'Nope', avatar: 'avatar-3', emailVerified: false },
];
User.findById = (id) => ({ select: async () => users.find((u) => String(u._id) === String(id)) || null });

let store = [];
const clone = (x) => JSON.parse(JSON.stringify(x), (k, v) => v);
const asLean = (d) => ({ ...d, replies: d.replies.map((r) => ({ ...r })) });
const q = (arr) => { const o = { _a: arr, sort() { this._a = [...this._a].sort((a, b) => b.createdAt - a.createdAt); return this; }, limit(n) { this._a = this._a.slice(0, n); return this; }, lean: async () => o._a, then(res, rej) { return Promise.resolve(o._a).then(res, rej); } }; return o; };
Discussion.find = (filter = {}) => q(store.filter((d) => !filter.channelId || d.channelId === filter.channelId));
Discussion.findById = (id) => ({ lean: async () => store.find((d) => String(d._id) === String(id)) || null });
Discussion.findOne = (f) => ({ lean: async () => {
  const since = f.createdAt?.$gte;
  if (f.replies) { const m = f.replies.$elemMatch; return store.find((d) => String(d._id) === String(f._id) && d.replies.some((r) => String(r.author) === String(m.author) && r.content === m.content && r.createdAt >= m.createdAt.$gte)) || null; }
  return store.find((d) => String(d.author) === String(f.author) && d.channelId === f.channelId && d.title === f.title && d.content === f.content && d.createdAt >= since) || null; } });
Discussion.create = async (data) => { const d = { _id: oid(), upvotes: 0, replies: [], createdAt: new Date(), updatedAt: new Date(), ...data }; store.push(d); return { toObject: () => asLean(d) }; };
Discussion.findOneAndUpdate = (f, u) => ({ lean: async () => { const d = store.find((x) => String(x._id) === String(f._id)); if (!d) return null; d.replies.push(u.$push.replies); return asLean(d); } });

const { default: app } = await import(pathToFileURL(`${root}/server.js`).href);
const server = app.listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

let pass = 0, fail = 0;
const t = (name, cond, extra) => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  -> ' + JSON.stringify(extra)}`); };
const call = async (path, { method = 'GET', body, token, raw } = {}) => {
  const r = await fetch(base + path, { method, headers: { ...(body !== undefined || raw ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined) });
  let j = null; try { j = await r.json(); } catch {}
  return { s: r.status, j };
};
const A = signAuthToken(users[0]._id), B = signAuthToken(users[1]._id);

// health
let r = await call('/api/health'); t('health returns healthy + db state', r.s === 200 && r.j.status === 'healthy' && r.j.database === 'connected', r);

// auth enforcement
r = await call('/api/discussions'); t('GET without token -> 401', r.s === 401, r);
r = await call('/api/discussions', { token: 'garbage.token' }); t('GET with forged token -> 401', r.s === 401, r);
const tampered = A.split('.')[0] + '.' + 'x'.repeat(43); r = await call('/api/discussions', { token: tampered }); t('tampered signature -> 401', r.s === 401, r);
const forgedPayload = Buffer.from(JSON.stringify({ sub: String(users[1]._id), exp: 9999999999 })).toString('base64url'); r = await call('/api/discussions', { token: forgedPayload + '.' + A.split('.')[1] }); t('payload swapped to another user -> 401', r.s === 401, r);
r = await call('/api/discussions', { token: signAuthToken(users[2]._id) }); t('unverified user token -> 401', r.s === 401, r);
r = await call('/api/discussions', { token: signAuthToken(oid()) }); t('token for non-existent user -> 401', r.s === 401, r);
t('expired token rejected', verifyAuthToken((() => { const p = Buffer.from(JSON.stringify({ sub: 'x', exp: 1 })).toString('base64url'); return p + '.' + 'a'; })()) === null);

// empty state
r = await call('/api/discussions', { token: A }); t('empty list for A', r.s === 200 && r.j.discussions.length === 0, r);

// validation
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: 'dsa', title: '  ', content: 'x' } }); t('empty title -> 400', r.s === 400, r);
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: 'dsa', title: 't', content: '' } }); t('empty content -> 400', r.s === 400, r);
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: '../x', title: 't', content: 'c' } }); t('bad channel -> 400', r.s === 400, r);
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: 'dsa', title: 'x'.repeat(201), content: 'c' } }); t('over-long title -> 400', r.s === 400, r);
r = await call('/api/discussions', { method: 'POST', token: A, raw: '{bad json' }); t('malformed JSON -> 400 JSON error', r.s === 400 && r.j?.success === false, r);
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: 'dsa', title: 'you are stupid', content: 'idiot' } }); t('abusive text -> 422 MODERATION_REJECTED', r.s === 422 && r.j.code === 'MODERATION_REJECTED', r);
t('nothing saved after rejected posts', store.length === 0);

// A creates question (client tries to spoof identity)
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: 'dsa', title: 'How does a monotonic stack work?', content: 'Explain please', tags: ['Stack', '#Stack', 'DSA'], isAnonymous: false, authorPublicId: 'KnightBob', author: String(users[1]._id), authorRole: 'Alumni' } });
const qid = r.j?.discussion?.id;
t('A creates question -> 201', r.s === 201 && qid, r);
t('author identity comes from token, not body', r.j.discussion.authorPublicId === 'PixelAlice' && r.j.discussion.authorRole === 'Junior', r.j.discussion);
t('tags de-duplicated', JSON.stringify(r.j.discussion.tags) === '["Stack","DSA"]', r.j.discussion.tags);
t('public response never leaks email or internal Mongo author id', !/alice@x|"author"\s*:/.test(JSON.stringify(r.j)), r.j);
t('saved in store', store.length === 1);

// Anonymous mode must hide role/name while public mode displays the authenticated role.
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: 'dsa', title: 'Anonymous privacy check', content: 'Please keep my identity private.' } });
t('anonymous post hides role and real name', r.s === 201 && r.j.discussion.isAnonymous === true && r.j.discussion.authorRole === null && r.j.discussion.authorName === 'PixelAlice', r.j?.discussion);
store = store.filter(d => d.title !== 'Anonymous privacy check');

// double-click duplicate
r = await call('/api/discussions', { method: 'POST', token: A, body: { channelId: 'dsa', title: 'How does a monotonic stack work?', content: 'Explain please' } });
t('duplicate submit returns existing, not a 2nd row', r.s === 200 && r.j.duplicate && store.length === 1, r);

// B sees A's question
r = await call('/api/discussions', { token: B }); t('B sees A\'s question', r.s === 200 && r.j.discussions.length === 1 && r.j.discussions[0].id === qid && r.j.discussions[0].isMine === false, r);
r = await call('/api/discussions', { token: A }); t('A sees own question as isMine', r.j.discussions[0].isMine === true, r);
r = await call(`/api/discussions/${qid}`, { token: B }); t('GET one discussion', r.s === 200 && r.j.discussion.id === qid, r);
r = await call('/api/discussions/not-an-id', { token: B }); t('bad id -> 404', r.s === 404, r);
r = await call(`/api/discussions/${oid()}`, { token: B }); t('unknown id -> 404', r.s === 404, r);

// replies
r = await call(`/api/discussions/${qid}/replies`, { method: 'POST', token: B, body: { content: '   ' } }); t('empty reply -> 400', r.s === 400, r);
r = await call(`/api/discussions/${qid}/replies`, { method: 'POST', token: B, body: { content: 'x'.repeat(3001) } }); t('over-long reply -> 400', r.s === 400, r);
r = await call(`/api/discussions/${qid}/replies`, { method: 'POST', token: B, body: { content: 'shut up loser' } }); t('abusive reply -> 422', r.s === 422, r);
r = await call(`/api/discussions/${qid}/replies`, { method: 'POST', body: { content: 'hi' } }); t('reply without token -> 401', r.s === 401, r);
r = await call(`/api/discussions/${oid()}/replies`, { method: 'POST', token: B, body: { content: 'hi' } }); t('reply to missing discussion -> 404', r.s === 404, r);
r = await call(`/api/discussions/${qid}/replies`, { method: 'POST', token: B, body: { content: 'Think of a waiting room.', isAnonymous: false, authorPublicId: 'PixelAlice' } });
t('B replies -> 201 attributed to B', r.s === 201 && r.j.reply.authorPublicId === 'KnightBob' && r.j.reply.authorRole === 'Senior', r);
t('reply stored on the right question', store[0].replies.length === 1 && String(store[0].replies[0].author) === String(users[1]._id));
r = await call(`/api/discussions/${qid}/replies`, { method: 'POST', token: B, body: { content: 'Think of a waiting room.' } }); t('double-click reply not duplicated', r.s === 200 && r.j.duplicate && store[0].replies.length === 1, r);
r = await call('/api/discussions', { token: A }); t('A sees B\'s reply (polling GET)', r.j.discussions[0].replies.length === 1 && r.j.discussions[0].replies[0].content.startsWith('Think') && r.j.discussions[0].replies[0].isMine === false, r.j);
r = await call(`/api/discussions/${qid}/replies`, { method: 'POST', token: A, body: { content: 'Thanks, that helps!' } }); t('A can reply too', r.s === 201 && store[0].replies.length === 2, r);

// channel filter
await call('/api/discussions', { method: 'POST', token: B, body: { channelId: 'placements', title: 'OA tips', content: 'any?' } });
r = await call('/api/discussions?channelId=placements', { token: A }); t('channel filter', r.j.discussions.length === 1 && r.j.discussions[0].channelId === 'placements', r);
r = await call('/api/discussions', { token: A }); t('newest first', r.j.discussions[0].title === 'OA tips', r.j.discussions.map((d) => d.title));
t('no-store cache header (no per-user caching)', (await fetch(base + '/api/discussions', { headers: { Authorization: `Bearer ${A}` } })).headers.get('cache-control') === 'no-store');

// DB down
globalThis.__dbState = 0; r = await call('/api/discussions', { token: A }); t('DB down -> 503', r.s === 503, r);
r = await call('/api/health'); t('health still answers, reports db disconnected', r.s === 200 && r.j.database === 'disconnected', r);
globalThis.__dbState = 1;

console.log(`\n${pass} passed, ${fail} failed`);
server.close(); process.exit(fail ? 1 : 0);
