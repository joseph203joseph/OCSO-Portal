const crypto = require('crypto');

function secret() {
  return process.env.AUTH_SECRET || 'change-me';
}

function sign(value) {
  return crypto.createHmac('sha256', secret()).update(value).digest('hex');
}

function makeToken(role) {
  const payload = Buffer.from(JSON.stringify({ role, exp: Date.now() + 12 * 60 * 60 * 1000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function readToken(req) {
  const raw = req.headers.cookie || '';
  const match = raw.match(/(?:^|;\s*)ocso_auth=([^;]+)/);
  if (!match) return null;
  const [payload, sig] = decodeURIComponent(match[1]).split('.');
  if (!payload || !sig || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(sign(payload)))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function setCookie(res, role) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `ocso_auth=${encodeURIComponent(makeToken(role))}; Path=/; HttpOnly; SameSite=Lax; Max-Age=43200${secure}`);
}

function requireRole(req, res, allowed) {
  const auth = readToken(req);
  if (!auth || !allowed.includes(auth.role)) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unauthorized' }));
    return null;
  }
  return auth;
}

module.exports = { setCookie, requireRole };
