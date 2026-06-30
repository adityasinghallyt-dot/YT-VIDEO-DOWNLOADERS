const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

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

    const options = {
      method: 'GET',
      url: 'https://youtube-info-download-api.p.rapidapi.com/ajax/download.php',
      params: {
        format: format === 'mp3' ? 'mp3' : 'mp4',
        add_info: '0',
        url: url,
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

    const response = await axios.request(options);
    const result = response.data;

    if (!result || (!result.download_url && !result.url && !result.link)) {
      return res.status(500).json({
        error: 'Download failed! Please try again.',
        details: 'No download link returned by API'
      });
    }

    const downloadLink = result.download_url || result.url || result.link;

    res.json({
      success: true,
      title: result.title || result.info?.title || 'Video',
      downloadLink: downloadLink,
      format: format,
      message: 'Download link generated successfully!'
    });

  } catch (error) {
    console.error('API Error:', error.message);
    res.status(500).json({
      error: 'Download failed! Please try again.',
      details: error.message
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
        url: url
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
