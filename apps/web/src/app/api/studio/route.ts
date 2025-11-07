import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createXai } from "@ai-sdk/xai";
import { generateText } from "ai";
import type { LanguageModel } from "ai";
import { NextResponse } from "next/server";

import {
	PROVIDERS,
	parseModelValue,
	type ProviderId,
	type ProviderModelSelection,
} from "@/lib/model-providers";

interface StudioRequestBody {
	systemPrompt?: string;
	userPrompt?: string;
	selections?: ProviderModelSelection[];
	providerKeys?: Partial<Record<ProviderId, string>>;
}

interface StudioResponseItem {
	providerId: ProviderId;
	modelId: string;
	output: string;
	usage?: {
		inputTokens?: number;
		outputTokens?: number;
		totalTokens?: number;
	};
}

type LanguageProviderFactory = (apiKey: string) => (modelId: string) => unknown;

const providerFactories: Record<ProviderId, LanguageProviderFactory> = {
	openai: (apiKey: string) => createOpenAI({ apiKey }),
	anthropic: (apiKey: string) => createAnthropic({ apiKey }),
	xai: (apiKey: string) => createXai({ apiKey }),
	gemini: (apiKey: string) => createGoogleGenerativeAI({ apiKey }),
};

export async function POST(request: Request) {
	try {
		const body = (await request.json()) as StudioRequestBody;
		const systemPrompt = body.systemPrompt?.toString() ?? "";
		const userPrompt = body.userPrompt?.toString() ?? "";
		const rawSelections = Array.isArray(body.selections) ? body.selections : [];
		const providerKeyInput =
			typeof body.providerKeys === "object" && body.providerKeys !== null
				? (body.providerKeys as Record<string, unknown>)
				: {};

		const providerKeys = Object.entries(providerKeyInput).reduce<
			Partial<Record<ProviderId, string>>
		>((acc, [providerId, value]) => {
			if (typeof value !== "string") {
				return acc;
			}
			if (!PROVIDERS.some((provider) => provider.id === providerId)) {
				return acc;
			}
			acc[providerId as ProviderId] = value;
			return acc;
		}, {});

		const selections = rawSelections
			.map((candidate) => {
				if (typeof candidate === "string") {
					return parseModelValue(candidate);
				}
				if (
					candidate &&
					typeof candidate === "object" &&
					"providerId" in candidate &&
					"modelId" in candidate
				) {
					return candidate as ProviderModelSelection;
				}
				return null;
			})
			.filter((selection): selection is ProviderModelSelection => Boolean(selection));

		if (selections.length === 0) {
			return NextResponse.json({ message: "No model selections provided." }, { status: 400 });
		}

		const invalidProviders = selections.filter(
			(selection) => !PROVIDERS.some((provider) => provider.id === selection.providerId)
		);
		if (invalidProviders.length > 0) {
			return NextResponse.json(
				{ message: `Unsupported providers: ${invalidProviders.map((item) => item.providerId).join(", ")}` },
				{ status: 400 }
			);
		}

		const missingKeys = Array.from(
			new Set(selections.map((selection) => selection.providerId))
		).filter((providerId) => {
			const key = providerKeys[providerId];
			return typeof key !== "string" || key.trim().length === 0;
		});

		if (missingKeys.length > 0) {
			return NextResponse.json(
				{
					message: `Missing API keys for: ${missingKeys.join(", ")}`,
				},
				{ status: 400 }
			);
		}

		const results = await Promise.all(
			selections.map(async (selection) => {
				const providerKey = providerKeys[selection.providerId] ?? "";
				const factory = providerFactories[selection.providerId];

				if (!factory) {
					return {
						providerId: selection.providerId,
						modelId: selection.modelId,
						output: "Provider not supported.",
					} satisfies StudioResponseItem;
				}

				try {
					const provider = factory(providerKey.trim());
					const model = provider(selection.modelId) as LanguageModel;
					const result = await generateText({
						model,
						system: systemPrompt,
						prompt: userPrompt,
					});

					return {
						providerId: selection.providerId,
						modelId: selection.modelId,
						output: result.text,
						usage: result.usage,
					} satisfies StudioResponseItem;
				} catch (error) {
					return {
						providerId: selection.providerId,
						modelId: selection.modelId,
						output:
							error instanceof Error
								? `Request failed: ${error.message}`
								: "Request failed due to an unknown error.",
					};
				}
			})
		);

		return NextResponse.json({ results });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				message: error instanceof Error ? error.message : "Unexpected error",
			},
			{ status: 500 }
		);
	}
}

