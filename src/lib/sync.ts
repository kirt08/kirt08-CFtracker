import "server-only"

import { and, eq, inArray, lt, max, ne, or, sql } from "drizzle-orm"

import { db } from "@/db"
import {
    cfProfile,
    contest,
    contestParticipation,
    problem,
    submission,
} from "@/db/schema"

import {
    CfSubmission,
    CodeforcesError,
    getContests,
    getRatingHistory,
    getSubmissions,
    getUser,
} from "./codeforces"

const PAGE_SIZE = 1000 // limits for CF
const BATCH_SIZE = 1000 // limits for Postgres
const STUCK_AFTER_MS = 5 * 60 * 1000 // 5 mins in ms; when something forgot to change 'sync' status in db
const RETRY_DELAY_MS = 5000
const FIRST_GYM_CONTEST_ID = 100000
const IN_CONTEST_TYPES = new Set(["CONTESTANT", "OUT_OF_COMPETITION"])

export async function syncHandle(handle: string): Promise<void> {
    if (!(await lockProfile(handle))) return

    try {
        await withRetry(() => loadHandle(handle))
    } catch (error) {
        console.error(`syncHandle(${handle}) failed`, error)
        await db
            .update(cfProfile)
            .set({ syncStatus: "failed", syncStartedAt: null })
            .where(eq(cfProfile.handle, handle))
    }
}

async function lockProfile(handle: string): Promise<boolean> {
    const stuckBefore = new Date(Date.now() - STUCK_AFTER_MS)

    const rows = await db
        .update(cfProfile)
        .set({ syncStatus: "syncing", syncStartedAt: new Date() })
        .where(
            and(
                eq(cfProfile.handle, handle),
                or(
                    ne(cfProfile.syncStatus, "syncing"),
                    lt(cfProfile.syncStartedAt, stuckBefore)
                )
            )
        )
        .returning({ handle: cfProfile.handle })

    return rows.length > 0
}

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn()
    } catch (error: unknown) {
        if (!(error instanceof CodeforcesError && error.kind === "unavailable"))
            throw error

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))

        return fn()
    }
}

async function loadHandle(handle: string): Promise<void> {
    const cfUser = await getUser(handle)
    const ratingChanges = await getRatingHistory(handle)
    const submissions = (await fetchNewSubmissions(handle)).flatMap((item) => {
        const { contestId, verdict } = item
        if (
            contestId === undefined ||
            contestId >= FIRST_GYM_CONTEST_ID ||
            verdict === undefined ||
            verdict === "TESTING"
        ) {
            return []
        }

        return [{ ...item, contestId }]
    })

    const knownContests = await ensureContests([
        ...ratingChanges.map((change) => change.contestId),
        ...submissions.map((submission) => submission.contestId),
    ])

    const participationRows = ratingChanges
        .filter((change) => knownContests.has(change.contestId))
        .map((change) => ({
            handle,
            contestId: change.contestId,
            place: change.rank,
            oldRating: change.oldRating,
            newRating: change.newRating,
        }))

    const storedSubmissions = submissions.filter((item) =>
        knownContests.has(item.contestId)
    )

    const problemRows = new Map<string, typeof problem.$inferInsert>()
    for (const item of storedSubmissions) {
        const { contestId } = item
        problemRows.set(`${contestId}/${item.problem.index}`, {
            contestId,
            index: item.problem.index,
            name: item.problem.name,
            rating: item.problem.rating,
            tags: item.problem.tags,
        })
    }

    const submissionRows = storedSubmissions.map((item) => ({
        id: item.id,
        handle,
        contestId: item.contestId,
        problemIndex: item.problem.index,
        isAccepted: item.verdict === "OK",
        inContest: IN_CONTEST_TYPES.has(item.author.participantType),
        createdAt: new Date(item.creationTimeSeconds * 1000),
    }))

    await db.transaction(async (tx) => {
        for (const rows of chunk([...problemRows.values()])) {
            await tx
                .insert(problem)
                .values(rows)
                .onConflictDoUpdate({
                    target: [problem.contestId, problem.index],
                    set: {
                        name: sql`excluded.name`,
                        tags: sql`excluded.tags`,
                        rating: sql`coalesce(excluded.rating, ${problem.rating})`,
                    },
                })
        }

        for (const rows of chunk(submissionRows)) {
            await tx
                .insert(submission)
                .values(rows)
                .onConflictDoUpdate({
                    target: submission.id,
                    set: { isAccepted: sql`excluded.is_accepted` },
                })
        }

        for (const rows of chunk(participationRows)) {
            await tx
                .insert(contestParticipation)
                .values(rows)
                .onConflictDoUpdate({
                    target: [
                        contestParticipation.handle,
                        contestParticipation.contestId,
                    ],
                    set: {
                        place: sql`excluded.place`,
                        oldRating: sql`excluded.old_rating`,
                        newRating: sql`excluded.new_rating`,
                    },
                })
        }

        await tx
            .update(cfProfile)
            .set({
                rating: cfUser.rating,
                maxRating: cfUser.maxRating,
                rank: cfUser.rank,
                maxRank: cfUser.maxRank,
                avatarUrl: cfUser.titlePhoto,
                syncStatus: "idle",
                syncStartedAt: null,
                lastSyncedAt: new Date(),
            })
            .where(eq(cfProfile.handle, handle))
    })
}

async function fetchNewSubmissions(handle: string): Promise<CfSubmission[]> {
    const [{ lastId }] = await db
        .select({ lastId: max(submission.id) })
        .from(submission)
        .where(eq(submission.handle, handle))

    const result: CfSubmission[] = []
    for (let from = 1; ; from += PAGE_SIZE) {
        const page = await getSubmissions(handle, from, PAGE_SIZE)
        result.push(...page)

        const oldest = page.at(-1)
        const reachedStored =
            lastId != null && oldest !== undefined && oldest.id <= lastId
        if (page.length < PAGE_SIZE || reachedStored) {
            return result
        }
    }
}

async function ensureContests(ids: number[]): Promise<Set<number>> {
    const uniqueIds = [...new Set(ids)]
    if (uniqueIds.length === 0) return new Set()

    const existing = await db
        .select({ id: contest.id })
        .from(contest)
        .where(inArray(contest.id, uniqueIds))
    const known = new Set(existing.map((row) => row.id))

    const missing = new Set(uniqueIds.filter((id) => !known.has(id)))
    if (missing.size === 0) return known

    const rows = (await getContests())
        .filter((item) => missing.has(item.id))
        .map((item) => ({
            id: item.id,
            name: item.name,
            startTime:
                item.startTimeSeconds !== undefined
                    ? new Date(item.startTimeSeconds * 1000)
                    : null,
            durationSeconds: item.durationSeconds,
        }))

    for (const batch of chunk(rows)) {
        await db.insert(contest).values(batch).onConflictDoNothing()
    }
    for (const row of rows) known.add(row.id)

    return known
}

function chunk<T>(items: T[]): T[][] {
    const batches: T[][] = []
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        batches.push(items.slice(i, i + BATCH_SIZE))
    }

    return batches
}
