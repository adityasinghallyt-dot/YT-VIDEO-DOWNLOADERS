# 📚 API Reference & Developer Cheat Sheet

## Quick Reference

### Base URL
```
http://localhost:5000/api
```

### Supported Video Formats
| Format | Type | Quality |
|--------|------|---------|
| MP4 | Video | 1080p, 720p, 480p |
| MP3 | Audio | 192kbps, 256kbps, 320kbps |
| AAC | Audio | High quality |
| WAV | Audio | Lossless |
| FLAC | Audio | Lossless |

---

## API Endpoints Reference

### Endpoint 1: Health Check
```
GET /api/health
```

**cURL:**
```bash
curl http://localhost:5000/api/health
```

**JavaScript Fetch:**
```javascript
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(data => console.log(data))
```

**Response:**
```json
{"status": "Server is running! 🚀"}
```

---

### Endpoint 2: Download (Main)
```
POST /api/download
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/download \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "format": "mp4"
  }'
```

**JavaScript Fetch:**
```javascript
const response = await fetch('http://localhost:5000/api/download', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=...',
    format: 'mp4' // or 'mp3'
  })
});

const data = await response.json();
console.log(data.downloadLink);
```

**Python Requests:**
```python
import requests

response = requests.post(
    'http://localhost:5000/api/download',
    json={
        'url': 'https://www.youtube.com/watch?v=...',
        'format': 'mp4'
    }
)

data = response.json()
print(data['downloadLink'])
```

**Request Parameters:**
```json
{
  "url": "string (required)",    // Full YouTube URL
  "format": "string (required)"   // 'mp3' or 'mp4'
}
```

**Success Response:**
```json
{
  "success": true,
  "title": "Video Title",
  "downloadLink": "https://...",
  "format": "mp4",
  "message": "Download link generated successfully!"
}
```

**Error Response:**
```json
{
  "error": "Error message here",
  "details": "Additional error details"
}
```

---

### Endpoint 3: Video Info
```
GET /api/info?url=<URL>
```

**cURL:**
```bash
curl "http://localhost:5000/api/info?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**JavaScript Fetch:**
```javascript
const url = new URL('http://localhost:5000/api/info');
url.searchParams.append('url', 'https://www.youtube.com/watch?v=...');

const response = await fetch(url);
const data = await response.json();
console.log(data.title);
```

**Response:**
```json
{
  "success": true,
  "title": "Video Title",
  "duration": "3:45",
  "thumbnail": "https://..."
}
```

---

## Common Use Cases

### Use Case 1: Simple Download
```javascript
async function downloadVideo(youtubeUrl) {
  const response = await fetch('http://localhost:5000/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: youtubeUrl,
      format: 'mp4'
    })
  });
  
  const { downloadLink } = await response.json();
  return downloadLink;
}

// Usage
const link = await downloadVideo('https://youtube.com/watch?v=...');
window.location.href = link; // Start download
```

### Use Case 2: Extract Audio Only
```javascript
async function downloadAudio(youtubeUrl) {
  const response = await fetch('http://localhost:5000/api/download', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: youtubeUrl,
      format: 'mp3'
    })
  });
  
  return response.json();
}
```

### Use Case 3: Get Video Info Before Downloading
```javascript
async function getVideoInfo(youtubeUrl) {
  const response = await fetch(
    `http://localhost:5000/api/info?url=${encodeURIComponent(youtubeUrl)}`
  );
  return response.json();
}

// Usage
const info = await getVideoInfo('https://youtube.com/watch?v=...');
console.log(`Downloading: ${info.title}`);
```

### Use Case 4: Batch Download Multiple Videos
```javascript
async function downloadMultiple(urls, format = 'mp4') {
  const results = [];
  
  for (const url of urls) {
    try {
      const response = await fetch('http://localhost:5000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format })
      });
      
      const data = await response.json();
      results.push({
        url,
        success: true,
        downloadLink: data.downloadLink,
        title: data.title
      });
    } catch (error) {
      results.push({
        url,
        success: false,
        error: error.message
      });
    }
  }
  
  return results;
}
```

---

## Error Codes & Solutions

### 400: Bad Request
```
Cause: Missing or invalid parameters
Solution: Check URL and format are provided and valid
```

**Example Error:**
```json
{
  "error": "URL required!",
  "details": null
}
```

---

### 400: Invalid URL Format
```
Cause: URL is not a YouTube URL
Solution: Use valid YouTube URL (youtube.com or youtu.be)
```

**Example Error:**
```json
{
  "error": "Only YouTube URLs supported!",
  "details": null
}
```

---

### 500: Server Error
```
Cause: API call failed or server issue
Solution: Check internet connection, try again later, check API key
```

**Example Error:**
```json
{
  "error": "Download failed! Please try again.",
  "details": "API Error: Request timeout"
}
```

---

## Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Proceed with download link |
| 400 | Bad Request | Fix request parameters |
| 500 | Server Error | Retry or contact support |

---

## Rate Limiting

**Current Limits (RapidAPI):**
- Free Plan: 500 requests/month
- Pro Plan: 5,000 requests/month
- Higher: Contact RapidAPI support

**Tips to Avoid Rate Limits:**
1. Cache download links (valid for 24-48 hours)
2. Don't retry failed requests immediately
3. Implement exponential backoff
4. Monitor your API usage

---

## URL Validation Helpers

### Accepted YouTube URL Formats
```javascript
// All these work:
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s
https://youtu.be/dQw4w9WgXcQ?t=42s
```

### Extract Video ID
```javascript
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Usage
const id = extractVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ');
console.log(id); // dQw4w9WgXcQ
```

---

## Response Handling Examples

### Handle Success
```javascript
async function download(url, format) {
  try {
    const response = await fetch('http://localhost:5000/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, format })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    console.log(`✅ ${data.title}`);
    return data.downloadLink;
  } catch (error) {
    console.error(`❌ ${error.message}`);
    return null;
  }
}
```

### Retry Logic
```javascript
async function downloadWithRetry(url, format, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('http://localhost:5000/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, format })
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise(r => setTimeout(r, 1000 * attempt)); // Exponential backoff
    }
  }
  
  throw new Error('Failed after retries');
}
```

---

## Environment Setup

### Local Development
```bash
# .env file
PORT=5000
RAPIDAPI_KEY=your_key_here
RAPIDAPI_HOST=youtube-mp36.p.rapidapi.com
FRONTEND_URL=http://localhost:3000
```

### Production
```bash
# .env file
PORT=8080
RAPIDAPI_KEY=your_production_key_here
RAPIDAPI_HOST=youtube-mp36.p.rapidapi.com
FRONTEND_URL=https://yourdomain.com
```

---

## Testing with Postman

**1. Create New Request**
- Method: POST
- URL: `http://localhost:5000/api/download`

**2. Headers Tab**
```
Content-Type: application/json
```

**3. Body Tab (JSON)**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp4"
}
```

**4. Send Request**
- Check response in Results tab

---

## Debugging Checklist

- [ ] Backend server running on port 5000?
- [ ] API key correct in .env?
- [ ] YouTube URL valid?
- [ ] Network connection working?
- [ ] Checking browser console for errors?
- [ ] CORS headers present?
- [ ] Request/Response format correct?

---

**Happy downloading! 🎬**
