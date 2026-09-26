import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { ImageCompare } from '@/components/ImageCompare';
import { useAuth } from '@/hooks/useAuth';
import { SignInScreen } from '@/screens/SignInScreen';
import { CreateScreen } from '@/screens/CreateScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { GalleryScreen } from '@/screens/GalleryScreen';
import { generateMakeover } from '@/lib/makeovers';
import { getStyle } from '@/lib/styles';
import type { Makeover, StyleId } from '@/types';

type Route = 'signin' | 'create' | 'result' | 'gallery' | 'detail';

interface PendingGeneration {
  originalImage: string;
  style: StyleId;
  title: string;
}

interface DetailView {
  makeover: Makeover;
}

export default function App() {
  const { user, signOut } = useAuth();
  const [route, setRoute] = useState<Route>('signin');
  const [pending, setPending] = useState<PendingGeneration | null>(null);
  const [detail, setDetail] = useState<DetailView | null>(null);

  // Auth guard: redirect based on sign-in state.
  useEffect(() => {
    if (user && (route === 'signin')) {
      setRoute('create');
    }
    if (!user && route !== 'signin') {
      setRoute('signin');
    }
  }, [user, route]);

  function navigate(to: string) {
    setRoute(to as Route);
  }

  function handleSignOut() {
    signOut();
    setRoute('signin');
    setPending(null);
    setDetail(null);
  }

  function handleGenerate(originalImage: string, style: StyleId, title: string) {
    setPending({ originalImage, style, title });
    setRoute('result');
  }

  function handleViewMakeover(m: Makeover) {
    setDetail({ makeover: m });
    setRoute('detail');
  }

  // Not signed in → sign-in screen (no header).
  if (!user) {
    return <SignInScreen onSuccess={() => setRoute('create')} />;
  }

  return (
    <div className="min-h-screen bg-sand-50">
      <Header user={user} current={route} onNavigate={navigate} onSignOut={handleSignOut} />

      <main>
        {route === 'signin' && <SignInScreen onSuccess={() => setRoute('create')} />}

        {route === 'create' && (
          <CreateScreen userId={user.id} onGenerate={handleGenerate} />
        )}

        {route === 'result' && pending && (
          <ResultScreen
            userId={user.id}
            originalImage={pending.originalImage}
            style={pending.style}
            title={pending.title}
            onBack={() => setRoute('create')}
            onGoGallery={() => setRoute('gallery')}
            generateFn={generateMakeover}
          />
        )}

        {route === 'gallery' && (
          <GalleryScreen
            userId={user.id}
            onCreate={() => setRoute('create')}
            onView={handleViewMakeover}
          />
        )}

        {route === 'detail' && detail && (
          <DetailView
            makeover={detail.makeover}
            onBack={() => setRoute('gallery')}
          />
        )}
      </main>

      <footer className="border-t border-sand-200/70 py-6">
        <p className="text-center text-xs text-sand-400">
          Room Revive — a design concept using mock data.
        </p>
      </footer>
    </div>
  );
}

function DetailView({
  makeover,
  onBack,
}: {
  makeover: Makeover;
  onBack: () => void;
}) {
  const styleInfo = getStyle(makeover.style);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <button
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-sand-500 transition-colors hover:text-sand-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to gallery
      </button>

      <div className="animate-scale-in">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-xs font-semibold text-sage-700">
          {styleInfo?.name} style
        </span>
        <h1 className="mt-3 font-serif text-3xl font-600 tracking-tight text-sand-900 sm:text-4xl">
          {makeover.title}
        </h1>

        <div className="mt-6">
          <ImageCompare
            before={makeover.originalImage}
            after={makeover.generatedImage}
          />
        </div>

        <p className="mt-4 text-center text-sm text-sand-400">
          Drag the handle to compare your before and after
        </p>
      </div>
    </div>
  );
}
