import { Button } from "@/components/ui/button"

type SignInMethodsSectionProps = { email: string }

export function SignInMethodsSection({ email }: SignInMethodsSectionProps) {
    return (
        <section
            id="signin"
            className="flex flex-col gap-1 rounded-[14px] border border-border bg-card p-6"
        >
            <h2 className="mb-3 text-[17px] font-semibold">Sign-in methods</h2>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-3.5">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-medium">
                        Email and password
                    </span>
                    <span className="text-[13px] text-muted-foreground">
                        {email}
                    </span>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="md"
                    className="font-normal"
                >
                    Change password
                </Button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-3.5">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-medium">GitHub</span>
                    <span className="text-[13px] text-muted-foreground">
                        Not connected
                    </span>
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    size="md"
                    className="font-semibold"
                >
                    Connect GitHub
                </Button>
            </div>
        </section>
    )
}
