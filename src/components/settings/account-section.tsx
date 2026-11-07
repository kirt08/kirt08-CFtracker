import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type AccountSectionProps = { name: string; email: string }

export function AccountSection({ name, email }: AccountSectionProps) {
    return (
        <section
            id="account"
            className="flex flex-col gap-4.5 rounded-[14px] border border-border bg-card p-6"
        >
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
                        defaultValue={name}
                    />
                </Field>
                <div className="flex min-w-0 flex-[1_1_240px] flex-col gap-1.5">
                    <span className="text-[13px] font-semibold">Email</span>
                    <span className="flex h-11 items-center text-[15px] text-zinc-300">
                        {email}
                    </span>
                </div>
            </div>
            <Button
                type="button"
                variant="outline"
                size="md"
                className="self-start"
            >
                Save changes
            </Button>
        </section>
    )
}
