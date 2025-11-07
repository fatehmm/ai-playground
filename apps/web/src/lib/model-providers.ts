export type ProviderId = "openai" | "anthropic" | "xai" | "gemini";

export interface ModelDescriptor {
	id: string;
	label: string;
	contextWindowTokens?: number;
}

export interface ProviderConfig {
	id: ProviderId;
	name: string;
	apiKeyLabel: string;
	docsUrl: string;
	models: ModelDescriptor[];
}

export const PROVIDERS: ProviderConfig[] = [
	{
		id: "openai",
		name: "OpenAI",
		apiKeyLabel: "OpenAI API Key",
		docsUrl: "https://platform.openai.com/api-keys",
		models: [
			{ id: "gpt-4.1-mini", label: "GPT-4.1 Mini", contextWindowTokens: 128000 },
			{ id: "gpt-4.1", label: "GPT-4.1", contextWindowTokens: 128000 },
			{ id: "o4-mini", label: "o4 Mini", contextWindowTokens: 200000 },
		],
	},
	{
		id: "anthropic",
		name: "Anthropic",
		apiKeyLabel: "Anthropic API Key",
		docsUrl: "https://console.anthropic.com/settings/keys",
		models: [
			{ id: "claude-3-5-sonnet-latest", label: "Claude 3.5 Sonnet", contextWindowTokens: 200000 },
			{ id: "claude-3-opus-latest", label: "Claude 3 Opus", contextWindowTokens: 200000 },
			{ id: "claude-3-haiku-20240307", label: "Claude 3 Haiku", contextWindowTokens: 200000 },
		],
	},
	{
		id: "xai",
		name: "xAI",
		apiKeyLabel: "xAI API Key",
		docsUrl: "https://console.x.ai/api-keys",
		models: [
			{ id: "grok-3", label: "Grok 3", contextWindowTokens: 131072 },
			{ id: "grok-3-mini", label: "Grok 3 Mini", contextWindowTokens: 131072 },
		],
	},
	{
		id: "gemini",
		name: "Google Gemini",
		apiKeyLabel: "Google AI Studio Key",
		docsUrl: "https://aistudio.google.com/app/apikey",
		models: [
			{ id: "gemini-2.0-flash", label: "Gemini 2.0 Flash", contextWindowTokens: 1048576 },
			{ id: "gemini-2.0-pro", label: "Gemini 2.0 Pro", contextWindowTokens: 2097152 },
			{ id: "gemini-1.5-flash", label: "Gemini 1.5 Flash", contextWindowTokens: 1048576 },
		],
	},
];

export interface ProviderModelSelection {
	providerId: ProviderId;
	modelId: string;
}

export function makeModelValue(providerId: ProviderId, modelId: string) {
	return `${providerId}:${modelId}`;
}

export function parseModelValue(value: string): ProviderModelSelection | null {
	const [providerId, ...rest] = value.split(":");
	if (!providerId || rest.length === 0) {
		return null;
	}
	const modelId = rest.join(":");
	if (!isProviderId(providerId)) {
		return null;
	}
	return { providerId, modelId };
}

export function isProviderId(value: string): value is ProviderId {
	return PROVIDERS.some((provider) => provider.id === value);
}

export function getModelOptions() {
	return PROVIDERS.flatMap((provider) =>
		provider.models.map((model) => ({
			value: makeModelValue(provider.id, model.id),
			label: `${provider.name} · ${model.label}`,
		}))
	);
}

export function describeSelection(selection: ProviderModelSelection) {
	const provider = PROVIDERS.find((item) => item.id === selection.providerId);
	const model = provider?.models.find((item) => item.id === selection.modelId);
	return {
		providerName: provider?.name ?? selection.providerId,
		modelLabel: model?.label ?? selection.modelId,
	};
}

