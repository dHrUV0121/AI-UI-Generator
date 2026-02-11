import React from "react";

interface NavItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface NavbarProps {
    brand?: React.ReactNode;
    items?: NavItem[];
    actions?: React.ReactNode;
    sticky?: boolean;
}

export default function Navbar({
    brand,
    items = [],
    actions,
    sticky = true,
}: NavbarProps) {
    return (
        <nav
            className={`
        w-full bg-white border-b border-slate-200 z-40
        ${sticky ? "sticky top-0" : ""}
      `}
        >
            <div className="flex items-center justify-between px-6 h-16">
                <div className="flex items-center gap-8">
                    {brand && (
                        <div className="text-lg font-bold text-slate-900">{brand}</div>
                    )}
                    <div className="flex items-center gap-1">
                        {items.map((item) => (
                            <a
                                key={item.label}
                                href={item.href || "#"}
                                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150
                  ${item.active
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                                    }
                `}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        </nav>
    );
}
