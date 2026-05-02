'use client';

import { useEffect } from 'react';

// Client-side serviceWorker registration loads public/sw.js for offline support.
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Keep app stable if registration fails.
    });
  }, []);

  return null;
}