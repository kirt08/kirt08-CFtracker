import { sql } from "drizzle-orm"
import {
    bigint,
    boolean,
    check,
    foreignKey,
    index,
    integer,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core"

import { user } from "./auth-schema"

export * from "./auth-schema"

export const syncStatus = pgEnum("sync_status", ["idle", "syncing", "failed"])

export const cfProfile = pgTable(
    "cf_profile",
    {
        handle: text("handle").primaryKey(),
        ownerUserId: text("owner_user_id")
            .unique()
            .references(() => user.id, { onDelete: "set null" }),
        rating: integer("rating"),
        maxRating: integer("max_rating"),
        rank: text("rank"),
        maxRank: text("max_rank"),
        avatarUrl: text("avatar_url"),
        verifiedAt: timestamp("verified_at", { withTimezone: true }),
        lastSyncedAt: timestamp("last_synced_at", { withTimezone: true }),
        lastViewedAt: timestamp("last_viewed_at", { withTimezone: true }),
        syncStatus: syncStatus("sync_status").default("idle").notNull(),
        syncStartedAt: timestamp("sync_started_at", { withTimezone: true }),
    },
    (t) => [
        uniqueIndex("cf_profile_handle_lower_idx").on(sql`lower(${t.handle})`),
        check(
            "cf_profile_syncing_started_chk",
            sql`(${t.syncStatus} = 'syncing') = (${t.syncStartedAt} is not null)`
        ),
    ]
)

export const handleVerification = pgTable(
    "handle_verification",
    {
        id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        handle: text("handle").notNull(),
        contestId: integer("contest_id").notNull(),
        problemIndex: text("problem_index").notNull(),
        startedAt: timestamp("started_at", { withTimezone: true })
            .defaultNow()
            .notNull(),
        expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    },
    (t) => [
        index("handle_verification_user_id_idx").on(t.userId),
        check(
            "handle_verification_window_chk",
            sql`${t.expiresAt} > ${t.startedAt}`
        ),
    ]
)

export const contest = pgTable("contest", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    startTime: timestamp("start_time", { withTimezone: true }),
    durationSeconds: integer("duration_seconds").notNull(),
})

export const problem = pgTable(
    "problem",
    {
        contestId: integer("contest_id")
            .notNull()
            .references(() => contest.id, { onDelete: "cascade" }),
        index: text("index").notNull(),
        name: text("name").notNull(),
        rating: integer("rating"),
        tags: text("tags")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
    },
    (t) => [primaryKey({ columns: [t.contestId, t.index] })]
)

export const submission = pgTable(
    "submission",
    {
        id: bigint("id", { mode: "number" }).primaryKey(),
        handle: text("handle")
            .notNull()
            .references(() => cfProfile.handle, { onDelete: "cascade" }),
        contestId: integer("contest_id").notNull(),
        problemIndex: text("problem_index").notNull(),
        isAccepted: boolean("is_accepted").notNull(),
        inContest: boolean("in_contest").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
    },
    (t) => [
        foreignKey({
            columns: [t.contestId, t.problemIndex],
            foreignColumns: [problem.contestId, problem.index],
        }).onDelete("cascade"),
        index("submission_handle_problem_idx").on(
            t.handle,
            t.contestId,
            t.problemIndex
        ),
    ]
)

export const contestParticipation = pgTable(
    "contest_participation",
    {
        handle: text("handle")
            .notNull()
            .references(() => cfProfile.handle, { onDelete: "cascade" }),
        contestId: integer("contest_id")
            .notNull()
            .references(() => contest.id, { onDelete: "cascade" }),
        place: integer("place").notNull(),
        oldRating: integer("old_rating").notNull(),
        newRating: integer("new_rating").notNull(),
    },
    (t) => [primaryKey({ columns: [t.handle, t.contestId] })]
)

export const upsolveNote = pgTable(
    "upsolve_note",
    {
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        contestId: integer("contest_id").notNull(),
        problemIndex: text("problem_index").notNull(),
        isDone: boolean("is_done").default(false).notNull(),
        note: text("note"),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (t) => [
        primaryKey({ columns: [t.userId, t.contestId, t.problemIndex] }),
        foreignKey({
            columns: [t.contestId, t.problemIndex],
            foreignColumns: [problem.contestId, problem.index],
        }).onDelete("cascade"),
    ]
)
