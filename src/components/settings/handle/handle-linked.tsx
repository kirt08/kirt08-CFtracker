import Link from "next/link"

import { unlinkHandle } from "@/app/settings/action"
import { Button, buttonVariants } from "@/components/ui/button"
import { rankColor } from "@/lib/rank"

import { SettingsBanner } from "../settings-banner"

type HandleLinkedProps = {
    handle: string
    rating: number | null
    rank: string | null
    verifiedAt: Date | null
    isFirstSync: boolean
}

const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" })

export function HandleLinked({
    handle,
    rating,
    rank,
    verifiedAt,
    isFirstSync,
}: HandleLinkedProps) {
    const details = [
        rank,
        rating,
        verifiedAt && `linked ${dateFormat.format(verifiedAt)}`,
    ]
        .filter(Boolean)
        .join(" · ")

    return (
        <>
            {isFirstSync && (
                <SettingsBanner
                    variant="success"
                    action={
                        <Link
                            href={`/u/${handle}`}
                            className="font-semibold text-[#4ADE80] underline"
                        >
                            Open profile
                        </Link>
                    }
                >
                    Handle verified. We’re loading your data - your profile will
                    be ready in a moment.
                </SettingsBanner>
            )}

            <section
                id="handle"
                className="flex flex-col gap-4.5 rounded-[14px] border border-border bg-card p-6"
            >
                <h2 className="text-[17px] font-semibold">Codeforces handle</h2>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center gap-3.5">
                        <div className="flex size-13 items-center justify-center rounded-[10px] border border-border bg-muted text-[10px] text-muted-foreground">
                            avatar
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className="font-mono text-lg font-bold"
                                    style={{ color: rankColor(rating) }}
                                >
                                    {handle}
                                </span>
                                <span className="rounded-full bg-[#052E16] px-2 py-0.5 text-xs font-semibold text-[#4ADE80]">
                                    Verified
                                </span>
                            </div>
                            <span className="text-[13px] text-muted-foreground first-letter:uppercase">
                                {details}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Link
                            href={`/u/${handle}`}
                            className={buttonVariants({
                                size: "md",
                                className: "font-semibold",
                            })}
                        >
                            View profile
                        </Link>
                        <form action={unlinkHandle}>
                            <Button
                                type="submit"
                                variant="outline"
                                size="md"
                                className="font-normal"
                            >
                                Unlink
                            </Button>
                        </form>
                    </div>
                </div>
                <span className="text-[13px] text-muted-foreground">
                    Your data refreshes automatically every few hours. You can
                    also sync manually from your profile.
                </span>
            </section>
        </>
    )
}
