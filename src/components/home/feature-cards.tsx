const FEATURES = [
    {
        title: "Upsolve list",
        text: "Problems from contests you entered but didn’t solve. Mark them as done and keep notes.",
        color: "#60A5FA",
        paths: ["M3 12a9 9 0 1 0 3-6.7", "M3 4v5h5"],
    },
    {
        title: "Weak topics",
        text: "Success rate by tag and difficulty — see where your ceiling is and what to train.",
        color: "#FB923C",
        paths: ["M4 20V10", "M10 20V4", "M16 20v-7", "M22 20H2"],
    },
    {
        title: "Problem notes",
        text: "Write down the key idea once you crack a problem, so it sticks before the next contest.",
        color: "#4ADE80",
        paths: [
            "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z",
            "M14 3v6h6",
            "M8 13h8",
            "M8 17h5",
        ],
    },
]

export function FeatureCards() {
    return (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
            {FEATURES.map(({ title, text, color, paths }) => (
                <div
                    key={title}
                    className="flex flex-col gap-2.5 rounded-[14px] border border-border bg-card p-6"
                >
                    <svg
                        aria-hidden
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {paths.map((d) => (
                            <path key={d} d={d} />
                        ))}
                    </svg>
                    <h2 className="text-[17px] font-semibold">{title}</h2>
                    <p className="text-sm leading-[1.55] text-muted-foreground">
                        {text}
                    </p>
                </div>
            ))}
        </section>
    )
}
