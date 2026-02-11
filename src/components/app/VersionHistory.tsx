"use client";
import React from "react";
import { GenerationResult } from "@/lib/agents/orchestrator";

interface VersionHistoryProps {
    versions: GenerationResult[];
    currentIndex: number;
    onSelect: (index: number) => void;
}

export default function VersionHistory({
    versions,
    currentIndex,
    onSelect,
}: VersionHistoryProps) {
    if (versions.length === 0) return null;

    return (
        <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto"
            style={{
                background: "#111118",
                borderBottom: "1px solid #1a3a5c",
            }}>
            <span className="text-xs font-medium mr-2 flex-shrink-0" style={{ color: "#555570" }}>
                Versions:
            </span>
            {versions.map((v, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(i)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200"
                    style={
                        i === currentIndex
                            ? {
                                background: "linear-gradient(135deg, #0066ff 0%, #00d4ff 100%)",
                                color: "#ffffff",
                                boxShadow: "0 0 10px rgba(0, 212, 255, 0.3)"
                            }
                            : {
                                background: "#16161f",
                                color: "#8888a0",
                                border: "1px solid #2a2a3a",
                            }
                    }
                    title={`v${v.version}: ${v.prompt.slice(0, 50)}...`}
                >
                    v{v.version}
                </button>
            ))}
            {versions.length > 1 && (
                <span className="text-xs ml-2 flex-shrink-0" style={{ color: "#555570" }}>
                    Click to rollback
                </span>
            )}
        </div>
    );
}
