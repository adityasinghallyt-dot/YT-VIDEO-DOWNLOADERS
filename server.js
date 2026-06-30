const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

// Normalize any YouTube URL (Shorts, youtu.be, share links with extra params) to standard watch?v= format
function normalizeYoutubeUrl(rawUrl) {
  try {
    const u = new URL(rawUrl);
    let videoId = u.searchParams.get('v');

    if (!videoId && u.hostname.includes('youtu.be')) {
      videoId = u.pathname.split('/').filter(Boolean)[0];
    }

    if (!videoId && u.pathname.includes('/shorts/')) {
      videoId = u.pathname.split('/shorts/')[1]?.split('/')[0];
    }

    if (!videoId && u.pathname.includes('/embed/')) {
      videoId = u.pathname.split('/embed/')[1]?.split('/')[0];
    }

    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
  } catch (e) {
    // fall through
  }
  return rawUrl;
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://yt-video-downloaders.vercel.app', 'http://localhost:3000', 'http://localhost:8000']
}));
app.use(express.json());

// RapidAPI Configuration
const RAPIDAPI_KEY = '46e76ec678msh7a3fb167a9479b4p119690jsnee3ff0b4d897';
const RAPIDAPI_HOST = 'youtube-info-download-api.p.rapidapi.com';

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running! 🚀' });
});

// Download Video/Audio Endpoint
app.post('/api/download', async (req, res) => {
  try {
    const { url, format } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required!' });
    }

    // Validate YouTube URL
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ error: 'Only YouTube URLs supported!' });
    }

    // This API uses resolution-based format codes for video, 'mp3' for audio
    const apiFormat = format === 'mp3' ? 'mp3' : '720';
    const normalizedUrl = normalizeYoutubeUrl(url);

    const submitOptions = {
      method: 'GET',
      url: 'https://youtube-info-download-api.p.rapidapi.com/ajax/download.php',
      params: {
        format: apiFormat,
        add_info: '1',
        url: normalizedUrl,
        audio_quality: '128',
        allow_extended_duration: 'false',
        no_merge: 'false',
        audio_language: 'en'
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const submitResponse = await axios.request(submitOptions);
    const job = submitResponse.data;

    if (!job || !job.success || !job.id) {
      return res.status(500).json({
        error: 'Download failed! Please try again.',
        details: 'Could not start download job: ' + JSON.stringify(job)
      });
    }

    const progressUrl = job.progress_url || `https://p.savenow.to/api/progress?id=${job.id}`;

    // Poll progress until ready (max ~8 sec to fit serverless timeout)
    let downloadLink = null;
    let title = job.info?.title || job.title || 'Video';

    for (let attempt = 0; attempt < 5; attempt++) {
      await new Promise(r => setTimeout(r, 1500));

      const progressResponse = await axios.get(progressUrl);
      const progress = progressResponse.data;

      if (progress.title) title = progress.title;
      if (progress.info?.title) title = progress.info.title;

      if (progress.download_url) {
        downloadLink = progress.download_url;
        break;
      }
      if (progress.url) {
        downloadLink = progress.url;
        break;
      }
    }

    if (!downloadLink) {
      return res.status(500).json({
        error: 'Download failed! Please try again.',
        details: 'Job did not complete in time. Try again in a moment.'
      });
    }

    res.json({
      success: true,
      title: title,
      downloadLink: downloadLink,
      format: format,
      message: 'Download link generated successfully!'
    });

  } catch (error) {
    const apiErrorBody = error.response?.data;
    console.error('API Error:', error.message, apiErrorBody);
    res.status(500).json({
      error: 'Download failed! Please try again.',
      details: apiErrorBody ? JSON.stringify(apiErrorBody) : error.message
    });
  }
});

// Get Video Info Endpoint
app.get('/api/info', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL required!' });
    }

    const options = {
      method: 'GET',
      url: 'https://youtube-info-download-api.p.rapidapi.com/ajax/download.php',
      params: {
        format: 'mp4',
        add_info: '1',
        url: normalizeYoutubeUrl(url)
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    const result = response.data;

    res.json({
      success: true,
      title: result.title || result.info?.title || 'Unknown',
      duration: result.duration || result.info?.duration || 'Unknown',
      thumbnail: result.thumbnail || result.info?.thumbnail || ''
    });

  } catch (error) {
    console.error('Info Error:', error.message);
    res.status(500).json({
      error: 'Could not fetch video info!',
      details: error.message
    });
  }
});

// Helper function to extract Video ID
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error occurred!',
    message: err.message
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎬 Video Downloader Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
