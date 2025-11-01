

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Logo from './Logo';
import { cn } from '@/lib/utils';
import { User as UserIcon, LogOut } from 'lucide-react';
import ChatBubble from '../chat/ChatBubble';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/settings', label: 'Profile' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { userProfile, logout } = useAuth();
  const pathname = usePathname();
  const userInitial = userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || 'U';

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-4 z-50 mx-4">
        <div className="container flex h-16 items-center rounded-2xl border bg-card/60 backdrop-blur-xl shadow-lg">
          <div className="mr-auto ml-4">
            <Logo />
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium mr-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary font-semibold' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary/50 transition-colors">
                    <AvatarImage src={userProfile?.photoURL || undefined} alt={userProfile?.displayName || 'User'} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitial.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userProfile?.displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="container pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <ChatBubble />
    </div>
  );
}
