# 🎬 YouTube Video Downloader - Complete Project

A beautiful, fully functional YouTube video downloader application with support for MP3 and MP4 formats.

## 🚀 Features

✅ **Fast Downloads** - Download YouTube videos in seconds
✅ **Multiple Formats** - MP3 (audio) and MP4 (video)
✅ **Beautiful UI** - Modern, responsive design
✅ **No Ads** - Clean, ad-free experience
✅ **Safe & Secure** - Uses official APIs
✅ **Easy to Use** - Simple one-click downloads

## 📁 Project Structure

```
├── server.js              # Express backend server
├── package.json           # Node.js dependencies
├── .env                   # Environment configuration
├── index.html             # Standalone HTML version (No build needed!)
├── YouTubeDownloader.jsx  # React component version
└── README.md              # This file
```

## 🔧 Setup Instructions

### Option 1: Standalone HTML Version (Easiest)

**Best for:** Quick testing, no build tools needed

1. **Open the HTML file:**
   ```bash
   # Simply open index.html in your web browser
   # Or use a simple local server:
   python3 -m http.server 8000
   # Then open: http://localhost:8000
   ```

2. **Start the backend server:**
   ```bash
   npm install
   npm start
   ```

3. **Done!** Open `http://localhost:8000` in your browser

### Option 2: React Version (Recommended)

**Best for:** Modern development, component reusability

1. **Create a React app:**
   ```bash
   npx create-react-app youtube-downloader
   cd youtube-downloader
   ```

2. **Copy files:**
   - Copy `server.js`, `package.json`, and `.env` to project root
   - Copy `YouTubeDownloader.jsx` to `src/components/`

3. **Install dependencies:**
   ```bash
   npm install express axios cors dotenv
   npm install -D nodemon
   ```

4. **Update App.js:**
   ```jsx
   import YouTubeDownloader from './components/YouTubeDownloader';

   function App() {
     return <YouTubeDownloader />;
   }

   export default App;
   ```

5. **Start both servers:**
   ```bash
   # Terminal 1: React frontend
   npm start

   # Terminal 2: Express backend
   node server.js
   ```

6. **Open** `http://localhost:3000` in your browser

## 🔑 API Configuration

The app uses RapidAPI's YouTube Downloader API.

Your credentials are already configured in `.env`:
```
RAPIDAPI_KEY=8138e0fbb7msh5fdbcdbfd734137p176442jsnc7f65d3ac3f8
RAPIDAPI_HOST=youtube-mp36.p.rapidapi.com
```

If you need to change them:
1. Edit `.env` file
2. Restart the server

## 📝 API Endpoints

### GET /api/health
Check if server is running
```bash
curl http://localhost:5000/api/health
```

### POST /api/download
Download a video/audio
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.youtube.com/watch?v=...", "format":"mp4"}'
```

**Request body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp4"  // or "mp3"
}
```

**Response:**
```json
{
  "success": true,
  "title": "Video Title",
  "downloadLink": "https://...",
  "format": "mp4",
  "message": "Download link generated successfully!"
}
```

### GET /api/info
Get video information
```bash
curl "http://localhost:5000/api/info?url=https://www.youtube.com/watch?v=..."
```

## 🎨 UI Features

### Beautiful Design
- Modern gradient background
- Glass-morphism cards
- Smooth animations
- Responsive layout (mobile-friendly)

### User-Friendly
- Real-time error messages
- One-click copy to clipboard
- Direct download button
- Format selection
- Loading states

## 🛠️ Troubleshooting

### "Cannot GET /"
- Make sure backend server is running on port 5000
- Check if port 5000 is available: `lsof -i :5000`

### "Download Failed"
- Verify your internet connection
- Check if YouTube URL is valid
- Make sure the video is not private or restricted
- Check API key in `.env` file

### CORS Issues
- Backend CORS is already configured
- Make sure backend runs on `http://localhost:5000`
- Frontend should run on `http://localhost:3000` or `http://localhost:8000`

### Port Already in Use
```bash
# Kill process using port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

## 📦 Dependencies

### Backend
- **express** - Web framework
- **axios** - HTTP client for API calls
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI framework
- **lucide-react** - Icons
- **Tailwind CSS** - Styling (for React version)
- **Font Awesome** - Icons (for HTML version)

## 🔒 Important Notes

⚠️ **Legal:** Always respect copyright laws and YouTube's terms of service. Download only content that:
- You own
- Is licensed for download
- Has explicit permission from the creator
- Is in the public domain

## 📱 Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## 🚀 Deployment

### Deploy to Heroku (Backend)
```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Vercel (Frontend)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable `REACT_APP_API_URL`
4. Deploy!

## 📧 Support

For issues or questions:
1. Check troubleshooting section
2. Verify all dependencies are installed
3. Check API key and network connection
4. Review console for error messages

## 📄 License

This project is provided as-is for educational purposes.

## 🎉 You're All Set!

Your YouTube Video Downloader is ready to use! 

**Quick Start:**
```bash
# Install
npm install

# Run backend
npm start

# Run frontend (in another terminal)
# Option 1: Open index.html in browser
# Option 2: npm start (if using React)
```

**Then open:**
- Standalone: `http://localhost:8000`
- React: `http://localhost:3000`

---

Made with ❤️ | Download YouTube content legally and responsibly! 🎬
