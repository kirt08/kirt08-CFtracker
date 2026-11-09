import { runScheduledSync } from "@/lib/cron"

export const maxDuration = 300

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET
    const header = request.headers.get("authorization")

    if (!secret || header !== `Bearer ${secret}`) {
        return new Response("Unauthorized", { status: 401 })
    }

    const summary = await runScheduledSync()
    console.log("cron sync finished", JSON.stringify(summary))

    return Response.json(summary)
}
