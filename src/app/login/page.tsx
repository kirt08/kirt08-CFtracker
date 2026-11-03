import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthDivider } from "@/components/auth/auth-divider"
import { GitHubButton } from "@/components/auth/github-button"
import { OAuthError } from "@/components/auth/oauth-error"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
    title: "Sign in · CF tracker",
}

export default function SignInPage() {
    return (
        <AuthCard
            title="Sign in"
            description="Welcome back. Pick up where you left off."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-link hover:underline">
                        Sign up
                    </Link>
                </>
            }
        >
            <GitHubButton label="Continue with GitHub" />
            <Suspense fallback={null}>
                <OAuthError />
            </Suspense>

            <AuthDivider />

            <SignInForm />
        </AuthCard>
    )
}
