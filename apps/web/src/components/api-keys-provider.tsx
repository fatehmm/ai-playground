"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { ProviderId } from "@/lib/model-providers";

interface ApiKeysContextValue {
	apiKeys: Partial<Record<ProviderId, string>>;
	isLoading: boolean;
	setKey: (provider: ProviderId, key: string) => void;
	deleteKey: (provider: ProviderId) => void;
}

const ApiKeysContext = createContext<ApiKeysContextValue | undefined>(undefined);

const STORAGE_KEY = "ai-playground:api-keys";

export function ApiKeysProvider({ children }: { children: ReactNode }) {
	const [apiKeys, setApiKeys] = useState<Partial<Record<ProviderId, string>>>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored) {
				setApiKeys(JSON.parse(stored));
			}
		} catch (error) {
			console.error("Failed to read API keys", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const persist = useCallback((value: Partial<Record<ProviderId, string>>) => {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
		} catch (error) {
			console.error("Failed to persist API keys", error);
		}
	}, []);

	const setKey = useCallback(
		(provider: ProviderId, key: string) => {
			setApiKeys((current) => {
				const next = { ...current, [provider]: key };
				persist(next);
				return next;
			});
		},
		[persist]
	);

	const deleteKey = useCallback(
		(provider: ProviderId) => {
			setApiKeys((current) => {
				if (!(provider in current)) {
					return current;
				}
				const { [provider]: _removed, ...rest } = current;
				persist(rest);
				return rest;
			});
		},
		[persist]
	);

	const value = useMemo<ApiKeysContextValue>(
		() => ({ apiKeys, isLoading, setKey, deleteKey }),
		[apiKeys, isLoading, setKey, deleteKey]
	);

	return <ApiKeysContext.Provider value={value}>{children}</ApiKeysContext.Provider>;
}

export function useApiKeys() {
	const context = useContext(ApiKeysContext);
	if (!context) {
		throw new Error("useApiKeys must be used within ApiKeysProvider");
	}
	return context;
}

