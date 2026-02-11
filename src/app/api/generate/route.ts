import { NextRequest, NextResponse } from "next/server";
import { orchestrate } from "@/lib/agents/orchestrator";
import { sanitizeInput } from "@/lib/sanitizer";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prompt, currentCode, conversationHistory, currentVersion } = body;

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'prompt' field" },
                { status: 400 }
            );
        }

        // Sanitize input
        const { sanitized, warnings } = sanitizeInput(prompt);

        if (warnings.length > 0) {
            console.warn("[API] Input sanitization warnings:", warnings);
        }

        // Run the multi-agent orchestration pipeline
        const result = await orchestrate(
            sanitized,
            currentCode || undefined,
            conversationHistory || undefined,
            currentVersion || 0
        );

        return NextResponse.json({
            success: true,
            ...result,
            sanitizationWarnings: warnings.length > 0 ? warnings : undefined,
        });
    } catch (error) {
        console.error("[API] Generation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: (error as Error).message || "An unexpected error occurred",
            },
            { status: 500 }
        );
    }
}
