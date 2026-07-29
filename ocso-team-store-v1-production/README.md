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
