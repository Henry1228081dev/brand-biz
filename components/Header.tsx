
import React from 'react';
import { Feature } from '../types';

interface HeaderProps {
  activeFeature: Feature;
  setActiveFeature: (feature: Feature) => void;
}

const features: { id: Feature; name: string }[] = [
  { id: 'critique', name: 'Video Critique' },
  { id: 'image', name: 'Image Analysis' },
  { id: 'video', name: 'Video Analysis' },
  { id: 'search', name: 'Grounded Search' },
  { id: 'thinking', name: 'Complex Query' },
  { id: 'audio', name: 'Audio Transcription' },
];

const Header: React.FC<HeaderProps> = ({ activeFeature, setActiveFeature }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">
            Gemini <span className="text-brand-primary">Multi-Modal Suite</span>
          </h1>
          <nav className="overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            <ul className="flex space-x-2 sm:space-x-4">
              {features.map((feature) => (
                <li key={feature.id}>
                  <button
                    onClick={() => setActiveFeature(feature.id)}
                    className={`whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-primary ${
                      activeFeature === feature.id
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {feature.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
