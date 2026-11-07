import { LoaderCircle } from "lucide-react"

import { LoadingSteps } from "./loading-steps"

type ProfileSkeletonProps = { handle?: string }

export function ProfileSkeleton({ handle }: ProfileSkeletonProps) {
    return (
        <>
            <section className="flex flex-wrap items-center gap-5">
                <div className="size-22 rounded-2xl bg-[#1C1C1C]" />
                <div className="flex flex-col gap-2.5">
                    <span className="h-3.5 w-22.5 rounded bg-[#1C1C1C]" />
                    {handle ? (
                        <h1 className="font-mono text-[34px] leading-[normal] font-bold text-zinc-300">
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
        </>
    )
}
