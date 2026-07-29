const { requireRole } = require('../_auth');

module.exports = async function handler(req, res) {
  if (!requireRole(req, res, ['admin'])) return;
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const url = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Database is not configured');
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const allowed = ['pending_payment', 'paid', 'produced', 'shipped', 'canceled'];
    if (!allowed.includes(body.status)) return res.status(400).json({ error: 'Invalid status' });
    const response = await fetch(`${url}/rest/v1/orders?id=eq.${encodeURIComponent(req.query.id)}`, {
      method: 'PATCH',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify({ status: body.status })
    });
    const text = await response.text();
    if (!response.ok) throw new Error(text || 'Update failed');
    return res.status(200).json(text ? JSON.parse(text) : { ok: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
