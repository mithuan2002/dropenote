# Render Deployment Guide

## Critical Fix Applied ✅

I've added the required configuration for Render deployment. The key fix was adding:

```typescript
app.set('trust proxy', 1);
```

This is **required** for Render because they use reverse proxies. Without it, Express can't detect HTTPS properly, causing session cookies to fail.

---

## Required Environment Variables on Render

You MUST set these environment variables in your Render dashboard:

### 1. SESSION_SECRET (Required)
```
SESSION_SECRET=your-random-secret-here-min-32-chars
```

**How to generate a secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. DATABASE_URL (Required)
```
DATABASE_URL=postgresql://user:password@host:port/database
```

**Important:** Use your Render PostgreSQL database URL or external database (Neon, Supabase, etc.)

### 3. NODE_ENV (Required)
```
NODE_ENV=production
```

This ensures proper cookie settings for HTTPS.

---

## How to Set Environment Variables on Render

1. Go to your Render dashboard
2. Select your web service
3. Click **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Add each variable above
6. Click **Save Changes**
7. Render will automatically redeploy

---

## Session Configuration (Already Fixed)

Your app now has the correct configuration:

```typescript
// Trust proxy - CRITICAL for Render
app.set('trust proxy', 1);

app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true on Render
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: 'lax',
  }
}));
```

**Key points:**
- ✅ `trust proxy` enabled for Render's reverse proxy
- ✅ PostgreSQL session store (persists across restarts)
- ✅ `secure: true` in production (HTTPS only)
- ✅ `httpOnly: true` (prevents XSS attacks)
- ✅ `sameSite: 'lax'` (allows cookies on same-site requests)

---

## Deployment Checklist

Before deploying to Render:

- [ ] Set `SESSION_SECRET` environment variable
- [ ] Set `DATABASE_URL` environment variable
- [ ] Set `NODE_ENV=production` environment variable
- [ ] Push latest code to your Git repository
- [ ] Trigger deployment on Render
- [ ] Wait for deployment to complete
- [ ] Test login functionality

---

## Troubleshooting

### Issue: Still showing "authenticated: false"

**Check these:**

1. **Environment variables are set on Render**
   - Go to Dashboard → Environment
   - Verify all three variables exist

2. **Database is accessible**
   - Check Render logs for database connection errors
   - Verify DATABASE_URL is correct

3. **Session table exists**
   - The app creates it automatically on first run
   - Check your database for a `session` table

4. **Clear browser cookies**
   - Go to DevTools → Application → Cookies
   - Delete all cookies for your Render domain
   - Try logging in again

5. **Check Render logs**
   - Look for any error messages
   - Verify the session store connects successfully

### Issue: Cookies not being set

**In browser DevTools:**
1. Open Network tab
2. Login to your app
3. Check the login request
4. Look at Response Headers
5. Verify `Set-Cookie` header is present

**Expected cookie attributes:**
- `Secure` (on HTTPS)
- `HttpOnly`
- `SameSite=Lax`
- `Max-Age=2592000`

---

## Database Migration

After deployment, your app will automatically:
1. Connect to the PostgreSQL database
2. Create the `session` table if it doesn't exist
3. Create all other tables from your schema

No manual migration needed!

---

## Testing Deployment

After deployment completes:

1. **Visit your Render URL** (e.g., `https://your-app.onrender.com`)
2. **Try to register a new user**
3. **Check if login persists**
4. **Verify in Render logs:**
   ```
   GET /api/auth/status 200 in Xms :: {"authenticated":true}
   ```

---

## Common Render Gotchas

### Free Tier Limitations
- Apps spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid tier for always-on service

### Session Persistence
- ✅ Using PostgreSQL session store (good!)
- Sessions persist across restarts
- Users stay logged in even after app restarts

### HTTPS
- Render provides free HTTPS for all apps
- No additional configuration needed
- Cookies work correctly with `secure: true`

---

## Next Steps

1. **Set environment variables on Render** (see above)
2. **Redeploy your app**
3. **Test login functionality**
4. **Monitor Render logs** for any errors

Your app is now ready for production! 🚀
