"use client";
import React, { useCallback } from "react";
import Editor from "@monaco-editor/react";

interface CodePanelProps {
    code: string;
    onCodeChange: (code: string) => void;
    isGenerating: boolean;
}

export default function CodePanel({
    code,
    onCodeChange,
    isGenerating,
}: CodePanelProps) {
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(code);
    }, [code]);

    return (
        <div className="flex flex-col h-full" style={{ background: "#0a0a0f" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5"
                style={{
                    background: "linear-gradient(180deg, #111118 0%, #0d0d14 100%)",
                    borderBottom: "1px solid #1a3a5c",
                    boxShadow: "0 1px 10px rgba(0, 212, 255, 0.05)"
                }}>
                <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#00d4ff", textShadow: "0 0 6px rgba(0, 212, 255, 0.4)" }}>{"<>"}</span>
                    <span className="text-xs font-medium" style={{ color: "#e8e8ef" }}>Generated Code</span>
                    {code && (
                        <span className="text-xs ml-2" style={{ color: "#555570" }}>
                            GeneratedUI.tsx
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {code && (
                        <button
                            onClick={handleCopy}
                            className="text-xs px-2 py-1 rounded transition-all duration-200"
                            style={{ color: "#555570" }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = "#00d4ff"; e.currentTarget.style.background = "rgba(0, 212, 255, 0.1)"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = "#555570"; e.currentTarget.style.background = "transparent"; }}
                            title="Copy code"
                        >
                            📋 Copy
                        </button>
                    )}
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
                {!code && !isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                            <div className="text-3xl mb-3 opacity-50">📝</div>
                            <p className="text-sm" style={{ color: "#555570" }}>
                                Generated code will appear here
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#3a3a50" }}>
                                You can also edit the code directly
                            </p>
                        </div>
                    </div>
                )}
                {isGenerating && !code && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center">
                            <div className="animate-spin text-3xl mb-3">⚙️</div>
                            <p className="text-sm" style={{ color: "#00d4ff" }}>Generating code...</p>
                        </div>
                    </div>
                )}
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language="javascript"
                    value={code}
                    onChange={(value) => onCodeChange(value || "")}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', monospace",
                        lineNumbers: "on",
                        wordWrap: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        padding: { top: 12 },
                        renderLineHighlight: "line",
                        bracketPairColorization: { enabled: true },
                        suggest: { showKeywords: false },
                    }}
                />
            </div>
        </div>
    );
}
