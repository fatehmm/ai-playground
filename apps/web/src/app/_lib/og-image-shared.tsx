import type { ReactElement, CSSProperties } from "react";

export const OG_IMAGE_SIZE = {
	width: 1200,
	height: 630,
} as const;

const gradientBackground = "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #f472b6 100%)";

const outerStyle: CSSProperties = {
	display: "flex",
	width: "100%",
	height: "100%",
	backgroundColor: "#020617",
	backgroundImage: gradientBackground,
	padding: "64px",
	color: "#f8fafc",
	fontFamily: "Geist, Arial, sans-serif",
};

const containerStyle: CSSProperties = {
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	width: "100%",
	borderRadius: "40px",
	backgroundColor: "rgba(2, 6, 23, 0.7)",
	padding: "64px",
	boxShadow: "0 40px 100px rgba(15, 23, 42, 0.4)",
};

const badgeStyle: CSSProperties = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "72px",
	height: "72px",
	borderRadius: "24px",
	backgroundColor: "rgba(37, 99, 235, 0.18)",
	border: "2px solid rgba(248, 250, 252, 0.2)",
};

const headlineStyle: CSSProperties = {
	margin: 0,
	fontSize: "64px",
	fontWeight: 700,
	lineHeight: 1,
};

const subheadStyle: CSSProperties = {
	margin: "48px 0 0",
	maxWidth: "70%",
	fontSize: "28px",
	lineHeight: 1.4,
	color: "rgba(248, 250, 252, 0.92)",
};

const footerStyle: CSSProperties = {
	display: "flex",
	gap: "24px",
	marginTop: "auto",
	fontSize: "24px",
	color: "rgba(248, 250, 252, 0.85)",
};

export function renderOgImage(): ReactElement {
	return (
		<div style={outerStyle}>
			<div style={containerStyle}>
				<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
					<div style={badgeStyle}>
						<span style={{ fontSize: "40px", fontWeight: 600 }}>AI</span>
					</div>
					<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
						<span style={{ fontSize: "20px", letterSpacing: "0.3em", opacity: 0.7 }}>
							MULTI-PROVIDER STUDIO
						</span>
						<h1 style={headlineStyle}>AI Playground Studio</h1>
					</div>
				</div>
				<p style={subheadStyle}>
					Run the same prompt across OpenAI, Anthropic, xAI, and Gemini. Compare reasoning, download configs, and
					ship faster.
				</p>
				<div style={footerStyle}>
					<span>⚡ Live prompt diffing</span>
					<span>🔐 Bring your own keys</span>
					<span>📊 Ready for sharing</span>
				</div>
			</div>
		</div>
	);
}

