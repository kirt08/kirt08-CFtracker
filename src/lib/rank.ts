export function rankColor(rating: number | null): string {
    if (rating === null) return "#A1A1AA"
    if (rating >= 2400) return "#FF4D4D"
    if (rating >= 2100) return "#FF8C00"
    if (rating >= 1900) return "#D46BD4"
    if (rating >= 1600) return "#6B8CFF"
    if (rating >= 1400) return "#03A89E"
    if (rating >= 1200) return "#4ADE80"
    return "#A1A1AA"
}

export function formatRank(rank: string | null): string {
    if (!rank) return "Unrated"
    return rank[0].toUpperCase() + rank.slice(1)
}
