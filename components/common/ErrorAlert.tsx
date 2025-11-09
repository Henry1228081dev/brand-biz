
import React from 'react';

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  return (
    <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorAlert;
