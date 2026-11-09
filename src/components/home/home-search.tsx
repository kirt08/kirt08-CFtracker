"use client"

import { useHandleSearch } from "@/lib/use-handle-search"

import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function HomeSearch() {
    const handleSubmit = useHandleSearch()

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="mt-4 flex w-full max-w-140 flex-wrap gap-2.5"
        >
            <label htmlFor="home-search" className="sr-only">
                Codeforces handle
            </label>
            <div className="flex h-13 flex-[1_1_280px] items-center gap-2 rounded-[10px] border border-input bg-card px-3.5 transition-colors focus-within:border-foreground/25 focus-within:ring-3 focus-within:ring-foreground/5">
                <span className="font-mono text-[15px] text-muted-foreground">
                    /u/
                </span>
                <Input
                    id="home-search"
                    name="handle"
                    type="text"
                    placeholder="tourist"
                    autoComplete="off"
                    className="h-12 flex-1 rounded-none border-0 bg-transparent px-0 font-mono text-base focus-visible:ring-0 dark:bg-transparent"
                />
            </div>
            <Button
                type="submit"
                size="xl"
                className="h-13 w-full rounded-[10px] px-5.5 sm:w-auto"
            >
                View profile
            </Button>
        </form>
    )
}
