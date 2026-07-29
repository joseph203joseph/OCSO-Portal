const { requireRole } = require('./_auth');
const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    if (!requireRole(req, res, ['store', 'admin'])) return;
    const rows = await supabase('products?select=*&active=eq.true&order=sort_order.asc,created_at.asc');
    return res.status(200).json(rows || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
