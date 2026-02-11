"use client";
import React, { useEffect, useRef, useState } from "react";
import { buildPreviewHTML } from "@/lib/preview-builder";

interface PreviewPanelProps {
    code: string;
    isGenerating: boolean;
}

export default function PreviewPanel({ code, isGenerating }: PreviewPanelProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [scale, setScale] = useState<"100%" | "75%" | "50%">("100%");

    useEffect(() => {
        if (!code || !iframeRef.current) {
            setError(null);
            return;
        }

        try {
            const html = buildPreviewHTML(code);
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            iframeRef.current.src = url;
            setError(null);

            return () => URL.revokeObjectURL(url);
        } catch (e) {
            setError((e as Error).message);
        }
    }, [code]);

    const scaleValue = scale === "100%" ? 1 : scale === "75%" ? 0.75 : 0.5;

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
                    <div className="w-2 h-2 rounded-full"
                        style={{
                            background: code ? "#00d4ff" : "#3a3a50",
                            boxShadow: code ? "0 0 6px #00d4ff, 0 0 12px rgba(0, 212, 255, 0.3)" : "none"
                        }} />
                    <span className="text-xs font-medium" style={{ color: "#e8e8ef" }}>Live Preview</span>
                </div>
                <div className="flex items-center gap-1">
                    {["100%", "75%", "50%"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setScale(s as typeof scale)}
                            className="text-xs px-2 py-1 rounded transition-all duration-200"
                            style={
                                scale === s
                                    ? { background: "rgba(0, 212, 255, 0.15)", color: "#00d4ff", boxShadow: "0 0 6px rgba(0, 212, 255, 0.15)" }
                                    : { color: "#555570" }
                            }
                        >
                            {s}
                        </button>
                    ))}
                    <button
                        onClick={() => {
                            if (iframeRef.current && code) {
                                const html = buildPreviewHTML(code);
                                const blob = new Blob([html], { type: "text/html" });
                                const url = URL.createObjectURL(blob);
                                iframeRef.current.src = url;
                            }
                        }}
                        className="text-xs px-2 py-1 rounded transition-all duration-200 ml-1"
                        style={{ color: "#555570" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#00d4ff"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#555570"; }}
                        title="Refresh preview"
                    >
                        🔄
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 relative overflow-hidden" style={{ background: "#0d0d14" }}>
                {!code && !isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-5xl mb-4" style={{ opacity: 0.3, filter: "drop-shadow(0 0 8px rgba(0, 212, 255, 0.2))" }}>👁️</div>
                            <p className="text-sm" style={{ color: "#555570" }}>
                                Preview will render here
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#3a3a50" }}>
                                Describe a UI in the chat to get started
                            </p>
                        </div>
                    </div>
                )}

                {isGenerating && !code && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-pulse text-5xl mb-4">🎨</div>
                            <p className="text-sm" style={{ color: "#00d4ff", textShadow: "0 0 8px rgba(0, 212, 255, 0.3)" }}>
                                Building your UI...
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute top-4 left-4 right-4 rounded-lg p-3 z-10"
                        style={{ background: "#1a0a0a", border: "1px solid #4a1a1a" }}>
                        <p className="text-xs font-medium" style={{ color: "#ff6b6b" }}>Preview Error</p>
                        <p className="text-xs mt-1" style={{ color: "#cc5555" }}>{error}</p>
                    </div>
                )}

                <div
                    className="w-full h-full origin-top-left"
                    style={{
                        transform: `scale(${scaleValue})`,
                        width: `${100 / scaleValue}%`,
                        height: `${100 / scaleValue}%`,
                    }}
                >
                    <iframe
                        ref={iframeRef}
                        title="UI Preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                        style={{ background: "#ffffff" }}
                    />
                </div>
            </div>
        </div>
    );
}
