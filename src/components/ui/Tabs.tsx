"use client";
import React, { useState } from "react";

interface TabItem {
    label: string;
    content: React.ReactNode;
    icon?: string;
}

interface TabsProps {
    tabs: TabItem[];
    defaultIndex?: number;
    variant?: "underline" | "pills" | "enclosed";
}

export default function Tabs({
    tabs,
    defaultIndex = 0,
    variant = "underline",
}: TabsProps) {
    const [activeIndex, setActiveIndex] = useState(defaultIndex);

    const tabStyles: Record<string, (active: boolean) => string> = {
        underline: (active) =>
            active
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-500 border-b-2 border-transparent hover:text-slate-700 hover:border-slate-300",
        pills: (active) =>
            active
                ? "bg-indigo-600 text-white rounded-lg"
                : "text-slate-600 hover:bg-slate-100 rounded-lg",
        enclosed: (active) =>
            active
                ? "bg-white text-slate-900 border border-slate-200 border-b-white rounded-t-lg -mb-px"
                : "text-slate-500 hover:text-slate-700",
    };

    return (
        <div className="w-full">
            <div
                className={`
          flex gap-1
          ${variant === "underline" ? "border-b border-slate-200" : ""}
          ${variant === "enclosed" ? "border-b border-slate-200" : ""}
        `}
            >
                {tabs.map((tab, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`
              px-4 py-2.5 text-sm font-medium transition-all duration-150 flex items-center gap-2
              ${tabStyles[variant](index === activeIndex)}
            `}
                    >
                        {tab.icon && <span>{tab.icon}</span>}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="py-4">{tabs[activeIndex]?.content}</div>
        </div>
    );
}
