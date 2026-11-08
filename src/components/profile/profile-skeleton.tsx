import { LoaderCircle } from "lucide-react"

import { LoadingSteps } from "./loading-steps"

const CHART_BARS = [
    70, 85, 60, 50, 45, 38, 30, 25, 20, 16, 12, 10, 8, 6, 5, 4, 3,
]

type ProfileSkeletonProps = { handle?: string }

export function ProfileSkeleton({ handle }: ProfileSkeletonProps) {
    return (
        <>
            <section className="flex flex-wrap items-center gap-5">
                <div className="size-22 rounded-2xl bg-[#1C1C1C]" />
                <div className="flex min-w-0 flex-col gap-2.5">
                    <span className="h-3.5 w-22.5 rounded bg-[#1C1C1C]" />
                    {handle ? (
                        <h1 className="font-mono text-2xl leading-tight font-bold break-all text-zinc-300 sm:text-[34px] sm:leading-[normal]">
                            {handle}
                        </h1>
                    ) : (
                        <span className="h-10 w-48 rounded-md bg-[#1C1C1C]" />
                    )}
                    <span className="h-3.5 w-65 rounded bg-[#1C1C1C]" />
                </div>
            </section>

            {handle && (
                <section
                    aria-live="polite"
                    className="flex items-center gap-4 rounded-[14px] border border-border bg-card px-5 py-4.5"
                >
                    <LoaderCircle
                        aria-hidden
                        className="size-5.5 animate-spin text-link"
                    />
                    <div className="flex flex-col gap-1">
                        <span className="text-[15px] font-semibold">
                            Loading this profile for the first time
                        </span>
                        <LoadingSteps />
                    </div>
                </section>
            )}

            <section className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
                {[40, 45, 35, 30].map((width) => (
                    <div
                        key={width}
                        className="flex h-34 flex-col gap-3 rounded-[14px] border border-border bg-card p-5"
                    >
                        <span className="h-3 w-2/5 rounded bg-[#1C1C1C]" />
                        <span
                            className="h-7 rounded-md bg-[#1C1C1C]"
                            style={{ width: `${width + 15}%` }}
                        />
                    </div>
                ))}
            </section>

            <div className="flex flex-wrap gap-6">
                <section className="flex min-w-0 flex-[999_1_560px] flex-col gap-4 rounded-[14px] border border-border bg-card p-6">
                    <div className="flex h-6.5 items-center justify-between">
                        <span className="h-4 w-40 rounded bg-[#1C1C1C]" />
                        <span className="h-3 w-24 rounded bg-[#1C1C1C]" />
                    </div>
                    <div className="flex h-55 items-end gap-1.5">
                        {CHART_BARS.map((height) => (
                            <span
                                key={height}
                                className="flex-1 rounded-t bg-[#1C1C1C]"
                                style={{ height: `${height}%` }}
                            />
                        ))}
                    </div>
                </section>

                <section className="flex min-w-0 flex-[1_1_360px] flex-col gap-5 rounded-[14px] border border-border bg-card p-6">
                    <div className="flex h-6.5 items-center">
                        <span className="h-4 w-20 rounded bg-[#1C1C1C]" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="h-4 w-20 rounded bg-[#1C1C1C]" />
                        <div className="h-15 rounded-[10px] border border-border bg-background" />
                        <div className="h-15 rounded-[10px] border border-border bg-background" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <span className="h-4 w-28 rounded bg-[#1C1C1C]" />
                        <div className="h-15 rounded-[10px] border border-border" />
                    </div>
                </section>
            </div>

            <section className="flex flex-col gap-4.5 rounded-[14px] border border-border bg-card p-6">
                <div className="flex h-6.5 items-center justify-between">
                    <span className="h-4 w-36 rounded bg-[#1C1C1C]" />
                    <span className="h-3 w-48 rounded bg-[#1C1C1C]" />
                </div>
                <div className="grid gap-x-10 gap-y-3.5 lg:grid-cols-2">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div key={index} className="flex flex-col gap-1.5">
                            <div className="flex h-5 items-center">
                                <span className="h-3 w-1/3 rounded bg-[#1C1C1C]" />
                            </div>
                            <span className="h-2 rounded bg-[#1C1C1C]" />
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
