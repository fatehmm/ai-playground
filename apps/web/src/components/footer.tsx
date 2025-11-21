'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCookieConsent } from '@/hooks/use-cookie-consent';

export default function Footer() {
  const { openConsentBanner } = useCookieConsent();

  return (
    <footer className='mt-10 px-6'>
      <Separator />
      <div className='mx-auto flex max-w-5xl flex-col gap-4 py-8 text-sm text-muted-foreground'>
        {/* Main footer content */}
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <span>
            © 2025 ai playground. project of{' '}
            <a
              className='underline cursor-pointer'
              href='http://zenstad.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              zenstad labs
            </a>
          </span>
          <span>
            crafted with ai sdk + next.js by{' '}
            <a
              className='underline cursor-pointer'
              href='http://fatehmm.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              fatehmm
            </a>
            .
          </span>
        </div>

        {/* Policy links */}
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t pt-4'>
          <div className='flex flex-wrap gap-4'>
            <a href='/privacy-policy' className='hover:underline'>
              Privacy Policy
            </a>
            <Button
              variant='link'
              size='sm'
              onClick={openConsentBanner}
              className='h-auto p-0 text-sm text-muted-foreground hover:underline'
            >
              Your Privacy Choices
            </Button>
          </div>

          <div className='text-xs'>Made with ❤️ for the AI community</div>
        </div>
      </div>
    </footer>
  );
}
