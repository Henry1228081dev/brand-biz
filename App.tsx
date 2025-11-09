import React from 'react';
import BrandAssetAnalyzer from './components/BrandAssetAnalyzer';
import VideoCritique from './components/VideoCritique';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <h1 className="text-2xl font-bold text-center text-white">
            Brand <span className="text-brand-primary">AI Suite</span>
          </h1>
        </div>
      </header>
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-16">
          <section id="video-critique">
            <VideoCritique />
          </section>

          <div className="border-t-2 border-dashed border-gray-700"></div>

          <section id="asset-analysis">
            <BrandAssetAnalyzer />
          </section>

        </div>
      </main>
       <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Built by a World-Class Senior Frontend React Engineer</p>
      </footer>
    </div>
  );
};

export default App;