# OCSO Team Store v2

Adds full owner-facing product management to the working OCSO portal.

## New admin features
- Separate Add Hat and Add Patch buttons
- Direct drag/drop image upload to Supabase Storage
- Edit, hide/show, duplicate, archive/restore, and permanent delete
- Drag-to-reorder within Hats or Patches
- Store preview link
- Existing orders remain unchanged

## Upgrade
1. Run `product-management-v2-migration.sql` once in Supabase SQL Editor.
2. Replace the files in the existing Vercel/GitHub production folder with this package.
3. Commit. Vercel will redeploy automatically.
4. Hard-refresh `/admin`.
