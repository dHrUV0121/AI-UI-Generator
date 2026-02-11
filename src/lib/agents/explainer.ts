import { callGemini } from "../gemini";
import { EXPLAINER_SYSTEM_PROMPT, EXPLAINER_EDIT_SYSTEM_PROMPT } from "./prompts";
import { PlannerOutput } from "./planner";

export interface ExplainerOutput {
    summary: string;
    decisions?: Array<{
        what: string;
        why: string;
        component?: string;
    }>;
    changes?: Array<{
        what: string;
        why: string;
    }>;
    structureExplanation?: string;
    preserved?: string;
}

export async function runExplainer(
    plan: PlannerOutput,
    code: string,
    isEdit: boolean = false
): Promise<ExplainerOutput> {
    const systemPrompt = isEdit ? EXPLAINER_EDIT_SYSTEM_PROMPT : EXPLAINER_SYSTEM_PROMPT;

    const userPrompt = `
PLAN:
${JSON.stringify(plan, null, 2)}

GENERATED CODE:
\`\`\`
${code}
\`\`\`

Explain the ${isEdit ? "changes made to" : "decisions behind"} this UI.`;

    const response = await callGemini(systemPrompt, userPrompt, { temperature: 0.3 });

    // Parse JSON from response
    let jsonStr = response.trim();
    if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    try {
        return JSON.parse(jsonStr) as ExplainerOutput;
    } catch (e) {
        console.error("Explainer JSON parse error:", e);
        // Fallback: return the raw response as summary
        return {
            summary: response.slice(0, 200),
            decisions: [{ what: "UI Generated", why: "Based on user request", component: "Multiple" }],
            structureExplanation: "See generated code for details.",
        };
    }
}
