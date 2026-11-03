interface AuthCardProps {
    title: string
    description: string
    children: React.ReactNode
    footer: React.ReactNode
}

export function AuthCard({
    title,
    description,
    children,
    footer,
}: AuthCardProps) {
    return (
        <main className="flex flex-1 items-start justify-center px-4 py-16 sm:py-20">
            <div className="flex w-full max-w-105 flex-col gap-5 rounded-2xl border border-border bg-card p-8">
                <div className="flex flex-col gap-1.5">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                </div>
                {children}
                <p className="text-center text-sm text-muted-foreground">
                    {footer}
                </p>
            </div>
        </main>
    )
}
