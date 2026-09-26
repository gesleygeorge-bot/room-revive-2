import { useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

interface ImageCompareProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ImageCompare({
  before,
  after,
  beforeLabel = 'Original',
  afterLabel = 'Makeover',
}: ImageCompareProps) {
  const [pos, setPos] = useState(50);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-sand-200 bg-sand-100 select-none">
      {/* After (full) */}
      <img
        src={after}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <span className="absolute right-3 top-3 rounded-full bg-sand-900/85 px-3 py-1 text-xs font-semibold text-sand-50 backdrop-blur">
        {afterLabel}
      </span>

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <img
          src={before}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }}
          draggable={false}
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-sand-900 backdrop-blur">
          {beforeLabel}
        </span>
      </div>

      {/* Slider handle */}
      <div
        className="absolute inset-y-0 z-10 flex items-center"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="h-full w-0.5 bg-white/90 shadow-md" />
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-sand-900 bg-white shadow-lift">
          <MoveHorizontal className="h-5 w-5 text-sand-900" />
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Compare slider"
      />
    </div>
  );
}
