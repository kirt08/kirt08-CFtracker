import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"

import { GuestBanner } from "@/components/profile/guest-banner"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileSkeleton } from "@/components/profile/profile-skeleton"
import { ProfileStatCards } from "@/components/profile/profile-stat-cards"
import { CodeforcesError } from "@/lib/codeforces"
import { HANDLE_PATTERN } from "@/lib/handle"
import {
    getProfile,
    getProfileStats,
    loadNewProfile,
    Profile,
} from "@/lib/profile"
import { getSession } from "@/lib/session"

export async function generateMetadata({
    params,
}: PageProps<"/u/[handle]">): Promise<Metadata> {
    const { handle } = await params

    return { title: `${handle} · CF tracker` }
}

async function ProfileView({ profile }: { profile: Profile }) {
    const [session, stats] = await Promise.all([
        getSession(),
        getProfileStats(profile.handle, profile.ownerUserId),
    ])

    return (
        <>
            {!session && <GuestBanner />}
            <ProfileHeader
                handle={profile.handle}
                rating={profile.rating}
                rank={profile.rank}
                maxRating={profile.maxRating}
                maxRank={profile.maxRank}
                avatarUrl={profile.avatarUrl}
                lastSyncedAt={profile.lastSyncedAt}
                isOwner={session?.user.id === profile.ownerUserId}
            />
            <ProfileStatCards rating={profile.rating} stats={stats} />
        </>
    )
}

async function NewProfile({ handle }: { handle: string }) {
    let profile
    try {
        profile = await loadNewProfile(handle)
    } catch (error: unknown) {
        if (error instanceof CodeforcesError && error.kind === "not_found") {
            notFound()
        }
        throw error
    }

    if (!profile) notFound()

    if (profile.handle !== handle) redirect(`/u/${profile.handle}`)

    return <ProfileView profile={profile} />
}

async function ProfileContent({
    params,
}: {
    params: PageProps<"/u/[handle]">["params"]
}) {
    const { handle } = await params
    if (!HANDLE_PATTERN.test(handle)) notFound()

    const profile = await getProfile(handle)
    if (!profile || profile.lastSyncedAt === null) {
        return (
            <Suspense fallback={<ProfileSkeleton handle={handle} />}>
                <NewProfile handle={handle} />
            </Suspense>
        )
    }
    if (profile.handle !== handle) redirect(`/u/${profile.handle}`)

    return <ProfileView profile={profile} />
}

export default function ProfilePage({ params }: PageProps<"/u/[handle]">) {
    return (
        <main className="mx-auto flex w-full max-w-300 flex-col gap-6 px-6 pt-8 pb-20">
            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent params={params} />
            </Suspense>
        </main>
    )
}
