const { supabase } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
    const slug = String(req.query.slug || 'ocso').toLowerCase().replace(/[^a-z0-9-]/g, '');
    const rows = await supabase(`stores?slug=eq.${encodeURIComponent(slug)}&active=eq.true&select=id,name,slug,logo_url,primary_color,accent_color,tax_exempt,selection_mode,order_schedule,batch_anchor,batch_interval_days,reference_label,division_label,distribution_contact`);
    if (!rows || !rows[0]) return res.status(404).json({ error: 'Store not found' });
    return res.status(200).json(rows[0]);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
