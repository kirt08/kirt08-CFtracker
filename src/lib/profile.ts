import "server-only"

import { desc, eq, sql } from "drizzle-orm"

import { db } from "@/db"
import { cfProfile, contest, contestParticipation } from "@/db/schema"

import { getUser } from "./codeforces"
import { syncHandle } from "./sync"

export type Profile = typeof cfProfile.$inferSelect

export async function getProfile(handle: string) {
    const [profile] = await db
        .select()
        .from(cfProfile)
        .where(eq(sql`lower(${cfProfile.handle})`, handle.toLocaleLowerCase()))
        .limit(1)

    return profile
}

export async function loadNewProfile(handle: string) {
    const cfUser = await getUser(handle)

    await db
        .insert(cfProfile)
        .values({ handle: cfUser.handle })
        .onConflictDoNothing()

    await syncHandle(cfUser.handle)

    return getProfile(cfUser.handle)
}

export async function getProfileStats(
    handle: string,
    ownerUserId: string | null
) {
    const [lastRound] = await db
        .select({
            oldRating: contestParticipation.oldRating,
            newRating: contestParticipation.newRating,
            startTime: contest.startTime,
        })
        .from(contestParticipation)
        .innerJoin(contest, eq(contest.id, contestParticipation.contestId))
        .where(eq(contestParticipation.handle, handle))
        .orderBy(desc(contest.startTime))
        .limit(1)

    const contests = await db.$count(
        contestParticipation,
        eq(contestParticipation.handle, handle)
    )

    const [solved] = await db.execute<{ total: number; thisMonth: number }>(sql`
        select
            count(*)::int as "total",
            count(*) filter (
                where first_accepted_at >= date_trunc('month', now())
            )::int as "thisMonth"
        from (
            select min(created_at) as first_accepted_at
            from submission
            where handle = ${handle} and is_accepted
            group by contest_id, problem_index
        ) as solved
    `)

    const [upsolve] = await db.execute<{ toDo: number; done: number }>(sql`
        select
            count(*) filter (where not done)::int as "toDo",
            count(*) filter (where done)::int as "done"
        from (
            select
                bool_or(s.is_accepted) or bool_or(coalesce(n.is_done, false)) as done
            from submission s
            left join upsolve_note n
                on n.user_id = ${ownerUserId}
                and n.contest_id = s.contest_id
                and n.problem_index = s.problem_index
            where s.handle = ${handle}
            group by s.contest_id, s.problem_index
            having bool_or(s.in_contest)
                and not bool_or(s.in_contest and s.is_accepted)
        ) as problems
    `)

    return {
        ratingChange: lastRound
            ? lastRound.newRating - lastRound.oldRating
            : null,
        lastContestAt: lastRound?.startTime ?? null,
        contests,
        solved: solved.total,
        solvedThisMonth: solved.thisMonth,
        toUpsolve: upsolve.toDo,
        upsolveDone: upsolve.done,
    }
}

export type ProfileStats = Awaited<ReturnType<typeof getProfileStats>>
