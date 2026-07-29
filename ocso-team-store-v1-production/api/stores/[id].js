const { requireRole, hashCode } = require('../_auth');
const { supabase } = require('../_db');

function cleanSlug(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

module.exports = async function handler(req, res) {
  try {
    if (!requireRole(req, res, ['admin'])) return;
    const id = String(req.query.id || '').replace(/[^a-f0-9-]/gi, '');
    if (!id) return res.status(400).json({ error: 'Invalid store id' });
    if (req.method === 'GET') {
      const rows = await supabase(`stores?id=eq.${id}&select=*`);
      return res.status(200).json(rows[0] || null);
    }
    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const patch = { updated_at: new Date().toISOString() };
      for (const key of ['name','logo_url','primary_color','accent_color','square_payment_link','report_email','distribution_contact','reference_label','division_label','batch_anchor']) {
        if (Object.prototype.hasOwnProperty.call(body, key)) patch[key] = body[key] === null ? null : String(body[key]).trim();
      }
      if (Object.prototype.hasOwnProperty.call(body, 'slug')) patch.slug = cleanSlug(body.slug);
      if (Object.prototype.hasOwnProperty.call(body, 'tax_exempt')) patch.tax_exempt = Boolean(body.tax_exempt);
      if (Object.prototype.hasOwnProperty.call(body, 'active')) patch.active = Boolean(body.active);
      if (Object.prototype.hasOwnProperty.call(body, 'selection_mode')) patch.selection_mode = body.selection_mode === 'paired' ? 'paired' : 'single';
      if (Object.prototype.hasOwnProperty.call(body, 'order_schedule')) patch.order_schedule = body.order_schedule === 'biweekly' ? 'biweekly' : 'on_demand';
      if (Object.prototype.hasOwnProperty.call(body, 'batch_interval_days')) patch.batch_interval_days = Math.max(1, Number(body.batch_interval_days || 14));
      if (body.access_code) patch.access_code_hash = hashCode(body.access_code);
      const updated = await supabase(`stores?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify(patch) });
      return res.status(200).json(updated[0]);
    }
    if (req.method === 'DELETE') {
      const updated = await supabase(`stores?id=eq.${id}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ active: false, updated_at: new Date().toISOString() }) });
      return res.status(200).json(updated[0]);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
