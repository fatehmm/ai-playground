'use client';
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import UserMenu from './user-menu';

const links = [{ to: '/', label: 'Home' }] as const;

export default function Header() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className='border-b'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-6'>
          <Link href='/' className='text-lg font-semibold tracking-tight text-foreground'>
            ai playground
          </Link>
          <nav className='hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex'>
            {links.map(({ to, label }) => (
              <Link key={to} href={to} className='transition-colors hover:text-foreground'>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className='flex items-center gap-3'>
          <ModeToggle />
          {isPending ? (
            <>
              <Skeleton className='h-9 w-28' />
              <Skeleton className='h-9 w-24' />
            </>
          ) : (
            <>
              <Button asChild>
                <Link href={session ? '/dashboard' : '/login'}>
                  {session ? 'Dashboard' : 'Get Started'}
                </Link>
              </Button>
              <UserMenu session={session ?? null} />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
