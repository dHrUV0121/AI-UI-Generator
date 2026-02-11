import React from "react";

interface ProgressBarProps {
    value: number;
    variant?: "default" | "success" | "warning" | "error";
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
}

const variantColors: Record<string, string> = {
    default: "bg-indigo-600",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    error: "bg-red-500",
};

const sizeStyles: Record<string, string> = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
};

export default function ProgressBar({
    value,
    variant = "default",
    size = "md",
    showLabel = false,
}: ProgressBarProps) {
    const clampedValue = Math.min(100, Math.max(0, value));

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-slate-600">Progress</span>
                    <span className="text-xs font-semibold text-slate-700">
                        {clampedValue}%
                    </span>
                </div>
            )}
            <div className={`w-full bg-slate-200 rounded-full overflow-hidden ${sizeStyles[size]}`}>
                <div
                    className={`${variantColors[variant]} rounded-full transition-all duration-500 ease-out h-full`}
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        </div>
    );
}
