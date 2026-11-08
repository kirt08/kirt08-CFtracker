"use client"

import { RotateCw } from "lucide-react"
import { useTransition } from "react"

import { syncMyProfile } from "@/app/u/[handle]/action"
import { cn } from "@/lib/utils"

import { Button } from "../ui/button"

export function SyncButton() {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            type="button"
            size="xl"
            disabled={isPending}
            onClick={() => startTransition(() => syncMyProfile())}
            className="h-11 gap-2 rounded-[10px] px-4.5 text-sm"
        >
            <RotateCw
                aria-hidden
                className={cn("size-4", isPending && "animate-spin")}
            />
            {isPending ? "Syncing…" : "Sync now"}
        </Button>
    )
}
