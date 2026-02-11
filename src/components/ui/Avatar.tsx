import React from "react";

interface AvatarProps {
    src?: string;
    alt?: string;
    size?: "sm" | "md" | "lg" | "xl";
    fallback?: string;
    status?: "online" | "offline" | "away";
}

const sizeStyles: Record<string, string> = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
};

const statusColors: Record<string, string> = {
    online: "bg-emerald-400",
    offline: "bg-slate-400",
    away: "bg-amber-400",
};

export default function Avatar({
    src,
    alt = "",
    size = "md",
    fallback,
    status,
}: AvatarProps) {
    return (
        <div className="relative inline-flex">
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className={`rounded-full object-cover ${sizeStyles[size]}`}
                />
            ) : (
                <div
                    className={`
            rounded-full flex items-center justify-center font-medium
            bg-indigo-100 text-indigo-700
            ${sizeStyles[size]}
          `}
                >
                    {fallback || "?"}
                </div>
            )}
            {status && (
                <span
                    className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-white
            ${statusColors[status]}
            ${size === "sm" ? "w-2 h-2" : "w-3 h-3"}
          `}
                />
            )}
        </div>
    );
}
