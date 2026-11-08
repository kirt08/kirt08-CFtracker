"use server"

import { refresh } from "next/cache"

import { getOwnerProfile } from "@/lib/handle"
import { getProfile } from "@/lib/profile"
import { getSession, requireSession } from "@/lib/session"
import { syncHandle } from "@/lib/sync"
import {
    getUpsolvePage,
    isUpsolveProblem,
    upsertUpsolveNote,
    UPSOLVE_FILTERS,
    UpsolveCursor,
    UpsolveFilter,
    UpsolvePage,
} from "@/lib/upsolve"

const SYNC_COOLDOWN_MS = 5 * 60 * 1000
const MAX_NOTE_LENGTH = 2000

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

export async function loadUpsolvePage(
    handle: string,
    filter: UpsolveFilter,
    cursor: UpsolveCursor | null
): Promise<UpsolvePage> {
    if (!UPSOLVE_FILTERS.includes(filter)) {
        throw new Error("Unknown filter")
    }

    const [profile, session] = await Promise.all([
        getProfile(handle),
        getSession(),
    ])
    if (!profile) return { items: [], nextCursor: null }

    return getUpsolvePage({
        handle: profile.handle,
        ownerUserId: profile.ownerUserId,
        showNotes: profile.ownerUserId === session?.user.id,
        filter,
        cursor,
    })
}

async function requireUpsolveOwner(contestId: number, index: string) {
    const { user } = await requireSession()

    const profile = await getOwnerProfile(user.id)
    if (
        !profile ||
        !(await isUpsolveProblem(profile.handle, contestId, index))
    ) {
        throw new Error("This problem is not in ypur upsolve list")
    }

    return user.id
}

export async function setUpsolveDone(
    contestId: number,
    index: string,
    isDone: boolean
) {
    const userId = await requireUpsolveOwner(contestId, index)

    await upsertUpsolveNote(userId, contestId, index, { isDone })

    refresh()
}

export async function saveUpsolveNote(
    contestId: number,
    index: string,
    note_text: string
) {
    const userId = await requireUpsolveOwner(contestId, index)

    const note = note_text.trim()
    if (!note && note.length > MAX_NOTE_LENGTH) {
        throw new Error("Note must be 1-2000 characters long")
    }

    await upsertUpsolveNote(userId, contestId, index, { note })

    return note
}

export async function deleteUpsolveNote(contestId: number, index: string) {
    const userId = await requireUpsolveOwner(contestId, index)

    await upsertUpsolveNote(userId, contestId, index, { note: null })
}
