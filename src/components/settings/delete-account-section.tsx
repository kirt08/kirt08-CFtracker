"use client"

import { useActionState } from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { deleteAccount } from "@/lib/auth-client"

const DESTRUCTIVE_OUTLINE =
    "text-destructive hover:text-destructive dark:border-[#7F1D1D]"

type DeleteAccountSectionProps = { hasPassword: boolean }

export function DeleteAccountSection({
    hasPassword,
}: DeleteAccountSectionProps) {
    return (
        <section
            id="danger"
            className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-[#3B1D1D] bg-card p-6"
        >
            <div className="flex flex-col gap-1">
                <h2 className="text-[17px] font-semibold">Delete account</h2>
                <span className="text-sm text-muted-foreground">
                    Removes your account, notes and upsolve progress. This can’t
                    be undone.
                </span>
            </div>
            <Dialog disablePointerDismissal>
                <DialogTrigger
                    render={
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            className={DESTRUCTIVE_OUTLINE}
                        />
                    }
                >
                    Delete account
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete your account?</DialogTitle>
                        <DialogDescription>
                            Removes your account, notes and upsolve progress.
                            This can’t be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DeleteAccountForm hasPassword={hasPassword} />
                </DialogContent>
            </Dialog>
        </section>
    )
}

function DeleteAccountForm({ hasPassword }: DeleteAccountSectionProps) {
    const [error, formAction, isPending] = useActionState(
        async (
            prevError: string | null,
            formData: FormData
        ): Promise<string | null> => {
            const password = String(formData.get("password") ?? "")

            const result = await deleteAccount(
                hasPassword ? password : undefined
            )
            if (result.error) return result.error

            window.location.replace("/")

            return null
        },
        null
    )

    return (
        <form action={formAction}>
            <FieldGroup className="gap-3.5">
                {hasPassword && (
                    <Field className="gap-1.5">
                        <FieldLabel
                            htmlFor="delete-password"
                            className="text-[13px] font-semibold"
                        >
                            Password
                        </FieldLabel>
                        <Input
                            id="delete-password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                        />
                    </Field>
                )}
                <FieldError>{error}</FieldError>
                <div className="mt-2 flex justify-end gap-2">
                    <DialogClose
                        render={
                            <Button type="button" variant="outline" size="md" />
                        }
                    >
                        Cancel
                    </DialogClose>
                    <Button
                        type="submit"
                        variant="outline"
                        size="md"
                        className={DESTRUCTIVE_OUTLINE}
                        disabled={isPending}
                    >
                        Delete account
                    </Button>
                </div>
            </FieldGroup>
        </form>
    )
}
