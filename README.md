# Musiclink – smartlinks for music artists
Cloudflare Pages (static dashboard + Functions for SEO/OG-rendered public pages & click tracking) + Supabase (Auth, Postgres, Storage).

## Deploy
1. **Supabase**: create a project → SQL editor → run `supabase/schema.sql`. Auth → Providers: enable Email.
2. Put your Project URL + anon key in `public/config.js` and `wrangler.toml` (`[vars]`). The anon key is public by design; RLS protects data.
3. **Cloudflare**: `npm i -g wrangler && wrangler pages deploy public --project-name spinlink`
   (or connect the repo in the dashboard: build command empty, output dir `public`; add `SUPABASE_URL` and `SUPABASE_ANON_KEY` env vars).
4. Add your domain in Pages → Custom domains. Smartlinks live at `/l/your-slug`.
5. Supabase Auth → URL Configuration: set Site URL to your domain.

## Structure
- `public/index.html` – landing, auth, dashboard, editor with live phone preview, 30-day stats
- `public/render.js` + `smartlink.css` – one renderer shared by the public page and the preview
- `functions/l/[slug].js` – server-renders the public page with OG/Twitter tags, logs a view
- `functions/api/track.js` – logs platform clicks (with country from Cloudflare)

## Next steps
Pre-save/pre-release countdowns, custom domains per artist, Spotify/Apple lookup by URL (needs a server-side API key), country/platform charts, Stripe plans.
