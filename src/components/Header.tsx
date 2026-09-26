import { LogOut, Sparkles } from 'lucide-react';
import type { AuthUser } from '@/types';

interface HeaderProps {
  user: AuthUser | null;
  current: string;
  onNavigate: (route: string) => void;
  onSignOut: () => void;
}

const NAV = [
  { route: 'create', label: 'Create' },
  { route: 'gallery', label: 'My Gallery' },
];

export function Header({ user, current, onNavigate, onSignOut }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200/70 bg-sand-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={() => onNavigate(user ? 'create' : 'signin')}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-900 text-sand-50">
            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="font-serif text-lg font-600 tracking-tight text-sand-900">
            Room Revive
          </span>
        </button>

        {user && (
          <nav className="hidden items-center gap-1 sm:flex">
            {NAV.map((item) => (
              <button
                key={item.route}
                onClick={() => onNavigate(item.route)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  current === item.route
                    ? 'bg-sand-900 text-sand-50'
                    : 'text-sand-600 hover:bg-sand-100 hover:text-sand-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-sand-500 sm:inline">
                {user.name}
              </span>
              <button
                onClick={onSignOut}
                className="btn-ghost"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </>
          ) : (
            <button onClick={() => onNavigate('signin')} className="btn-ghost">
              Sign in
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {user && (
        <nav className="flex items-center gap-1 border-t border-sand-200/70 px-4 py-2 sm:hidden">
          {NAV.map((item) => (
            <button
              key={item.route}
              onClick={() => onNavigate(item.route)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                current === item.route
                  ? 'bg-sand-900 text-sand-50'
                  : 'text-sand-600 hover:bg-sand-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
