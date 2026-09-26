import { useEffect, useState } from 'react';
import { Images, ArrowRight, Trash2, Calendar } from 'lucide-react';
import { listMakeovers, deleteMakeover, onMakeoversChange } from '@/lib/makeovers';
import { getStyle } from '@/lib/styles';
import type { Makeover } from '@/types';

interface GalleryScreenProps {
  userId: string;
  onCreate: () => void;
  onView: (makeover: Makeover) => void;
}

export function GalleryScreen({ userId, onCreate, onView }: GalleryScreenProps) {
  const [makeovers, setMakeovers] = useState<Makeover[]>([]);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => setMakeovers(listMakeovers(userId));
    refresh();
    return onMakeoversChange(refresh);
  }, [userId]);

  async function handleDelete(id: string) {
    await deleteMakeover(userId, id);
    setConfirmId(null);
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-in">
        <div>
          <h1 className="font-serif text-3xl font-600 tracking-tight text-sand-900 sm:text-4xl">
            My Gallery
          </h1>
          <p className="mt-2 text-base text-sand-500">
            {makeovers.length} saved {makeovers.length === 1 ? 'makeover' : 'makeovers'}
          </p>
        </div>
        <button onClick={onCreate} className="btn-primary">
          <Images className="h-4 w-4" /> New makeover
        </button>
      </div>

      {makeovers.length === 0 ? (
        <EmptyState onCreate={onCreate} />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {makeovers.map((m, i) => {
            const styleInfo = getStyle(m.style);
            return (
              <div
                key={m.id}
                className="group card overflow-hidden animate-scale-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  onClick={() => onView(m)}
                  className="relative block aspect-[4/3] w-full overflow-hidden"
                >
                  <img
                    src={m.generatedImage}
                    alt={m.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sand-900/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-sand-900 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                    View <ArrowRight className="h-3 w-3" />
                  </span>
                </button>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-serif text-lg font-600 text-sand-900">
                        {m.title}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-sand-500">
                        <span className="rounded-full bg-sand-100 px-2.5 py-0.5 font-medium text-sand-700">
                          {styleInfo?.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {formatDate(m.createdAt)}
                        </span>
                      </div>
                    </div>
                    {confirmId === m.id ? (
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg bg-sand-100 px-2.5 py-1.5 text-xs font-medium text-sand-600 transition-colors hover:bg-sand-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(m.id)}
                        className="shrink-0 rounded-lg p-2 text-sand-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        aria-label="Delete makeover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-sand-300 bg-white/50 py-20 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-100 text-sand-400">
        <Images className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-serif text-xl font-600 text-sand-900">
        No makeovers yet
      </h3>
      <p className="mt-1.5 max-w-xs text-sm text-sand-500">
        Upload a photo of your living room and generate your first Room Revive makeover.
      </p>
      <button onClick={onCreate} className="btn-primary mt-6">
        Create your first makeover
      </button>
    </div>
  );
}
