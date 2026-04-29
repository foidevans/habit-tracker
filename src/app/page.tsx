'use client';

import { useEffect, useRef } from 'react';
import SplashScreen from '@/components/shared/SplashScreen';
import { SPLASH_DURATION } from '@/lib/constants';

export default function Home() {
  const redirected = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
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
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen />;
}

// 'use client';

// import { useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import SplashScreen from '@/components/shared/SplashScreen';
// import { ROUTES, SPLASH_DURATION } from '@/lib/constants';

// export default function Home() {
//   const router = useRouter();
//   const redirected = useRef(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (redirected.current) return;
//       redirected.current = true;

//       try {
//         const raw = localStorage.getItem('habit-tracker-session');
//         const session = raw ? JSON.parse(raw) : null;

//         if (session && session.userId) {
//           router.replace(ROUTES.dashboard);
//         } else {
//           router.replace(ROUTES.login);
//         }
//       } catch {
//         router.replace(ROUTES.login);
//       }
//     }, SPLASH_DURATION);

//     return () => clearTimeout(timer);
//   }, [router]);

//   return <SplashScreen />;
// }

// 'use client';

// import { useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import SplashScreen from '@/components/shared/SplashScreen';
// import { ROUTES, SPLASH_DURATION } from '@/lib/constants';

// export default function Home() {
//   const router = useRouter();
//   const redirected = useRef(false);

//   useEffect(() => {
//     console.log('Checking session on splash screen...');
//     const timer = setTimeout(() => {
//       if (redirected.current) return;
//       redirected.current = true;

//       try {
//         const session = localStorage.getItem('habit-tracker-session');
//         const parsed = session ? JSON.parse(session) : null;

//         if (parsed && parsed.userId) {
//           router.push(ROUTES.dashboard);
//         } else {
//           router.push(ROUTES.login);
//         }
//       } catch {
//         router.push(ROUTES.login);
//       }
//     }, SPLASH_DURATION);

//     return () => clearTimeout(timer);
//   }, [router]);

//   return <SplashScreen />;
// }




