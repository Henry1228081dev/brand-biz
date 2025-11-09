
import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import FileUploader from './common/FileUploader';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import ErrorAlert from './common/ErrorAlert';

const ImageAnalyzer: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('Describe this image in detail.');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      const response = await analyzeImage(imageFile, prompt);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Image Understanding</h2>
      <p className="text-center text-gray-400">Upload an image and ask Gemini to analyze it. Uses <code className="bg-gray-700 p-1 rounded">gemini-2.5-flash</code>.</p>
      
      <div className="space-y-4">
        <FileUploader onFileSelect={setImageFile} accept="image/*" label="an image" />
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt..."
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !imageFile}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>

      {loading && <LoadingSpinner message="Analyzing image..." />}
      {error && <ErrorAlert message={error} />}
      {result && (
        <ResultCard title="Analysis Result">
          <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
        </ResultCard>
      )}
    </div>
  );
};

export default ImageAnalyzer;
