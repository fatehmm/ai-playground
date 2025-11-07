import Link from 'next/link';

import { StudioCard } from '@/components/studio-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const features = [
  {
    title: 'Multiple models',
    description:
      'Test multiple models in one go. Select from OpenAI, Anthropic, xAI, or Google Gemini.',
    icon: '🧩',
  },
  {
    title: 'Realtime insights',
    description: 'Inspect requests and responses as they stream in the playground.',
    icon: '📡',
  },
  {
    title: 'Download your prompts',
    description: 'Download your prompts as a text file in your computer.',
    icon: '🔃',
  },
] as const;

export default function Home() {
  return (
    <div className='min-h-screen bg-background text-foreground'>
      <main className='mx-auto flex max-w-5xl flex-col gap-20 px-6 py-16 sm:py-20'>
        <section className='flex flex-col items-center gap-6 text-center'>
          <Badge className=' tracking-wide' variant='secondary'>
            Open Source AI Playground
          </Badge>
          <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
            Minimal dashboard for testing scenarios with AI
          </h1>
          <p className='max-w-2xl text-balance text-base text-muted-foreground sm:text-lg'>
            Spin up experiments, test scenarios, and get insights from AI. Free and open source.
            Bring your own key.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-3'>
            <Button asChild size='lg'>
              <Link href='/dashboard'>launch app</Link>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href='/ai'>view docs</Link>
            </Button>
          </div>
        </section>

        <section className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader className='gap-4'>
                <span className='text-3xl' aria-hidden>
                  {feature.icon}
                </span>
                <CardTitle className='text-lg font-medium'>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </section>

        <section className='grid gap-6'>
          <Card>
            <CardHeader className='gap-2'>
              <CardTitle className='text-xl font-medium'>Realtime playground</CardTitle>
              <CardDescription>
                Monitor prompts, responses, and token costs without leaving the flow.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudioCard />
            </CardContent>
          </Card>
        </section>
      </main>

      <section className='mx-auto flex max-w-5xl flex-col gap-2 px-6 py-16 sm:py-20'>
        <strong className='text-2xl font-semibold'>Proudly Open Source</strong>
        <p>This project is open source and free to use. You can find the source code on GitHub.</p>
      </section>

      <footer className='mt-10 px-6'>
        <Separator />
        <div className='mx-auto flex max-w-5xl flex-col gap-2 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
          <span>© 2025 ai playground.</span>
          <span>crafted with bun + next.js.</span>
        </div>
      </footer>
    </div>
  );
}
