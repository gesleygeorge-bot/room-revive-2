import type { Makeover, StyleId } from '@/types';
import { GENERATED_BY_STYLE, MOCK_GALLERY, SAMPLE_ORIGINAL } from './mockData';

/**
 * Makeover service — currently backed by localStorage + mock data.
 *
 * The public API (generateMakeover, listMakeovers, getMakeover, deleteMakeover)
 * mirrors what the Supabase storage + edge-function integration will provide,
 * so only this file changes when wiring up the real backend:
 *
 *   - generateMakeover → upload to Storage, invoke the generation edge function
 *   - listMakeovers    → select from the `makeovers` table
 *   - save/delete      → insert / delete on the `makeovers` table
 */

const STORAGE_KEY = 'aim_makeovers';

type Listener = () => void;
const listeners = new Set<Listener>();

function uid(): string {
  return crypto.randomUUID();
}

function load(): Makeover[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Makeover[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list: Makeover[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  listeners.forEach((fn) => fn());
}

function emit() {
  listeners.forEach((fn) => fn());
}

export function onMakeoversChange(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function listMakeovers(userId: string): Makeover[] {
  const local = load().filter((m) => m.userId === userId);
  // Seed the gallery with mock entries the first time a user visits.
  if (local.length === 0 && MOCK_GALLERY.length > 0) {
    const seeded = MOCK_GALLERY.map((m) => ({ ...m, userId }));
    save(seeded);
    return seeded;
  }
  return local.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getMakeover(userId: string, id: string): Makeover | undefined {
  return load().find((m) => m.userId === userId && m.id === id);
}

export async function generateMakeover(
  userId: string,
  originalImage: string,
  style: StyleId,
  title: string
): Promise<Makeover> {
  // Simulate generation time for the loading state.
  await new Promise((r) => setTimeout(r, 2600));

  const makeover: Makeover = {
    id: uid(),
    userId,
    style,
    originalImage: originalImage || SAMPLE_ORIGINAL,
    generatedImage: GENERATED_BY_STYLE[style] ?? SAMPLE_ORIGINAL,
    title: title || `${style[0].toUpperCase()}${style.slice(1)} makeover`,
    createdAt: new Date().toISOString(),
  };

  const list = load();
  list.push(makeover);
  save(list);
  emit();
  return makeover;
}

export async function deleteMakeover(userId: string, id: string): Promise<void> {
  const list = load().filter((m) => !(m.userId === userId && m.id === id));
  save(list);
  emit();
}
