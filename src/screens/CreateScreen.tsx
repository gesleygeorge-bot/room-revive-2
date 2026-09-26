import { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Wand2, X } from 'lucide-react';
import { STYLES } from '@/lib/styles';
import { StyleCard } from '@/components/StyleCard';
import type { StyleId } from '@/types';

interface CreateScreenProps {
  userId: string;
  onGenerate: (originalImage: string, style: StyleId, title: string) => void;
}

export function CreateScreen({ onGenerate }: CreateScreenProps) {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [style, setStyle] = useState<StyleId | null>(null);
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function canGenerate() {
    return imagePreview && style;
  }

  function generate() {
    if (!canGenerate()) return;
    onGenerate(imagePreview, style as StyleId, title);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="animate-fade-in">
        <h1 className="font-serif text-3xl font-600 tracking-tight text-sand-900 sm:text-4xl">
          Create a makeover
        </h1>
        <p className="mt-2 text-base text-sand-500">
          Upload a photo of your living room, pick a style, and let AI reimagine the space.
        </p>
      </div>

      {/* Step 1 — Upload */}
      <section className="mt-8 animate-fade-in" style={{ animationDelay: '60ms' }}>
        <StepLabel n={1} label="Upload your living-room photo" />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {imagePreview ? (
          <div className="relative overflow-hidden rounded-2xl border border-sand-200 shadow-soft">
            <img
              src={imagePreview}
              alt="Your living room"
              className="aspect-[4/3] w-full object-cover"
            />
            <button
              onClick={() => {
                setImagePreview('');
                if (fileRef.current) fileRef.current.value = '';
              }}
              className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-sand-900/85 px-3 py-1.5 text-xs font-semibold text-sand-50 backdrop-blur transition-colors hover:bg-sand-900"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex aspect-[4/3] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors ${
              dragging
                ? 'border-sand-900 bg-sand-100'
                : 'border-sand-300 bg-sand-50 hover:border-sand-400 hover:bg-sand-100'
            }`}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand-200 text-sand-600">
              <Upload className="h-6 w-6" />
            </div>
            <p className="mt-4 text-sm font-medium text-sand-700">
              Drag & drop or <span className="text-sand-900 underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-sand-400">PNG or JPG, up to 10 MB</p>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      {/* Step 2 — Style */}
      <section className="mt-8 animate-fade-in" style={{ animationDelay: '120ms' }}>
        <StepLabel n={2} label="Choose a style" />
        <div className="grid gap-4 sm:grid-cols-3">
          {STYLES.map((s) => (
            <StyleCard
              key={s.id}
              style={s}
              selected={style === s.id}
              onSelect={() => setStyle(s.id)}
            />
          ))}
        </div>
      </section>

      {/* Step 3 — Title (optional) */}
      <section className="mt-8 animate-fade-in" style={{ animationDelay: '180ms' }}>
        <StepLabel n={3} label="Name this makeover (optional)" />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sunday living-room refresh"
          className="input-field"
          maxLength={60}
        />
      </section>

      {/* Generate */}
      <div className="mt-10 flex flex-col items-center gap-3 animate-fade-in" style={{ animationDelay: '240ms' }}>
        <button
          onClick={generate}
          disabled={!canGenerate()}
          className="btn-primary w-full sm:w-auto sm:px-10"
        >
          <Wand2 className="h-5 w-5" />
          Generate makeover
        </button>
        {!canGenerate() && (
          <p className="flex items-center gap-1.5 text-sm text-sand-400">
            <ImageIcon className="h-3.5 w-3.5" />
            Upload a photo and pick a style to continue.
          </p>
        )}
      </div>
    </div>
  );
}

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sand-900 text-xs font-bold text-sand-50">
        {n}
      </span>
      <h2 className="font-serif text-lg font-600 text-sand-900">{label}</h2>
    </div>
  );
}
