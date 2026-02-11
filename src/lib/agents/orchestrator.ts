import { runPlanner, PlannerOutput } from "./planner";
import { runGenerator } from "./generator";
import { runExplainer, ExplainerOutput } from "./explainer";
import { validateComponentUsage } from "../component-registry";

export interface GenerationResult {
    code: string;
    plan: PlannerOutput;
    explanation: ExplainerOutput;
    version: number;
    timestamp: string;
    errors?: string[];
    prompt: string;
}

const MAX_RETRIES = 2;

export async function orchestrate(
    userPrompt: string,
    currentCode?: string,
    conversationHistory?: string[],
    currentVersion?: number
): Promise<GenerationResult> {
    const isEdit = !!currentCode;
    const version = (currentVersion || 0) + 1;

    console.log(`[Orchestrator] Starting ${isEdit ? "EDIT" : "NEW"} generation (v${version})`);
    console.log(`[Orchestrator] User prompt: "${userPrompt}"`);

    // ─── Step 1: Planner Agent ───────────────────────────────────
    console.log("[Orchestrator] Step 1: Running Planner Agent...");
    let plan: PlannerOutput;
    try {
        plan = await runPlanner(userPrompt, currentCode, conversationHistory);
        console.log("[Orchestrator] Planner output:", JSON.stringify(plan).slice(0, 200));
    } catch (error) {
        console.error("[Orchestrator] Planner failed:", error);
        throw new Error(`Planner Agent failed: ${(error as Error).message}`);
    }

    // ─── Step 2: Generator Agent (with retry on validation failure) ───
    console.log("[Orchestrator] Step 2: Running Generator Agent...");
    let code = "";
    let validationErrors: string[] = [];
    let attempts = 0;

    while (attempts <= MAX_RETRIES) {
        try {
            code = await runGenerator(plan, isEdit ? currentCode : undefined);
            console.log("[Orchestrator] Generator produced code:", code.slice(0, 200));

            // ─── Step 2.5: Validate Generated Code ───────────────────
            const validation = validateComponentUsage(code);
            if (validation.valid) {
                console.log("[Orchestrator] Validation passed ✓");
                break;
            } else {
                validationErrors = validation.errors;
                console.warn(`[Orchestrator] Validation failed (attempt ${attempts + 1}):`, validationErrors);

                if (attempts < MAX_RETRIES) {
                    // Retry with error context
                    console.log("[Orchestrator] Retrying generation with error context...");
                    const errorContext = `PREVIOUS ATTEMPT HAD ERRORS. Fix these:\n${validationErrors.join("\n")}\n\nGenerate the code again, using ONLY whitelisted components and NO custom styling.`;
                    plan.reasoning = (plan.reasoning || "") + "\n\n" + errorContext;
                }
                attempts++;
            }
        } catch (error) {
            console.error("[Orchestrator] Generator failed:", error);
            if (attempts >= MAX_RETRIES) {
                throw new Error(`Generator Agent failed after ${MAX_RETRIES + 1} attempts: ${(error as Error).message}`);
            }
            attempts++;
        }
    }

    // ─── Step 3: Explainer Agent ─────────────────────────────────
    console.log("[Orchestrator] Step 3: Running Explainer Agent...");
    let explanation: ExplainerOutput;
    try {
        explanation = await runExplainer(plan, code, isEdit);
        console.log("[Orchestrator] Explainer output:", explanation.summary);
    } catch (error) {
        console.error("[Orchestrator] Explainer failed (non-critical):", error);
        explanation = {
            summary: isEdit ? "UI was modified based on your request." : "UI was generated based on your description.",
            decisions: [{ what: "Generation completed", why: "Follow user instructions" }],
            structureExplanation: "See the generated code for details.",
        };
    }

    const result: GenerationResult = {
        code,
        plan,
        explanation,
        version,
        timestamp: new Date().toISOString(),
        errors: validationErrors.length > 0 ? validationErrors : undefined,
        prompt: userPrompt,
    };

    console.log(`[Orchestrator] Generation complete (v${version}) ✓`);
    return result;
}
