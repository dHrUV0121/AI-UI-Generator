import React from "react";

interface ToggleProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    size?: "sm" | "md";
}

const sizeStyles: Record<string, { track: string; thumb: string; translate: string }> = {
    sm: { track: "w-8 h-4", thumb: "w-3 h-3", translate: "translate-x-4" },
    md: { track: "w-11 h-6", thumb: "w-5 h-5", translate: "translate-x-5" },
};

export default function Toggle({
    checked = false,
    onChange,
    label,
    disabled = false,
    size = "md",
}: ToggleProps) {
    const styles = sizeStyles[size];

    return (
        <label
            className={`
        inline-flex items-center gap-3 select-none
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
        >
            <button
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange?.(!checked)}
                className={`
          relative inline-flex flex-shrink-0 rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${styles.track}
          ${checked ? "bg-indigo-600" : "bg-slate-300"}
        `}
            >
                <span
                    className={`
            inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200
            ${styles.thumb}
            ${checked ? styles.translate : "translate-x-0.5"}
            mt-0.5
          `}
                />
            </button>
            {label && <span className="text-sm text-slate-700">{label}</span>}
        </label>
    );
}
