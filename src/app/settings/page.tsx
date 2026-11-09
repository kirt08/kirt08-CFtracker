import type { Metadata } from "next"
import { Suspense } from "react"

import { AccountSection } from "@/components/settings/account-section"
import { DeleteAccountSection } from "@/components/settings/delete-account-section"
import { HandleSection } from "@/components/settings/handle/handle-section"
import { SettingsNav } from "@/components/settings/settings-nav"
import { SignInMethodsSection } from "@/components/settings/sign-in-methods-section"
import { getSignInMethods } from "@/lib/account"
import { getHandleData } from "@/lib/handle"
import { requireSession } from "@/lib/session"

export const metadata: Metadata = {
    title: "Settings · CF tracker",
}

async function SettingsContent() {
    const { user } = await requireSession()
    const [handleData, signInMethods] = await Promise.all([
        getHandleData(user.id),
        getSignInMethods(user.id),
    ])

    return (
        <>
            <SettingsNav hasHandle={handleData.state === "linked"} />
            <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-5">
                <HandleSection data={handleData} />
                <AccountSection name={user.name} email={user.email} />
                <SignInMethodsSection
                    email={user.email}
                    hasPassword={signInMethods.hasPassword}
                    hasGitHub={signInMethods.hasGitHub}
                />
                <DeleteAccountSection hasPassword={signInMethods.hasPassword} />
            </div>
        </>
    )
}

export default function SettingsPage() {
    return (
        <main className="mx-auto flex w-full max-w-300 flex-col gap-7 px-6 pt-10 pb-20">
            <h1 className="text-3xl font-bold">Settings</h1>
            <div className="flex flex-wrap items-start gap-8">
                <Suspense fallback={null}>
                    <SettingsContent />
                </Suspense>
            </div>
        </main>
    )
}
