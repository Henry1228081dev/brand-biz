
import React from 'react';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => {
  return (
    <div className="mt-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gray-700">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default ResultCard;
