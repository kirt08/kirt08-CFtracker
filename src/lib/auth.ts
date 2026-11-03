import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"

import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
    baseURL: {
        allowedHosts: [
            "localhost:3000",
            "kirt08-cftracker.vercel.app",
            "kirt08-cftracker-*.vercel.app",
        ],
        protocol: process.env.NODE_ENV === "development" ? "http" : "https",
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schema,
    }),
    emailAndPassword: {
        enabled: true,
    },
    plugins: [nextCookies()],
})
