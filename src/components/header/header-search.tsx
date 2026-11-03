import { Input } from "../ui/input"

export function HeaderSearch() {
    return (
        <form role="search">
            <label htmlFor="header-search" className="sr-only">
                Search handle
            </label>
            <Input
                id="header-search"
                type="search"
                placeholder="Search handle…"
                autoComplete="off"
                className="h-10 w-60 border-border bg-card font-mono text-sm dark:bg-card [&::-webkit-search-cancel-button]:appearance-none"
            />
        </form>
    )
}
