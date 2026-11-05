import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

type SettingsBannerProps = {
    variant: "info" | "success"
    title?: string
    action?: React.ReactNode
    children: React.ReactNode
}

const VARIANT_STYLES = {
    info: { box: "border-[#1E3A8A] bg-[#0B1530]", icon: "text-link" },
    success: { box: "border-[#14532D] bg-[#052E16]", icon: "text-[#4ADE80]" },
}

export function SettingsBanner({
    variant,
    title,
    action,
    children,
}: SettingsBannerProps) {
    const styles = VARIANT_STYLES[variant]

    return (
        <div
            role="status"
            className={cn(
                "flex gap-3 rounded-xl border px-4.5 text-sm leading-normal",
                title ? "items-start py-4" : "items-center py-3.5",
                styles.box
            )}
        >
            <Check
                aria-hidden
                className={cn("size-5 flex-none", styles.icon)}
            />
            <div className="flex flex-1 flex-col gap-1">
                {title && <span className="font-semibold">{title}</span>}
                <span className={title ? "text-zinc-300" : undefined}>
                    {children}
                </span>
            </div>
            {action}
        </div>
    )
}
