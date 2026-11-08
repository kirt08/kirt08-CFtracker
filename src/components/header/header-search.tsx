"use client"

import { usePathname, useRouter } from "next/navigation"

import { Input } from "../ui/input"

export function HeaderSearch() {
    const router = useRouter()
    const pathname = usePathname()

    if (pathname === "/") return null

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget
        const handle = String(new FormData(form).get("handle") ?? "").trim()
        if (!handle) return

        form.reset()
        router.push(`/u/${encodeURIComponent(handle)}`)
    }

    return (
        <form role="search" onSubmit={handleSubmit}>
            <label htmlFor="header-search" className="sr-only">
                Search handle
            </label>
            <Input
                id="header-search"
                name="handle"
                type="search"
                placeholder="Search handle…"
                autoComplete="off"
                className="h-10 w-60 border-border bg-card font-mono text-sm dark:bg-card [&::-webkit-search-cancel-button]:appearance-none"
            />
        </form>
    )
}
