"use client"

import { useRouter } from "next/navigation"
import { useActionState } from "react"

import { signUp } from "@/lib/auth-client"

import { Button } from "../ui/button"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field"
import { Input } from "../ui/input"

type SignUpState = { error: string | null; name: string; email: string }

const initialState: SignUpState = { error: null, name: "", email: "" }

export function SignUpForm() {
    const router = useRouter()

    const [state, formAction, isPending] = useActionState(
        async (
            prevState: SignUpState,
            newFormData: FormData
        ): Promise<SignUpState> => {
            const name = String(newFormData.get("name") ?? "").trim()
            const email = String(newFormData.get("email") ?? "").trim()
            const password = String(newFormData.get("password") ?? "")

            const { error } = await signUp({ name, email, password })
            if (error) {
                return { error, name, email }
            }

            router.push("/")
            router.refresh()
            return { error: null, name, email }
        },
        initialState
    )

    return (
        <form action={formAction}>
            <FieldGroup className="gap-3.5">
                <Field className="gap-1.5">
                    <FieldLabel
                        htmlFor="name"
                        className="text-[13px] font-semibold"
                    >
                        Name
                    </FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        autoComplete="name"
                        placeholder="Your name"
                        defaultValue={state.name}
                        required
                    />
                </Field>
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
                        autoComplete="new-password"
                        placeholder="••••••••"
                        minLength={8}
                        required
                    />
                    <FieldDescription className="text-xs">
                        At least 8 characters
                    </FieldDescription>
                </Field>
                {state.error && (
                    <FieldError className="text-[13px]">
                        {state.error}
                    </FieldError>
                )}
                <Button
                    type="submit"
                    size="xl"
                    disabled={isPending}
                    className="mt-2"
                >
                    {isPending ? "Creating account…" : "Create account"}
                </Button>
            </FieldGroup>
        </form>
    )
}
