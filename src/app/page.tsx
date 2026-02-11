"use client";
import React from "react";
import ChatPanel from "@/components/app/ChatPanel";
import CodePanel from "@/components/app/CodePanel";
import PreviewPanel from "@/components/app/PreviewPanel";
import VersionHistory from "@/components/app/VersionHistory";
import { useGeneratorStore } from "@/hooks/useGeneratorStore";

export default function Home() {
    const {
        messages,
        versions,
        currentVersionIndex,
        currentCode,
        isGenerating,
        error,
        generate,
        setVersionIndex,
        setCode,
        clearMessages,
    } = useGeneratorStore();

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#0a0a0f" }}>
            {/* Top Bar */}
            <header className="flex items-center justify-between px-5 h-12 flex-shrink-0"
                style={{
                    background: "linear-gradient(180deg, #111118 0%, #0d0d14 100%)",
                    borderBottom: "1px solid #1a3a5c",
                    boxShadow: "0 1px 15px rgba(0, 212, 255, 0.08)"
                }}>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{
                                background: "linear-gradient(135deg, #00d4ff 0%, #0066ff 100%)",
                                boxShadow: "0 0 12px rgba(0, 212, 255, 0.5), 0 0 24px rgba(0, 212, 255, 0.2)"
                            }}>
                            <span className="text-white text-xs font-bold">AI</span>
                        </div>
                        <h1 className="text-sm font-bold" style={{ color: "#e8e8ef" }}>
                            UI Generator
                        </h1>
                    </div>
                    <span className="text-xs hidden sm:block" style={{ color: "#00d4ff", textShadow: "0 0 8px rgba(0, 212, 255, 0.3)" }}>
                        Natural Language → Working UI
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#555570" }}>
                        {versions.length > 0
                            ? `v${versions[currentVersionIndex]?.version || 1} · ${versions.length} version${versions.length !== 1 ? "s" : ""
                            }`
                            : "Ready"}
                    </span>
                    <div className="w-2 h-2 rounded-full"
                        style={{
                            background: isGenerating ? "#f59e0b" : "#00d4ff",
                            boxShadow: isGenerating
                                ? "0 0 6px #f59e0b, 0 0 12px rgba(245, 158, 11, 0.3)"
                                : "0 0 6px #00d4ff, 0 0 12px rgba(0, 212, 255, 0.3)",
                            animation: isGenerating ? "pulse 1.5s ease-in-out infinite" : "none"
                        }} />
                </div>
            </header>

            {/* Version History */}
            <VersionHistory
                versions={versions}
                currentIndex={currentVersionIndex}
                onSelect={setVersionIndex}
            />

            {/* Main 3-Panel Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Chat */}
                <div className="w-[340px] flex-shrink-0 overflow-hidden"
                    style={{ borderRight: "1px solid #1a3a5c" }}>
                    <ChatPanel
                        messages={messages}
                        isGenerating={isGenerating}
                        error={error}
                        onSend={generate}
                        onClear={clearMessages}
                    />
                </div>

                {/* Middle Panel: Code Editor */}
                <div className="flex-1 min-w-0 overflow-hidden"
                    style={{ borderRight: "1px solid #1a3a5c" }}>
                    <CodePanel
                        code={currentCode}
                        onCodeChange={setCode}
                        isGenerating={isGenerating}
                    />
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 min-w-0 overflow-hidden">
                    <PreviewPanel
                        code={currentCode}
                        isGenerating={isGenerating}
                    />
                </div>
            </div>
        </div>
    );
}
