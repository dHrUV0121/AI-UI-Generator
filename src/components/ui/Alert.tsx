"use client";
import React, { useState } from "react";

interface AlertProps {
    variant?: "success" | "warning" | "error" | "info";
    title?: string;
    children?: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
}

const variantStyles: Record<string, { bg: string; border: string; icon: string; title: string }> = {
    success: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "✓", title: "text-emerald-800" },
    warning: { bg: "bg-amber-50", border: "border-amber-200", icon: "⚠", title: "text-amber-800" },
    error: { bg: "bg-red-50", border: "border-red-200", icon: "✕", title: "text-red-800" },
    info: { bg: "bg-blue-50", border: "border-blue-200", icon: "ℹ", title: "text-blue-800" },
};

export default function Alert({
    variant = "info",
    title,
    children,
    dismissible = false,
    onDismiss,
}: AlertProps) {
    const [visible, setVisible] = useState(true);
    const styles = variantStyles[variant];

    if (!visible) return null;

    return (
        <div className={`rounded-xl border p-4 ${styles.bg} ${styles.border}`}>
            <div className="flex gap-3">
                <span className="text-lg flex-shrink-0">{styles.icon}</span>
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className={`text-sm font-semibold ${styles.title}`}>{title}</h4>
                    )}
                    {children && (
                        <div className={`text-sm mt-1 ${styles.title} opacity-80`}>
                            {children}
                        </div>
                    )}
                </div>
                {dismissible && (
                    <button
                        onClick={() => {
                            setVisible(false);
                            onDismiss?.();
                        }}
                        className={`text-sm ${styles.title} opacity-60 hover:opacity-100 flex-shrink-0`}
                    >
                        ✕
                    </button>
                )}
            </div>
        </div>
    );
}
