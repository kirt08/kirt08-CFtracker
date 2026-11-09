import Link from "next/link"
import { connection } from "next/server"

import { getRecentlyViewed, RECENTLY_VIEWED_LIMIT } from "@/lib/profile"
import { rankColor } from "@/lib/rank"

const ROW = "flex max-w-160 flex-wrap items-center justify-center gap-2"
const LABEL = "mr-1 text-[13px] text-muted-foreground"

export async function RecentlyViewed() {
    await connection()

    const profiles = await getRecentlyViewed()
    if (profiles.length === 0) return null

    return (
        <div className={ROW}>
            <span className={LABEL}>Recently viewed:</span>
            {profiles.map(({ handle, rating }) => (
                <Link
                    key={handle}
                    href={`/u/${handle}`}
                    style={{ color: rankColor(rating) }}
                    className="rounded-full border border-border bg-card px-2.5 py-1.5 font-mono text-[13px] font-bold transition-colors hover:border-foreground/25"
                >
                    {handle}
                </Link>
            ))}
        </div>
    )
}

export function RecentlyViewedSkeleton() {
    return (
        <div aria-hidden className={ROW}>
            <span className={LABEL}>Recently viewed:</span>
            {Array.from({ length: RECENTLY_VIEWED_LIMIT }, (_, index) => (
                <span
                    key={index}
                    className="h-8.5 w-20 animate-pulse rounded-full border border-border bg-card"
                />
            ))}
        </div>
    )
}
