import { Metadata } from "next"
import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { AuthDivider } from "@/components/auth/auth-divider"
import { GitHubButton } from "@/components/auth/github-button"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
    title: "Sign up · CF tracker",
}

export default function SignUpPage() {
    return (
        <AuthCard
            title="Create an account"
            description="You can link your Codeforces handle later in settings."
            footer={
                <>
                    Already have an account?{" "}
                    <Link href="/login" className="text-link hover:underline">
                        Sign In
                    </Link>
                </>
            }
        >
            <GitHubButton label="Sign up with GitHub" />
            <AuthDivider />
            <SignUpForm />
        </AuthCard>
    )
}
