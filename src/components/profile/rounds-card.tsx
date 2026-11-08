import type { LastRound, UpcomingContest } from "@/lib/profile"
import { formatTimeAgo } from "@/lib/time"
import { cn } from "@/lib/utils"

import { LocalDateTime } from "./local-date-time"

const SECTION_TITLE =
    "text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase"

function shortRoundName(name: string): string {
    return name.replace(
        /^Educational Codeforces Round (\d+).*$/,
        "Educational Round $1"
    )
}

type RoundsCardProps = {
    upcoming: UpcomingContest[]
    lastRound: LastRound | null
}

export function RoundsCard({ upcoming, lastRound }: RoundsCardProps) {
    return (
        <section className="flex min-w-0 flex-[1_1_360px] flex-col gap-5 rounded-[14px] border border-border bg-card p-6">
            <h2 className="text-[17px] font-semibold">Rounds</h2>
            <div className="flex flex-col gap-2">
                <span className={SECTION_TITLE}>Upcoming</span>
                {upcoming.length === 0 && (
                    <span className="text-[13px] text-muted-foreground">
                        No rounds scheduled yet
                    </span>
                )}
                {upcoming.map((round, index) => (
                    <a
                        key={round.id}
                        href="https://codeforces.com/contests"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 rounded-[10px] border border-border bg-background px-3 py-2.5"
                    >
                        <span className="flex min-w-0 flex-col gap-0.5">
                            <span
                                title={round.name}
                                className="truncate text-sm font-medium"
                            >
                                {shortRoundName(round.name)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                <LocalDateTime date={round.startTime} />
                            </span>
                        </span>
                        <span
                            className={cn(
                                "text-xs whitespace-nowrap",
                                index === 0
                                    ? "font-semibold text-[#FBBF24]"
                                    : "text-muted-foreground"
                            )}
                        >
                            {formatTimeAgo(round.startTime)}
                        </span>
                    </a>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                <span className={SECTION_TITLE}>Last round</span>
                {lastRound ? (
                    <div className="flex items-center justify-between gap-3 rounded-[10px] border border-border px-3 py-2.5">
                        <span className="flex min-w-0 flex-col gap-0.5">
                            <span
                                title={lastRound.name}
                                className="truncate text-sm font-medium"
                            >
                                {shortRoundName(lastRound.name)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                place {lastRound.place} · {lastRound.solved}{" "}
                                solved
                            </span>
                        </span>
                        <span
                            className={cn(
                                "font-mono text-sm font-bold",
                                lastRound.ratingChange >= 0
                                    ? "text-[#4ADE80]"
                                    : "text-destructive"
                            )}
                        >
                            {lastRound.ratingChange >= 0 ? "+" : ""}
                            {lastRound.ratingChange}
                        </span>
                    </div>
                ) : (
                    <span className="text-[13px] text-muted-foreground">
                        No rated rounds yet
                    </span>
                )}
            </div>
        </section>
    )
}
