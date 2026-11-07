const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

const UNITS = [
    ["day", 24 * 60 * 60],
    ["hour", 60 * 60],
    ["minute", 60],
] as const

export function formatTimeAgo(date: Date): string {
    const seconds = Math.round((date.getTime() - Date.now()) / 1000)

    for (const [unit, size] of UNITS) {
        if (Math.abs(seconds) >= size) {
            return relativeFormat.format(Math.round(seconds / size), unit)
        }
    }

    return "just now"
}
