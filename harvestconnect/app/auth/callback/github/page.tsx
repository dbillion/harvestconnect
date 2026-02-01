'use client';

import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/api-client';

// Opt out of static generation to avoid useSearchParams issues
export const dynamic = 'force-dynamic';

export default function GithubCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      apiClient.githubLogin(code)
        .then(() => {
          router.push('/dashboard');
        })
        .catch((err) => {
          console.error('GitHub login failed:', err);
          setError('Authentication failed. Please try again.');
        });
    } else {
      setError('No authorization code found.');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {error ? (
          <div className="text-red-500 font-bold mb-4">{error}</div>
        ) : (
          <>
            <Loader2 className="animate-spin size-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-black uppercase tracking-[0.2em]">Authenticating GitHub...</h1>
            <p className="text-muted-foreground mt-2">Finalizing your secure session</p>
          </>
        )}
      </div>
    </div>
  );
}
