# Scout Flyer Builder - Deployment Guide

## ✅ Project is Ready to Deploy

Your complete Scout Flyer Builder project has been generated and is ready for deployment. All files are production-ready.

---

## Project Structure

```
scout-flyer-builder/
├── src/
│   ├── App.jsx              # Main Scout Flyer Builder component (BUILT & TESTED ✓)
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point for Vite
├── package.json             # Dependencies & build scripts
├── vite.config.js           # Vite build configuration
├── vercel.json              # Vercel deployment config
├── README.md                # User & developer documentation
├── DEPLOYMENT_GUIDE.md      # This file
└── .gitignore               # Git ignore rules
```

---

## Quick Start: Deploy to Vercel in 3 Steps

### Step 1: Create GitHub Repository

```bash
# Navigate to the project directory
cd scout-flyer-builder

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial Scout Flyer Builder commit"

# Create new repo on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/scout-flyer-builder.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI (Fastest)**
```bash
npm install -g vercel
vercel

# Follow prompts:
# 1. Login with GitHub
# 2. Select this folder
# 3. Select GitHub project (or create new one)
# 4. Done!
```

**Option B: Using Vercel Web UI**
1. Go to https://vercel.com
2. Login with GitHub
3. Click "Add New Project"
4. Select `scout-flyer-builder` repo
5. Click "Deploy"
6. Wait ~30 seconds
7. Done!

### Step 3: Get Your Live URL

Vercel will give you a URL like:
```
https://scout-flyer-builder.vercel.app
```

This is your app! Share this link with Scout troops.

---

## Testing Before Deployment

### Local Testing (Recommended)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173

# Test all features:
# ✓ Fill form (all 5 steps)
# ✓ Select images from library
# ✓ Upload custom images
# ✓ Generate preview
# ✓ Save template
# ✓ Download HTML
# ✓ Open HTML in browser
# ✓ Print to PDF

# Stop server: Ctrl+C
```

### Test on Gitpod (Browser-based, No Installation)

If you prefer testing without installing Node.js locally:

1. Replace `YOUR_USERNAME` and `scout-flyer-builder` in this URL:
```
https://gitpod.io/#https://github.com/YOUR_USERNAME/scout-flyer-builder
```

2. Open that URL in browser
3. Click "Continue with GitHub"
4. Wait for workspace to load (~60 seconds)
5. In terminal, run:
```bash
npm install
npm run dev
```
6. Click "Open in Browser" when prompted

---

## Production Build

### Build for Production

```bash
npm run build

# Creates optimized files in dist/ directory
# ~150KB total (JS + CSS minified)
```

### Preview Production Build

```bash
npm run preview

# Opens production build locally at http://localhost:4173
```

---

## After Deployment

### Monitor Your Live App

Visit your live URL: `https://scout-flyer-builder.vercel.app`

Test everything works:
- ✓ Form loads
- ✓ Images appear
- ✓ Preview works
- ✓ Download works
- ✓ Print-to-PDF works

### Share with Scout Troops

Send the URL to:
- Your friend's troop
- Your Scout council
- Scout leaders on Reddit/Facebook
- Anyone who needs recruitment flyers!

### Get Feedback

- Ask users for feedback
- Identify any issues
- Report bugs on GitHub

---

## Customization

### Change App Title

Edit `index.html`:
```html
<title>Scout Flyer Generator - Your Council Name</title>
```

### Change Scout Colors

Edit `src/index.css`:
```css
--color-primary: #2E7D32;  /* Scout green */
--color-primary-dark: #1b5e20;
--color-primary-light: #4CAF50;
```

Replace with your council colors (e.g., `#0066CC` for blue).

### Add More Images to Library

Edit `src/App.jsx`, find `IMAGE_LIBRARY`:
```javascript
const IMAGE_LIBRARY = {
  hero: [
    {
      id: 'adventure_1',
      name: 'Your Image Name',
      url: 'https://images.unsplash.com/photo-XXXXX',
      category: 'Your Category'
    },
    // Add more here
  ],
  activity: [ /* ... */ ]
}
```

Then rebuild and redeploy:
```bash
npm run build
vercel deploy --prod
```

---

## Troubleshooting

### "npm install" fails
```bash
# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### "vite not found"
```bash
# Make sure you ran npm install
npm install

# Then try again
npm run dev
```

### "Vercel deploy fails"
- Check vercel.json is present ✓
- Check package.json is present ✓
- Check vite.config.js is present ✓
- Run `npm run build` locally to test build
- Check Node.js version: `node --version` (should be 18+)

### "App won't load on Vercel"
- Wait a few minutes (sometimes takes time to propagate)
- Check browser console (F12 → Console)
- Try different browser (Chrome/Firefox/Safari)
- Check Vercel deployment logs in dashboard

### "Images don't show in downloaded HTML"
- This is expected! Images are embedded as base64 and may take a few seconds
- Make sure browser has loaded the app fully before downloading
- Try opening the HTML file locally first

---

## Domain Setup (Optional)

If you want a custom domain (e.g., `scout-flyer.yourcouncil.com`):

1. Buy domain from GoDaddy, Namecheap, etc.
2. Go to Vercel dashboard → Project → Settings → Domains
3. Add your custom domain
4. Update DNS records (Vercel will show instructions)
5. Wait 24-48 hours for DNS to propagate

---

## Maintenance

### Updates & Fixes

If you make changes:
```bash
# Make your changes to code

# Test locally
npm run dev

# Test production build
npm run build
npm run preview

# Push to GitHub
git add .
git commit -m "Your commit message"
git push origin main

# Vercel auto-deploys when you push to GitHub!
# No need to run vercel deploy again
```

### Monitor Errors

Vercel shows deployment logs in the dashboard. Check these periodically:
- Deployment errors (red)
- Build warnings (yellow)
- Build time (should be <1 minute)

---

## Phase 2 Ideas (Future)

After launch, consider:
1. **Form validation** — Warn users if fields are empty
2. **File size checks** — Limit image uploads to 5MB
3. **Drag-and-drop images** — Instead of click-to-upload
4. **Multiple layouts** — Different flyer designs
5. **Email integration** — Send flyer directly to email
6. **Analytics** — Track how many flyers created
7. **Accessibility** — Add ARIA labels for screen readers

---

## Support

### If Something Breaks

1. Check the QA review in this project (no known bugs)
2. Check GitHub Issues (create one if needed)
3. Review error messages in browser console (F12)
4. Try local testing first to isolate the issue

### Getting Help

- **Vite Docs:** https://vitejs.dev
- **React Docs:** https://react.dev
- **Vercel Docs:** https://vercel.com/docs
- **GitHub:** Create an issue in your repo

---

## Checklist Before Launch

- [ ] GitHub repo created with all files
- [ ] Vercel deployment successful
- [ ] Live app loads without errors
- [ ] Form works and saves data
- [ ] Images load (library + upload)
- [ ] Preview generates correctly
- [ ] HTML downloads successfully
- [ ] HTML opens in browser
- [ ] Prints to PDF correctly
- [ ] Template save/load works
- [ ] Works on mobile (if desired)

---

## You're Ready! 🚀

Your Scout Flyer Builder is production-ready. Deploy it now and start helping Scout troops create recruitment flyers!

**Next:** Push to GitHub → Deploy to Vercel → Share link with troops → Enjoy! 🦅

Questions? Check the README.md for more details.
