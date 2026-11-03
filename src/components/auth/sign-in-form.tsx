"use client"

import { useRouter } from "next/navigation"
import { useActionState } from "react"

import { signIn } from "@/lib/auth-client"

import { Button } from "../ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Input } from "../ui/input"

type SignInState = { error: string | null; email: string }

const initialState: SignInState = { error: null, email: "" }

export function SignInForm() {
    const router = useRouter()

    const [state, formAction, isPending] = useActionState(
        async (
            prevState: SignInState,
            newFormData: FormData
        ): Promise<SignInState> => {
            const email = String(newFormData.get("email") ?? "").trim()
            const password = String(newFormData.get("password") ?? "")

            const { error } = await signIn({ email, password })
            if (error) {
                return { error: error, email }
            }

            router.push("/")
            router.refresh()

            return initialState
        },
        initialState
    )

    return (
        <form action={formAction}>
            <FieldGroup className="gap-3.5">
                <Field className="gap-1.5">
                    <FieldLabel
                        htmlFor="email"
                        className="text-[13px] font-semibold"
                    >
                        Email
                    </FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        defaultValue={state.email}
                        required
                    />
                </Field>
                <Field className="gap-1.5">
                    <FieldLabel
                        htmlFor="password"
                        className="text-[13px] font-semibold"
                    >
                        Password
                    </FieldLabel>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        aria-invalid={state.error ? true : undefined}
                        required
                    />
                    {state.error && (
                        <FieldError className="text-[13px]">
                            {state.error}
                        </FieldError>
                    )}
                </Field>
                <Button
                    type="submit"
                    size="xl"
                    disabled={isPending}
                    className="mt-2"
                >
                    {isPending ? "Signing in…" : "Sign in"}
                </Button>
            </FieldGroup>
        </form>
    )
}
