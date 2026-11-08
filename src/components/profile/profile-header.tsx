import { buttonVariants } from "@/components/ui/button"
import { avatarSrc } from "@/lib/codeforces"
import { formatRank, rankColor } from "@/lib/rank"
import { formatTimeAgo } from "@/lib/time"

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { SyncButton } from "./sync-button"

type ProfileHeaderProps = {
    handle: string
    rating: number | null
    rank: string | null
    maxRating: number | null
    maxRank: string | null
    avatarUrl: string | null
    lastSyncedAt: Date | null
    isOwner: boolean
}

export function ProfileHeader({
    handle,
    rating,
    rank,
    maxRating,
    maxRank,
    avatarUrl,
    lastSyncedAt,
    isOwner,
}: ProfileHeaderProps) {
    const color = rankColor(rating)
    const updated = lastSyncedAt
        ? `updated ${formatTimeAgo(lastSyncedAt)}`
        : "not synced yet"

    return (
        <section className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
                <Avatar className="size-22 rounded-2xl after:rounded-2xl">
                    {avatarUrl && (
                        <AvatarImage
                            src={avatarSrc(avatarUrl)}
                            alt=""
                            className="rounded-2xl"
                        />
                    )}
                    <AvatarFallback className="rounded-2xl bg-[#1C1C1C] font-mono text-3xl font-bold text-zinc-300">
                        {handle[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold" style={{ color }}>
                        {formatRank(rank)}
                    </span>
                    <h1
                        className="font-mono text-[34px] leading-[normal] font-bold"
                        style={{ color }}
                    >
                        {handle}
                    </h1>
                    <span className="text-sm text-muted-foreground">
                        {maxRating !== null && (
                            <>
                                max{" "}
                                <span
                                    className="font-semibold"
                                    style={{ color: rankColor(maxRating) }}
                                >
                                    {maxRating} · {formatRank(maxRank)}
                                </span>{" "}
                                ·{" "}
                            </>
                        )}
                        {updated}
                    </span>
                </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
                <a
                    href={`https://codeforces.com/profile/${handle}`}
                    target="_blank"
                    className={buttonVariants({
                        variant: "outline",
                        size: "xl",
                        className:
                            "h-11 rounded-[10px] px-4 text-sm font-medium",
                    })}
                >
                    Open on Codeforces
                </a>
                {isOwner && <SyncButton />}
            </div>
        </section>
    )
}
