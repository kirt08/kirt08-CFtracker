"use client"

import { useActionState, useState } from "react"

import { setAccountPassword } from "@/app/settings/action"
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
import { changePassword } from "@/lib/auth-client"

const MIN_PASSWORD_LENGTH = 8

type PasswordDialogProps = { hasPassword: boolean; email: string }

export function PasswordDialog({ hasPassword, email }: PasswordDialogProps) {
    const [open, setOpen] = useState(false)
    const [saved, setSaved] = useState(false)

    const title = hasPassword ? "Change password" : "Set password"

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen)
        if (nextOpen) setSaved(false)
    }

    function handleSaved() {
        setOpen(false)
        setSaved(true)
    }

    return (
        <div className="flex items-center gap-3">
            {saved && (
                <span role="status" className="text-[13px] text-[#4ADE80]">
                    Password saved
                </span>
            )}
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger
                    render={
                        <Button
                            type="button"
                            variant="outline"
                            size="md"
                            className="font-normal"
                        />
                    }
                >
                    {title}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {hasPassword
                                ? "Other devices will be signed out."
                                : "Add a password to also sign in with your email."}
                        </DialogDescription>
                    </DialogHeader>
                    <PasswordForm
                        hasPassword={hasPassword}
                        email={email}
                        submitLabel={title}
                        onSaved={handleSaved}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

type PasswordFormProps = PasswordDialogProps & {
    submitLabel: string
    onSaved: () => void
}

function PasswordForm({
    hasPassword,
    email,
    submitLabel,
    onSaved,
}: PasswordFormProps) {
    const [error, formAction, isPending] = useActionState(
        async (
            prevError: string | null,
            formData: FormData
        ): Promise<string | null> => {
            const currentPassword = String(formData.get("current") ?? "")
            const newPassword = String(formData.get("new") ?? "")
            const confirmPassword = String(formData.get("confirm") ?? "")

            if (newPassword.length < MIN_PASSWORD_LENGTH) {
                return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
            }
            if (newPassword !== confirmPassword) {
                return "Passwords don’t match"
            }

            const result = hasPassword
                ? await changePassword({ currentPassword, newPassword })
                : await setAccountPassword(newPassword)
            if (result.error) return result.error

            onSaved()

            return null
        },
        null
    )

    return (
        <form action={formAction}>
            <FieldGroup className="gap-3.5">
                {hasPassword ? (
                    <PasswordField
                        id="current"
                        label="Current password"
                        autoComplete="current-password"
                    />
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <span className="text-[13px] font-semibold">Email</span>
                        <span className="text-[15px] text-zinc-300">
                            {email}
                        </span>
                    </div>
                )}
                <PasswordField
                    id="new"
                    label="New password"
                    autoComplete="new-password"
                />
                <PasswordField
                    id="confirm"
                    label="Confirm new password"
                    autoComplete="new-password"
                />
                <FieldError>{error}</FieldError>
                <div className="mt-2 flex justify-end gap-2">
                    <DialogClose
                        render={
                            <Button type="button" variant="outline" size="md" />
                        }
                    >
                        Cancel
                    </DialogClose>
                    <Button type="submit" size="md" disabled={isPending}>
                        {submitLabel}
                    </Button>
                </div>
            </FieldGroup>
        </form>
    )
}

type PasswordFieldProps = {
    id: string
    label: string
    autoComplete: string
}

function PasswordField({ id, label, autoComplete }: PasswordFieldProps) {
    return (
        <Field className="gap-1.5">
            <FieldLabel htmlFor={id} className="text-[13px] font-semibold">
                {label}
            </FieldLabel>
            <Input
                id={id}
                name={id}
                type="password"
                autoComplete={autoComplete}
                required
            />
        </Field>
    )
}
