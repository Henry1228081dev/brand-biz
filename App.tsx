
import React, { useState } from 'react';
import Header from './components/Header';
import ImageAnalyzer from './components/ImageAnalyzer';
import VideoAnalyzer from './components/VideoAnalyzer';
import GroundedSearch from './components/GroundedSearch';
import ComplexQuery from './components/ComplexQuery';
import AudioTranscriber from './components/AudioTranscriber';
import VideoCritique from './components/VideoCritique';
import { Feature } from './types';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>('critique');

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'image':
        return <ImageAnalyzer />;
      case 'video':
        return <VideoAnalyzer />;
      case 'search':
        return <GroundedSearch />;
      case 'thinking':
        return <ComplexQuery />;
      case 'audio':
        return <AudioTranscriber />;
      case 'critique':
        return <VideoCritique />;
      default:
        return <VideoCritique />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header activeFeature={activeFeature} setActiveFeature={setActiveFeature} />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {renderActiveFeature()}
        </div>
      </main>
       <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Built by a World-Class Senior Frontend React Engineer</p>
      </footer>
    </div>
  );
};

export default App;
