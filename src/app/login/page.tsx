'use client';

import Logo from '@/components/layout/Logo';
import LoginForm from '@/components/auth/LoginForm';
import LoginButton from '@/components/auth/LoginButton';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function LoginPage() {
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/90 p-4">
      <div className="w-full max-w-sm rounded-xl border bg-card shadow-lg p-8">
        <div className="flex flex-col items-center justify-center text-center">
            <Logo />
            <h1 className="mt-8 text-3xl font-bold font-headline leading-9 tracking-tight text-primary">
              Welcome Back
            </h1>
            <p className="mt-2 text-sm leading-6 text-foreground/70">
              Sign in to continue your journey with Emodash.
            </p>
        </div>

        <div className="mt-8">
          <LoginForm />

          <div className="my-6 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs uppercase text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          <LoginButton />
        </div>
        
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="#" className="font-semibold text-primary hover:underline">
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}
