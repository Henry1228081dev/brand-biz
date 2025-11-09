
import React, { useState } from 'react';
import { transcribeAudio } from '../services/geminiService';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import LoadingSpinner from './common/LoadingSpinner';
import ResultCard from './common/ResultCard';
import ErrorAlert from './common/ErrorAlert';

const AudioTranscriber: React.FC = () => {
  const { isRecording, audioFile, error: recorderError, startRecording, stopRecording } = useAudioRecorder();
  const [transcription, setTranscription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');

  const handleTranscribe = async () => {
    if (!audioFile) {
      setApiError('No audio recording available to transcribe.');
      return;
    }
    setApiError('');
    setLoading(true);
    setTranscription('');
    try {
      const response = await transcribeAudio(audioFile);
      setTranscription(response);
    } catch (e: any) {
      setApiError(e.message || 'An error occurred during transcription.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-center text-white">Audio Transcription</h2>
      <p className="text-center text-gray-400">Record audio from your microphone and get a transcription. Uses <code className="bg-gray-700 p-1 rounded">gemini-2.5-flash</code>.</p>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z"></path><path fillRule="evenodd" d="M5.5 8.5A.5.5 0 016 9v1a4 4 0 004 4h.01a4 4 0 004-4V9a.5.5 0 011 0v1a5 5 0 01-4.5 4.975V17h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 015 10V9a.5.5 0 01.5-.5z" clipRule="evenodd"></path></svg>
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center"
          >
             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5A.5.5 0 018 7zm4 0a.5.5 0 01.5.5v5a.5.5 0 01-1 0v-5A.5.5 0 0112 7z" clipRule="evenodd"></path></svg>
            Stop Recording
          </button>
        </div>
        {isRecording && <p className="text-brand-secondary animate-pulse">Recording in progress...</p>}
        {audioFile && (
          <div className="w-full max-w-md p-4 bg-gray-800 rounded-lg space-y-3">
             <p className="text-center text-gray-300">Recording complete. Ready to transcribe.</p>
             <audio src={URL.createObjectURL(audioFile)} controls className="w-full" />
             <button
                onClick={handleTranscribe}
                disabled={loading}
                className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition disabled:bg-gray-600"
              >
                {loading ? 'Transcribing...' : 'Transcribe Audio'}
              </button>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner message="Transcribing audio..." />}
      {(recorderError || apiError) && <ErrorAlert message={recorderError || apiError} />}
      {transcription && (
        <ResultCard title="Transcription">
          <p className="text-gray-300 whitespace-pre-wrap">{transcription}</p>
        </ResultCard>
      )}
    </div>
  );
};

export default AudioTranscriber;
