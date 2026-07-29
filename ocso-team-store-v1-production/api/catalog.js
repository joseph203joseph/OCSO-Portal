const { requireRole } = require('./_auth');
const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const auth = requireRole(req, res, ['store', 'admin']);
    if (!auth) return;
    const storeId = auth.role === 'store' ? auth.store_id : String(req.query.store_id || '').replace(/[^a-f0-9-]/gi, '');
    if (!storeId) return res.status(400).json({ error: 'Store is required' });
    const rows = await supabase(`products?store_id=eq.${storeId}&select=*&active=eq.true&archived=eq.false&order=sort_order.asc,created_at.asc`);
    return res.status(200).json(rows || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
