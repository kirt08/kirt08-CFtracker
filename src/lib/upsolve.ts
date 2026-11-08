import { sql } from "drizzle-orm"

import { db } from "@/db"

import "server-only"

import { upsolveNote } from "@/db/app-schema"

const FIRST_PAGE_SIZE = 5
const NEXT_PAGE_SIZE = 10

export const UPSOLVE_FILTERS = ["all", "todo", "done"] as const

export type UpsolveFilter = (typeof UPSOLVE_FILTERS)[number]

export type UpsolveCursor = {
    startTime: string
    contestId: number
    index: string
}

export type UpsolveItem = {
    contestId: number
    index: string
    name: string
    rating: number | null
    tags: string[]
    contestName: string
    startTime: string
    attempts: number
    solvedOnCf: boolean
    isDone: boolean
    note: string | null
}

export type UpsolvePage = {
    items: UpsolveItem[]
    nextCursor: UpsolveCursor | null
}

function filterCondition(filter: UpsolveFilter) {
    if (filter === "todo") return sql`not u."isDone"`
    if (filter === "done") return sql`u."isDone"`
    return sql`true`
}

function cursorCondition(cursor: UpsolveCursor | null) {
    if (!cursor) return sql`true`

    const position = sql`(${cursor.startTime}::timestamptz, ${cursor.contestId}::int)`

    return sql`(
        (u."startTime", u."contestId") < ${position}
        or (
            (u."startTime", u."contestId") = ${position}
            and u."index" > ${cursor.index}
        )
    )`
}

export async function getUpsolvePage(input: {
    handle: string
    ownerUserId: string | null
    showNotes: boolean
    filter: UpsolveFilter
    cursor: UpsolveCursor | null
}): Promise<UpsolvePage> {
    const { handle, ownerUserId, showNotes, filter, cursor } = input
    const pageSize = cursor ? NEXT_PAGE_SIZE : FIRST_PAGE_SIZE

    const rows = await db.execute<UpsolveItem>(sql`
        with attempted as (
            select
                s.contest_id,
                s.problem_index,
                (count(*) filter (where s.in_contest))::int as attempts,
                bool_or(s.is_accepted) as solved
            from submission s
            where handle = ${handle}
            group by s.contest_id, s.problem_index
            having bool_or(s.in_contest) 
                and not bool_or(s.in_contest and s.is_accepted)
        ),
        upsolve as (
            select
                a.contest_id as "contestId",
                a.problem_index as "index",
                p.name,
                p.rating,
                p.tags,
                c.name as "contestName",
                c.start_time as "startTime",
                a.attempts,
                a.solved as "solvedOnCf",
                a.solved or coalesce(n.is_done, false) as "isDone",
                n.note
            from attempted a
            join problem p
                on p.contest_id = a.contest_id and p.index = a.problem_index
            join contest c
                on c.id = a.contest_id
            left join upsolve_note n
                on n.user_id = ${ownerUserId}
                and n.contest_id = a.contest_id
                and n.problem_index = a.problem_index
            where c.start_time is not null
        )
        select
            u."contestId", u."index", u.name, u.rating, u.tags,
            u."contestName", u."startTime"::text as "startTime", u.attempts,
            u."solvedOnCf", u."isDone", u.note
        from upsolve u
        where ${filterCondition(filter)} and ${cursorCondition(cursor)}
        order by u."startTime" desc, u."contestId" desc, u."index"
        limit ${pageSize + 1}
    `)

    const items = rows
        .slice(0, pageSize)
        .map((row) => ({ ...row, note: showNotes ? row.note : null }))
    const last = items.at(-1)

    return {
        items,
        nextCursor:
            rows.length > pageSize && last
                ? {
                      startTime: last.startTime,
                      contestId: last.contestId,
                      index: last.index,
                  }
                : null,
    }
}

export async function isUpsolveProblem(
    handle: string,
    contestId: number,
    index: string
): Promise<boolean> {
    const rows = await db.execute(sql`
        select 1
        from submission s
        where
            s.handle = ${handle} and
            s.contest_id = ${contestId} and
            s.problem_index = ${index}
        having bool_or(s.in_contest)
            and not bool_or(s.is_accepted and s.in_contest)
    `)

    return rows.length > 0
}

export async function upsertUpsolveNote(
    userId: string,
    contestId: number,
    index: string,
    values: { isDone: boolean } | { note: string | null }
) {
    await db
        .insert(upsolveNote)
        .values({ userId, contestId, problemIndex: index, ...values })
        .onConflictDoUpdate({
            target: [
                upsolveNote.userId,
                upsolveNote.contestId,
                upsolveNote.problemIndex,
            ],
            set: { ...values, updatedAt: new Date() },
        })
}
