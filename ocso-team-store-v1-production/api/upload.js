const crypto = require('crypto');
const { requireRole } = require('./_auth');
const { config } = require('./_db');

const allowed = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp'
};

module.exports = async function handler(req, res) {
  try {
    if (!requireRole(req, res, ['admin'])) return;
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const mime = String(body.mime || '');
    const ext = allowed[mime];
    if (!ext) return res.status(400).json({ error: 'Use a PNG, JPG, or WEBP image' });
    const raw = String(body.data || '').replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    if (!buffer.length || buffer.length > 3 * 1024 * 1024) return res.status(400).json({ error: 'Image must be under 3 MB' });
    const { url, key } = config();
    const folder = body.type === 'patch' ? 'patches' : 'hats';
    const filename = `${folder}/${Date.now()}-${crypto.randomBytes(5).toString('hex')}.${ext}`;
    const upload = await fetch(`${url}/storage/v1/object/product-images/${filename}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': mime,
        'x-upsert': 'false'
      },
      body: buffer
    });
    const text = await upload.text();
    if (!upload.ok) throw new Error(text || 'Image upload failed');
    return res.status(201).json({ url: `${url}/storage/v1/object/public/product-images/${filename}` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
