
import React, { useState } from 'react';
import { analyzeVideo } from '../services/geminiService';
import FileUploader from './common/FileUploader';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import ErrorAlert from './common/ErrorAlert';

const VideoAnalyzer: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Summarize this video and identify key moments.');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!videoFile) {
      setError('Please upload a video first.');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      const response = await analyzeVideo(videoFile, prompt);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An error occurred during video analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Video Understanding</h2>
       <p className="text-center text-gray-400">Upload a short video and get insights from Gemini. Uses <code className="bg-gray-700 p-1 rounded">gemini-2.5-pro</code>. Note: Large files may fail.</p>
      
      <div className="space-y-4">
        <FileUploader onFileSelect={setVideoFile} accept="video/*" label="a video" />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt for the video..."
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !videoFile}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing Video...' : 'Analyze Video'}
        </button>
      </div>

      {loading && <LoadingSpinner message="Processing video, this may take a moment..." />}
      {error && <ErrorAlert message={error} />}
      {result && (
        <ResultCard title="Video Analysis Result">
          <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
        </ResultCard>
      )}
    </div>
  );
};

export default VideoAnalyzer;
