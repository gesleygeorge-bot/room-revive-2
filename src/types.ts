export type StyleId = 'modern' | 'minimalist' | 'traditional';

export interface MakeoverStyle {
  id: StyleId;
  name: string;
  tagline: string;
  description: string;
  swatch: string; // tailwind gradient classes for the style card
}

export interface Makeover {
  id: string;
  userId: string;
  style: StyleId;
  originalImage: string; // URL or data URL of the uploaded living-room photo
  generatedImage: string; // URL of the AI-generated result
  title: string;
  createdAt: string; // ISO timestamp
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}
