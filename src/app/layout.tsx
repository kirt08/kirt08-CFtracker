import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import { SiteHeader } from "@/components/site-header"

import "./globals.css"

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "CF tracker",
    description: "Contest prep dashboard on top of Codeforces data",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`dark ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                <SiteHeader />
                {children}
            </body>
        </html>
    )
}
