'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  describeSelection,
  getModelOptions,
  parseModelValue,
  type ProviderModelSelection,
} from '@/lib/model-providers';
import { Download, Expand } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { toast } from 'sonner';

interface StudioCardProps {
  showCardWrapper?: boolean;
}

export function StudioCard({ showCardWrapper = false }: StudioCardProps) {
  const router = useRouter();
  const [systemPrompt, setSystemPrompt] = useState('You are an expert AI assistant.');
  const [userPrompt, setUserPrompt] = useState('');
  const modelOptions = useMemo(() => getModelOptions(), []);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [activePrompt, setActivePrompt] = useState<'system' | 'user' | null>(null);
  const previousPromptRef = useRef<string>('');

  const modelSelections = useMemo(
    () =>
      selectedModels
        .map((value) => parseModelValue(value))
        .filter((selection): selection is ProviderModelSelection => Boolean(selection)),
    [selectedModels]
  );

  const selectionSummaries = useMemo(
    () =>
      modelSelections.map((selection) => {
        const { providerName, modelLabel } = describeSelection(selection);
        return `${providerName} · ${modelLabel}`;
      }),
    [modelSelections]
  );

  const handleDownload = useCallback(() => {
    const promptDocument = [
      `<system-prompt>${systemPrompt}</system-prompt>`,
      '',
      `<user-prompt>${userPrompt}</user-prompt>`,
      '',
      `<models>${selectionSummaries.length > 0 ? selectionSummaries.join(', ') : 'none'}</models>`,
    ].join('\n');

    const blob = new Blob([promptDocument], { type: 'text/plain;charset=utf-8' });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `ai-playground-studio-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  }, [selectionSummaries, systemPrompt, userPrompt]);

  const handleRunStudio = useCallback(() => {
    if (modelSelections.length === 0) {
      toast.error('Select at least one model before running the studio.');
      return;
    }

    toast.success('How easy was that? Now sign in to get started!', {
      duration: 4000,
    });
    setTimeout(() => {
      router.push('/login');
    }, 1500);
  }, [modelSelections.length, router]);

  const handleOpenFullscreen = useCallback(
    (type: 'system' | 'user') => {
      previousPromptRef.current = type === 'system' ? systemPrompt : userPrompt;
      setActivePrompt(type);
    },
    [systemPrompt, userPrompt]
  );

  const handleRevertPrompt = useCallback(() => {
    if (activePrompt === 'system') {
      setSystemPrompt(previousPromptRef.current);
    }
    if (activePrompt === 'user') {
      setUserPrompt(previousPromptRef.current);
    }
  }, [activePrompt]);

  const formContent = (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between gap-2'>
            <Label htmlFor='system-prompt'>System Prompt</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  size='icon-sm'
                  variant='ghost'
                  className='cursor-pointer'
                  onClick={() => handleOpenFullscreen('system')}
                  aria-label='Expand system prompt'
                >
                  <Expand className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open fullscreen editor</TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id='system-prompt'
            value={systemPrompt}
            onChange={(event) => setSystemPrompt(event.target.value)}
            placeholder='Define the assistant persona and constraints.'
            rows={6}
          />
        </div>
        <div className='space-y-2'>
          <div className='flex items-center justify-between gap-2'>
            <Label htmlFor='user-prompt'>User Prompt</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  size='icon-sm'
                  variant='ghost'
                  className='cursor-pointer'
                  onClick={() => handleOpenFullscreen('user')}
                  aria-label='Expand user prompt'
                >
                  <Expand className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Open fullscreen editor</TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id='user-prompt'
            value={userPrompt}
            className='font-mono'
            onChange={(event) => setUserPrompt(event.target.value)}
            placeholder='Describe what you want the model to accomplish.'
            rows={6}
          />
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='model-select'>Target Models</Label>
          <MultiSelect
            options={modelOptions}
            selected={selectedModels}
            onChange={setSelectedModels}
            placeholder='Select target models'
            className='w-full'
          />
          <p className='text-xs text-muted-foreground'>
            Select one or more models from OpenAI, Anthropic, xAI, or Google Gemini.
          </p>
        </div>
        <div className='space-y-2'>
          <Label>Selection Summary</Label>
          <div className='rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground'>
            {selectionSummaries.length === 0 ? (
              <span>No models selected.</span>
            ) : (
              <ul className='space-y-1'>
                {selectionSummaries.map((summary) => (
                  <li key={summary}>{summary}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-wrap items-center justify-end gap-3'>
        <span className='text-sm text-muted-foreground'>
          {modelSelections.length === 0
            ? 'Choose at least one model to enable the run.'
            : `${modelSelections.length} model${modelSelections.length > 1 ? 's' : ''} selected.`}
        </span>
        <Button type='button' onClick={handleRunStudio} disabled={modelSelections.length === 0}>
          Run Studio
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {showCardWrapper ? (
        <Card>
          <CardHeader>
            <div className='flex items-start justify-between gap-4'>
              <div className='space-y-1'>
                <CardTitle>AI Playground Studio</CardTitle>
                <CardDescription>
                  Draft system context, prompts, and run them across multiple model providers in one
                  click.
                </CardDescription>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type='button'
                    size='icon'
                    variant='outline'
                    aria-label='Download prompt'
                    onClick={handleDownload}
                  >
                    <Download className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='left'>Download the prompt</TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>{formContent}</CardContent>
        </Card>
      ) : (
        formContent
      )}

      <Dialog open={activePrompt !== null} onOpenChange={(open) => !open && setActivePrompt(null)}>
        <DialogContent className='max-w-4xl space-y-4 sm:max-w-5xl'>
          <DialogHeader>
            <DialogTitle>{activePrompt === 'system' ? 'System Prompt' : 'User Prompt'}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={activePrompt === 'system' ? systemPrompt : userPrompt}
            onChange={(event) => {
              if (activePrompt === 'system') {
                setSystemPrompt(event.target.value);
              }
              if (activePrompt === 'user') {
                setUserPrompt(event.target.value);
              }
            }}
            className='h-[60vh] min-h-[400px] font-mono'
            autoFocus
          />
          <div className='flex flex-wrap items-center justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={handleRevertPrompt}
              disabled={!activePrompt}
            >
              Revert to previous
            </Button>
            <Button type='button' onClick={() => setActivePrompt(null)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
