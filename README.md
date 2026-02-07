# HTS Swag

Premium merchandise & gift cards store.

## Local development

```bash
npm install
npm run dev
```

Create a `.env` file with:

- `VITE_SUPABASE_URL` – your Supabase project URL  
- `VITE_SUPABASE_ANON_KEY` – your Supabase anon/public key  

## Deploy to Vercel

1. Push your repo and import the project in [Vercel](https://vercel.com).
2. In the project, go to **Settings → Environment Variables**.
3. Add:
   - **Name:** `VITE_SUPABASE_URL`  
     **Value:** your Supabase project URL (e.g. `https://xxxx.supabase.co`)
   - **Name:** `VITE_SUPABASE_ANON_KEY`  
     **Value:** your Supabase anon key (from Supabase → Project Settings → API)
4. Redeploy (e.g. **Deployments → … → Redeploy**).

Without these variables, the site will show “Unable to load products” / “Failed to fetch” on Vercel because the app cannot reach Supabase.
