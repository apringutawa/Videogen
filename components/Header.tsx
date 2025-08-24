
import React from 'react';
import { VideoIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-3">
        <VideoIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
          VEO3 Video Generator
        </h1>
	  </div>
	  <div>
	  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text"><font size='6'><a href="https://www.youtube.com/@BelajarAI-ID-DPK">Youtube @BelajarAI-ID-DPK</a></font></h1>
      </div>
      <p className="text-slate-400 mt-2">
        Bring your ideas to life. Generate stunning videos from text and images.
      </p>
    </header>
  );
};
