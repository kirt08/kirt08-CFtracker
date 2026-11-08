"use client"

import { cn } from "cn"
import { useState, useTransition } from "react"

import { loadUpsolvePage } from "@/app/u/[handle]/action"
import { UpsolveRow } from "@/components/profile/upsolve-row"
import { Button } from "@/components/ui/button"
import type {
    UpsolveCursor,
    UpsolveFilter,
    UpsolveItem,
    UpsolvePage,
} from "@/lib/upsolve"

const FILTERS: { value: UpsolveFilter; label: string; empty: string }[] = [
    { value: "all", label: "All", empty: "Nothing to upsolve yet." },
    { value: "todo", label: "To do", empty: "Nothing left to upsolve." },
    { value: "done", label: "Done", empty: "No upsolved problems yet." },
]

export function UpsolveCard({
    handle,
    isOwner,
    initialPage,
}: {
    handle: string
    isOwner: boolean
    initialPage: UpsolvePage
}) {
    const [filter, setFilter] = useState<UpsolveFilter>("all")
    const [items, setItems] = useState(initialPage.items)
    const [nextCursor, setNextCursor] = useState(initialPage.nextCursor)
    const [hasError, setHasError] = useState(false)
    const [isLoading, startLoading] = useTransition()

    function load(nextFilter: UpsolveFilter, cursor: UpsolveCursor | null) {
        if (isLoading) return

        setFilter(nextFilter)
        setHasError(false)
        startLoading(async () => {
            try {
                const page = await loadUpsolvePage(handle, nextFilter, cursor)

                setItems((current) =>
                    cursor ? [...current, ...page.items] : page.items
                )
                setNextCursor(page.nextCursor)
            } catch {
                setHasError(true)
            }
        })
    }

    function updateItem(target: UpsolveItem, patch: Partial<UpsolveItem>) {
        setItems((current) =>
            current.map((item) =>
                item.contestId === target.contestId &&
                item.index === target.index
                    ? { ...item, ...patch }
                    : item
            )
        )
    }

    return (
        <section className="flex flex-col gap-4 rounded-[14px] border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[17px] font-semibold">Upsolve</h2>
                    <span className="text-[13px] text-muted-foreground">
                        Problems from contests you entered but didn’t solve
                    </span>
                </div>
                <div className="flex gap-1.5">
                    {FILTERS.map(({ value, label }) => {
                        const isActive = value === filter

                        return (
                            <Button
                                key={value}
                                variant={isActive ? "default" : "outline"}
                                aria-pressed={isActive}
                                onClick={() => {
                                    if (!isActive || hasError) load(value, null)
                                }}
                                className={cn(
                                    "h-auto rounded-full px-3 py-1.5 text-[13px]",
                                    isActive
                                        ? "bg-foreground font-semibold text-background hover:bg-foreground/90"
                                        : "border-zinc-700 font-normal text-zinc-300 dark:border-zinc-700"
                                )}
                            >
                                {label}
                            </Button>
                        )
                    })}
                </div>
            </div>

            <div
                aria-busy={isLoading}
                className={cn(
                    "flex flex-col border-t border-border transition-opacity",
                    isLoading && "opacity-60"
                )}
            >
                {items.map((item) => (
                    <UpsolveRow
                        key={`${item.contestId}${item.index}`}
                        item={item}
                        isOwner={isOwner}
                        onChange={(patch: Partial<UpsolveItem>) =>
                            updateItem(item, patch)
                        }
                    />
                ))}
                {items.length === 0 && (
                    <p className="py-8 text-center text-[13px] text-muted-foreground">
                        {FILTERS.find(({ value }) => value === filter)?.empty}
                    </p>
                )}
            </div>

            {hasError && (
                <p className="text-center text-[13px] text-destructive">
                    Couldn’t load problems. Try again.
                </p>
            )}

            {nextCursor && (
                <Button
                    variant="outline"
                    className="h-11 self-center rounded-[10px] border-zinc-700 px-5.5 dark:border-zinc-700"
                    onClick={() => load(filter, nextCursor)}
                    disabled={isLoading}
                >
                    {isLoading ? "Loading…" : "Load more"}
                </Button>
            )}
        </section>
    )
}
