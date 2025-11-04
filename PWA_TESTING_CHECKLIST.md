# PWA Installation Testing Checklist

## 🎯 Quick Start - How to Test PWA Installation NOW

### Step 1: Get Your App URL
Copy this URL from Replit's preview address bar or use your deployed URL.

### Step 2: Open in Chrome/Edge (Desktop or Android)
**IMPORTANT:** You MUST test outside the Replit preview iframe!

**Option A - Fastest Method:**
1. Right-click on the preview pane
2. Select "Open in new tab" OR
3. Click the "Open in new tab" icon in the preview toolbar

**Option B - Use Deployed URL:**
1. Click "Deploy" in Replit
2. Copy your production HTTPS URL
3. Open it in Chrome/Edge

### Step 3: Verify PWA Installability
1. Open **Chrome DevTools** (F12 or Cmd+Option+I)
2. Go to **Application** tab
3. Click **Manifest** in left sidebar
4. Check for green checkmarks:
   - ✅ Manifest exists and is valid
   - ✅ Service worker is registered
   - ✅ Icons are valid (192x192 and 512x512)
   - ✅ Start URL is valid
   - ✅ Display mode is standalone

### Step 4: Check Console for Install Prompt
Look for these messages in Console tab:
```
✅ Top-level document - PWA install available
✅ Service Worker registered successfully
💡 PWA install prompt available
```

**If you see iframe warning:**
```
⚠️ Running in iframe - PWA install prompt will NOT fire
```
→ You're still in the preview! Go back to Step 2.

### Step 5: Install the PWA

**Method A - Click Install Button:**
1. Click the "Install App Now" button on homepage
2. Should see native browser install dialog
3. Click "Install"

**Method B - Use Browser UI:**
1. Look for install icon in address bar (⊕ or ⬇ icon)
2. Click it
3. Or go to browser menu → "Install [App Name]"

---

## 📋 Detailed Troubleshooting

### Issue: No Install Prompt Appears

**Check 1: Are you in an iframe?**
- Console shows: "⚠️ Running in iframe"
- **Fix:** Open URL in new tab

**Check 2: Clear browser cache**
```bash
1. DevTools → Application → Storage
2. Click "Clear site data"
3. Refresh page (Ctrl+Shift+R)
```

**Check 3: Verify service worker**
```bash
1. DevTools → Application → Service Workers
2. Should show "activated and is running"
3. If not, click "Update" or "Unregister" then refresh
```

**Check 4: Check manifest errors**
```bash
1. DevTools → Application → Manifest
2. Look for any red errors
3. Verify icons load (should see preview images)
```

**Check 5: Already installed?**
- Check if app is already on home screen/desktop
- Uninstall first, then try again

### Issue: Icons Show Error

**Error:** "Download error or resource isn't a valid image"

**Current Status:** ✅ FIXED - Icons are now valid binary PNG files

**To verify fix applied:**
```bash
curl -I https://your-url/icon-192.png
# Should show: Content-Type: image/png
# Should NOT show: Content-Type: text/html
```

### Issue: "beforeinstallprompt event not firing"

**Reason:** Event only fires when ALL criteria met:
- ✅ HTTPS enabled
- ✅ Valid manifest with icons
- ✅ Service worker registered with fetch handler
- ✅ NOT in iframe
- ✅ NOT already installed
- ✅ Using Chrome/Edge (not Firefox/Safari)

**Check:** Open chrome://inspect/#service-workers
- Verify service worker is running
- Check scope matches your domain

---

## 🌐 Browser-Specific Instructions

### Desktop Chrome/Edge ✅ Best Support
1. Look for install icon in address bar
2. Or menu → "Install [App Name]"
3. Or click your app's install button

### Android Chrome ✅ Best Support
1. Menu (⋮) → "Install app"
2. Or "Add to Home screen"
3. Or click your app's install button

### iOS Safari ⚠️ Manual Only
**Note:** iOS doesn't support `beforeinstallprompt`
1. Tap Share button (⎙)
2. Scroll down to "Add to Home Screen"
3. Tap "Add"

### Firefox ❌ Limited Support
- Desktop Firefox: No PWA install support
- Android Firefox: Manual "Add to Home screen" only

---

## 🔍 How to Verify PWA is Installed

### Desktop:
1. Check desktop for app icon
2. Or check Chrome Apps (chrome://apps)
3. Launch should open in standalone window (no browser UI)

### Mobile:
1. Check home screen for app icon
2. Tap to launch
3. Should open fullscreen (no address bar)

### Verify Standalone Mode:
Open DevTools Console in installed app:
```javascript
window.matchMedia('(display-mode: standalone)').matches
// Should return: true
```

---

## ✅ Expected Results

### When Working Correctly:

**In Browser (not installed):**
- Console: "💡 PWA install prompt available"
- Install button visible
- Clicking shows native dialog

**After Installation:**
- App icon on home screen/desktop
- Opens in standalone window
- Works offline (cached content)
- Console: App is in standalone mode

---

## 📊 PWA Audit with Lighthouse

**Run a full PWA audit:**
1. DevTools → Lighthouse tab
2. Select "Progressive Web App"
3. Click "Analyze page load"
4. Review score and recommendations

**Target Score:** 90+ for installable PWA

**Common Issues:**
- ❌ "Manifest doesn't have maskable icon" → OK to ignore
- ❌ "Does not redirect HTTP to HTTPS" → Replit handles this
- ✅ "Registers a service worker" → Must pass
- ✅ "Manifest includes icons" → Must pass

---

## 🚀 Deployment Checklist

If testing locally doesn't work, deploy and test on production:

1. **Deploy in Replit:**
   - Click "Deploy" button
   - Wait for deployment to complete
   - Copy production URL

2. **Test on Production:**
   - Open deployed URL in Chrome
   - Follow Steps 1-5 from Quick Start
   - Install prompt should appear

3. **Test on Real Device:**
   - Open production URL on Android phone
   - Try to install from browser menu
   - Verify home screen icon appears

---

## 📝 Test Results Template

Use this to document your testing:

```
Date: ___________
Browser: Chrome/Edge/Safari (version: ___)
Device: Desktop/Android/iOS
Environment: Replit Preview / New Tab / Deployed URL

✅ Opened outside iframe
✅ HTTPS enabled
✅ Manifest loads without errors
✅ Icons load correctly (192x192, 512x512)
✅ Service worker registered
✅ Console shows "PWA install prompt available"
✅ Install button triggers native dialog
✅ App installed successfully
✅ App opens in standalone mode
✅ Works offline

Issues encountered:
- 

Notes:
- 
```

---

## 🆘 Still Not Working?

**Before reporting an issue, verify:**
1. ✅ Testing in Chrome/Edge (not Firefox/Safari)
2. ✅ Opened in NEW TAB (not iframe)
3. ✅ Cleared site data and hard refreshed
4. ✅ App NOT already installed
5. ✅ DevTools → Manifest shows all green checks
6. ✅ Console shows NO iframe warning

**If all above are true and still failing:**
1. Check console for any error messages
2. Run Lighthouse PWA audit
3. Try incognito window
4. Try different device/browser
5. Deploy and test production URL

---

## 💡 Pro Tips

1. **Always test in incognito first** - Avoids cache issues
2. **Use Chrome DevTools Application tab** - Shows exact install criteria status
3. **Check Service Worker scope** - Should be "/" for root-level PWA
4. **Verify HTTPS** - localhost and deployed URLs only
5. **Mobile testing matters** - Install flow different on phones
6. **iOS requires manual install** - No automatic prompt on Safari

---

**Last Updated:** November 4, 2025
**Status:** Ready for testing ✅
