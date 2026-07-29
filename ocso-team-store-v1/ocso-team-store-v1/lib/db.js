const base=()=>`${process.env.SUPABASE_URL}/rest/v1/orders`;
const headers=()=>({apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json'});
export function configured(){return Boolean(process.env.SUPABASE_URL&&process.env.SUPABASE_SERVICE_ROLE_KEY)}
export async function createOrder(order){if(!configured()) throw new Error('Database not configured'); const r=await fetch(base(),{method:'POST',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify(order),cache:'no-store'});if(!r.ok)throw new Error(await r.text());return (await r.json())[0]}
export async function listOrders(){if(!configured())return [];const r=await fetch(`${base()}?select=*&order=created_at.desc`,{headers:headers(),cache:'no-store'});if(!r.ok)throw new Error(await r.text());return r.json()}
export async function updateOrder(id,patch){const r=await fetch(`${base()}?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',headers:{...headers(),Prefer:'return=representation'},body:JSON.stringify(patch),cache:'no-store'});if(!r.ok)throw new Error(await r.text());return r.json()}
