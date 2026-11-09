"use client"

import { useRouter } from "next/navigation"
import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { updateName } from "@/lib/auth-client"

const MAX_NAME_LENGTH = 100

type AccountSectionProps = { name: string; email: string }

type AccountState = { error: string | null; name: string; saved: boolean }

export function AccountSection({ name, email }: AccountSectionProps) {
    const router = useRouter()

    const [state, formAction, isPending] = useActionState(
        async (
            prevState: AccountState,
            formData: FormData
        ): Promise<AccountState> => {
            const newName = String(formData.get("name") ?? "").trim()
            if (!newName) {
                return { error: "Enter a name", name: newName, saved: false }
            }

            const { error } = await updateName(newName)
            if (error) return { error, name: newName, saved: false }

            router.refresh()

            return { error: null, name: newName, saved: true }
        },
        { error: null, name, saved: false }
    )

    return (
        <section
            id="account"
            className="rounded-[14px] border border-border bg-card p-6"
        >
            <form action={formAction} className="flex flex-col gap-4.5">
                <h2 className="text-[17px] font-semibold">Account</h2>
                <div className="flex flex-wrap gap-4">
                    <Field className="flex-[1_1_240px] gap-1.5">
                        <FieldLabel
                            htmlFor="account-name"
                            className="text-[13px] font-semibold"
                        >
                            Name
                        </FieldLabel>
                        <Input
                            id="account-name"
                            name="name"
                            autoComplete="name"
                            maxLength={MAX_NAME_LENGTH}
                            defaultValue={state.name}
                            aria-invalid={state.error ? true : undefined}
                            required
                        />
                        <FieldError>{state.error}</FieldError>
                    </Field>
                    <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1.5">
                        <span className="text-[13px] font-semibold">Email</span>
                        <span className="flex h-11 items-center text-[15px] text-zinc-300">
                            {email}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="submit"
                        variant="outline"
                        size="md"
                        disabled={isPending}
                    >
                        Save changes
                    </Button>
                    {state.saved && (
                        <span
                            role="status"
                            className="text-[13px] text-[#4ADE80]"
                        >
                            Saved
                        </span>
                    )}
                </div>
            </form>
        </section>
    )
}
