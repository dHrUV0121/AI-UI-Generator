import React from "react";

interface SidebarItem {
    label: string;
    icon?: string;
    href?: string;
    active?: boolean;
    children?: SidebarItem[];
}

interface SidebarProps {
    items: SidebarItem[];
    collapsed?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Sidebar({
    items,
    collapsed = false,
    header,
    footer,
}: SidebarProps) {
    const renderItem = (item: SidebarItem, depth: number = 0) => (
        <div key={item.label}>
            <a
                href={item.href || "#"}
                className={`
          flex items-center gap-3 rounded-lg transition-all duration-150
          ${collapsed ? "px-3 py-2.5 justify-center" : "px-3 py-2.5"}
          ${depth > 0 ? "ml-4" : ""}
          ${item.active
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }
        `}
            >
                {item.icon && (
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                )}
                {!collapsed && <span className="text-sm">{item.label}</span>}
            </a>
            {item.children &&
                !collapsed &&
                item.children.map((child) => renderItem(child, depth + 1))}
        </div>
    );

    return (
        <div
            className={`
        flex flex-col bg-white border-r border-slate-200 h-full
        ${collapsed ? "w-16" : "w-64"}
        transition-all duration-200
      `}
        >
            {header && (
                <div className="px-4 py-4 border-b border-slate-200">{header}</div>
            )}
            <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                {items.map((item) => renderItem(item))}
            </nav>
            {footer && (
                <div className="px-4 py-3 border-t border-slate-200">{footer}</div>
            )}
        </div>
    );
}
