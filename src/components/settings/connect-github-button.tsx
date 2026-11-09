"use client"

import { useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { linkGitHub } from "@/lib/auth-client"

export function ConnectGitHubButton() {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    function handleClick() {
        startTransition(async () => {
            const result = await linkGitHub()
            setError(result.error)
        })
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <Button
                type="button"
                variant="secondary"
                size="md"
                className="font-semibold"
                disabled={isPending}
                onClick={handleClick}
            >
                Connect GitHub
            </Button>
            {error && (
                <p role="alert" className="text-[13px] text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}
