
import React from 'react';
import { DownloadIcon, RefreshIcon } from './IconComponents';

interface VideoPlayerProps {
  videoUrl: string;
  onGenerateAnother: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, onGenerateAnother }) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-cyan-400">Generation Complete!</h2>
      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
        <video src={videoUrl} controls autoPlay muted loop className="w-full h-auto" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={videoUrl}
          download="generated-video.mp4"
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded-lg transition-colors transform active:scale-95"
        >
          <DownloadIcon className="w-5 h-5" />
          Download
        </a>
        <button
          onClick={onGenerateAnother}
          className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-colors transform active:scale-95"
        >
          <RefreshIcon className="w-5 h-5" />
          Generate Another
        </button>
      </div>
    </div>
  );
};
