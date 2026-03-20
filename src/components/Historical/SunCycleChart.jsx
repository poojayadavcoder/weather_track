import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";
import ReusableChart from "../Common/ReusableChart";

const SunCycleChart = ({ weatherData }) => {
    return (
        <ReusableChart
            category="ASTRONOMY · PATTERNS"
            title="Sun Cycle"
            subtitle="SUNRISE AND SUNSET VARIATION"
            height={300}
        >
            <LineChart data={weatherData} style={{ outline: "none" }}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                />
                <XAxis dataKey="date" hide />
                <YAxis
                    domain={[0, 24]}
                    ticks={[6, 12, 18]}
                    tickFormatter={(val) => `${val}:00`}
                    hide
                />
                <Tooltip
                    cursor={false}
                    formatter={(value) => {
                        const hours = Math.floor(value);
                        const minutes = Math.round((value - hours) * 60);
                        return `${hours}:${minutes.toString().padStart(2, "0")}`;
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="sunrise"
                    stroke="#fbbf24"
                    strokeWidth={3}
                    dot={{ r: 2, fill: "#f59e0b" }}
                    name="Sunrise"
                />
                <Line
                    type="monotone"
                    dataKey="sunset"
                    stroke="#f87171"
                    strokeWidth={3}
                    dot={{ r: 2, fill: "#ef4444" }}
                    name="Sunset"
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "20px" }}
                    formatter={(value) => (
                        <span className="text-[10px] md:text-xs font-bold text-[#4a5568] px-1 md:px-2">
                            {value}
                        </span>
                    )}
                />
                <Brush
                    dataKey="date"
                    height={30}
                    stroke="#e2e8f0"
                    fill="#f8fafc"
                    tickFormatter={(val) => {
                        const d = new Date(val);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                    }}
                />
            </LineChart>
        </ReusableChart>
    );
};

export default SunCycleChart;
