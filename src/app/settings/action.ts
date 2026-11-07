"use server"

import { and, eq, isNull } from "drizzle-orm"
import { refresh } from "next/cache"
import { after } from "next/server"

import { db } from "@/db"
import { cfProfile, handleVerification } from "@/db/app-schema"
import { CodeforcesError, getSubmissions, getUser } from "@/lib/codeforces"
import {
    getActiveVerification,
    getOwnerProfile,
    HANDLE_PATTERN,
    VERIFICATION_PROBLEM,
} from "@/lib/handle"
import { requireSession } from "@/lib/session"
import { syncHandle } from "@/lib/sync"

const VERIFICATION_WINDOW_MS = 5 * 60 * 1000

export type StartVerificationState = { error: string | null; handle: string }
export type CheckVerificationState = { error: string | null }

function toCodeforcesMessage(error: unknown): string {
    if (error instanceof CodeforcesError && error.kind === "not_found") {
        return "We couldn’t find this handle on Codeforces"
    }
    return "Codeforces is unavailable right now. Try again in a minute."
}

export async function startVerification(
    prevState: StartVerificationState,
    formData: FormData
): Promise<StartVerificationState> {
    const { user } = await requireSession()

    const handle = String(formData.get("handle") ?? "").trim()
    if (!HANDLE_PATTERN.test(handle)) {
        return { error: "Enter a valid handle", handle }
    }

    if (await getOwnerProfile(user.id)) {
        return { error: "You already have a linked handle", handle }
    }

    let cfUser
    try {
        cfUser = await getUser(handle)
    } catch (error: unknown) {
        return { error: toCodeforcesMessage(error), handle }
    }

    const [existing] = await db
        .select({ ownerUserId: cfProfile.ownerUserId })
        .from(cfProfile)
        .where(eq(cfProfile.handle, cfUser.handle))
        .limit(1)

    if (existing?.ownerUserId) {
        return {
            error: "This handle is already linked to another account",
            handle,
        }
    }

    const profileFields = {
        rating: cfUser.rating,
        maxRating: cfUser.maxRating,
        rank: cfUser.rank,
        maxRank: cfUser.maxRank,
        avatarUrl: cfUser.titlePhoto,
    }

    await db.transaction(async (tx) => {
        await tx
            .insert(cfProfile)
            .values({ handle: cfUser.handle, ...profileFields })
            .onConflictDoUpdate({
                target: cfProfile.handle,
                set: profileFields,
            })
        await tx
            .delete(handleVerification)
            .where(eq(handleVerification.userId, user.id))
        await tx.insert(handleVerification).values({
            userId: user.id,
            handle: cfUser.handle,
            contestId: VERIFICATION_PROBLEM.contestId,
            problemIndex: VERIFICATION_PROBLEM.index,
            expiresAt: new Date(Date.now() + VERIFICATION_WINDOW_MS),
        })
    })

    refresh()

    return { error: null, handle: "" }
}

export async function checkVerification(): Promise<CheckVerificationState> {
    const { user } = await requireSession()

    const verification = await getActiveVerification(user.id)
    if (!verification) {
        refresh()
        return { error: "Time is up. Start again." }
    }

    let submissions
    try {
        submissions = await getSubmissions(verification.handle, 1, 10)
    } catch (error: unknown) {
        return { error: toCodeforcesMessage(error) }
    }

    const found = submissions.some(
        (submission) =>
            submission.problem.contestId === verification.contestId &&
            submission.problem.index === verification.problemIndex &&
            submission.verdict === "COMPILATION_ERROR" &&
            submission.creationTimeSeconds * 1000 >=
                verification.startedAt.getTime()
    )
    if (!found) {
        return {
            error: "We couldn’t find that submission yet. Give it a moment and try again.",
        }
    }

    const linked = await db.transaction(async (tx) => {
        const rows = await tx
            .update(cfProfile)
            .set({ ownerUserId: user.id, verifiedAt: new Date() })
            .where(
                and(
                    eq(cfProfile.handle, verification.handle),
                    isNull(cfProfile.ownerUserId)
                )
            )
            .returning({ handle: cfProfile.handle })
        await tx
            .delete(handleVerification)
            .where(eq(handleVerification.userId, user.id))

        return rows.length > 0
    })

    refresh()
    if (!linked) {
        return { error: "This handle is already linked to another account" }
    }

    after(() => syncHandle(verification.handle))

    return { error: null }
}

export async function cancelVerification() {
    const { user } = await requireSession()

    await db
        .delete(handleVerification)
        .where(eq(handleVerification.userId, user.id))

    refresh()
}

export async function unlinkHandle() {
    const { user } = await requireSession()

    await db
        .update(cfProfile)
        .set({ ownerUserId: null, verifiedAt: null })
        .where(eq(cfProfile.ownerUserId, user.id))

    refresh()
}
