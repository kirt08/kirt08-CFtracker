const STEPS = [
    { afterMs: 0, text: "Fetching profile and rating…" },
    { afterMs: 4000, text: "Loading submissions…" },
    { afterMs: 10000, text: "Saving contests and problems…" },
    { afterMs: 20000, text: "Big profiles take a bit longer. Almost there…" },
]

export function LoadingSteps() {
    return (
        <span aria-hidden className="grid text-[13px] text-muted-foreground">
            {STEPS.map((step, index) => {
                const next = STEPS[index + 1]
                const animations = [
                    `loading-step-in 300ms ease ${step.afterMs}ms both`,
                ]
                if (next) {
                    animations.push(
                        `loading-step-out 300ms ease ${next.afterMs}ms forwards`
                    )
                }

                return (
                    <span
                        key={step.text}
                        className="[grid-area:1/1]"
                        style={{ animation: animations.join(", ") }}
                    >
                        {step.text}
                    </span>
                )
            })}
        </span>
    )
}
