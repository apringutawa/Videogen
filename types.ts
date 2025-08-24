export enum AspectRatio {
  SixteenNine = '16:9',
  NineSixteen = '9:16',
}

export enum Resolution {
  HD720p = '720p',
  FullHD1080p = '1080p',
}

export interface ImageFile {
  mimeType: string;
  data: string; // base64 encoded string
  previewUrl: string; // Object URL for UI preview
}

export interface GenerateVideoParams {
  prompt: string;
  image?: ImageFile;
  aspectRatio: AspectRatio;
  resolution: Resolution;
  soundEnabled: boolean;
}
