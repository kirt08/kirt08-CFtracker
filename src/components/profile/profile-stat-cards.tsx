import { ProfileStats } from "@/lib/profile"
import { rankColor } from "@/lib/rank"
import { formatTimeAgo } from "@/lib/time"

import { StatCard } from "./stat-card"

type ProfileStatCardsProps = {
    rating: number | null
    stats: ProfileStats
}

export function ProfileStatCards({ rating, stats }: ProfileStatCardsProps) {
    const ratingChange = stats.lastRound?.ratingChange ?? null
    const lastContestAt = stats.lastRound?.startTime ?? null

    return (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            <StatCard
                label="Rating"
                value={rating ?? "-"}
                valueColor={rankColor(rating)}
                extra={
                    ratingChange !== null && (
                        <span
                            className={
                                ratingChange >= 0
                                    ? "text-sm font-semibold text-[#4ADE80]"
                                    : "text-sm font-semibold text-destructive"
                            }
                        >
                            {ratingChange >= 0 ? "+" : ""}
                            {ratingChange}
                        </span>
                    )
                }
                hint={
                    ratingChange !== null
                        ? "after the last contest"
                        : "no rated contests yet"
                }
            />
            <StatCard
                label="Problems solved"
                value={stats.solved}
                hint={
                    stats.solvedThisMonth > 0
                        ? `+${stats.solvedThisMonth} this month`
                        : "none this month"
                }
            />
            <StatCard
                label="Contests"
                value={stats.contests}
                hint={
                    lastContestAt
                        ? `last one ${formatTimeAgo(lastContestAt)}`
                        : "no rated contests yet"
                }
            />
            <StatCard
                label="To upsolve"
                value={stats.toUpsolve}
                valueColor="#FBBF24"
                hint={`${stats.upsolveDone} already done`}
            />
        </section>
    )
}
