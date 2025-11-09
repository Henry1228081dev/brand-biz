
import React, { useState } from 'react';
import { groundedSearch } from '../services/geminiService';
import { GroundingChunk } from '../types';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import ErrorAlert from './common/ErrorAlert';

const GroundedSearch: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('What are the latest developments in AI?');
  const [result, setResult] = useState<string>('');
  const [chunks, setChunks] = useState<GroundingChunk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!prompt) {
      setError('Please enter a search query.');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    setChunks([]);
    try {
      const response = await groundedSearch(prompt);
      setResult(response.text);
      setChunks(response.chunks);
    } catch (e: any) {
      setError(e.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Search Grounding</h2>
      <p className="text-center text-gray-400">Get up-to-date, accurate information grounded in Google Search. Uses <code className="bg-gray-700 p-1 rounded">gemini-2.5-flash</code>.</p>
      
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          rows={4}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <LoadingSpinner message="Searching the web..." />}
      {error && <ErrorAlert message={error} />}
      {result && (
        <ResultCard title="Search Result">
          <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
          {chunks.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="font-semibold text-lg text-white mb-2">Sources:</h4>
              <ul className="list-disc list-inside space-y-1">
                {chunks.map((chunk, index) => (
                  chunk.web?.uri && (
                    <li key={index}>
                      <a href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
                        {chunk.web.title || chunk.web.uri}
                      </a>
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}
        </ResultCard>
      )}
    </div>
  );
};

export default GroundedSearch;
