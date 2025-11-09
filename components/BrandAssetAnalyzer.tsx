import React, { useState } from 'react';
import { analyzeImage, analyzeVideo } from '../services/geminiService';
import FileUploader from './common/FileUploader';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import ErrorAlert from './common/ErrorAlert';

const BrandAssetAnalyzer: React.FC = () => {
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Describe this asset in detail and explain its potential use in a marketing campaign.');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);

  const handleFileSelect = (file: File) => {
    setAssetFile(file);
    if (file.type.startsWith('image/')) {
        setFileType('image');
    } else if (file.type.startsWith('video/')) {
        setFileType('video');
    } else {
        setFileType(null);
    }
  };

  const handleSubmit = async () => {
    if (!assetFile || !fileType) {
      setError('Please upload a valid image or video file.');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      let response = '';
      if (fileType === 'image') {
        response = await analyzeImage(assetFile, prompt);
      } else {
        response = await analyzeVideo(assetFile, prompt);
      }
      setResult(response);
    } catch (e: any) {
      setError(e.message || `An error occurred during ${fileType} analysis.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Brand Asset Analysis</h2>
      <p className="text-center text-gray-400">Upload an image or video to get insights from Gemini. Uses <code className="bg-gray-700 p-1 rounded">gemini-2.5-flash</code> for images and <code className="bg-gray-700 p-1 rounded">gemini-2.5-pro</code> for videos.</p>
      
      <div className="space-y-4">
        <FileUploader onFileSelect={handleFileSelect} accept="image/*,video/*" label="an image or video" />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !assetFile}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing Asset...' : 'Analyze Asset'}
        </button>
      </div>

      {loading && <LoadingSpinner message={`Processing ${fileType}, this may take a moment...`} />}
      {error && <ErrorAlert message={error} />}
      {result && (
        <ResultCard title="Asset Analysis Result">
          <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
        </ResultCard>
      )}
    </div>
  );
};

export default BrandAssetAnalyzer;
