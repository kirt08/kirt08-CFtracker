import "server-only"

import { and, desc, eq, gt } from "drizzle-orm"

import { db } from "@/db"
import { cfProfile, handleVerification } from "@/db/schema"

export const HANDLE_PATTERN = /^[\w.-]+$/
export const VERIFICATION_PROBLEM = {
    contestId: 4,
    index: "A",
    name: "Watermelon",
}

export async function getActiveVerification(userId: string) {
    const [verification] = await db
        .select()
        .from(handleVerification)
        .where(
            and(
                eq(handleVerification.userId, userId),
                gt(handleVerification.expiresAt, new Date())
            )
        )
        .orderBy(desc(handleVerification.startedAt))
        .limit(1)

    return verification
}

export async function getOwnerProfile(userId: string) {
    const [profile] = await db
        .select()
        .from(cfProfile)
        .where(eq(cfProfile.ownerUserId, userId))
        .limit(1)

    return profile
}

export async function getHandleData(userId: string) {
    const profile = await getOwnerProfile(userId)
    if (profile) {
        return { state: "linked" as const, profile }
    }

    const verification = await getActiveVerification(userId)
    if (!verification) {
        return { state: "not_linked" as const }
    }

    const [candidate] = await db
        .select({ rating: cfProfile.rating })
        .from(cfProfile)
        .where(eq(cfProfile.handle, verification.handle))
        .limit(1)

    return {
        state: "verify" as const,
        verification,
        rating: candidate?.rating ?? null,
        problemName: VERIFICATION_PROBLEM.name,
    }
}

export type HandleData = Awaited<ReturnType<typeof getHandleData>>
