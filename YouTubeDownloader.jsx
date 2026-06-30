import React, { useState } from 'react';
import { Download, Music, Video, Copy, Check, AlertCircle, Loader } from 'lucide-react';

export default function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  const handleDownload = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('🎬 Please enter a YouTube URL!');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Download failed!');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong! 😞');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.downloadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-purple-600 to-blue-600 p-4 md:p-8">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_25%,rgba(68,68,68,.2)_50%,transparent_50%,transparent_75%,rgba(68,68,68,.2)_75%,rgba(68,68,68,.2))] bg-[length:60px_60px] animate-pulse"></div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
              <Video className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🎬 Video Downloader
          </h1>
          <p className="text-red-100 text-lg">Download YouTube Videos & Audio in seconds!</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 mb-8 border border-white/20">
          
          {/* Form */}
          <form onSubmit={handleDownload} className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                YouTube URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-all placeholder-gray-400"
                  disabled={loading}
                />
                <Video className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Format
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'mp4', icon: Video, label: 'MP4 Video', color: 'bg-blue-50 border-blue-200' },
                  { value: 'mp3', icon: Music, label: 'MP3 Audio', color: 'bg-purple-50 border-purple-200' }
                ].map(({ value, icon: Icon, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormat(value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      format === value
                        ? `border-red-500 bg-red-50`
                        : `border-gray-200 ${color}`
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      format === value ? 'text-red-600' : 'text-gray-600'
                    }`} />
                    <p className={`font-semibold text-sm ${
                      format === value ? 'text-red-600' : 'text-gray-700'
                    }`}>
                      {label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download Now
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded animate-slideIn">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-lg animate-slideIn">
              <div className="flex items-start gap-3 mb-4">
                <Check className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-green-800 text-lg">✅ Ready to Download!</h3>
                  <p className="text-green-700 text-sm mt-1">{result.title || 'Video'}</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Download Link */}
                <div className="bg-white/60 p-3 rounded border border-green-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2">Download Link:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={result.downloadLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-green-200 rounded text-xs text-gray-600 truncate"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold transition-all flex items-center gap-1 text-sm"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Direct Download Button */}
                <a
                  href={result.downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all text-center flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download File
                </a>
              </div>

              <p className="text-xs text-gray-600 mt-4 text-center">
                💡 Tip: Right-click and select "Save as" for best results
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { icon: '⚡', title: 'Lightning Fast', desc: 'Download in seconds' },
            { icon: '🎵', title: 'Multiple Formats', desc: 'MP3, MP4, AAC, WAV' },
            { icon: '🔒', title: '100% Safe', desc: 'No ads or malware' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-white text-center border border-white/20 hover:border-white/40 transition-all">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <h3 className="font-bold">{feature.title}</h3>
              <p className="text-sm text-gray-100">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-white/80 text-sm">
          <p>Made with ❤️ | Download YouTube content legally and responsibly</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
