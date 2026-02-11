import React from "react";

interface StatProps {
    label: string;
    value: string | number;
    change?: string;
    changeType?: "increase" | "decrease";
    icon?: string;
}

export default function Stat({
    label,
    value,
    change,
    changeType,
    icon,
}: StatProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                </div>
                {icon && (
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 text-lg">
                        {icon}
                    </div>
                )}
            </div>
            {change && (
                <div className="mt-3 flex items-center gap-1">
                    <span
                        className={`text-xs font-semibold ${changeType === "increase" ? "text-emerald-600" : "text-red-600"
                            }`}
                    >
                        {changeType === "increase" ? "↑" : "↓"} {change}
                    </span>
                    <span className="text-xs text-slate-400">vs last period</span>
                </div>
            )}
        </div>
    );
}
