import { useCallback, useEffect, useState } from 'react';
import type { AuthUser } from '@/types';
import * as auth from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => auth.getSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthChange(setUser);
    return unsub;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      return await auth.signIn(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      return await auth.signUp(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
  }, []);

  return { user, loading, signIn, signUp, signOut };
}
