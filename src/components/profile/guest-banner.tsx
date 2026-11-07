import Link from "next/link"

export function GuestBanner() {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#1E3A8A] bg-[#0B1530] px-4.5 py-3.5 text-sm">
            <span className="text-zinc-300">
                Is this your profile? Sign up and link your handle to track
                upsolving and keep notes.
            </span>
            <Link
                href="/signup"
                className="font-semibold text-link hover:text-[#93C5FD]"
            >
                Link handle
            </Link>
        </div>
    )
}
