import { APP_NAME } from '@/lib/constants';

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen flex flex-col items-center justify-center bg-white"
    >
      <h1 className="text-4xl font-bold tracking-tight">
        {APP_NAME}
      </h1>
      <p className="mt-2 text-gray-500 text-sm">
        Build better habits, one day at a time.
      </p>
    </div>
  );
}