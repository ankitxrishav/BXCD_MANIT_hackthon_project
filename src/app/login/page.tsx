
'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LoginButton from '@/components/auth/LoginButton';
import Logo from '@/components/layout/Logo';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const loginImage = PlaceHolderImages.find(p => p.id === 'login-background');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Logo />
            <h2 className="mt-8 text-2xl md:text-3xl font-bold font-headline leading-9 tracking-tight text-primary">
              Welcome back
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              Sign in to continue your journey with Emodash.
            </p>
          </div>

          <div className="mt-10">
            <div>
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        {loginImage && (
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src={loginImage.imageUrl}
            alt={loginImage.description}
            data-ai-hint={loginImage.imageHint}
            fill
            priority
          />
        )}
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
      </div>
    </div>
  );
}
