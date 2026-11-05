"use client"

import { useActionState } from "react"

import {
    startVerification,
    StartVerificationState,
} from "@/app/settings/action"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { SettingsBanner } from "../settings-banner"

const initialState: StartVerificationState = { error: null, handle: "" }

export function HandleNotLinked() {
    const [state, formAction, isPending] = useActionState(
        startVerification,
        initialState
    )

    return (
        <>
            <SettingsBanner variant="info" title="Your account is ready">
                Link your Codeforces handle to track upsolving and keep notes.
                You can still browse any profile without it.
            </SettingsBanner>

            <section
                id="handle"
                className="flex flex-col gap-4.5 rounded-[14px] border border-border bg-card p-6"
            >
                <div className="flex flex-col gap-1">
                    <h2 className="text-[17px] font-semibold">
                        Codeforces handle
                    </h2>
                    <span className="text-sm text-muted-foreground">
                        Not linked yet
                    </span>
                </div>
                <form
                    action={formAction}
                    className="flex flex-wrap items-end gap-2.5"
                >
                    <Field className="flex-[1_1_260px] gap-1.5">
                        <FieldLabel
                            htmlFor="cf-handle"
                            className="text-[13px] font-semibold"
                        >
                            Your handle
                        </FieldLabel>
                        <Input
                            id="cf-handle"
                            name="handle"
                            placeholder="e.g. tourist"
                            autoComplete="off"
                            defaultValue={state.handle}
                            aria-invalid={state.error ? true : undefined}
                            required
                            className="font-mono"
                        />
                    </Field>
                    <Button
                        type="submit"
                        size="xl"
                        disabled={isPending}
                        className="h-11"
                    >
                        {isPending ? "Checking…" : "Continue"}
                    </Button>
                </form>
                {state.error && (
                    <FieldError className="text-[13px]">
                        {state.error}
                    </FieldError>
                )}
                <span className="text-[13px] text-muted-foreground">
                    Next, we’ll ask you to make one quick submission to confirm
                    the handle is yours.
                </span>
            </section>
        </>
    )
}
