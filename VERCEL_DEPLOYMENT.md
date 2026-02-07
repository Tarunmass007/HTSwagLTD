# Vercel Deployment Guide

## Prerequisites
- GitHub account (or GitLab/Bitbucket)
- Vercel account (sign up at https://vercel.com)
- Your Supabase credentials
- (Optional) Telegram bot credentials

## Step 1: Push Your Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Professional e-commerce store"

# Add your GitHub repository as remote (replace with your repo URL)
git remote add origin https://github.com/yourusername/htswag-ltd.git

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Your Repository**
   - Connect your GitHub account if not already connected
   - Select your repository (htswag-ltd)
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (use this, not `vite build` — avoids Vercel permission error)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

   > **Important:** The project uses `vercel.json` and `npm run build` to avoid the "Permission denied" error on Vercel's Linux build environment. Do not override with `vite build` directly.

4. **Add Environment Variables**
   Click on "Environment Variables" and add:

   **Required (client + server):**
   ```
   VITE_SUPABASE_URL = your_supabase_project_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   ```

   **Required for OTP verification (server-side only):**
   ```
   RESEND_API_KEY = your_resend_api_key
   SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
   SUPABASE_URL = your_supabase_project_url
   ```

   **Optional:**
   ```
   VITE_TELEGRAM_BOT_TOKEN = your_telegram_bot_token
   VITE_TELEGRAM_CHAT_ID = your_telegram_chat_id
   ```

   > **Note:** `RESEND_API_KEY` is from [resend.com](https://resend.com). Domain `htswag.net` must be verified in Resend. `SUPABASE_SERVICE_ROLE_KEY` is from Supabase Dashboard → Settings → API → service_role (never expose to client).

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live!

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time - will ask questions)
vercel

# Deploy to production
vercel --prod
```

## Step 3: Add Environment Variables via CLI

```bash
# Add Supabase URL
vercel env add VITE_SUPABASE_URL

# Add Supabase Anon Key
vercel env add VITE_SUPABASE_ANON_KEY

# Add OTP / Email (Resend)
vercel env add RESEND_API_KEY

# Add Supabase Service Role (for OTP storage)
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add SUPABASE_URL

# Add Telegram Bot Token (optional)
vercel env add VITE_TELEGRAM_BOT_TOKEN

# Add Telegram Chat ID (optional)
vercel env add VITE_TELEGRAM_CHAT_ID
```

For each command, you'll be prompted to:
- Enter the value
- Select environments (Production, Preview, Development)

## Step 4: Get Your Environment Variable Values

### Supabase Credentials

1. Go to https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → Use for `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → Use for `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never expose to client)

### Resend (OTP Emails)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Verify your domain (e.g. `htswag.net`) in Resend
4. Add `RESEND_API_KEY` in Vercel

### Telegram Credentials (Optional)

1. Create a bot via [@BotFather](https://t.me/botfather) on Telegram
2. Get your bot token
3. Get your chat ID (send a message to your bot, then visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`)

## Step 5: Redeploy After Adding Environment Variables

If you added environment variables after initial deployment:

1. **Via Dashboard:**
   - Go to your project settings
   - Go to "Deployments"
   - Click "..." on the latest deployment
   - Click "Redeploy"

2. **Via CLI:**
   ```bash
   vercel --prod
   ```

## Important Notes

- ✅ Environment variables starting with `VITE_` are exposed to the browser
- ✅ Never commit `.env` files with real credentials
- ✅ Always use environment variables in Vercel dashboard
- ✅ After adding new env vars, you need to redeploy

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify build command is `vite build`
- Check output directory is `dist`

### Environment Variables Not Working
- Make sure variables start with `VITE_`
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### CORS Issues
- Update Supabase CORS settings to include your Vercel domain
- Go to Supabase Dashboard → Settings → API → CORS

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME

# View deployment logs
vercel logs
```
