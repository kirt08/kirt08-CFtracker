import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient()

type AuthResult = { error: string | null }

const ERROR_MESSAGES: Record<string, string> = {
    INVALID_EMAIL_OR_PASSWORD: "Incorrect email or password",
    USER_ALREADY_EXISTS: "An account with this email already exists",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
        "An account with this email already exists",
    PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
    INVALID_EMAIL: "Enter a valid email",
    INVALID_PASSWORD: "Incorrect password",
    SESSION_EXPIRED: "For security, sign in again and retry",
}

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
    account_not_linked:
        "An account with this email already exists. Sign in with your password, then connect GitHub in Settings.",
    access_denied: "GitHub sign-in was cancelled.",
    account_already_linked_to_different_user:
        "This GitHub account is already connected to another user.",
}

type AuthClientError = { code?: string; message?: string; status: number }

function toMessage(error: AuthClientError): string {
    if (error.status === 429) {
        return "Too many attempts. Try again in a minute."
    }
    if (error.code && ERROR_MESSAGES[error.code]) {
        return ERROR_MESSAGES[error.code]
    }
    return error.message ?? "Something went wrong. Try again."
}

export function toOAuthMessage(code: string): string {
    return (
        OAUTH_ERROR_MESSAGES[code] ?? "Couldn't sign in with GitHub. Try again."
    )
}

export async function signUp(input: {
    name: string
    email: string
    password: string
}): Promise<AuthResult> {
    const { error } = await authClient.signUp.email(input)

    return { error: error ? toMessage(error) : null }
}

export async function signIn(input: {
    email: string
    password: string
}): Promise<AuthResult> {
    const { error } = await authClient.signIn.email(input)

    return { error: error ? toMessage(error) : null }
}

export async function signOut(): Promise<AuthResult> {
    const { error } = await authClient.signOut()

    return { error: error ? toMessage(error) : null }
}

export async function updateName(name: string): Promise<AuthResult> {
    const { error } = await authClient.updateUser({ name })

    return { error: error ? toMessage(error) : null }
}

export async function changePassword(input: {
    currentPassword: string
    newPassword: string
}): Promise<AuthResult> {
    const { error } = await authClient.changePassword({
        ...input,
        revokeOtherSessions: true,
    })

    return { error: error ? toMessage(error) : null }
}

export async function linkGitHub(): Promise<AuthResult> {
    const { error } = await authClient.linkSocial({
        provider: "github",
        callbackURL: "/settings",
        errorCallbackURL: "/settings",
    })

    return { error: error ? toMessage(error) : null }
}

export async function deleteAccount(password?: string): Promise<AuthResult> {
    const { error } = await authClient.deleteUser(password ? { password } : {})

    return { error: error ? toMessage(error) : null }
}

export async function signInWithGitHub(): Promise<AuthResult> {
    const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        newUserCallbackURL: "/settings",
        errorCallbackURL: "/login",
    })

    return { error: error ? toMessage(error) : null }
}
