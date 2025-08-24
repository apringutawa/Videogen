
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 rounded-lg">
      <div className="w-16 h-16 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold mt-6 text-slate-200">Generating Your Video</h2>
      <p className="text-slate-400 mt-2">{message}</p>
    </div>
  );
};
