const { requireRole } = require('./_auth');
const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      if (!requireRole(req, res, ['admin'])) return;
      const storeId = String(req.query.store_id || '').replace(/[^a-f0-9-]/gi, '');
      if (!storeId) return res.status(400).json({ error: 'Store is required' });
      const rows = await supabase(`orders?store_id=eq.${storeId}&select=*&order=created_at.desc`);
      return res.status(200).json(rows || []);
    }
    if (req.method === 'POST') {
      const auth = requireRole(req, res, ['store', 'admin']);
      if (!auth) return;
      const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const storeId = auth.role === 'store' ? auth.store_id : String(b.store_id || '').replace(/[^a-f0-9-]/gi, '');
      if (!storeId) return res.status(400).json({ error: 'Store is required' });
      const stores = await supabase(`stores?id=eq.${storeId}&active=eq.true&select=*`);
      const store = stores && stores[0];
      if (!store) return res.status(404).json({ error: 'Store not found' });
      const qty = Math.max(1, Math.min(50, Number(b.quantity || 1)));
      const unitPrice = Number(b.product && b.product.price ? b.product.price : 25);
      const prefix = String(store.slug || 'ORDER').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) || 'ORDER';
      const orderNumber = `${prefix}-${Date.now().toString().slice(-8)}`;
      const option = b.option || null;
      const product = b.product || b.hat;
      if (!product) return res.status(400).json({ error: 'Product selection is missing' });
      const row = {
        store_id: storeId,
        order_number: orderNumber,
        customer_name: String(b.customerName || '').trim(),
        email: String(b.email || '').trim(),
        phone: String(b.phone || '').trim(),
        badge_number: String(b.referenceNumber || b.badgeNumber || '').trim(),
        division: String(b.division || '').trim(),
        supervisor: String(b.supervisor || store.distribution_contact || '').trim(),
        patch_id: option ? option.id : '',
        patch_name: option ? option.name : '',
        hat_id: product.id,
        hat_model: product.model || product.label || product.code || '',
        hat_name: product.name,
        size: String(b.size || ''),
        quantity: qty,
        unit_price: unitPrice,
        total: qty * unitPrice,
        status: 'pending_payment',
        batch_cutoff: b.batchCutoff || null
      };
      if (!row.customer_name || !row.email) return res.status(400).json({ error: 'Name and email are required' });
      const created = await supabase('orders', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
      return res.status(201).json({ order: created[0], payment_link: store.square_payment_link || process.env.SQUARE_PAYMENT_LINK || '' });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
