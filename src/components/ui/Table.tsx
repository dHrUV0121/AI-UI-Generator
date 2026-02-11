import React from "react";

interface Column {
    key: string;
    header: string;
    width?: string;
}

interface TableProps {
    columns: Column[];
    data: Record<string, React.ReactNode>[];
    striped?: boolean;
    hoverable?: boolean;
    compact?: boolean;
}

export default function Table({
    columns,
    data,
    striped = false,
    hoverable = true,
    compact = false,
}: TableProps) {
    return (
        <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`font-semibold text-slate-600 uppercase tracking-wider text-xs ${compact ? "px-3 py-2" : "px-4 py-3"
                                    }`}
                                style={col.width ? { width: col.width } : undefined}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className={`
                border-b border-slate-100 last:border-0 transition-colors
                ${striped && i % 2 === 1 ? "bg-slate-50" : "bg-white"}
                ${hoverable ? "hover:bg-indigo-50/50" : ""}
              `}
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={`text-slate-700 ${compact ? "px-3 py-1.5" : "px-4 py-3"
                                        }`}
                                >
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-8 text-center text-slate-400"
                            >
                                No data available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
