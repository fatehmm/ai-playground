import { headers } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { auth } from '@ai-playground/auth';

import Dashboard from './dashboard';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/settings', label: 'Settings' },
] as const;

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col gap-8 px-0.5 py-10 md:flex-row'>
      <aside className='md:w-56'>
        <nav className='hidden flex-col gap-2 md:flex'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(buttonVariants({ variant: 'ghost' }), 'justify-start text-sm')}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className='flex items-center gap-2 overflow-x-auto md:hidden'>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </aside>
      <main className='flex-1'>
        <Dashboard session={session} />
      </main>
    </div>
  );
}
