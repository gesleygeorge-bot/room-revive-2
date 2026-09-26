import { useEffect, useState } from 'react';
import { Sparkles, Save, ArrowLeft, Check } from 'lucide-react';
import { ImageCompare } from '@/components/ImageCompare';
import { getStyle } from '@/lib/styles';
import type { Makeover, StyleId } from '@/types';

interface ResultScreenProps {
  userId: string;
  originalImage: string;
  style: StyleId;
  title: string;
  onBack: () => void;
  onGoGallery: () => void;
  // Injected so the real Supabase generate call can replace the mock later.
  generateFn: (
    userId: string,
    originalImage: string,
    style: StyleId,
    title: string
  ) => Promise<Makeover>;
}

const STEPS = [
  'Analyzing your room…',
  'Understanding layout & lighting…',
  'Applying your chosen style…',
  'Rendering the new design…',
];

export function ResultScreen({
  userId,
  originalImage,
  style,
  title,
  onBack,
  onGoGallery,
  generateFn,
}: ResultScreenProps) {
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');
  const [stepIdx, setStepIdx] = useState(0);
  const [makeover, setMakeover] = useState<Makeover | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const styleInfo = getStyle(style);

  useEffect(() => {
    let cancelled = false;
    const stepTimer = setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
    }, 700);

    generateFn(userId, originalImage, style, title)
      .then((m) => {
        if (!cancelled) {
          setMakeover(m);
          setSaved(true); // mock generate already persists
          setPhase('done');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Generation failed. Please try again.'
          );
        }
      })
      .finally(() => clearInterval(stepTimer));

    return () => {
      cancelled = true;
      clearInterval(stepTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="font-serif text-2xl text-sand-900">Something went wrong</p>
        <p className="mt-2 text-sm text-sand-500">{error}</p>
        <button onClick={onBack} className="btn-secondary mt-6">
          <ArrowLeft className="h-4 w-4" /> Back to create
        </button>
      </div>
    );
  }

  if (phase === 'loading') {
    return <LoadingView stepIdx={stepIdx} styleName={styleInfo?.name ?? ''} />;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-sand-500 transition-colors hover:text-sand-900"
      >
        <ArrowLeft className="h-4 w-4" /> Create another
      </button>

      <div className="animate-scale-in">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-700">
              <Sparkles className="h-3.5 w-3.5" /> {styleInfo?.name} style
            </span>
            <h1 className="mt-3 font-serif text-3xl font-600 tracking-tight text-sand-900 sm:text-4xl">
              {makeover?.title ?? title}
            </h1>
          </div>
          {saved && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-900 px-3 py-1.5 text-xs font-semibold text-sand-50">
              <Check className="h-3.5 w-3.5" /> Saved to your gallery
            </span>
          )}
        </div>

        <div className="mt-6">
          <ImageCompare before={originalImage} after={makeover?.generatedImage ?? ''} />
        </div>

        <p className="mt-4 text-center text-sm text-sand-400">
          Drag the handle to compare your before and after
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button onClick={onGoGallery} className="btn-primary w-full sm:w-auto">
            <Save className="h-4 w-4" /> View in gallery
          </button>
          <button onClick={onBack} className="btn-secondary w-full sm:w-auto">
            Create another
          </button>
        </div>
      </div>
    </div>
  );
}

function LoadingView({ stepIdx, styleName }: { stepIdx: number; styleName: string }) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Animated room illustration */}
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 animate-pulse rounded-full bg-clay-100 blur-2xl" />
          <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-sand-200 bg-white shadow-lift">
            <div className="animate-float">
              <Sparkles className="h-12 w-12 text-sand-700" strokeWidth={1.5} />
            </div>
          </div>
          <div className="absolute -inset-2 animate-spin rounded-full border-2 border-sand-200 border-t-sand-900" style={{ animationDuration: '2s' }} />
        </div>

        <h2 className="mt-8 font-serif text-2xl font-600 text-sand-900">
          Designing your {styleName.toLowerCase()} space
        </h2>
        <p className="mt-2 text-sm text-sand-500">
          This usually takes a few moments.
        </p>

        {/* Progress steps */}
        <div className="mt-8 space-y-2.5 text-left">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ${
                i < stepIdx
                  ? 'bg-sage-50 text-sage-700'
                  : i === stepIdx
                  ? 'bg-sand-100 text-sand-900'
                  : 'text-sand-400'
              }`}
            >
              {i < stepIdx ? (
                <Check className="h-4 w-4 shrink-0 text-sage-600" />
              ) : i === stepIdx ? (
                <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-sand-400 border-t-sand-900" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-sand-200" />
              )}
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


