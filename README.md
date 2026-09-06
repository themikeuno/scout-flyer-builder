# Scout Troop Recruitment Flyer Generator

🎯 **Create professional Scout recruitment flyers in minutes** — No design experience needed!

## What It Does

This web app helps Scout troop leaders create beautiful, print-ready recruitment flyers using a simple form. Fill in your troop details, pick images, and download a professional HTML flyer that prints perfectly to PDF.

### Key Features
- ✅ **No Design Skills Required** — Simple 5-step form walks you through it
- ✅ **Choose from Professional Scout Images** — Or upload your own troop photos
- ✅ **Save Templates** — Save your settings as JSON and reuse them anytime
- ✅ **Print to PDF** — Download as HTML, print to PDF in one click (Cmd+P / Ctrl+P)
- ✅ **Works Everywhere** — Desktop, tablet, mobile (form) → desktop (print)
- ✅ **No Account Needed** — Everything stays on your computer (no server storage)

---

## How to Use (For Scout Leaders)

### Quick Start
1. **Visit the live app:** [Link will appear after deployment]
2. **Fill out 5 steps:**
   - Step 1: Troop name, type, age range
   - Step 2: Meeting day, time, address
   - Step 3: Email, website, Instagram
   - Step 4: Description & highlights
   - Step 5: Pick or upload images
3. **Click "Generate Flyer Preview"** to see what it looks like
4. **Click "Download as HTML"** to save the flyer
5. **Print to PDF:** Open the HTML file → Cmd+P (Mac) or Ctrl+P (Windows) → "Save as PDF"
6. **Share:** Print, email, or post online!

### Save Your Settings
Before leaving, click **"Save Template"** to download your settings as a JSON file. Next time you visit, click **"Load Template"** to restore everything instantly. Just re-select/upload images and you're ready to generate a new version.

---

## How to Deploy (For Developers)

### Prerequisites
- Node.js 18+
- npm (comes with Node.js)
- GitHub account
- Vercel account (free, sign up at vercel.com)

### Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/scout-flyer-builder.git
cd scout-flyer-builder

# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:5173 in your browser
```

### Build for Production

```bash
npm run build

# Output will be in dist/ directory
# Preview: npm run preview
```

### Deploy to Vercel

**Option 1: Via CLI (Fastest)**
```bash
npm install -g vercel
vercel

# Follow the prompts:
# 1. Link to GitHub account
# 2. Select this project
# 3. Done! Your app is live
```

**Option 2: Via Web UI**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Select this GitHub repository
5. Click "Deploy"
6. Done!

**Your live URL will be something like:** `https://scout-flyer-builder.vercel.app`

---

## Project Structure

```
scout-flyer-builder/
├── src/
│   ├── App.jsx              # Main Scout Flyer Builder component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML entry point for Vite
├── package.json             # Dependencies & build scripts
├── vite.config.js           # Vite build configuration
├── vercel.json              # Vercel deployment config
├── README.md                # This file
├── .gitignore               # Git ignore rules
└── dist/                    # (Generated after build) Production output
```

---

## Technology Stack

- **React 18** — UI framework
- **Vite** — Super fast build tool
- **Vercel** — Free hosting & deployment
- **Vanilla CSS** — Styling (no framework needed)

### Why This Stack?
- **React:** Flexible, component-based, large community
- **Vite:** Instant dev server, fast builds, minimal config
- **Vercel:** One-click deployment, automatic HTTPS, free tier covers this project
- **CSS:** Simple, no dependencies, easy to customize

---

## Features Explained

### Image Library
The app comes with 6 professional Scout-themed images from Unsplash:
- Diverse Scout groups
- Hiking/outdoor activities
- Leadership training
- Community service
- Campfire/social events
- Outdoor skills

**Can I use my own photos?**
Yes! Upload your own in Step 5. Works with JPG, PNG, WebP.

### Template Save/Load
When you click **"Save Template,"** you get a JSON file like this:
```json
{
  "troopBasics": {
    "troopName": "Troop 111",
    "troopType": "Girl Scouts",
    "ageRange": "Ages 11-17"
  },
  "meetingLocation": {
    "day": "Monday",
    "time": "7:00 PM",
    "address": "2810 Providence Rd, Charlotte, NC 28211"
  },
  ...
}
```

**Important:** Images are NOT saved (keeps file small). When you load a template, you'll re-select or re-upload images. This is intentional — images are large and tied to your session.

### Print-to-PDF
The generated HTML is print-optimized:
- ✅ Page breaks prevent content overflow
- ✅ 8.5" × 11" sizing (US Letter)
- ✅ Professional spacing and margins
- ✅ Colors and fonts render correctly

**How to print:**
1. Download the HTML file
2. Open in your browser
3. Press Cmd+P (Mac) or Ctrl+P (Windows)
4. Select "Save as PDF"
5. Done!

---

## Customization

### Change Colors
Scout green (#2E7D32) is hardcoded. To change:
1. Open `src/App.jsx`
2. Search for `#2E7D32`
3. Replace with your color (e.g., `#0066CC` for blue)
4. Save and rebuild

### Change Image Library
To add more images:
1. Open `src/App.jsx`
2. Find the `IMAGE_LIBRARY` object
3. Add new image URLs from Unsplash/Pexels
4. Rebuild

### Add Form Fields
To add a new field (e.g., "Meeting Address 2"):
1. Add to `formData` state in `App.jsx`
2. Add input field to the appropriate form step
3. Include in HTML generation function
4. Rebuild

---

## Troubleshooting

### "App won't load locally"
```bash
# Make sure you're in the right directory
cd scout-flyer-builder

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Restart dev server
npm run dev
```

### "Download button not working"
- Try a different browser (Chrome/Firefox/Safari all work)
- Check browser console for errors (F12 → Console tab)

### "Template won't load"
- Make sure JSON file is valid (download a fresh template to check format)
- Try a different JSON file

### "Images aren't showing in HTML"
- Images are embedded as base64 (may take a few seconds to load)
- Try opening the HTML file in a different browser

---

## FAQ

**Q: Will my data be stored on a server?**
A: No. Everything stays on your computer. No accounts, no signup, no server storage.

**Q: Can I edit the flyer after downloading?**
A: Yes! The HTML file is readable. Open in a text editor to make tweaks. Or re-load your template and regenerate.

**Q: Can multiple troops use this?**
A: Yes! Share the link `https://scout-flyer-builder.vercel.app` with other troops. Each troop saves their own template locally.

**Q: Does it work offline?**
A: After the first load, yes. Images are cached, form works locally. Offline mode is supported.

**Q: Can I print in color or black & white?**
A: Both work! Browser print dialog has options. Flyer is designed to look good either way.

**Q: What if I find a bug?**
A: Create an issue on GitHub or email the developer. Bugs will be fixed quickly.

---

## Development Notes

### Testing
- Test locally with `npm run dev`
- Test build with `npm run build && npm run preview`
- Test on mobile by visiting the Vercel URL on your phone

### Performance
- App is very fast (no server requests, all client-side)
- Largest flyer HTML: ~5-10MB (depending on image count & size)
- Load time: <1 second on most connections

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Known Limitations
- Images must be uploaded fresh each session (not persisted)
- File uploads are limited to browser memory (~500MB max)
- Template JSON keeps references to images, not the images themselves

---

## Contributing

Want to improve the app? Contributions welcome!

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Make changes
4. Push and create a Pull Request

### Ideas for Phase 2
- Form validation UI (ensure fields are filled)
- File size check on image uploads
- Drag-and-drop image upload
- Multiple flyer layouts (carousel, single-page, etc.)
- Email flyer to yourself directly
- Share link to generated flyer (requires backend)

---

## License

This project is open source and free to use. No license restrictions for Scout troops.

---

## Support

**Live App:** [Will be at vercel.app URL]
**GitHub:** [Your GitHub repo URL]
**Questions?** Create an issue on GitHub or contact the developer.

---

## Made for Scout Troops, By Scout Enthusiasts

Built to help Scout troops recruit the next generation of leaders! 🦅

If you found this helpful, consider sharing it with other troops in your council.

Happy recruiting! 🎯
