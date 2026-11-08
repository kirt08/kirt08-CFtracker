"use client"

import { cn } from "cn"
import { Check } from "lucide-react"
import { useState, useTransition } from "react"

import {
    deleteUpsolveNote,
    saveUpsolveNote,
    setUpsolveDone,
} from "@/app/u/[handle]/action"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { rankColor } from "@/lib/rank"
import type { UpsolveItem } from "@/lib/upsolve"

function NoteEditor({
    item,
    onSaved,
    onCancel,
}: {
    item: UpsolveItem
    onSaved: (note: string | null) => void
    onCancel: () => void
}) {
    const [draft, setDraft] = useState(item.note ?? "")
    const [hasError, setHasError] = useState(false)
    const [isSaving, startSaving] = useTransition()

    function run(request: () => Promise<string | null>) {
        setHasError(false)
        startSaving(async () => {
            try {
                onSaved(await request())
            } catch {
                setHasError(true)
            }
        })
    }

    function save() {
        run(() => saveUpsolveNote(item.contestId, item.index, draft))
    }

    function remove() {
        run(async () => {
            await deleteUpsolveNote(item.contestId, item.index)
            return null
        })
    }

    return (
        <div className="mt-1 flex flex-col gap-2">
            <Textarea
                aria-label={`Note for problem ${item.contestId}${item.index}`}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={2000}
                placeholder="What was the key idea?"
                autoFocus
            />
            {hasError && (
                <p className="text-[13px] text-destructive">
                    Something went wrong. Try again.
                </p>
            )}
            <div className="flex gap-2">
                <Button
                    size="md"
                    onClick={save}
                    disabled={isSaving || !draft.trim()}
                >
                    Save
                </Button>
                <Button
                    size="md"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSaving}
                >
                    Cancel
                </Button>
                {item.note && (
                    <Button
                        size="md"
                        variant="destructive"
                        onClick={() => remove()}
                        disabled={isSaving}
                        className="ml-auto"
                    >
                        Delete
                    </Button>
                )}
            </div>
        </div>
    )
}

export function UpsolveRow({
    item,
    isOwner,
    onChange,
}: {
    item: UpsolveItem
    isOwner: boolean
    onChange: (patch: Partial<UpsolveItem>) => void
}) {
    const [isEditing, setIsEditing] = useState(false)

    function toggleDone() {
        const isDone = !item.isDone

        onChange({ isDone })
        setUpsolveDone(item.contestId, item.index, isDone).catch(() => {
            onChange({ isDone: !isDone })
        })
    }

    return (
        <div className="flex flex-wrap items-start gap-4 border-b border-border py-4">
            {isOwner && (
                <span
                    title={item.solvedOnCf ? "Solved on Codeforces" : undefined}
                    className="mt-0.5 shrink-0"
                >
                    <Button
                        variant="outline"
                        size="icon-xs"
                        aria-label="Mark as done"
                        aria-pressed={item.isDone}
                        disabled={item.solvedOnCf}
                        onClick={toggleDone}
                        className={cn(
                            "rounded-md border-[1.5px] disabled:opacity-100",
                            item.isDone
                                ? "border-green-400 bg-green-400 hover:bg-green-400 dark:border-green-400 dark:bg-green-400 dark:hover:bg-green-400"
                                : "border-zinc-600 dark:border-zinc-600"
                        )}
                    >
                        {item.isDone && (
                            <Check
                                strokeWidth={3}
                                className="size-3.5 text-background"
                            />
                        )}
                    </Button>
                </span>
            )}

            <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-2.5">
                    <a
                        href={`https://codeforces.com/contest/${item.contestId}/problem/${item.index}`}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            "min-w-0 font-mono text-[15px] font-bold wrap-anywhere hover:underline",
                            item.isDone && "text-zinc-500"
                        )}
                    >
                        {item.contestId}
                        {item.index} · {item.name}
                    </a>
                    {item.rating !== null && (
                        <span
                            className="rounded bg-[#1C1C1C] px-1.5 py-0.5 font-mono text-xs font-bold"
                            style={{ color: rankColor(item.rating) }}
                        >
                            {item.rating}
                        </span>
                    )}
                </div>

                <span className="text-[13px] text-muted-foreground">
                    {item.contestName} · {item.attempts}{" "}
                    {item.attempts === 1 ? "attempt" : "attempts"}
                </span>

                {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-border px-2 py-0.5 text-xs text-zinc-300"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {isEditing ? (
                    <NoteEditor
                        item={item}
                        onCancel={() => setIsEditing(false)}
                        onSaved={(note) => {
                            onChange({ note })
                            setIsEditing(false)
                        }}
                    />
                ) : (
                    item.note && (
                        <p className="mt-1 rounded-lg border border-border bg-background px-3 py-2.5 text-[13px] leading-normal wrap-anywhere whitespace-pre-wrap text-zinc-300">
                            {item.note}
                        </p>
                    )
                )}
            </div>

            {isOwner && !isEditing && (
                <Button
                    variant="outline"
                    className="h-9 border-zinc-700 px-3 text-[13px] font-normal text-zinc-300 dark:border-zinc-700"
                    onClick={() => setIsEditing(true)}
                >
                    {item.note ? "Edit note" : "Add note"}
                </Button>
            )}
        </div>
    )
}
