import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// update

export async function callGemini(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: "gemini-3-flash-preview",
        generationConfig: {
            temperature: options?.temperature ?? 0.1, // Low temperature for determinism
            maxOutputTokens: options?.maxTokens ?? 8192,
        },
    });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: systemPrompt }],
            },
            {
                role: "model",
                parts: [{ text: "Understood. I will follow these instructions precisely." }],
            },
        ],
    });

    const result = await chat.sendMessage(userPrompt);
    const response = result.response;
    return response.text();
}
