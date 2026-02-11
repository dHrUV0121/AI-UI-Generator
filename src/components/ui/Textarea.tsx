import React from "react";

interface TextareaProps {
    label?: string;
    placeholder?: string;
    rows?: number;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    disabled?: boolean;
    maxLength?: number;
}

export default function Textarea({
    label,
    placeholder,
    rows = 4,
    value,
    onChange,
    error,
    disabled = false,
    maxLength,
}: TextareaProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <textarea
                placeholder={placeholder}
                rows={rows}
                value={value}
                onChange={onChange}
                disabled={disabled}
                maxLength={maxLength}
                className={`
          w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900
          placeholder:text-slate-400 transition-all duration-150 resize-y
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }
          ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}
        `}
            />
            <div className="flex justify-between mt-1.5">
                {error && <p className="text-xs text-red-600">{error}</p>}
                {maxLength && (
                    <p className="text-xs text-slate-400 ml-auto">
                        {(value || "").length}/{maxLength}
                    </p>
                )}
            </div>
        </div>
    );
}
