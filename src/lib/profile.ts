import { eq, sql } from "drizzle-orm"

import { db } from "@/db"
import { cfProfile } from "@/db/schema"

import "server-only"

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
