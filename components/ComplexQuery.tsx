
import React, { useState } from 'react';
import { complexQuery } from '../services/geminiService';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import ErrorAlert from './common/ErrorAlert';

const ComplexQuery: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('Explain the theory of relativity as if I were a curious 10-year-old.');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      const response = await complexQuery(prompt);
      setResult(response);
    } catch (e: any) {
      setError(e.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Complex Query (Thinking Mode)</h2>
      <p className="text-center text-gray-400">Tackle complex problems with enhanced reasoning. Uses <code className="bg-gray-700 p-1 rounded">gemini-2.5-pro</code> with max thinking budget.</p>
      
      <div className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your complex query..."
          className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
          rows={6}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !prompt}
          className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking...' : 'Submit Query'}
        </button>
      </div>

      {loading && <LoadingSpinner message="Engaging thinking mode..." />}
      {error && <ErrorAlert message={error} />}
      {result && (
        <ResultCard title="Query Result">
          <p className="text-gray-300 whitespace-pre-wrap">{result}</p>
        </ResultCard>
      )}
    </div>
  );
};

export default ComplexQuery;
