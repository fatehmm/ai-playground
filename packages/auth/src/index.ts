import { nextCookies } from 'better-auth/next-js';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@ai-playground/db";
import * as schema from "@ai-playground/db/schema/auth";
import { sendSignupNotification } from "./email-service";

export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: [process.env.CORS_ORIGIN || ""],
	emailAndPassword: {
		enabled: true,
	},
	events: {
		afterSignUp: {
			handler: async (context) => {
				const { user } = context;
				if (user && user.email && user.name) {
					await sendSignupNotification(user.email, user.name);
				}
			}
		}
	},
  plugins: [nextCookies()]
});
