# Vectorify - Deployment Guide

This guide covers deploying Vectorify to production.

## Deployment Options

### Recommended Stack for MVP:

- **Frontend:** Vercel (Next.js optimization)
- **Backend:** Railway or Render
- **Database:** Supabase or Railway PostgreSQL
- **Redis:** Upstash (free tier available)

---

## 1. Frontend Deployment (Vercel)

### Prerequisites

- GitHub repository
- Vercel account ([vercel.com](https://vercel.com))

### Steps

1. **Push your code to GitHub** (already done ✅)

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Set root directory: `apps/web`

3. **Configure Environment Variables:**

   In Vercel dashboard, add:

   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.railway.app/api/v1
   NEXT_PUBLIC_APP_NAME=Vectorify
   NEXT_PUBLIC_APP_URL=https://vectorify.vercel.app
   ```

4. **Configure Build Settings:**

   ```
   Framework Preset: Next.js
   Build Command: cd ../.. && pnpm install && pnpm --filter @vectorify/web build
   Output Directory: .next
   Install Command: pnpm install
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your frontend is live! 🎉

6. **Custom Domain (Optional):**
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records

---

## 2. Backend Deployment (Railway)

### Option A: Railway (Recommended for MVP)

**Why Railway:**
- Easy setup
- PostgreSQL included
- Free $5 credit/month
- Git-based deployment

**Steps:**

1. **Sign up:** [railway.app](https://railway.app)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Configure Backend Service:**

   Create a new service:
   - Root directory: `apps/api`
   - Add environment variables:

   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   CORS_ORIGIN=https://your-frontend.vercel.app
   JWT_SECRET=your-super-secret-key-generate-this

   # AI API Keys (Optional, users can provide their own)
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_API_KEY=...
   OPENROUTER_API_KEY=sk-or-...
   ```

4. **Add PostgreSQL Database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will auto-inject `DATABASE_URL`

5. **Configure Build:**

   Create `railway.json` in project root:

   ```json
   {
     "build": {
       "builder": "NIXPACKS",
       "buildCommand": "cd apps/api && pnpm install && pnpm build"
     },
     "deploy": {
       "startCommand": "cd apps/api && pnpm start:prod",
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

6. **Deploy:**
   - Railway auto-deploys on push
   - Get your public URL
   - Update Vercel's `NEXT_PUBLIC_API_URL`

7. **Run Prisma Migrations:**

   In Railway dashboard, open the terminal and run:

   ```bash
   cd apps/api
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Option B: Render

Similar to Railway but with a free tier:

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - Root Directory: `apps/api`
   - Build Command: `pnpm install && pnpm build`
   - Start Command: `pnpm start:prod`

---

## 3. Database Deployment

### Option A: Railway PostgreSQL (Included)

- Automatically provisioned with Railway
- $5/month after free tier
- Easy backups

### Option B: Supabase (Recommended for Scale)

**Why Supabase:**
- PostgreSQL + Realtime
- Free tier: 500MB database
- Built-in auth (useful for future)
- Automatic backups

**Steps:**

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` in Railway/Render

**Connection String Format:**

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Option C: Neon (Serverless PostgreSQL)

- Serverless (pay per use)
- Generous free tier
- Fast cold starts

---

## 4. Redis Deployment (Optional, for caching)

### Upstash (Free Tier)

1. Go to [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection URL
4. Add to Railway:

```
REDIS_URL=rediss://default:[password]@[endpoint]:6379
```

5. Install Redis client:

```bash
cd apps/api
pnpm add ioredis
```

---

## 5. Environment Variables Reference

### Backend (apps/api)

```bash
# Application
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://...

# CORS
CORS_ORIGIN=https://your-frontend-url.vercel.app

# Security
JWT_SECRET=generate-a-strong-random-string

# AI API Keys (Optional)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
OPENROUTER_API_KEY=sk-or-...

# Redis (Optional)
REDIS_URL=rediss://...
```

### Frontend (apps/web)

```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
NEXT_PUBLIC_APP_NAME=Vectorify
NEXT_PUBLIC_APP_URL=https://vectorify.vercel.app
```

---

## 6. Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] API health check works: `https://your-api.com/health`
- [ ] API docs accessible: `https://your-api.com/api/docs`
- [ ] Database connection works
- [ ] Can create new project
- [ ] Can create artifacts
- [ ] AI endpoints respond (if configured)
- [ ] Verify CORS is properly configured
- [ ] Custom domain connected (if applicable)

---

## 7. Monitoring & Logging

### Vercel

- Built-in analytics
- Real-time logs in dashboard

### Railway

- Built-in logs and metrics
- Alerts for errors

### Recommended Tools

1. **Sentry** (Error tracking)
   ```bash
   pnpm add @sentry/nextjs @sentry/node
   ```

2. **LogTail** (Log management)
   - Free tier available
   - Better than console.log

3. **Uptime Monitoring**
   - Use [UptimeRobot](https://uptimerobot.com) (free)
   - Monitor API health endpoint

---

## 8. Scaling Considerations

### When to Scale:

- **100+ users:** Add Redis caching
- **1000+ users:** Separate database server
- **10K+ users:** Consider microservices

### Optimization:

1. **Enable Redis caching for AI responses**
2. **Use CDN for static assets**
3. **Implement database connection pooling**
4. **Add rate limiting**
5. **Optimize Prisma queries**

---

## 9. Cost Estimation (Monthly)

### MVP (0-100 users):

- Vercel: Free
- Railway: $5
- Database: Free (Supabase free tier)
- **Total: ~$5/month**

### Growing (100-1000 users):

- Vercel: Free - $20
- Railway: $20
- Database (Supabase Pro): $25
- Redis (Upstash): Free
- **Total: ~$45-65/month**

### Established (1000+ users):

- Vercel Pro: $20
- Railway/Render: $50+
- Database: $50+
- Redis: $10
- Monitoring: $20
- **Total: ~$150-200/month**

---

## 10. CI/CD Pipeline

### Automatic Deployments

Both Vercel and Railway support auto-deploy on git push:

1. Push to `main` branch → deploys to production
2. Push to `develop` branch → deploys to staging (create separate Railway project)

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm build
      - run: pnpm test # Add tests!

      # Vercel and Railway auto-deploy,
      # so this is just for running tests
```

---

## 11. Security Best Practices

1. **Use HTTPS only** (Vercel does this automatically)
2. **Never commit `.env` files**
3. **Use strong JWT secrets**
4. **Implement rate limiting**
5. **Validate all inputs**
6. **Use CSP headers**

Add to `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 12. Backup Strategy

### Database Backups

**Supabase:** Automatic daily backups (Pro plan)

**Railway:** Manual backups via CLI

```bash
# Backup
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

### Code Backups

- Already on GitHub ✅
- Consider GitHub repo backups to another service

---

## Troubleshooting

### Build fails on Vercel

- Check build logs
- Ensure all dependencies in package.json
- Verify TypeScript has no errors

### API not connecting to database

- Check `DATABASE_URL` format
- Ensure database is accessible from Railway IP
- Check Prisma schema is up to date

### CORS errors

- Update `CORS_ORIGIN` in backend
- Ensure it matches frontend URL exactly

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs

---

**Your app is production-ready! 🚀**
