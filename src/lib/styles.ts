import type { MakeoverStyle } from '@/types';

export const STYLES: MakeoverStyle[] = [
  {
    id: 'modern',
    name: 'Modern',
    tagline: 'Clean lines, bold contrast',
    description:
      'Sleek furniture, geometric shapes, and a confident monochrome palette with metal and glass accents.',
    swatch: 'from-sand-800 to-sand-600',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    tagline: 'Less, but better',
    description:
      'Breathable space, natural light, and a restrained neutral palette. Every piece earns its place.',
    swatch: 'from-sand-200 to-sand-100',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    tagline: 'Warm, classic, timeless',
    description:
      'Rich wood tones, layered textiles, and elegant symmetry for a room that feels gathered and lived-in.',
    swatch: 'from-clay-500 to-clay-300',
  },
];

export function getStyle(id: string): MakeoverStyle | undefined {
  return STYLES.find((s) => s.id === id);
}
