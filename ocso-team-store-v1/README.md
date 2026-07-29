# Eight Legged Customs Team Stores — OCSO v1.0

## What works
- Private OCSO storefront with server-side access code cookie
- Only three approved patches; Motor Unit patches are excluded
- Six black hat styles at $25, tax exempt
- Mobile-responsive ordering flow
- Order details saved to Supabase before Square checkout
- Admin dashboard with status updates and CSV export
- Biweekly cutoff calculation beginning Friday, July 31, 2026 at 11:30 PM ET

## Important Square limitation
This release uses the existing Square Payment Link. Square does not automatically tell this app which saved order was paid. Orders therefore begin as `pending_payment`; verify the payment in Square and click **Paid** in the dashboard. Proper automatic payment verification requires a Square Developer application, Checkout API credentials, and webhooks.

## Deploy tonight
1. Create a free Supabase project.
2. Open Supabase SQL Editor and run `supabase.sql`.
3. In Supabase Project Settings > API, copy the Project URL and service-role secret.
4. Upload this project to GitHub and import it into Vercel, or use Vercel CLI. Vercel Drop is intended for static files and may not properly configure this full Next.js app.
5. In Vercel Project Settings > Environment Variables add every value from `.env.example`.
6. Redeploy.
7. Store URL: `/` and access code from `STORE_ACCESS_CODE`.
8. Admin URL: `/admin-login` and code from `ADMIN_ACCESS_CODE`.

Never expose the Supabase service-role key or AUTH_SECRET in browser code.
