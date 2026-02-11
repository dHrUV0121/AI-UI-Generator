import { callGemini } from "../gemini";
import { GENERATOR_SYSTEM_PROMPT, GENERATOR_EDIT_SYSTEM_PROMPT } from "./prompts";
import { PlannerOutput } from "./planner";

export async function runGenerator(
    plan: PlannerOutput,
    currentCode?: string
): Promise<string> {
    const isEdit = !!currentCode;
    const systemPrompt = isEdit ? GENERATOR_EDIT_SYSTEM_PROMPT : GENERATOR_SYSTEM_PROMPT;

    let userPrompt = "";

    if (isEdit) {
        userPrompt += `EXISTING CODE:\n\`\`\`\n${currentCode}\n\`\`\`\n\n`;
        userPrompt += `CHANGES TO APPLY:\n${JSON.stringify(plan, null, 2)}\n\n`;
        userPrompt += `Output ONLY the modified code. No explanation. No markdown. Just the function.`;
    } else {
        userPrompt += `UI PLAN:\n${JSON.stringify(plan, null, 2)}\n\n`;
        userPrompt += `Output ONLY the React component code. No explanation. No markdown. No reasoning. Just the function starting with "function GeneratedUI()".`;
    }

    const response = await callGemini(systemPrompt, userPrompt, {
        temperature: 0.1,
        maxTokens: 8192,
    });

    // Extract code from response — model may include reasoning text
    let code = extractCode(response);

    // Ensure the code has the GeneratedUI function
    if (!code.includes("function GeneratedUI")) {
        code = `function GeneratedUI() {\n  return (\n    ${code}\n  );\n}`;
    }

    return code;
}

/**
 * Robustly extract just the code from the model response.
 * Handles: raw code, markdown-fenced code, code mixed with reasoning text.
 */
function extractCode(response: string): string {
    let text = response.trim();

    // 1. Try to extract from markdown code fences first
    const fenceMatch = text.match(/```(?:jsx|tsx|javascript|typescript|react)?\s*\n([\s\S]*?)```/);
    if (fenceMatch) {
        return fenceMatch[1].trim();
    }

    // 2. Try to find the function GeneratedUI block
    const funcStart = text.indexOf("function GeneratedUI");
    if (funcStart !== -1) {
        const codeFromFunc = text.substring(funcStart);
        // Find the matching closing brace by counting braces
        let braceCount = 0;
        let endIndex = -1;
        for (let i = 0; i < codeFromFunc.length; i++) {
            if (codeFromFunc[i] === "{") braceCount++;
            if (codeFromFunc[i] === "}") {
                braceCount--;
                if (braceCount === 0) {
                    endIndex = i;
                    break;
                }
            }
        }
        if (endIndex !== -1) {
            return codeFromFunc.substring(0, endIndex + 1);
        }
        return codeFromFunc;
    }

    // 3. Try to find any JSX return block wrapped in code fences
    const simpleFence = text.match(/```\s*\n?([\s\S]*?)```/);
    if (simpleFence) {
        return simpleFence[1].trim();
    }

    // 4. Look for JSX content starting with < 
    const jsxStart = text.indexOf("<");
    if (jsxStart !== -1) {
        // Find the last > in the text
        const jsxEnd = text.lastIndexOf(">");
        if (jsxEnd > jsxStart) {
            const jsxCode = text.substring(jsxStart, jsxEnd + 1);
            return `function GeneratedUI() {\n  return (\n    ${jsxCode}\n  );\n}`;
        }
    }

    // 5. Fallback: return as-is, stripping any leading non-code text
    // Remove lines that look like commentary (don't start with code-like chars)
    const lines = text.split("\n");
    const codeLines = lines.filter(line => {
        const trimmed = line.trim();
        if (trimmed === "") return true;
        // Keep lines that look like code
        return (
            trimmed.startsWith("function") ||
            trimmed.startsWith("const") ||
            trimmed.startsWith("let") ||
            trimmed.startsWith("var") ||
            trimmed.startsWith("return") ||
            trimmed.startsWith("<") ||
            trimmed.startsWith("/>") ||
            trimmed.startsWith("</") ||
            trimmed.startsWith("{") ||
            trimmed.startsWith("}") ||
            trimmed.startsWith(")") ||
            trimmed.startsWith("(") ||
            trimmed.startsWith("export") ||
            trimmed.startsWith("import") ||
            /^\s*[\]<>{}()\/]/.test(trimmed) ||
            /^\s*(label|value|icon|title|brand|items|data|columns|variant|size|placeholder|type|checked|onChange|onClick|onClose|isOpen|showLabel|change|changeType|sticky|striped|hoverable|compact|tabs|options|rows|maxLength|content|children|footer|header|actions|src|alt|fallback|status|defaultIndex|orientation|position|dismissible|collapsed|fullWidth|disabled|error|helperText)/.test(trimmed)
        );
    });

    return codeLines.join("\n").trim() || text;
}
