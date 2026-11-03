import Link from "next/link"

import { getSession } from "@/lib/session"

import { buttonVariants } from "../ui/button"
import { AccountMenu } from "./account-menu"

export async function HeaderAuth() {
    const session = await getSession()

    if (session) {
        return (
            <AccountMenu name={session.user.name} email={session.user.email} />
        )
    }

    return (
        <nav className="flex items-center gap-2">
            <Link
                href="/login"
                className={buttonVariants({
                    variant: "ghost",
                    size: "lg",
                })}
            >
                Sign in
            </Link>
            <Link
                href="/signup"
                className={buttonVariants({
                    variant: "secondary",
                    size: "lg",
                    className: "font-semibold",
                })}
            >
                Sign up
            </Link>
        </nav>
    )
}
