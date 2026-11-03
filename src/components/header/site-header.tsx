import Link from "next/link"
import { Suspense } from "react"

import { HeaderAuth } from "./header-auth"
import { HeaderSearch } from "./header-search"

export function SiteHeader() {
    return (
        <header className="border-b border-border">
            <div className="mx-auto flex max-w-300 flex-wrap items-center justify-between gap-4 px-6 py-3.5">
                <Link
                    href="/"
                    className="flex items-center gap-2.5 text-foreground"
                >
                    <span aria-hidden className="flex h-5.5 items-end gap-0.75">
                        <span className="h-3 w-1.5 rounded-[1px] bg-[#FBBF24]" />
                        <span className="h-5.5 w-1.5 rounded-[1px] bg-[#3B82F6]" />
                        <span className="h-4 w-1.5 rounded-[1px] bg-[#EF4444]" />
                    </span>
                    <span className="font-mono text-[17px] font-bold">
                        cf·tracker
                    </span>
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                    <HeaderSearch />
                    <Suspense fallback={<div className="h-10" />}>
                        <HeaderAuth />
                    </Suspense>
                </div>
            </div>
        </header>
    )
}
