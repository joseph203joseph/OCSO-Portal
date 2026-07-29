# OCSO Team Store v1.0

This build uses static pages plus Vercel serverless API functions. It has no npm dependencies or framework preset requirement.

## Vercel settings
- Framework Preset: Other
- Root Directory: the folder containing `vercel.json`
- Build Command: leave blank
- Output Directory: leave blank
- Install Command: leave blank

## Environment variables
- STORE_ACCESS_CODE=OCSO26
- ADMIN_ACCESS_CODE=choose-a-private-admin-code
- AUTH_SECRET=use-a-long-random-string
- SUPABASE_URL=your Supabase project URL
- SUPABASE_SERVICE_ROLE_KEY=your Supabase service-role key
- SQUARE_PAYMENT_LINK=https://square.link/u/c4zgZFhq
- REPORT_EMAIL=joseph@eightleggedcustoms.com

## Database
Run `supabase.sql` in Supabase SQL Editor.

## URLs
- Store: `/`
- Admin: `/admin`

## Current payment workflow
Orders are saved as pending before the Square payment link opens. Confirm payment in Square and mark the order Paid in the admin dashboard. Automatic payment matching requires the Square Checkout API/webhook phase.

## Product Management Upgrade

1. In Supabase SQL Editor, run `product-management-migration.sql` once.
2. Replace the existing GitHub project files with this package and commit.
3. Vercel will redeploy automatically.
4. Open `/admin`, sign in, and click **Products**.

The Products area supports adding, editing, hiding/showing, deleting, sorting, sizing, and uploading PNG/JPG/WEBP product images up to 3 MB. Existing orders are not changed when a product is edited or deleted.

Important: the current Square payment link charges a fixed $25. Keep active hat prices at $25 until the Square Checkout API is connected.
