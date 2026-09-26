import { Check } from 'lucide-react';
import type { MakeoverStyle } from '@/types';

interface StyleCardProps {
  style: MakeoverStyle;
  selected: boolean;
  onSelect: () => void;
}

export function StyleCard({ style, selected, onSelect }: StyleCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
        selected
          ? 'border-sand-900 shadow-lift ring-1 ring-sand-900'
          : 'border-sand-200 shadow-soft hover:border-sand-400 hover:shadow-lift'
      }`}
    >
      <div className={`relative h-28 bg-gradient-to-br ${style.swatch}`}>
        <div className="absolute inset-0 flex items-end p-4">
          <div className="flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full border-2 transition-colors ${
                selected
                  ? 'border-sand-50 bg-sand-50'
                  : 'border-sand-300 bg-transparent'
              }`}
            >
              {selected && (
                <Check className="h-full w-full text-sand-900" strokeWidth={4} />
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-600 text-sand-900">{style.name}</h3>
        <p className="mt-0.5 text-xs font-medium text-clay-500">{style.tagline}</p>
        <p className="mt-2 text-sm leading-relaxed text-sand-500">
          {style.description}
        </p>
      </div>
    </button>
  );
}
