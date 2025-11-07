import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../index.css";
import Providers from "@/components/providers";
import Header from "@/components/header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const siteUrl = new URL("https://ai-playground.dev");

export const metadata: Metadata = {
	metadataBase: siteUrl,
	title: {
		default: "AI Playground Studio · Multi-Provider Prompt Sandbox",
		template: "%s · AI Playground Studio",
	},
	description:
		"Compare OpenAI, Anthropic, xAI, and Gemini responses side by side in a fast, shareable studio.",
	applicationName: "AI Playground Studio",
	authors: [{ name: "AI Playground" }],
	keywords: [
		"AI playground",
		"prompt studio",
		"multi provider",
		"OpenAI",
		"Anthropic",
		"xAI",
		"Google Gemini",
		"RAG",
		"LangChain",
	],
	openGraph: {
		type: "website",
		title: "AI Playground Studio · Multi-Provider Prompt Sandbox",
		description:
			"Ship better prompts faster. Test OpenAI, Anthropic, xAI, and Gemini in a single dashboard.",
		url: siteUrl,
		siteName: "AI Playground Studio",
		locale: "en_US",
		images: [
			{
				url: "/opengraph-image.png",
				width: 1200,
				height: 630,
				alt: "AI Playground Studio preview showing multi-provider responses",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "AI Playground Studio · Multi-Provider Prompt Sandbox",
		description:
			"Run one prompt across OpenAI, Anthropic, xAI, and Gemini. Download configs, compare reasoning, and share results.",
		images: ["/twitter-image.png"],
	},
	alternates: {
		canonical: "/",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
	icons: {
		icon: [
			{ url: "/icon.svg", type: "image/svg+xml" },
			{ url: "/favicon.ico", rel: "alternate icon" },
		],
		apple: [{ url: "/icon.svg" }],
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#020617",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<div className="grid grid-rows-[auto_1fr] h-svh">
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
