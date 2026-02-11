import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
    onClick?: () => void;
    icon?: string;
    fullWidth?: boolean;
    type?: "button" | "submit" | "reset";
}

const variantStyles: Record<string, string> = {
    primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm",
    secondary:
        "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
    danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
    ghost:
        "bg-transparent text-slate-600 hover:bg-slate-100 active:bg-slate-200",
    outline:
        "bg-transparent text-slate-700 border border-slate-300 hover:bg-slate-50 active:bg-slate-100",
};

const sizeStyles: Record<string, string> = {
    sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
    md: "px-4 py-2 text-sm rounded-lg gap-2",
    lg: "px-6 py-3 text-base rounded-lg gap-2.5",
};

export default function Button({
    children,
    variant = "primary",
    size = "md",
    disabled = false,
    onClick,
    icon,
    fullWidth = false,
    type = "button",
}: ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
        inline-flex items-center justify-center font-medium transition-all duration-150
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}
      `}
        >
            {icon && <span className="text-current">{icon}</span>}
            {children}
        </button>
    );
}
