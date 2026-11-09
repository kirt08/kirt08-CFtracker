import { Suspense } from "react"

import { FeatureCards } from "@/components/home/feature-cards"
import { HomeSearch } from "@/components/home/home-search"
import {
    RecentlyViewed,
    RecentlyViewedSkeleton,
} from "@/components/home/recently-viewed"

export default function Home() {
    return (
        <>
            <main className="mx-auto flex w-full max-w-300 flex-1 flex-col gap-18 px-6 pt-24 pb-16">
                <section className="flex flex-col items-center gap-5 text-center">
                    <span className="text-[13px] font-semibold tracking-[0.06em] text-muted-foreground uppercase">
                        Contest prep
                    </span>
                    <h1 className="max-w-190 text-4xl leading-[1.08] font-bold tracking-[-0.02em] sm:text-[52px]">
                        See what you’ve solved — and what’s left to upsolve
                    </h1>
                    <p className="max-w-150 text-lg leading-[1.55] text-muted-foreground">
                        Enter a Codeforces handle to see stats by topic and
                        difficulty, plus the contest problems you didn’t finish.
                    </p>
                    <HomeSearch />
                    <Suspense fallback={<RecentlyViewedSkeleton />}>
                        <RecentlyViewed />
                    </Suspense>
                </section>
                <FeatureCards />
            </main>
            <footer className="border-t border-border">
                <div className="mx-auto flex max-w-300 flex-wrap justify-between gap-3 px-6 py-5 text-[13px] text-muted-foreground">
                    <span>
                        Data from Codeforces. Not affiliated with Codeforces.
                    </span>
                    <a
                        href="https://github.com/kirt08/kirt08-CFtracker"
                        className="text-link hover:text-[#93C5FD]"
                    >
                        GitHub
                    </a>
                </div>
            </footer>
        </>
    )
}
