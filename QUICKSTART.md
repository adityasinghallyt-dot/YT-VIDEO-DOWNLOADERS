# ⚡ Quick Start Guide (5 minutes setup)

## 🏃 Fastest Way to Run

### Step 1️⃣ - Install Node.js
Download from: https://nodejs.org/ (Latest LTS version)

### Step 2️⃣ - Open Terminal/Command Prompt
Navigate to your project folder:
```bash
cd /path/to/youtube-downloader
```

### Step 3️⃣ - Install Dependencies
```bash
npm install
```

### Step 4️⃣ - Start the Backend Server
```bash
npm start
```

You should see:
```
🎬 Video Downloader Server running on port 5000
Health check: http://localhost:5000/api/health
```

### Step 5️⃣ - Open in Browser
**Option A - Standalone HTML (Easiest):**
```bash
# Open index.html directly in your browser
# Or use:
python3 -m http.server 8000
# Then go to: http://localhost:8000
```

**Option B - React Version:**
```bash
# In another terminal
npx create-react-app youtube-downloader-app
cd youtube-downloader-app
npm start
# Copy YouTubeDownloader.jsx to src/components/
# Update App.js and you're done!
```

## ✅ Testing the API

Open new terminal and test:
```bash
curl http://localhost:5000/api/health
```

Should return:
```
{"status":"Server is running! 🚀"}
```

## 🎬 Download a Video

1. Open http://localhost:8000 (or http://localhost:3000 for React)
2. Paste YouTube URL
3. Choose format (MP3 or MP4)
4. Click "Download Now"
5. Click "Download File" or copy the link

## ⚡ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Port 5000 already in use" | `lsof -i :5000` then `kill -9 <PID>` |
| "ENOENT: no such file" | Run `npm install` first |
| "CORS error" | Make sure backend runs on port 5000 |
| "Download failed" | Check internet, try different video |

## 🎯 File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Backend Express server |
| `index.html` | Standalone HTML UI (no build needed) |
| `YouTubeDownloader.jsx` | React component version |
| `package.json` | Dependencies |
| `.env` | API keys & config |

## 🚀 Production Deployment

### Deploy Backend to Heroku:
```bash
heroku create
git push heroku main
```

### Deploy Frontend to Vercel:
1. Push to GitHub
2. Connect to Vercel
3. Done!

## 📞 Need Help?

Check these files for more info:
- `README.md` - Full documentation
- `.env` - Configuration

---

**You're ready! Open your browser and start downloading! 🎉**
