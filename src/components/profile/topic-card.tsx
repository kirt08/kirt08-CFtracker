import { Info } from "lucide-react"

import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverTrigger,
} from "@/components/ui/popover"
import type { TopicStat } from "@/lib/profile"

const WEAK_RATE = 40
const BORDERLINE_RATE = 45
const BORDERLINE_COLOR = "#FBBF24"

function rateColor(rate: number): string {
    if (rate < WEAK_RATE) return "var(--weak-topic)"
    if (rate < BORDERLINE_RATE) return BORDERLINE_COLOR
    return "#3B82F6"
}

type TopicsCardProps = { topics: TopicStat[] }

export function TopicsCard({ topics }: TopicsCardProps) {
    return (
        <section className="flex flex-col gap-4.5 rounded-[14px] border border-border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[17px] font-semibold">Solved by topic</h2>
                <span className="text-[13px] text-muted-foreground">
                    bar = success rate
                    <Popover>
                        <PopoverTrigger
                            aria-label="How the success rate is calculated"
                            className="ml-1 inline-flex align-[-2px] text-muted-foreground hover:text-foreground"
                        >
                            <Info aria-hidden className="size-3.5" />
                        </PopoverTrigger>
                        <PopoverContent className="w-64 text-[13px] leading-normal">
                            <PopoverDescription
                                render={<div />}
                                className="flex flex-col gap-2"
                            >
                                <p>
                                    Accepted submissions divided by all your
                                    submissions on problems with this topic.
                                </p>
                                <p>
                                    Between{" "}
                                    <span style={{ color: BORDERLINE_COLOR }}>
                                        {WEAK_RATE}%
                                    </span>{" "}
                                    and{" "}
                                    <span style={{ color: BORDERLINE_COLOR }}>
                                        {BORDERLINE_RATE}%
                                    </span>{" "}
                                    is borderline: close, but worth some extra
                                    practice.
                                </p>
                                <p>
                                    Below{" "}
                                    <span className="text-weak-topic">
                                        {WEAK_RATE}%
                                    </span>{" "}
                                    counts as a weak topic.
                                </p>
                            </PopoverDescription>
                        </PopoverContent>
                    </Popover>
                </span>
            </div>
            {topics.length === 0 && (
                <span className="text-[13px] text-muted-foreground">
                    No submissions yet
                </span>
            )}
            <div
                className="grid gap-x-10 gap-y-3.5 lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[repeat(var(--topic-rows),auto)]"
                style={
                    {
                        "--topic-rows": Math.ceil(topics.length / 2),
                    } as React.CSSProperties
                }
            >
                {topics.map(({ name, solved, rate }) => {
                    const color = rateColor(rate)

                    return (
                        <div key={name} className="flex flex-col gap-1.5">
                            <div className="flex justify-between gap-3 text-sm">
                                <span className="font-medium">{name}</span>
                                <span className="font-mono text-[13px] text-muted-foreground">
                                    <span>{solved}</span> ·{" "}
                                    <span style={{ color }}>{rate}%</span>
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded bg-border">
                                <div
                                    className="h-full rounded"
                                    style={{
                                        width: `${rate}%`,
                                        backgroundColor: color,
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
