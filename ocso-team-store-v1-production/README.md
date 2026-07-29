# Eight Legged Customs Team Stores v3

Multi-customer upgrade for the working Vercel + Supabase portal.

## Included

- Main Team Stores dashboard
- Create/edit/activate customer stores
- Store-specific private access codes
- Store-specific Square payment links
- Single-product or product-plus-option ordering modes
- Store-specific products, orders, CSV exports and branding
- Existing OCSO products and orders migrated into Store #1

## Upgrade

1. Run `multi-store-v3-migration.sql` once in the existing Supabase SQL Editor.
2. Replace the files inside the existing Vercel/GitHub production folder with this package.
3. Commit. Vercel redeploys automatically.
4. Open `/admin` and sign in with the existing admin code.
5. OCSO remains available at `/store/ocso` with access code `OCSO26`.

No new Vercel environment variables are required. Keep the current Supabase, admin, auth, Square fallback and report variables.
