import React from "react";

interface DividerProps {
    label?: string;
    orientation?: "horizontal" | "vertical";
}

export default function Divider({
    label,
    orientation = "horizontal",
}: DividerProps) {
    if (orientation === "vertical") {
        return <div className="w-px bg-slate-200 self-stretch mx-2" />;
    }

    if (label) {
        return (
            <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {label}
                </span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>
        );
    }

    return <div className="w-full h-px bg-slate-200 my-4" />;
}
