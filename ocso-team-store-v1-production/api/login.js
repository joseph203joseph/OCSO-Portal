const { setCookie, hashCode } = require('./_auth');
const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    if (body.role === 'admin') {
      if (!process.env.ADMIN_ACCESS_CODE || body.code !== process.env.ADMIN_ACCESS_CODE) return res.status(401).json({ error: 'Invalid access code' });
      setCookie(res, { role: 'admin' });
      return res.status(200).json({ ok: true, role: 'admin' });
    }
    const slug = String(body.slug || 'ocso').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const rows = await supabase(`stores?slug=eq.${encodeURIComponent(slug)}&active=eq.true&select=id,name,slug,access_code_hash`);
    const store = rows && rows[0];
    if (!store || hashCode(body.code) !== store.access_code_hash) return res.status(401).json({ error: 'Invalid access code' });
    setCookie(res, { role: 'store', store_id: store.id, store_slug: store.slug });
    return res.status(200).json({ ok: true, role: 'store', store: { id: store.id, name: store.name, slug: store.slug } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
