import React from "react";

interface CardProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    variant?: "default" | "outlined" | "elevated";
    padding?: "sm" | "md" | "lg";
}

const variantStyles: Record<string, string> = {
    default: "bg-white border border-slate-200",
    outlined: "bg-transparent border-2 border-slate-300",
    elevated: "bg-white shadow-lg shadow-slate-200/50",
};

const paddingStyles: Record<string, string> = {
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
};

export default function Card({
    title,
    subtitle,
    children,
    footer,
    variant = "default",
    padding = "md",
}: CardProps) {
    return (
        <div className={`rounded-xl overflow-hidden ${variantStyles[variant]}`}>
            <div className={paddingStyles[padding]}>
                {title && (
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                        {subtitle && (
                            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                        )}
                    </div>
                )}
                {children}
            </div>
            {footer && (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-200">
                    {footer}
                </div>
            )}
        </div>
    );
}
