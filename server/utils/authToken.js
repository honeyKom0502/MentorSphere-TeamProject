import crypto from 'node:crypto';

// Minimal signed session token (HMAC-SHA256), built on node:crypto so no new
// dependency is needed. Format: base64url(payload).base64url(signature)

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

let cachedSecret = null;

const getSecret = () => {
  if (cachedSecret) return cachedSecret;

  const fromEnv = process.env.AUTH_SECRET;

  if (fromEnv && fromEnv.length >= 16) {
    cachedSecret = fromEnv;
  } else {
    cachedSecret = crypto.randomBytes(48).toString('hex');
    console.warn(
      '⚠️  AUTH_SECRET is not set in .env (or is shorter than 16 chars). ' +
      'Using a temporary secret: everyone will have to log in again whenever the server restarts.'
    );
  }

  return cachedSecret;
};

const b64url = (input) => Buffer.from(input).toString('base64url');

const sign = (data) =>
  crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');

export const signAuthToken = (userId) => {
  const now = Math.floor(Date.now() / 1000);
  const payload = b64url(
    JSON.stringify({ sub: String(userId), iat: now, exp: now + TOKEN_TTL_SECONDS })
  );
  return `${payload}.${sign(payload)}`;
};

export const verifyAuthToken = (token) => {
  if (typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payload, signature] = parts;
  const expected = sign(payload);

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data?.sub || typeof data.exp !== 'number') return null;
    if (data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
};
