import type { HandleData } from "@/lib/handle"

import { HandleLinked } from "./handle-linked"
import { HandleNotLinked } from "./handle-not-linked"
import { HandleVerify } from "./handle-verify"

type HandleSectionProps = { data: HandleData }

export function HandleSection({ data }: HandleSectionProps) {
    if (data.state === "verify") {
        return (
            <HandleVerify
                handle={data.verification.handle}
                rating={data.rating}
                contestId={data.verification.contestId}
                problemIndex={data.verification.problemIndex}
                problemName={data.problemName}
                expiresAt={data.verification.expiresAt}
            />
        )
    }

    if (data.state === "linked") {
        const { profile } = data

        return (
            <HandleLinked
                handle={profile.handle}
                rating={profile.rating}
                rank={profile.rank}
                verifiedAt={profile.verifiedAt}
                isFirstSync={
                    profile.lastSyncedAt === null &&
                    profile.syncStatus !== "failed"
                }
            />
        )
    }

    return <HandleNotLinked />
}
