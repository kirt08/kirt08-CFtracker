type StatCardProps = {
    label: string
    value: React.ReactNode
    valueColor?: string
    extra?: React.ReactNode
    hint: string
}

export function StatCard({
    label,
    value,
    valueColor,
    extra,
    hint,
}: StatCardProps) {
    return (
        <div className="flex flex-col gap-2 rounded-[14px] border border-border bg-card p-5">
            <span className="text-[13px] text-muted-foreground">{label}</span>
            <div className="flex items-baseline gap-2.5">
                <span
                    className="font-mono text-[32px] leading-[normal] font-bold"
                    style={{ color: valueColor }}
                >
                    {value}
                </span>
                {extra}
            </div>
            <span className="text-xs text-muted-foreground">{hint}</span>
        </div>
    )
}
