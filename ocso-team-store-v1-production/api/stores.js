const { requireRole, hashCode } = require('./_auth');
const { supabase } = require('./_db');

function cleanSlug(value) {
  return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function cleanStore(body, creating = false) {
  const row = {
    name: String(body.name || '').trim(),
    slug: cleanSlug(body.slug || body.name),
    logo_url: String(body.logo_url || '').trim(),
    primary_color: String(body.primary_color || '#003d2b').trim(),
    accent_color: String(body.accent_color || '#e2aa1b').trim(),
    square_payment_link: String(body.square_payment_link || '').trim(),
    report_email: String(body.report_email || '').trim(),
    distribution_contact: String(body.distribution_contact || '').trim(),
    tax_exempt: body.tax_exempt === true,
    selection_mode: body.selection_mode === 'paired' ? 'paired' : 'single',
    order_schedule: body.order_schedule === 'biweekly' ? 'biweekly' : 'on_demand',
    batch_anchor: body.batch_anchor || null,
    batch_interval_days: Math.max(1, Number(body.batch_interval_days || 14)),
    reference_label: String(body.reference_label || 'Employee / Reference ID').trim(),
    division_label: String(body.division_label || 'Department / Division').trim(),
    active: body.active !== false,
    updated_at: new Date().toISOString()
  };
  if (body.access_code) row.access_code_hash = hashCode(body.access_code);
  if (creating) row.created_at = new Date().toISOString();
  return row;
}

module.exports = async function handler(req, res) {
  try {
    if (!requireRole(req, res, ['admin'])) return;
    if (req.method === 'GET') {
      const stores = await supabase('stores?select=*&order=active.desc,name.asc');
      return res.status(200).json(stores || []);
    }
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const row = cleanStore(body, true);
      if (!row.name || !row.slug || !row.access_code_hash) return res.status(400).json({ error: 'Store name, URL slug, and access code are required' });
      const created = await supabase('stores', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(row) });
      return res.status(201).json(created[0]);
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
