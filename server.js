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
const RAPIDAPI_KEY = '8138e0fbb7msh5fdbcdbfd734137p176442jsnc7f65d3ac3f8';
const RAPIDAPI_HOST = 'youtube-mp36.p.rapidapi.com';

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
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      params: {
        id: extractVideoId(url)
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    // Handle different format requests
    let downloadLink = response.data.link;
    
    if (format === 'mp3' && response.data.mp3) {
      downloadLink = response.data.mp3;
    } else if (format === 'mp4' && response.data.mp4) {
      downloadLink = response.data.mp4;
    }

    res.json({
      success: true,
      title: response.data.title || 'Video',
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
      url: 'https://youtube-mp36.p.rapidapi.com/info',
      params: {
        id: extractVideoId(url)
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);

    res.json({
      success: true,
      title: response.data.title,
      duration: response.data.duration,
      thumbnail: response.data.thumbnail
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
