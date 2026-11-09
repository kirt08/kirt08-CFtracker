"use client"

import { useRouter } from "next/navigation"

export function useHandleSearch() {
    const router = useRouter()

    return function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault()

        const form = event.currentTarget
        const handle = String(new FormData(form).get("handle") ?? "").trim()
        if (!handle) return

        form.reset()
        router.push(`/u/${encodeURIComponent(handle)}`)
    }
}
