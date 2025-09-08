# Deploy with Netlify CLI

## Prereqs
- Netlify account
- Supabase project + Auth URL config (Site URL = your Netlify URL; Additional Redirects include localhost)
- Env vars set in Netlify UI (recommended) or pass at build time

## One‑time
- Login: `npm run ntl:login`
- Init/link site: `npm run ntl:init`
  - Choose “Create & configure a new site” or “Link to existing site”
  - Build command: `npm run build`
  - Publish directory: `dist`

## Deploy
- Preview: `npm run deploy:preview`
- Production: `npm run deploy:prod`

Notes
- Vite injects `VITE_*` vars at build time. Ensure Netlify site has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set, or export them in your shell before running deploy commands.
- If Netlify Secrets Scanning blocks builds due to public Vite vars, we’ve configured `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml`. You can also set it in Netlify UI.
- After changing env vars, redeploy with “Clear cache and deploy” to ensure they’re picked up.

