const { setCookie } = require('./_auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const role = body.role === 'admin' ? 'admin' : 'store';
  const expected = role === 'admin' ? process.env.ADMIN_ACCESS_CODE : process.env.STORE_ACCESS_CODE;
  if (!expected || body.code !== expected) return res.status(401).json({ error: 'Invalid access code' });
  setCookie(res, role);
  return res.status(200).json({ ok: true, role });
};
