import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "AI UI Generator",
    description: "Convert natural language UI descriptions into working, deterministic UI code with live preview",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="antialiased">{children}</body>
        </html>
    );
}
