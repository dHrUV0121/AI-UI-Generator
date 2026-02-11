import { callGemini } from "../gemini";
import { PLANNER_SYSTEM_PROMPT, PLANNER_EDIT_SYSTEM_PROMPT } from "./prompts";

export interface PlannerOutput {
    layout?: {
        type: string;
        description: string;
        sections: Array<{
            id: string;
            type: string;
            description: string;
            components: Array<{
                component: string;
                props: Record<string, unknown>;
                description: string;
            }>;
        }>;
    };
    editType?: string;
    changes?: Array<{
        action: string;
        target: string;
        component?: string;
        props?: Record<string, unknown>;
        position?: string;
        description: string;
    }>;
    preserveExisting?: boolean;
    reasoning: string;
}

export async function runPlanner(
    userPrompt: string,
    currentCode?: string,
    conversationHistory?: string[]
): Promise<PlannerOutput> {
    const isEdit = !!currentCode;
    const systemPrompt = isEdit ? PLANNER_EDIT_SYSTEM_PROMPT : PLANNER_SYSTEM_PROMPT;

    let fullPrompt = "";

    if (conversationHistory && conversationHistory.length > 0) {
        fullPrompt += "Previous conversation context:\n";
        fullPrompt += conversationHistory.join("\n") + "\n\n";
    }

    if (isEdit) {
        fullPrompt += `CURRENT CODE:\n\`\`\`\n${currentCode}\n\`\`\`\n\n`;
        fullPrompt += `USER'S CHANGE REQUEST: ${userPrompt}`;
    } else {
        fullPrompt += `USER'S UI DESCRIPTION: ${userPrompt}`;
    }

    const response = await callGemini(systemPrompt, fullPrompt, { temperature: 0.1 });

    // Parse JSON from response (handle potential markdown wrapping)
    let jsonStr = response.trim();
    if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    try {
        return JSON.parse(jsonStr) as PlannerOutput;
    } catch (e) {
        console.error("Planner JSON parse error:", e);
        console.error("Raw response:", response);
        throw new Error("Planner agent failed to produce valid JSON output");
    }
}
