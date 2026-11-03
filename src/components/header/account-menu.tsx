"use client"

import { ChevronDown, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { signOut } from "@/lib/auth-client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"

type AccountProps = { name: string; email: string }

export function AccountMenu({ name, email }: AccountProps) {
    const router = useRouter()

    async function handleSignOut() {
        const { error } = await signOut()
        if (error) return

        router.push("/")
        router.refresh()
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Account menu"
                className="flex h-10 items-center gap-2 rounded-full border border-border pr-2.5 pl-1 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
                <span className="flex size-8 items-center justify-center rounded-full bg-border text-[13px] font-bold">
                    {name.charAt(0).toUpperCase()}
                </span>
                <span className="font-medium">{name}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-60 rounded-xl p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] ring-border"
            >
                <div className="mb-1.5 flex flex-col gap-0.5 border-b border-border px-3 pt-2.5 pb-3">
                    <span className="text-sm font-semibold">{name}</span>
                    <span className="truncate text-[13px] text-muted-foreground">
                        {email}
                    </span>
                </div>
                <DropdownMenuItem
                    render={<Link href="/settings" />}
                    className="gap-2.5 rounded-lg px-3 py-2.5"
                >
                    <Settings className="text-muted-foreground" />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="mx-0 my-1.5" />
                <DropdownMenuItem
                    onClick={handleSignOut}
                    className="gap-2.5 rounded-lg px-3 py-2.5"
                >
                    <LogOut className="text-muted-foreground" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
