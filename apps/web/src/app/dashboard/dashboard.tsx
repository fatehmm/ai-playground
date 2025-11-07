'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import { useApiKeys } from '@/components/api-keys-provider';
import { Response } from '@/components/response';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { authClient } from '@/lib/auth-client';
import {
  PROVIDERS,
  describeSelection,
  getModelOptions,
  parseModelValue,
  type ProviderId,
  type ProviderModelSelection,
} from '@/lib/model-providers';
import { useQuery } from '@tanstack/react-query';
import { Download, Expand, Loader2 } from 'lucide-react';

import { trpc } from '@/utils/trpc';
import { toast } from 'sonner';

interface StudioResultItem {
  providerId: ProviderId;
  modelId: string;
  output: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
}

export default function Dashboard({ session }: { session: typeof authClient.$Infer.Session }) {
  const privateData = useQuery(trpc.privateData.queryOptions());
  const { apiKeys, isLoading, setKey } = useApiKeys();
  const [systemPrompt, setSystemPrompt] = useState('You are an expert AI assistant.');
  const [userPrompt, setUserPrompt] = useState('');
  const modelOptions = useMemo(() => getModelOptions(), []);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isRunningStudio, setIsRunningStudio] = useState(false);
  const [studioResults, setStudioResults] = useState<StudioResultItem[]>([]);
  const [queuedSelections, setQueuedSelections] = useState<ProviderModelSelection[]>([]);
  const [missingProviders, setMissingProviders] = useState<ProviderId[]>([]);
  const [pendingKeys, setPendingKeys] = useState<Partial<Record<ProviderId, string>>>({});
  const [isKeyDialogOpen, setIsKeyDialogOpen] = useState(false);
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

  const executeStudio = useCallback(
    async (
      selections: ProviderModelSelection[],
      providedKeys?: Partial<Record<ProviderId, string>>
    ) => {
      if (selections.length === 0) {
        toast.error('Select at least one model.');
        return;
      }

      const providerKeyMap = selections.reduce<Partial<Record<ProviderId, string>>>((acc, item) => {
        const key = (providedKeys ?? apiKeys)[item.providerId];
        if (key) {
          acc[item.providerId] = key;
        }
        return acc;
      }, {});

      const missing = selections
        .map((item) => item.providerId)
        .filter((providerId, index, array) => array.indexOf(providerId) === index)
        .filter((providerId) => !providerKeyMap[providerId]);

      if (missing.length > 0) {
        setQueuedSelections(selections);
        setMissingProviders(missing);
        setPendingKeys((current) => {
          const next = { ...current };
          missing.forEach((providerId) => {
            next[providerId] = providedKeys?.[providerId] ?? '';
          });
          return next;
        });
        setIsKeyDialogOpen(true);
        toast.info('Add API keys for the selected providers to continue.');
        return;
      }

      setIsRunningStudio(true);
      try {
        const response = await fetch('/api/studio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemPrompt,
            userPrompt,
            selections,
            providerKeys: providerKeyMap,
          }),
        });

        if (!response.ok) {
          const errorPayload = await response.json().catch(() => undefined);
          throw new Error(errorPayload?.message ?? 'Failed to run studio');
        }

        const payload = (await response.json()) as { results?: StudioResultItem[] };
        setStudioResults(payload.results ?? []);
        setQueuedSelections([]);
        toast.success('Studio run completed.');
      } catch (error) {
        console.error(error);
        toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
      } finally {
        setIsRunningStudio(false);
      }
    },
    [apiKeys, systemPrompt, userPrompt]
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
    if (isLoading) {
      toast.info('Loading your saved API keys. Try again in a moment.');
      return;
    }

    if (modelSelections.length === 0) {
      toast.error('Select at least one model before running the studio.');
      return;
    }

    setQueuedSelections(modelSelections);
    executeStudio(modelSelections);
  }, [executeStudio, isLoading, modelSelections]);

  const handleSaveKeys = useCallback(() => {
    if (missingProviders.length === 0) {
      setIsKeyDialogOpen(false);
      return;
    }

    const trimmedEntries = missingProviders.reduce<Partial<Record<ProviderId, string>>>(
      (acc, providerId) => {
        const value = pendingKeys[providerId]?.trim();
        if (value) {
          acc[providerId] = value;
        }
        return acc;
      },
      {}
    );

    const providersWithoutKey = missingProviders.filter(
      (providerId) => !trimmedEntries[providerId]
    );

    if (providersWithoutKey.length > 0) {
      const labels = providersWithoutKey
        .map((providerId) => PROVIDERS.find((item) => item.id === providerId)?.name ?? providerId)
        .join(', ');
      toast.error(`Enter API keys for ${labels}.`);
      return;
    }

    Object.entries(trimmedEntries).forEach(([providerId, key]) => {
      setKey(providerId as ProviderId, key!);
    });

    toast.success('API keys saved.');
    setIsKeyDialogOpen(false);
    setMissingProviders([]);
    setPendingKeys({});

    if (queuedSelections.length > 0) {
      executeStudio(queuedSelections, { ...apiKeys, ...trimmedEntries });
    }
  }, [apiKeys, executeStudio, missingProviders, pendingKeys, queuedSelections, setKey]);

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

  return (
    <div className='space-y-8'>
      <section className='space-y-2'>
        <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
          Welcome, {session.user.name}
        </h1>
        <p className='text-base text-muted-foreground sm:text-lg'>
          Here&apos;s a snapshot of your AI playground activity.
        </p>
      </section>

      <section className='grid gap-6 lg:grid-cols-3'>
        <Card className='lg:col-span-2'>
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
          <CardContent className='space-y-6'>
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
                  : `${modelSelections.length} model${
                      modelSelections.length > 1 ? 's' : ''
                    } selected.`}
              </span>
              <Button
                type='button'
                onClick={handleRunStudio}
                disabled={isRunningStudio || isLoading || modelSelections.length === 0}
              >
                {isRunningStudio && <Loader2 className='mr-2 size-4 animate-spin' />}
                {isRunningStudio ? 'Running...' : 'Run Studio'}
              </Button>
            </div>

            {studioResults.length > 0 && (
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <h3 className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                    Latest Results
                  </h3>
                  <p className='text-sm text-muted-foreground'>
                    Responses are shown per provider with the same system and user prompts.
                  </p>
                </div>
                <div className='space-y-4'>
                  {studioResults.map((result) => {
                    const { providerName, modelLabel } = describeSelection(result);
                    return (
                      <div
                        key={`${result.providerId}:${result.modelId}`}
                        className='space-y-3 rounded-lg border bg-background p-4 shadow-sm'
                      >
                        <div className='flex flex-wrap items-center justify-between gap-3'>
                          <div>
                            <p className='text-sm font-semibold'>{providerName}</p>
                            <p className='text-xs text-muted-foreground'>{modelLabel}</p>
                          </div>
                          {result.usage && (
                            <div className='text-xs text-muted-foreground text-right'>
                              {result.usage.totalTokens && (
                                <div>Total: {result.usage.totalTokens.toLocaleString()} tok</div>
                              )}
                              {result.usage.inputTokens && (
                                <div>Input: {result.usage.inputTokens.toLocaleString()} tok</div>
                              )}
                              {result.usage.outputTokens && (
                                <div>Output: {result.usage.outputTokens.toLocaleString()} tok</div>
                              )}
                            </div>
                          )}
                        </div>
                        <Response>{result.output}</Response>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

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

      <Dialog
        open={isKeyDialogOpen}
        onOpenChange={(open) => {
          setIsKeyDialogOpen(open);
          if (!open) {
            setMissingProviders([]);
            setPendingKeys({});
          }
        }}
      >
        <DialogContent className='max-w-lg space-y-4'>
          <DialogHeader>
            <DialogTitle>Add missing API keys</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>
            Provide API keys for each selected provider so we can forward your prompts securely.
          </p>
          <div className='space-y-4'>
            {missingProviders.map((providerId, index) => {
              const provider = PROVIDERS.find((item) => item.id === providerId);
              const inputId = `api-key-${providerId}`;
              return (
                <div key={providerId} className='space-y-2'>
                  <Label htmlFor={inputId}>{provider?.name ?? providerId}</Label>
                  <Input
                    id={inputId}
                    type='password'
                    value={pendingKeys[providerId] ?? ''}
                    onChange={(event) =>
                      setPendingKeys((current) => ({
                        ...current,
                        [providerId]: event.target.value,
                      }))
                    }
                    placeholder={`Enter ${provider?.name ?? providerId} API key`}
                    autoFocus={index === 0}
                  />
                  {provider?.docsUrl && (
                    <a
                      href={provider.docsUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-xs font-medium text-primary underline underline-offset-2'
                    >
                      Manage keys
                    </a>
                  )}
                </div>
              );
            })}
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={() => setIsKeyDialogOpen(false)}>
              Cancel
            </Button>
            <Button type='button' onClick={handleSaveKeys}>
              Save keys & run
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
