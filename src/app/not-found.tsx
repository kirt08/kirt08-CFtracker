import type { Metadata } from "next"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Page not found · CF tracker",
}

export default function NotFound() {
    return (
        <main className="flex flex-1 items-center justify-center px-4 py-16">
            <div className="flex flex-col items-center gap-4 text-center">
                <span className="font-mono text-8xl leading-none font-bold text-zinc-300">
                    404
                </span>
                <h1 className="text-2xl font-semibold">Page not found</h1>
                <p className="text-[15px] text-muted-foreground">
                    The page you’re looking for doesn’t exist or was moved.
                </p>
                <Link
                    href="/"
                    className={buttonVariants({
                        size: "xl",
                        className: "mt-3 h-11",
                    })}
                >
                    Back to home
                </Link>
            </div>
        </main>
    )
}
