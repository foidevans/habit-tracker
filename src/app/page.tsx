'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SplashScreen from '@/components/shared/SplashScreen';
import { getSession } from '@/lib/storage';
import { ROUTES, SPLASH_DURATION } from '@/lib/constants';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();

    setTimeout(() => {
      if (session) {
        router.push(ROUTES.dashboard);
      } else {
        router.push(ROUTES.login);
      }
    }, SPLASH_DURATION);
  }, [router]);

  return <SplashScreen />;
}