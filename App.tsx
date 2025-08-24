
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { VideoGeneratorForm } from './components/VideoGeneratorForm';
import { Loader } from './components/Loader';
import { VideoPlayer } from './components/VideoPlayer';
import type { GenerateVideoParams } from './types';
import { generateVideo } from './services/geminiService';
import { LOADING_MESSAGES } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleGenerate = useCallback(async (params: GenerateVideoParams) => {
    setIsLoading(true);
    setError(null);
    setVideoUrl(null);
    
    const onProgress = (message: string) => {
      setLoadingMessage(message);
    };

    try {
      const url = await generateVideo(params, onProgress);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setVideoUrl(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <Header />
        <main className="mt-8">
          {isLoading ? (
            <Loader message={loadingMessage} />
          ) : videoUrl ? (
            <VideoPlayer videoUrl={videoUrl} onGenerateAnother={handleReset} />
          ) : (
            <>
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-6 text-center">
                  <p className="font-semibold">Generation Failed</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}
              <VideoGeneratorForm onGenerate={handleGenerate} disabled={isLoading} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
