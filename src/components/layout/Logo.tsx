
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-foreground", className)}>
      <Heart className="h-6 w-6 text-red-500" />
      <span className="text-xl font-bold tracking-tight">
        Emodash
      </span>
    </Link>
  );
}
