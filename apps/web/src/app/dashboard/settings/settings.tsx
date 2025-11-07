'use client';

import { useEffect, useMemo, useState } from 'react';

import { useApiKeys } from '@/components/api-keys-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PROVIDERS, type ProviderId } from '@/lib/model-providers';
import { toast } from 'sonner';

export default function Settings() {
	const { apiKeys, isLoading, setKey, deleteKey } = useApiKeys();
	const [formValues, setFormValues] = useState<Partial<Record<ProviderId, string>>>({});

	useEffect(() => {
		setFormValues((current) => {
			const next = { ...current };
			for (const provider of PROVIDERS) {
				next[provider.id] = apiKeys[provider.id] ?? '';
			}
			return next;
		});
	}, [apiKeys]);

	const connectedProviders = useMemo(
		() =>
			Object.entries(apiKeys).filter(([, value]) => typeof value === 'string' && value.trim().length > 0).length,
		[apiKeys]
	);

	const handleSave = (providerId: ProviderId) => {
		const value = formValues[providerId]?.trim() ?? '';
		if (value.length === 0) {
			toast.error('Enter an API key before saving.');
			return;
		}
		setKey(providerId, value);
		toast.success('API key saved.');
	};

	const handleDelete = (providerId: ProviderId) => {
		deleteKey(providerId);
		setFormValues((current) => ({ ...current, [providerId]: '' }));
		toast.success('API key removed.');
	};

	return (
		<div className='space-y-8'>
			<header className='space-y-2'>
				<h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>API Keys</h1>
				<p className='text-base text-muted-foreground sm:text-lg'>
					Manage credentials for each provider used in AI Playground Studio.
				</p>
				<p className='text-sm text-muted-foreground'>
					{isLoading ? 'Loading saved keys…' : `${connectedProviders} provider${connectedProviders === 1 ? '' : 's'} connected.`}
				</p>
			</header>

			<div className='grid gap-6 lg:grid-cols-2'>
				{PROVIDERS.map((provider) => {
					const value = formValues[provider.id] ?? '';
					const isConfigured = Boolean(apiKeys[provider.id]);
					const maskedValue = isConfigured ? `${value.slice(0, 4)}••••${value.slice(-4)}` : '—';

					return (
						<Card key={provider.id} className='flex flex-col'>
							<CardHeader>
								<div className='flex items-start justify-between gap-4'>
									<div className='space-y-1'>
										<CardTitle className='text-xl'>{provider.name}</CardTitle>
										<CardDescription>{provider.apiKeyLabel}</CardDescription>
									</div>
									<Badge variant={isConfigured ? 'default' : 'secondary'}>
										{isConfigured ? 'Connected' : 'Not connected'}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className='flex flex-1 flex-col gap-4'>
								<div className='space-y-2'>
									<Label htmlFor={`api-key-${provider.id}`}>API Key</Label>
									<Input
										id={`api-key-${provider.id}`}
										type='password'
										value={value}
										onChange={(event) =>
											setFormValues((current) => ({
												...current,
												[provider.id]: event.target.value,
											}))
										}
										placeholder={`Paste your ${provider.name} API key`}
										autoComplete='off'
									/>
									{provider.docsUrl && (
										<a
											href={provider.docsUrl}
											target='_blank'
											rel='noopener noreferrer'
											className='text-xs font-medium text-primary underline underline-offset-2'
										>
											Visit provider console
										</a>
									)}
								</div>
								<div className='space-y-1 text-sm text-muted-foreground'>
									<p>Stored locally in your browser with localStorage.</p>
									<p>Current key preview: {maskedValue}</p>
								</div>
								<div className='flex flex-wrap items-center gap-2'>
									<Button type='button' onClick={() => handleSave(provider.id)}>
										Save
									</Button>
									<Button
										type='button'
										variant='outline'
										disabled={!isConfigured && value.trim().length === 0}
										onClick={() => handleDelete(provider.id)}
									>
										Remove
									</Button>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

