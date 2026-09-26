import type { Makeover } from '@/types';

// Placeholder "generated" results — one per style. These stand in for the
// generation function until the Supabase edge function is connected.
export const GENERATED_BY_STYLE: Record<string, string> = {
  modern:
    'https://images.pexels.com/photos/7546648/pexels-photo-7546648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  minimalist:
    'https://images.pexels.com/photos/29012619/pexels-photo-29012619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  traditional:
    'https://images.pexels.com/photos/14714646/pexels-photo-14714646.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

// A sample "before" photo used when the user hasn't uploaded one yet.
export const SAMPLE_ORIGINAL =
  'https://images.pexels.com/photos/4857775/pexels-photo-4857775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export const MOCK_GALLERY: Makeover[] = [
  {
    id: 'mock-1',
    userId: 'demo-user',
    style: 'modern',
    originalImage:
      'https://images.pexels.com/photos/4857775/pexels-photo-4857775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    generatedImage:
      'https://images.pexels.com/photos/7546648/pexels-photo-7546648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'Open-plan refresh',
    createdAt: '2026-09-20T10:00:00.000Z',
  },
  {
    id: 'mock-2',
    userId: 'demo-user',
    style: 'minimalist',
    originalImage:
      'https://images.pexels.com/photos/1239298/pexels-photo-1239298.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    generatedImage:
      'https://images.pexels.com/photos/29012619/pexels-photo-29012619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'Quiet light',
    createdAt: '2026-09-18T14:30:00.000Z',
  },
  {
    id: 'mock-3',
    userId: 'demo-user',
    style: 'traditional',
    originalImage:
      'https://images.pexels.com/photos/4469171/pexels-photo-4469171.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    generatedImage:
      'https://images.pexels.com/photos/14714646/pexels-photo-14714646.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    title: 'Reading nook',
    createdAt: '2026-09-15T09:15:00.000Z',
  },
];
