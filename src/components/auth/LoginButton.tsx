
'use client';

import { useAuth } from '@/hooks/use-auth.tsx';
import { Button } from '@/components/ui/button';

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.18-1.89-6.03-4.43H2.39v2.84C4.26 20.98 7.89 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.97 14.05c-.13-.4-.2-.81-.2-1.24s.07-.84.2-1.24V8.73H2.39c-.77 1.53-1.19 3.24-1.19 5.02s.42 3.49 1.19 5.02l3.58-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.89 1 4.26 3.02 2.39 6.22l3.58 2.84C6.82 6.73 9.2 5.38 12 5.38z"
      fill="#EA4335"
    />
  </svg>
);

export default function LoginButton() {
  const { signInWithGoogle } = useAuth();

  return (
    <Button variant="outline" className="w-full" onClick={signInWithGoogle}>
      <GoogleIcon />
      <span className="ml-3">Sign in with Google</span>
    </Button>
  );
}
