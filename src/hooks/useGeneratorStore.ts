import { useReducer, useCallback, useRef, useEffect } from "react";
import { GenerationResult } from "@/lib/agents/orchestrator";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: string;
    plan?: unknown;
    explanation?: unknown;
}

export interface AppState {
    messages: ChatMessage[];
    versions: GenerationResult[];
    currentVersionIndex: number;
    currentCode: string;
    isGenerating: boolean;
    error: string | null;
}

type Action =
    | { type: "ADD_MESSAGE"; message: ChatMessage }
    | { type: "SET_GENERATING"; isGenerating: boolean }
    | { type: "ADD_VERSION"; result: GenerationResult }
    | { type: "SET_VERSION_INDEX"; index: number }
    | { type: "SET_CODE"; code: string }
    | { type: "SET_ERROR"; error: string | null }
    | { type: "CLEAR_MESSAGES" };

const initialState: AppState = {
    messages: [],
    versions: [],
    currentVersionIndex: -1,
    currentCode: "",
    isGenerating: false,
    error: null,
};

function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.message] };
        case "SET_GENERATING":
            return { ...state, isGenerating: action.isGenerating, error: null };
        case "ADD_VERSION": {
            const newVersions = [...state.versions, action.result];
            return {
                ...state,
                versions: newVersions,
                currentVersionIndex: newVersions.length - 1,
                currentCode: action.result.code,
            };
        }
        case "SET_VERSION_INDEX":
            return {
                ...state,
                currentVersionIndex: action.index,
                currentCode: state.versions[action.index]?.code || "",
            };
        case "SET_CODE":
            return { ...state, currentCode: action.code };
        case "SET_ERROR":
            return { ...state, error: action.error };
        case "CLEAR_MESSAGES":
            return initialState;
        default:
            return state;
    }
}

export function useGeneratorStore() {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Use a ref to always have the latest state for async operations
    const stateRef = useRef(state);
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    const addMessage = useCallback(
        (role: ChatMessage["role"], content: string, extra?: Partial<ChatMessage>) => {
            const msg: ChatMessage = {
                id: Date.now().toString() + Math.random().toString(36).slice(2),
                role,
                content,
                timestamp: new Date().toISOString(),
                ...extra,
            };
            console.log("[Store] Adding message:", role, content.slice(0, 80));
            dispatch({ type: "ADD_MESSAGE", message: msg });
        },
        []
    );

    const generate = useCallback(
        async (prompt: string) => {
            console.log("[Store] generate() called with:", prompt);
            dispatch({ type: "SET_GENERATING", isGenerating: true });
            addMessage("user", prompt);

            try {
                // Read from ref to get latest state
                const current = stateRef.current;
                const isEdit = current.versions.length > 0;
                const conversationHistory = current.messages
                    .slice(-10)
                    .map((m) => `${m.role}: ${m.content}`);

                const bodyPayload = {
                    prompt,
                    currentCode: isEdit ? current.currentCode : undefined,
                    conversationHistory: isEdit ? conversationHistory : undefined,
                    currentVersion: current.versions.length,
                };
                console.log("[Store] Sending to /api/generate:", JSON.stringify(bodyPayload).slice(0, 200));

                const response = await fetch("/api/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyPayload),
                });

                console.log("[Store] Response status:", response.status);
                const data = await response.json();
                console.log("[Store] Response data:", JSON.stringify(data).slice(0, 300));

                if (!response.ok || !data.success) {
                    throw new Error(data.error || "Generation failed");
                }

                // Add the generation result as a version
                dispatch({ type: "ADD_VERSION", result: data as GenerationResult });

                // Add AI explanation message
                const explanation = data.explanation;
                let explanationText = explanation?.summary || "UI generated successfully.";
                if (explanation?.decisions) {
                    explanationText += "\n\n**Decisions:**\n";
                    explanationText += explanation.decisions
                        .map(
                            (d: { what: string; why: string; component?: string }) =>
                                `• **${d.what}**: ${d.why}${d.component ? ` (${d.component})` : ""}`
                        )
                        .join("\n");
                }
                if (explanation?.changes) {
                    explanationText += "\n\n**Changes:**\n";
                    explanationText += explanation.changes
                        .map((c: { what: string; why: string }) => `• **${c.what}**: ${c.why}`)
                        .join("\n");
                }
                if (explanation?.structureExplanation) {
                    explanationText += `\n\n**Structure:** ${explanation.structureExplanation}`;
                }
                if (explanation?.preserved) {
                    explanationText += `\n\n**Preserved:** ${explanation.preserved}`;
                }

                addMessage("assistant", explanationText, {
                    plan: data.plan,
                    explanation: data.explanation,
                });
            } catch (error) {
                const errorMsg = (error as Error).message;
                console.error("[Store] Generation error:", errorMsg);
                dispatch({ type: "SET_ERROR", error: errorMsg });
                addMessage("system", `❌ Error: ${errorMsg}`);
            } finally {
                dispatch({ type: "SET_GENERATING", isGenerating: false });
            }
        },
        [addMessage]
    );

    const setVersionIndex = useCallback((index: number) => {
        dispatch({ type: "SET_VERSION_INDEX", index });
    }, []);

    const setCode = useCallback((code: string) => {
        dispatch({ type: "SET_CODE", code });
    }, []);

    const clearMessages = useCallback(() => {
        dispatch({ type: "CLEAR_MESSAGES" });
    }, []);

    return {
        ...state,
        generate,
        addMessage,
        setVersionIndex,
        setCode,
        clearMessages,
    };
}
