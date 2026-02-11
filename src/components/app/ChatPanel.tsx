"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/hooks/useGeneratorStore";

interface ChatPanelProps {
    messages: ChatMessage[];
    isGenerating: boolean;
    error: string | null;
    onSend: (prompt: string) => void;
    onClear: () => void;
}

export default function ChatPanel({
    messages,
    isGenerating,
    error,
    onSend,
    onClear,
}: ChatPanelProps) {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("[ChatPanel] handleSubmit called, input:", input, "isGenerating:", isGenerating);
        if (input.trim() && !isGenerating) {
            onSend(input.trim());
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const renderMessageContent = (content: string) => {
        return content.split("\n").map((line, i) => {
            line = line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#00d4ff">$1</strong>');
            if (line.startsWith("• ")) {
                return (
                    <div key={i} className="flex gap-2 ml-2">
                        <span style={{ color: "#00d4ff" }} className="flex-shrink-0">•</span>
                        <span dangerouslySetInnerHTML={{ __html: line.slice(2) }} />
                    </div>
                );
            }
            if (line.trim() === "") return <div key={i} className="h-2" />;
            return <div key={i} dangerouslySetInnerHTML={{ __html: line }} />;
        });
    };

    return (
        <div className="flex flex-col h-full" style={{ background: "#0d0d14" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
                style={{
                    background: "linear-gradient(180deg, #111118 0%, #0d0d14 100%)",
                    borderBottom: "1px solid #1a3a5c",
                    boxShadow: "0 1px 10px rgba(0, 212, 255, 0.05)"
                }}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full"
                        style={{
                            background: "#00d4ff",
                            boxShadow: "0 0 6px #00d4ff, 0 0 12px rgba(0, 212, 255, 0.3)",
                            animation: "pulse 2s ease-in-out infinite"
                        }} />
                    <h2 className="text-sm font-semibold" style={{ color: "#e8e8ef" }}>AI Chat</h2>
                </div>
                <button
                    onClick={onClear}
                    className="text-xs px-2 py-1 rounded transition-all duration-200"
                    style={{ color: "#555570" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#00d4ff"; e.currentTarget.style.background = "rgba(0, 212, 255, 0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#555570"; e.currentTarget.style.background = "transparent"; }}
                >
                    Clear
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-4xl mb-4" style={{ filter: "drop-shadow(0 0 8px rgba(0, 212, 255, 0.3))" }}>🎨</div>
                        <h3 className="text-lg font-semibold mb-2" style={{ color: "#e8e8ef" }}>
                            AI UI Generator
                        </h3>
                        <p className="text-sm max-w-xs" style={{ color: "#8888a0" }}>
                            Describe the UI you want to build in plain English.
                            I&apos;ll generate working React code using our component library.
                        </p>
                        <div className="mt-6 space-y-2 w-full max-w-xs">
                            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#00d4ff", textShadow: "0 0 6px rgba(0, 212, 255, 0.3)" }}>
                                Try these:
                            </p>
                            {[
                                "Build a dashboard with stats, a chart, and a data table",
                                "Create a settings page with a sidebar and form",
                                "Design a landing page with navbar and feature cards",
                            ].map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        console.log("[ChatPanel] Suggestion clicked:", suggestion);
                                        onSend(suggestion);
                                    }}
                                    className="w-full text-left text-xs rounded-lg px-3 py-2.5 transition-all duration-200"
                                    style={{
                                        color: "#8888a0",
                                        background: "#16161f",
                                        border: "1px solid #2a2a3a",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = "#00d4ff";
                                        e.currentTarget.style.color = "#00d4ff";
                                        e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.15), inset 0 0 10px rgba(0, 212, 255, 0.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = "#2a2a3a";
                                        e.currentTarget.style.color = "#8888a0";
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className="max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                            style={
                                msg.role === "user"
                                    ? {
                                        background: "linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)",
                                        color: "#ffffff",
                                        borderBottomRightRadius: "6px",
                                        boxShadow: "0 0 15px rgba(0, 212, 255, 0.2)"
                                    }
                                    : msg.role === "system"
                                        ? {
                                            background: "#1a0a0a",
                                            color: "#ff6b6b",
                                            border: "1px solid #4a1a1a",
                                            borderBottomLeftRadius: "6px"
                                        }
                                        : {
                                            background: "#16161f",
                                            color: "#c8c8d8",
                                            border: "1px solid #2a2a3a",
                                            borderBottomLeftRadius: "6px"
                                        }
                            }
                        >
                            {msg.role === "assistant" && (
                                <div className="flex items-center gap-1.5 mb-2 pb-2" style={{ borderBottom: "1px solid #2a2a3a" }}>
                                    <span className="text-xs">🤖</span>
                                    <span className="text-xs font-medium" style={{ color: "#00d4ff" }}>
                                        AI Explainer
                                    </span>
                                </div>
                            )}
                            <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                        </div>
                    </div>
                ))}

                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="rounded-2xl px-4 py-3" style={{
                            background: "#16161f",
                            border: "1px solid #1a3a5c",
                            borderBottomLeftRadius: "6px",
                            boxShadow: "0 0 10px rgba(0, 212, 255, 0.1)"
                        }}>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[0, 150, 300].map((delay) => (
                                        <div key={delay} className="w-2 h-2 rounded-full animate-bounce"
                                            style={{
                                                background: "#00d4ff",
                                                boxShadow: "0 0 4px #00d4ff",
                                                animationDelay: `${delay}ms`
                                            }} />
                                    ))}
                                </div>
                                <span className="text-xs" style={{ color: "#00d4ff" }}>
                                    Generating UI...
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3" style={{ borderTop: "1px solid #1a3a5c", background: "#111118" }}>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <textarea
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe the UI you want..."
                        disabled={isGenerating}
                        rows={1}
                        className="flex-1 resize-none rounded-xl px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none"
                        style={{
                            background: "#16161f",
                            color: "#e8e8ef",
                            border: "1px solid #2a2a3a",
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = "#00d4ff";
                            e.currentTarget.style.boxShadow = "0 0 10px rgba(0, 212, 255, 0.15), 0 0 2px rgba(0, 212, 255, 0.3)";
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = "#2a2a3a";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isGenerating}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex-shrink-0"
                        style={{
                            background: !input.trim() || isGenerating
                                ? "#1a1a25"
                                : "linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)",
                            color: !input.trim() || isGenerating ? "#555570" : "#ffffff",
                            cursor: !input.trim() || isGenerating ? "not-allowed" : "pointer",
                            boxShadow: !input.trim() || isGenerating ? "none" : "0 0 12px rgba(0, 212, 255, 0.3)",
                            opacity: !input.trim() || isGenerating ? 0.5 : 1,
                        }}
                    >
                        {isGenerating ? "..." : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}
