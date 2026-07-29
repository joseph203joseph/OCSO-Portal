const { requireRole } = require('./_auth');
const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!requireRole(req, res, ['admin'])) return;
      const rows = await supabase('orders?select=*&order=created_at.desc');
      return res.status(200).json(rows || []);
    }
    if (req.method === 'POST') {
      if (!requireRole(req, res, ['store', 'admin'])) return;
      const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const qty = Math.max(1, Math.min(10, Number(b.quantity || 1)));
      const unitPrice = Number(b.hat && b.hat.price ? b.hat.price : 25);
      const orderNumber = `OCSO-${Date.now().toString().slice(-8)}`;
      const row = {
        order_number: orderNumber,
        customer_name: String(b.customerName || '').trim(),
        email: String(b.email || '').trim(),
        phone: String(b.phone || '').trim(),
        badge_number: String(b.badgeNumber || '').trim(),
        division: String(b.division || '').trim(),
        supervisor: String(b.supervisor || 'Kevin Vilches').trim(),
        patch_id: b.patch.id,
        patch_name: b.patch.name,
        hat_id: b.hat.id,
        hat_model: b.hat.model,
        hat_name: b.hat.name,
        size: String(b.size || ''),
        quantity: qty,
        unit_price: unitPrice,
        total: qty * unitPrice,
        status: 'pending_payment',
        batch_cutoff: b.batchCutoff
      };
      if (!row.customer_name || !row.email || !row.badge_number || !row.division) return res.status(400).json({ error: 'Required customer information is missing' });
      const created = await supabase('orders', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
      return res.status(201).json(created[0]);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
