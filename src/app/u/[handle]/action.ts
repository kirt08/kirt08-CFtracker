"use server"

import { refresh } from "next/cache"

import { getOwnerProfile } from "@/lib/handle"
import { requireSession } from "@/lib/session"
import { syncHandle } from "@/lib/sync"

const SYNC_COOLDOWN_MS = 5 * 60 * 1000

export async function syncMyProfile() {
    const { user } = await requireSession()

    const profile = await getOwnerProfile(user.id)
    if (!profile) return

    const syncedRecently =
        profile.lastSyncedAt !== null &&
        Date.now() - profile.lastSyncedAt.getTime() < SYNC_COOLDOWN_MS

    if (!syncedRecently) {
        await syncHandle(profile.handle)
    }

    refresh()
}
