# 🏗️ Project Architecture & Configuration

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Browser)                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  HTML/CSS/JS (index.html)                           │   │
│  │  ├─ YouTube URL Input                               │   │
│  │  ├─ Format Selection (MP3/MP4)                       │   │
│  │  ├─ Download Button                                 │   │
│  │  └─ Result Display                                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────┬──────────────────────────────────────────┘
                  │ HTTP Requests (Port 5000)
                  │
┌─────────────────▼──────────────────────────────────────────┐
│                  EXPRESS SERVER (Node.js)                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ROUTES                                              │   │
│  │  ├─ GET /api/health      (Health check)             │   │
│  │  ├─ POST /api/download   (Main download function)   │   │
│  │  └─ GET /api/info        (Video metadata)           │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                     │
│  ┌──────────────────────▼─────────────────────────────────┐ │
│  │  MIDDLEWARE                                          │ │
│  │  ├─ CORS (Allow cross-origin requests)              │ │
│  │  └─ Body Parser (Parse JSON)                        │ │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────┬──────────────────────────────────────────┘
                  │ API Calls (HTTPS)
                  │
┌─────────────────▼──────────────────────────────────────────┐
│           RapidAPI Video Downloader Service                 │
│  ├─ youtube-mp36.p.rapidapi.com                            │
│  ├─ API Key: 8138e0fbb7msh5fdbcdbfd734137p176442jsnc7f... │
│  └─ Formats: MP3, MP4, AAC, WAV, FLAC                      │
└────────────────────────────────────────────────────────────┘
```

## File Flow Diagram

```
User Request (Browser)
    │
    ▼
index.html (JavaScript)
    │ Uses fetch() to POST to /api/download
    ▼
server.js (Express Server)
    │ 1. Extract video ID from URL
    │ 2. Validate YouTube URL
    │ 3. Make API call to RapidAPI
    ▼
RapidAPI Service
    │ Returns download link + metadata
    ▼
server.js (Response Handler)
    │ Format response as JSON
    ▼
index.html (JavaScript)
    │ Display download link
    ▼
User clicks "Download File"
    │
    ▼
Browser downloads video/audio file
```

## API Endpoints Documentation

### 1. Health Check Endpoint
**Purpose:** Verify server is running

**Endpoint:** `GET /api/health`

**Request:**
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "Server is running! 🚀"
}
```

---

### 2. Download Endpoint (Main Function)
**Purpose:** Get download link for YouTube video

**Endpoint:** `POST /api/download`

**Request:**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "format": "mp4"
  }'
```

**Request Body:**
```json
{
  "url": "string",      // YouTube URL (required)
  "format": "string"    // "mp3" or "mp4" (required)
}
```

**Response (Success):**
```json
{
  "success": true,
  "title": "Video Title",
  "downloadLink": "https://download-url.com/file.mp4",
  "format": "mp4",
  "message": "Download link generated successfully!"
}
```

**Response (Error):**
```json
{
  "error": "Only YouTube URLs supported!",
  "details": "error message details"
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid data)
- `500` - Server Error

---

### 3. Video Info Endpoint
**Purpose:** Get video metadata without downloading

**Endpoint:** `GET /api/info?url=<YOUTUBE_URL>`

**Request:**
```bash
curl "http://localhost:5000/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Response:**
```json
{
  "success": true,
  "title": "Video Title",
  "duration": "3:45",
  "thumbnail": "https://thumbnail-url.jpg"
}
```

---

## Configuration Files

### `.env` File (Environment Variables)
```env
# Server Configuration
PORT=5000

# RapidAPI Credentials
RAPIDAPI_KEY=8138e0fbb7msh5fdbcdbfd734137p176442jsnc7f65d3ac3f8
RAPIDAPI_HOST=youtube-mp36.p.rapidapi.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**To change:**
1. Edit `.env` file
2. Restart the server

### `package.json` Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.2",      // Web framework
    "axios": "^1.6.2",         // HTTP client
    "cors": "^2.8.5",          // Cross-Origin requests
    "dotenv": "^16.3.1"        // Environment variables
  }
}
```

---

## How Each Component Works

### Frontend (index.html)
```
1. User enters YouTube URL
2. Selects format (MP3/MP4)
3. Clicks "Download Now" button
4. JavaScript sends POST request to server
5. Displays download link
6. User can copy link or download directly
```

### Backend (server.js)
```
1. Receives HTTP request with URL and format
2. Validates it's a YouTube URL
3. Extracts video ID from URL
4. Makes authenticated request to RapidAPI
5. Processes response
6. Returns download link to frontend
```

### RapidAPI Service
```
1. Receives video ID
2. Processes video (can take 5-60 seconds)
3. Generates download links
4. Returns links with metadata
5. Links are valid for 24-48 hours
```

---

## Error Handling Flow

```
User Submission
    │
    ▼
┌─ Is URL empty? ──YES──> Show error: "Please enter URL"
│   └─ NO
│   │
│   ▼
├─ Is it YouTube URL? ──NO──> Show error: "Only YouTube URLs"
│   └─ YES
│   │
│   ▼
├─ API Request ──ERROR──> Show error: "Download failed"
│   └─ SUCCESS
│   │
│   ▼
└─ Display Result!
```

---

## Security Considerations

### ✅ Implemented
- CORS headers to prevent unauthorized requests
- Input validation for URLs
- Environment variables for sensitive data
- Error messages without exposing internal details
- HTTPS for API communication

### ⚠️ Important
- Never commit `.env` file to public repositories
- Rotate API keys periodically
- Rate limit API calls in production
- Use HTTPS in production

---

## Performance Optimization

### Current Performance
- Average download link generation: 2-5 seconds
- Transfer size: ~1-5 KB per request
- Concurrent requests supported

### Tips for Better Performance
1. Cache download links for repeated URLs
2. Implement rate limiting
3. Use CDN for static files
4. Enable gzip compression
5. Monitor API quota

---

## Monitoring & Debugging

### Check Server Health
```bash
curl http://localhost:5000/api/health
```

### View Server Logs
```bash
# All errors logged in console
# Check for CORS errors
# Check for API authentication errors
```

### Browser Developer Tools
1. Press F12 to open DevTools
2. Check Network tab for API requests
3. Check Console for JavaScript errors
4. Check Application tab for stored data

---

## Troubleshooting Guide

| Problem | Cause | Solution |
|---------|-------|----------|
| CORS Error | Missing CORS header | Restart backend server |
| API Error | Invalid API key | Check .env file |
| Port 5000 in use | Another app using port | Kill process or use different port |
| Video not found | Private/deleted video | Try different video |
| Slow response | API rate limit | Wait or upgrade plan |

---

**For more detailed help, see README.md or QUICKSTART.md**
