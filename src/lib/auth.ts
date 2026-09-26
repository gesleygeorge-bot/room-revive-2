import type { AuthUser } from '@/types';

/**
 * Auth service — currently backed by an in-memory mock.
 *
 * The public API (signIn, signUp, signOut, getSession, onAuthChange) mirrors
 * Supabase Auth so the implementation can be swapped in one file later:
 *
 *   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
 *
 * without touching any component that imports from here.
 */

type AuthListener = (user: AuthUser | null) => void;

const STORAGE_KEY = 'aim_session';

let currentUser: AuthUser | null = restoreSession();
const listeners = new Set<AuthListener>();

function restoreSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function persist(user: AuthUser | null) {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEY);
}

function emit(user: AuthUser | null) {
  currentUser = user;
  listeners.forEach((fn) => fn(user));
}

function uid(): string {
  return crypto.randomUUID();
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  // Simulate network latency
  await delay(650);

  if (!email || !password) throw new Error('Please enter your email and password.');

  const user: AuthUser = {
    id: uid(),
    email,
    name: email.split('@')[0],
  };
  persist(user);
  emit(user);
  return user;
}

export async function signUp(email: string, password: string): Promise<AuthUser> {
  await delay(750);
  if (!email || password.length < 6)
    throw new Error('Enter a valid email and a password of at least 6 characters.');

  const user: AuthUser = {
    id: uid(),
    email,
    name: email.split('@')[0],
  };
  persist(user);
  emit(user);
  return user;
}

export async function signOut(): Promise<void> {
  await delay(200);
  persist(null);
  emit(null);
}

export function getSession(): AuthUser | null {
  return currentUser;
}

export function onAuthChange(listener: AuthListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
