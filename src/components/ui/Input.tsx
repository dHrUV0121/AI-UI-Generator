import React from "react";

interface InputProps {
    label?: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "number" | "search";
    error?: string;
    helperText?: string;
    disabled?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon?: string;
}

export default function Input({
    label,
    placeholder,
    type = "text",
    error,
    helperText,
    disabled = false,
    value,
    onChange,
    icon,
}: InputProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        {icon}
                    </span>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={value}
                    onChange={onChange}
                    className={`
            w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900
            placeholder:text-slate-400 transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-0
            ${icon ? "pl-9" : ""}
            ${error
                            ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                            : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                        }
            ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}
          `}
                />
            </div>
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
            {helperText && !error && (
                <p className="mt-1.5 text-xs text-slate-500">{helperText}</p>
            )}
        </div>
    );
}
