import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    cacheComponents: true,
    images: {
        remotePatterns: [new URL("https://userpic.codeforces.org/**")],
    },
    partialPrefetching: true,
    reactCompiler: true,
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css",
            },
        },
    },
}

export default nextConfig
