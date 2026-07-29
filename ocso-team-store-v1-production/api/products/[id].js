const { requireRole } = require('../_auth');
const { supabase } = require('../_db');

function cleanProduct(body) {
  const patch = {};
  for (const key of ['type','code','name','label','description','image_url','price','active','archived','sort_order']) {
    if (Object.prototype.hasOwnProperty.call(body, key)) patch[key] = body[key];
  }
  if (Object.prototype.hasOwnProperty.call(body, 'sizes')) {
    patch.sizes = (Array.isArray(body.sizes) ? body.sizes : String(body.sizes || '').split(',')).map(s => String(s).trim()).filter(Boolean);
  }
  if (patch.type) patch.type = patch.type === 'patch' ? 'patch' : 'hat';
  if (patch.code !== undefined) patch.code = String(patch.code).trim();
  if (patch.name !== undefined) patch.name = String(patch.name).trim();
  if (patch.label !== undefined) patch.label = String(patch.label).trim();
  if (patch.description !== undefined) patch.description = String(patch.description).trim();
  if (patch.image_url !== undefined) patch.image_url = String(patch.image_url).trim();
  if (patch.price !== undefined) patch.price = Number(patch.price || 25);
  if (patch.sort_order !== undefined) patch.sort_order = Number(patch.sort_order || 100);
  if (patch.active !== undefined) patch.active = Boolean(patch.active);
  if (patch.archived !== undefined) patch.archived = Boolean(patch.archived);
  return patch;
}

module.exports = async function handler(req, res) {
  try {
    if (!requireRole(req, res, ['admin'])) return;
    const id = String(req.query.id || '').replace(/[^a-f0-9-]/gi, '');
    if (!id) return res.status(400).json({ error: 'Invalid product id' });
    if (req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const updated = await supabase(`products?id=eq.${id}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(cleanProduct(body))
      });
      return res.status(200).json(updated[0]);
    }
    if (req.method === 'DELETE') {
      await supabase(`products?id=eq.${id}`, { method: 'DELETE' });
      return res.status(204).end();
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
