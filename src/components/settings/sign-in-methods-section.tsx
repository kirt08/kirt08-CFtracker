import { Suspense } from "react"

import { OAuthError } from "@/components/auth/oauth-error"

import { ConnectGitHubButton } from "./connect-github-button"
import { PasswordDialog } from "./password-dialog"

type SignInMethodsSectionProps = {
    email: string
    hasPassword: boolean
    hasGitHub: boolean
}

export function SignInMethodsSection({
    email,
    hasPassword,
    hasGitHub,
}: SignInMethodsSectionProps) {
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
                <PasswordDialog hasPassword={hasPassword} email={email} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-3.5">
                <div className="flex flex-col gap-0.5">
                    <span className="text-[15px] font-medium">GitHub</span>
                    <span className="text-[13px] text-muted-foreground">
                        {hasGitHub ? "Connected" : "Not connected"}
                    </span>
                </div>
                {!hasGitHub && <ConnectGitHubButton />}
            </div>
            <Suspense fallback={null}>
                <OAuthError />
            </Suspense>
        </section>
    )
}
