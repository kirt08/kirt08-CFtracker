import "server-only"

import { asc, desc, eq, gt, sql } from "drizzle-orm"

import { db } from "@/db"
import { cfProfile, contest, contestParticipation } from "@/db/schema"

import { getUser } from "./codeforces"
import { syncHandle } from "./sync"

const MIN_DIFFICULTY = 800
const MAX_DIFFICULTY = 2400
const DIFFICULTY_STEP = 100

const UPCOMING_LIMIT = 2

const TOPIC_LIMIT = 12

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
    const lastRound = await getLastRound(handle)

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
        lastRound,
        contests,
        solved: solved.total,
        solvedThisMonth: solved.thisMonth,
        toUpsolve: upsolve.toDo,
        upsolveDone: upsolve.done,
    }
}

export type ProfileStats = Awaited<ReturnType<typeof getProfileStats>>

export async function getSolvedByDifficulty(handle: string) {
    const rows = await db.execute<{ rating: number; solved: number }>(sql`
        select 
            least(p.rating, ${MAX_DIFFICULTY})::int as "rating",
            count(*)::int as "solved"
        from (
            select distinct contest_id, problem_index
            from submission
            where handle = ${handle} and is_accepted
        ) as s
        join problem p
            on p.contest_id = s.contest_id and p.index = s.problem_index
        where p.rating is not null
        group by 1
    `)
    const solvedByRating = new Map(rows.map((row) => [row.rating, row.solved]))

    const buckets = []
    for (
        let rating = MIN_DIFFICULTY;
        rating <= MAX_DIFFICULTY;
        rating += DIFFICULTY_STEP
    ) {
        buckets.push({ rating, solved: solvedByRating.get(rating) ?? 0 })
    }

    return buckets
}

export type DifficultyBucket = Awaited<
    ReturnType<typeof getSolvedByDifficulty>
>[number]

async function getLastRound(handle: string) {
    const [round] = await db
        .select({
            contestId: contestParticipation.contestId,
            name: contest.name,
            place: contestParticipation.place,
            oldRating: contestParticipation.oldRating,
            newRating: contestParticipation.newRating,
            startTime: contest.startTime,
        })
        .from(contestParticipation)
        .innerJoin(contest, eq(contest.id, contestParticipation.contestId))
        .where(eq(contestParticipation.handle, handle))
        .orderBy(desc(contest.startTime))
        .limit(1)

    if (!round) return null

    const [solved] = await db.execute<{ count: number }>(sql`
        select count(distinct problem_index)::int as "count"
        from submission
        where handle = ${handle}
            and contest_id = ${round.contestId}
            and in_contest
            and is_accepted
    `)

    return {
        name: round.name,
        place: round.place,
        startTime: round.startTime,
        ratingChange: round.newRating - round.oldRating,
        solved: solved.count,
    }
}

export type LastRound = Awaited<ReturnType<typeof getLastRound>>

export async function getUpcomingContests() {
    const rows = await db
        .select({
            id: contest.id,
            name: contest.name,
            startTime: contest.startTime,
        })
        .from(contest)
        .where(gt(contest.startTime, new Date()))
        .orderBy(asc(contest.startTime))
        .limit(UPCOMING_LIMIT)

    return rows.flatMap((row) =>
        row.startTime ? [{ ...row, startTime: row.startTime }] : []
    )
}

export type UpcomingContest = Awaited<
    ReturnType<typeof getUpcomingContests>
>[number]

export type TopicStat = { name: string; solved: number; rate: number }

export async function getTopicStats(handle: string) {
    return db.execute<TopicStat>(sql`
        with per_problem as (
            select
                contest_id,
                problem_index,
                count(*)::int as attempts,
                count(*) filter (where is_accepted)::int as accepted
            from submission
            where handle = ${handle}
            group by contest_id, problem_index
        )
        select
            t.tag as "name",
            count(*) filter (where pp.accepted > 0)::int as "solved",
            round(100.0 * sum(pp.accepted) / sum(pp.attempts))::int as "rate"
        from per_problem pp
        join problem p
            on p.contest_id = pp.contest_id and p.index = pp.problem_index
        cross join lateral unnest(p.tags) as t(tag)
        where t.tag not like '*%'
        group by t.tag
        order by "solved" desc, t.tag
        limit ${TOPIC_LIMIT}        
    `)
}
