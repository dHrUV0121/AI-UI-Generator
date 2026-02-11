import React from "react";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "success" | "warning" | "error" | "info" | "default";
    size?: "sm" | "md";
}

const variantStyles: Record<string, string> = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
};

const sizeStyles: Record<string, string> = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs",
};

export default function Badge({
    children,
    variant = "default",
    size = "md",
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
        >
            {children}
        </span>
    );
}
