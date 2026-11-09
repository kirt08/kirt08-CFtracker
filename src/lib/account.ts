import "server-only"

import { eq } from "drizzle-orm"

import { db } from "@/db"
import { account } from "@/db/auth-schema"

export async function getSignInMethods(userId: string) {
    const rows = await db
        .select({ providerId: account.providerId })
        .from(account)
        .where(eq(account.userId, userId))

    return {
        hasPassword: rows.some((row) => row.providerId === "credential"),
        hasGitHub: rows.some((row) => row.providerId === "github"),
    }
}
