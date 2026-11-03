"use client"

import { useSearchParams } from "next/navigation"

import { toOAuthMessage } from "@/lib/auth-client"

export function OAuthError() {
    const searchParams = useSearchParams()
    const code = searchParams.get("error")

    if (!code) return null

    return (
        <p role="alert" className="text-[13px] text-destructive">
            {toOAuthMessage(code)}
        </p>
    )
}
