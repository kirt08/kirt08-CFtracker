"use client"

import { useActionState, useEffect, useState } from "react"

import {
    cancelVerification,
    checkVerification,
    CheckVerificationState,
} from "@/app/settings/action"
import { Button } from "@/components/ui/button"
import { rankColor } from "@/lib/rank"

type HandleVerifyProps = {
    handle: string
    rating: number | null
    contestId: number
    problemIndex: string
    problemName: string
    expiresAt: Date
}

const initialState: CheckVerificationState = { error: null }

function formatTimeLeft(ms: number): string {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0")
    const seconds = String(totalSeconds % 60).padStart(2, "0")

    return `${minutes}:${seconds}`
}

export function HandleVerify({
    handle,
    rating,
    contestId,
    problemIndex,
    problemName,
    expiresAt,
}: HandleVerifyProps) {
    const [msLeft, setMsLeft] = useState(() => expiresAt.getTime() - Date.now())
    const [state, formAction, isPending] = useActionState(
        checkVerification,
        initialState
    )

    useEffect(() => {
        const timer = setInterval(() => {
            setMsLeft(expiresAt.getTime() - Date.now())
        }, 1000)

        return () => clearInterval(timer)
    }, [expiresAt])

    const handleName = (
        <span
            className="font-mono font-bold"
            style={{ color: rankColor(rating) }}
        >
            {handle}
        </span>
    )

    return (
        <section
            id="handle"
            className="flex flex-col gap-5 rounded-[14px] border border-border bg-card p-6"
        >
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[17px] font-semibold">
                        Confirm it’s you
                    </h2>
                    <span className="text-sm text-muted-foreground">
                        Linking {handleName}
                    </span>
                </div>
                <span className="rounded-full bg-[#3A2A06] px-2.5 py-1 text-xs font-semibold text-[#FBBF24]">
                    Waiting for submission
                </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background p-4">
                <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground">
                        Problem
                    </span>
                    <a
                        href={`https://codeforces.com/problemset/problem/${contestId}/${problemIndex}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono font-bold text-link hover:underline"
                    >
                        {contestId}
                        {problemIndex} · {problemName}
                    </a>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-muted-foreground">
                        Time left
                    </span>
                    <span
                        suppressHydrationWarning
                        className="font-mono text-[22px] font-bold text-[#FBBF24]"
                    >
                        {formatTimeLeft(msLeft)}
                    </span>
                </div>
            </div>

            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-normal text-zinc-300">
                <li>
                    Open the problem on Codeforces while signed in as{" "}
                    {handleName}.
                </li>
                <li>Submit any code that doesn’t compile.</li>
                <li>
                    Once you see “Compilation error”, come back and press Check.
                </li>
            </ol>

            <form action={formAction} className="flex flex-wrap gap-2.5">
                <Button
                    type="submit"
                    size="xl"
                    disabled={isPending}
                    className="flex-[1_1_200px]"
                >
                    {isPending ? "Checking…" : "Check"}
                </Button>
                <Button
                    type="submit"
                    variant="outline"
                    size="xl"
                    formAction={cancelVerification}
                    className="font-medium"
                >
                    Cancel
                </Button>
            </form>

            {state.error && (
                <p role="alert" className="text-[13px] text-destructive">
                    {state.error}
                </p>
            )}
        </section>
    )
}
