import { Button } from "@/components/ui/button"

export function DeleteAccountSection() {
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
            <Button
                type="button"
                variant="outline"
                size="md"
                className="text-destructive hover:text-destructive dark:border-[#7F1D1D]"
            >
                Delete account
            </Button>
        </section>
    )
}
