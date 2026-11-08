import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { buttonVariants } from "@/components/ui/button"
import { getOwnerProfile } from "@/lib/handle"
import { getSession } from "@/lib/session"

export const metadata: Metadata = {
    title: "Page not found · CF tracker",
}

async function MyProfileLink() {
    const session = await getSession()
    if (!session) return null

    const profile = await getOwnerProfile(session.user.id)
    if (!profile) return null

    return (
        <Link
            href={`/u/${profile.handle}`}
            className={buttonVariants({
                variant: "outline",
                size: "xl",
                className: "h-11 font-medium",
            })}
        >
            My profile
        </Link>
    )
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
                <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                    <Link
                        href="/"
                        className={buttonVariants({
                            size: "xl",
                            className: "h-11",
                        })}
                    >
                        Back to home
                    </Link>
                    <Suspense fallback={null}>
                        <MyProfileLink />
                    </Suspense>
                </div>
            </div>
        </main>
    )
}
