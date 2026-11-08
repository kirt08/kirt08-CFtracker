type SettingsNavProps = { hasHandle: boolean }

export function SettingsNav({ hasHandle }: SettingsNavProps) {
    return (
        <nav
            aria-label="Settings sections"
            className="flex flex-[1_1_200px] flex-col gap-1 text-sm"
        >
            <a
                href="#handle"
                className="flex items-center justify-between rounded-md bg-muted px-3 py-2.5 font-semibold"
            >
                Codeforces handle
                {!hasHandle && (
                    <span className="size-2 rounded-full bg-[#FBBF24]" />
                )}
            </a>
            <a href="#account" className="rounded-md px-3 py-2.5 text-zinc-300">
                Account
            </a>
            <a href="#signin" className="rounded-md px-3 py-2.5 text-zinc-300">
                Sign-in methods
            </a>
            <a href="#danger" className="rounded-md px-3 py-2.5 text-zinc-300">
                Delete account
            </a>
        </nav>
    )
}
