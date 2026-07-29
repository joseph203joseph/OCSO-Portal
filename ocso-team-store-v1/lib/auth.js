import crypto from 'crypto';
const secret=()=>process.env.AUTH_SECRET||'dev-only-change-me';
export function token(role){return crypto.createHmac('sha256',secret()).update(role).digest('hex')}
export function valid(value,role){return value===token(role)}
