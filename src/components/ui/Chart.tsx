"use client";
import React from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface ChartDataPoint {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface ChartProps {
    type?: "bar" | "line" | "pie" | "area";
    data: ChartDataPoint[];
    title?: string;
    xKey?: string;
    yKey?: string;
    color?: string;
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

export default function Chart({
    type = "bar",
    data,
    title,
    xKey = "name",
    yKey = "value",
    color = "#6366f1",
}: ChartProps) {
    const renderChart = () => {
        switch (type) {
            case "line":
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey={yKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={{ r: 4, fill: color }}
                        />
                    </LineChart>
                );
            case "pie":
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey={yKey}
                            label={({ name, percent }: { name: string; percent: number }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                );
            case "area":
                return (
                    <AreaChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey={yKey}
                            stroke={color}
                            fill={`${color}33`}
                            strokeWidth={2}
                        />
                    </AreaChart>
                );
            default:
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                );
        }
    };

    return (
        <div className="w-full">
            {title && (
                <h4 className="text-sm font-semibold text-slate-700 mb-3">{title}</h4>
            )}
            <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                    {renderChart()}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
