import "server-only"

import {
    refreshProblemRating,
    syncOwnedHandles,
    syncUpcomingContests,
} from "./sync"

// Vercel Function can work for 300s, we put 230 as limit, because some requests can be too long and should stop before 300s
const TIME_BUDGET_MS = 230 * 1000

async function runStep<T>(
    name: string,
    step: () => Promise<T>
): Promise<T | null> {
    try {
        return await step()
    } catch (error: unknown) {
        console.error(`cron step "${name}" failed`, error)
        return null
    }
}

export async function runScheduledSync() {
    const deadline = Date.now() + TIME_BUDGET_MS

    const upcomingContests = await runStep("contests", syncUpcomingContests)
    const ratingsUpdated = await runStep("ratings", refreshProblemRating)
    const handles = await runStep("handles", () => syncOwnedHandles(deadline))

    return { upcomingContests, ratingsUpdated, handles }
}
