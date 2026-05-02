'use client';

import { useEffect, useRef } from 'react';
import SplashScreen from '@/components/shared/SplashScreen';

const SPLASH_DELAY_MS = 1000;

export default function Home() {
  const redirected = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (redirected.current) return;
      redirected.current = true;

      try {
        const raw = localStorage.getItem('habit-tracker-session');
        const session = raw ? JSON.parse(raw) : null;

        if (session && session.userId) {
          window.location.replace('/dashboard');
        } else {
          window.location.replace('/login');
        }
      } catch {
        window.location.replace('/login');
      }
    }, SPLASH_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}