"use client"

import { useSyncExternalStore } from "react"

const dateFormat = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
})
const timeFormat = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
})

function subscribe() {
    return () => {}
}

export function LocalDateTime({ date }: { date: Date }) {
    const text = useSyncExternalStore(
        subscribe,
        () => `${dateFormat.format(date)} · ${timeFormat.format(date)}`,
        () => "\u00A0"
    )

    return <>{text}</>
}
