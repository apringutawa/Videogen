import { GoogleGenAI } from '@google/genai';
import type { GenerateVideoParams } from '../types';
import { LOADING_MESSAGES } from '../constants';

// Helper function to wait for a specified duration
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const generateVideo = async (
  params: GenerateVideoParams,
  onProgress: (message: string) => void
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set.');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const payload: any = {
      model: 'veo-3.0-generate-preview',
      prompt: params.prompt,
      config: {
        numberOfVideos: 1,
        enableSound: params.soundEnabled,
      }
  };

  if (params.image) {
    payload.image = {
        imageBytes: params.image.data,
        mimeType: params.image.mimeType
    }
  }
  
  // Note: Aspect ratio and resolution are part of the UI as requested,
  // but the current VEO API docs via @google/genai SDK do not explicitly
  // list them as configurable parameters in the same way `generateImages` does.
  // They are collected but not passed in this implementation.
  // This can be updated if the API supports it in the future.

  onProgress(LOADING_MESSAGES[0]);
  let operation;
  try {
    operation = await ai.models.generateVideos(payload);
  } catch (e) {
    console.error("Error starting video generation:", e);
    throw new Error("Failed to start video generation. Check your prompt or image and try again.");
  }


  let messageIndex = 1;
  while (!operation.done) {
    onProgress(LOADING_MESSAGES[messageIndex % LOADING_MESSAGES.length]);
    messageIndex++;
    await sleep(10000); // Poll every 10 seconds
    try {
        operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (e) {
        console.error("Error polling for video status:", e);
        throw new Error("Failed to get video generation status.");
    }
  }

  if (operation.error) {
    console.error("Video generation operation failed:", operation.error);
    throw new Error(`Video generation failed: ${operation.error.message}`);
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

  if (!downloadLink) {
    throw new Error('Video generation succeeded, but no download link was provided.');
  }

  onProgress('Downloading your video...');
  
  try {
    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
      throw new Error(`Failed to download video. Status: ${videoResponse.status}`);
    }
    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
  } catch(e) {
    console.error("Error fetching video blob:", e);
    throw new Error("Failed to download the generated video file.");
  }
};
