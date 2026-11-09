"use client"

import { usePathname } from "next/navigation"

import { useHandleSearch } from "@/lib/use-handle-search"

import { Input } from "../ui/input"

export function HeaderSearch() {
    const handleSubmit = useHandleSearch()
    const pathname = usePathname()

    if (pathname === "/") return null

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
