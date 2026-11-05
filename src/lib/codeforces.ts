import "server-only"

const CF_API_URL = "https://codeforces.com/api"
const MIN_INTERVAL_MS = 2000
const TIMEOUT_MS = 10000

export type CfUser = {
    handle: string
    rating?: number
    maxRating?: number
    rank?: number
    maxRank?: number
    titlePhoto: string
}

export type CfRatingChange = {
    contestId: number
    contestName: string
    rank: number
    ratingUpdateTimeSeconds: number
    oldRating: number
    newRating: number
}

export type CfProblem = {
    contestId?: number
    index: string
    name: string
    rating?: number
    tags: string[]
}

export type CfParticipantType =
    "CONTESTANT" | "PRACTICE" | "VIRTUAL" | "MANAGER" | "OUT_OF_COMPETITION"

export type CfSubmission = {
    id: number
    contestId?: number
    creationTimeSeconds: number
    problem: CfProblem
    author: { participantType: CfParticipantType }
    verdict?: string
}

export type CfContest = {
    id: number
    name: string
    phase: string
    durationSeconds: number
    startTimeSeconds?: number
}

type CfResponse<T> =
    { status: "OK"; result: T } | { status: "FAILED"; comment: string }

export class CodeforcesError extends Error {
    constructor(
        message: string,
        readonly kind: "not_found" | "failed" | "unavailable"
    ) {
        super(message)
        this.name = "CodeforcesError"
    }
}

let lastRequestAt = 0
let queue: Promise<void> = Promise.resolve()

function waitForTurn(): Promise<void> {
    const turn = queue.then(async () => {
        const wait = lastRequestAt + MIN_INTERVAL_MS - Date.now()
        if (wait > 0) {
            await new Promise((resolve) => setTimeout(resolve, wait))
        }
        lastRequestAt = Date.now()
    })
    queue = turn

    return turn
}

async function request<T>(
    method: string,
    params: Record<string, string | number>
): Promise<T> {
    await waitForTurn()

    const url = new URL(`${CF_API_URL}/${method}`)
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value))
    }

    let body: CfResponse<T>
    try {
        const response = await fetch(url, {
            signal: AbortSignal.timeout(TIMEOUT_MS),
        })
        body = await response.json()
    } catch (error) {
        throw new CodeforcesError(
            `Codeforces is unavailable (${method})`,
            "unavailable"
        )
    }

    if (body.status === "FAILED") {
        const kind = body.comment.includes("not found") ? "not_found" : "failed"
        throw new CodeforcesError(body.comment, kind)
    }

    return body.result
}

export async function getUser(handle: string): Promise<CfUser> {
    const [user] = await request<CfUser[]>("user.info", { handeles: handle })

    return user
}

export async function getRatingHistory(
    handle: string
): Promise<CfRatingChange[]> {
    return request<CfRatingChange[]>("user.rating", { handle })
}

export async function getSubmissions(
    handle: string,
    from: number,
    count: number
): Promise<CfSubmission[]> {
    return request<CfSubmission[]>("user.status", { handle, from, count })
}

export async function getContests(): Promise<CfContest[]> {
    return request<CfContest[]>("contest.list", { gym: "false" })
}

export async function getProblemset(): Promise<CfProblem[]> {
    const { problems } = await request<{ problems: CfProblem[] }>(
        "problemset.problems",
        {}
    )

    return problems
}
