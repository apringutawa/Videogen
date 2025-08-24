import React, { useState, useCallback, useRef } from 'react';
import type { GenerateVideoParams, ImageFile } from '../types';
import { AspectRatio, Resolution } from '../types';
import { UploadIcon, SparklesIcon, XCircleIcon } from './IconComponents';
import { SelectButton } from './SelectButton';
import { ToggleSwitch } from './ToggleSwitch';

interface VideoGeneratorFormProps {
  onGenerate: (params: GenerateVideoParams) => void;
  disabled: boolean;
}

export const VideoGeneratorForm: React.FC<VideoGeneratorFormProps> = ({ onGenerate, disabled }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<ImageFile | undefined>(undefined);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SixteenNine);
  const [resolution, setResolution] = useState<Resolution>(Resolution.HD720p);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setImage({
          data: base64String,
          mimeType: file.type,
          previewUrl: URL.createObjectURL(file),
        });
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    if(event.target) {
      event.target.value = '';
    }
  }, []);

  const triggerFileSelect = () => fileInputRef.current?.click();
  
  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.previewUrl);
      setImage(undefined);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Prompt cannot be empty.');
      return;
    }
    setError(null);
    onGenerate({ prompt, image, aspectRatio, resolution, soundEnabled });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-slate-300 mb-2">
          Prompt
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cat wearing sunglasses driving a convertible car through a neon-lit city at night..."
          className="w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors placeholder-slate-500"
          disabled={disabled}
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-slate-300 mb-2">Reference Image (Optional)</span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
          disabled={disabled}
        />
        {image ? (
          <div className="relative group">
            <img src={image.previewUrl} alt="Preview" className="w-full h-auto rounded-lg max-h-60 object-contain bg-slate-800" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              disabled={disabled}
              aria-label="Remove image"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={triggerFileSelect}
            className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 rounded-lg hover:border-cyan-500 transition-colors"
            disabled={disabled}
          >
            <UploadIcon className="w-8 h-8 text-slate-500" />
            <span className="mt-2 text-sm text-slate-400">Click to upload an image</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</span>
          <div className="flex gap-2">
            <SelectButton<AspectRatio>
              label="16:9"
              value={AspectRatio.SixteenNine}
              currentValue={aspectRatio}
              onClick={setAspectRatio}
              disabled={disabled}
            />
            <SelectButton<AspectRatio>
              label="9:16"
              value={AspectRatio.NineSixteen}
              currentValue={aspectRatio}
              onClick={setAspectRatio}
              disabled={disabled}
            />
          </div>
        </div>
        <div>
          <span className="block text-sm font-medium text-slate-300 mb-2">Resolution</span>
          <div className="flex gap-2">
             <SelectButton<Resolution>
              label="720p"
              value={Resolution.HD720p}
              currentValue={resolution}
              onClick={setResolution}
              disabled={disabled}
            />
            <SelectButton<Resolution>
              label="1080p"
              value={Resolution.FullHD1080p}
              currentValue={resolution}
              onClick={setResolution}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
      
      <div>
        <ToggleSwitch
          label="Enable Sound"
          enabled={soundEnabled}
          onChange={setSoundEnabled}
          disabled={disabled}
        />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      
      <button
        type="submit"
        disabled={disabled || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform active:scale-95"
      >
        <SparklesIcon className="w-5 h-5" />
        {disabled ? 'Generating...' : 'Generate Video'}
      </button>
    </form>
  );
};
