const { requireRole } = require('./_auth');
const { supabase } = require('./_db');

function cleanProduct(body) {
  const type = body.type === 'patch' ? 'patch' : 'hat';
  const sizes = type === 'hat'
    ? (Array.isArray(body.sizes) ? body.sizes : String(body.sizes || '').split(',')).map(s => String(s).trim()).filter(Boolean)
    : [];
  return {
    store_id: String(body.store_id || '').replace(/[^a-f0-9-]/gi, ''),
    type,
    code: String(body.code || '').trim(),
    name: String(body.name || '').trim(),
    label: String(body.label || '').trim(),
    description: String(body.description || '').trim(),
    image_url: String(body.image_url || '').trim(),
    sizes,
    price: Number(body.price || 25),
    active: body.active !== false,
    archived: body.archived === true,
    sort_order: Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 100
  };
}

module.exports = async function handler(req, res) {
  try {
    if (!requireRole(req, res, ['admin'])) return;
    if (req.method === 'GET') {
      const storeId = String(req.query.store_id || '').replace(/[^a-f0-9-]/gi, '');
      if (!storeId) return res.status(400).json({ error: 'Store is required' });
      const rows = await supabase(`products?store_id=eq.${storeId}&select=*&order=archived.asc,type.asc,sort_order.asc,created_at.asc`);
      return res.status(200).json(rows || []);
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const row = cleanProduct(body);
      if (!row.store_id || !row.code || !row.name || !row.image_url) return res.status(400).json({ error: 'Store, code, name, and image are required' });
      if (row.type === 'hat' && row.sizes.length === 0) return res.status(400).json({ error: 'At least one size is required' });
      const created = await supabase('products', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
      return res.status(201).json(created[0]);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
