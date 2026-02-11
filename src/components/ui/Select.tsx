import React from "react";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    options: SelectOption[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
}

export default function Select({
    label,
    options,
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
}: SelectProps) {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`
          w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900
          appearance-none transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-offset-0
          ${error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-200"
                    }
          ${disabled ? "opacity-50 cursor-not-allowed bg-slate-50" : ""}
        `}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
        </div>
    );
}
