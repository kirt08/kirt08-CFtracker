import type { DifficultyBucket } from "@/lib/profile"
import { rankColor } from "@/lib/rank"

const MAX_BAR_HEIGHT = 170
const LAST_BUCKET = 2400

type DifficultyChartProps = { buckets: DifficultyBucket[] }

export function DifficultyChart({ buckets }: DifficultyChartProps) {
    const maxSolved = Math.max(1, ...buckets.map((bucket) => bucket.solved))

    return (
        <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-4 rounded-[14px] border border-border bg-card p-6">
            <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-[17px] font-semibold">
                    Solved by difficulty
                </h2>
                <span className="text-[13px] text-muted-foreground">
                    colored by rank
                </span>
            </div>
            <div className="overflow-x-auto">
                <div
                    role="img"
                    aria-label="Problems solved by difficulty rating, from 800 to 2400 and above"
                    className="flex h-55 min-w-130 items-end gap-1.5"
                >
                    {buckets.map(({ rating, solved }) => (
                        <div
                            key={rating}
                            className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                        >
                            <span className="font-mono text-[11px] text-zinc-300">
                                {solved}
                            </span>
                            <span
                                className="w-full rounded-t"
                                style={{
                                    height: Math.max(
                                        2,
                                        Math.round(
                                            (solved / maxSolved) *
                                                MAX_BAR_HEIGHT
                                        )
                                    ),
                                    backgroundColor: rankColor(rating),
                                }}
                            />
                            <span className="font-mono text-[11px] text-muted-foreground">
                                {rating === LAST_BUCKET ? `${rating}+` : rating}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
