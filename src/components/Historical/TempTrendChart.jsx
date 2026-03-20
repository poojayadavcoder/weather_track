import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import ReusableChart from "../Common/ReusableChart";

const TempTrendChart = ({ weatherData }) => {
    return (
        <ReusableChart
            category="ANALYTICS · CLIMATE"
            title="Temperature Trends"
            subtitle="MEAN, MAX, AND MIN DISTRIBUTION"
            height={450}
        >
            {/* Keeping the internal padding for the chart itself */}
            <div className="h-full w-full bg-gray-50 p-4">
                <LineChart
                    data={weatherData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="meanGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#3182ce"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="100%"
                                stopColor="#90cdf4"
                                stopOpacity={0.2}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                    />

                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                            fill: "#4a5568",
                            fontSize: 11,
                            fontWeight: "bold",
                        }}
                        tickFormatter={(val, i) => {
                            const d = new Date(val);
                            return i % 180 === 0
                                ? `${d.toLocaleString("default", { month: "short" }).toUpperCase()} ${d.getFullYear()}`
                                : "";
                        }}
                    />

                    <YAxis hide />

                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-xl">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">
                                            {new Date(
                                                payload[0].payload.date,
                                            ).toDateString()}
                                        </p>
                                        {payload.map((p, i) => (
                                            <p
                                                key={i}
                                                className="text-sm font-bold"
                                                style={{ color: p.color }}
                                            >
                                                {p.name}: {p.value}°C
                                            </p>
                                        ))}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="tempMean"
                        stroke="url(#meanGradient)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 5, fill: "#3182ce", strokeWidth: 0 }}
                        name="Mean"
                    />

                    <Line
                        type="monotone"
                        dataKey="tempMax"
                        stroke="transparent"
                        dot={({ cx, cy }) => (
                            <circle cx={cx} cy={cy} r={3} fill="#63b3ed" />
                        )}
                        name="Distribution"
                    />

                    <Line
                        type="monotone"
                        dataKey="peakVal"
                        stroke="transparent"
                        dot={({ cx, cy, payload }) => {
                            if (payload.isPeak) {
                                return (
                                    <g>
                                        <circle cx={cx} cy={cy} r={5} fill="#ed64a6" />
                                        <rect
                                            x={cx - 22}
                                            y={cy - 32}
                                            width="44"
                                            height="22"
                                            rx="6"
                                            fill="#fff"
                                            stroke="#fbb6ce"
                                            strokeWidth="1"
                                        />
                                        <text
                                            x={cx}
                                            y={cy - 16}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fontWeight="bold"
                                            fill="#ed64a6"
                                        >
                                            {payload.peakVal}°
                                        </text>
                                    </g>
                                );
                            }
                            return null;
                        }}
                        name="Peak Max"
                    />

                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-xs font-bold text-gray-600 px-2">
                                {value}
                            </span>
                        )}
                    />

                    <Brush
                        dataKey="date"
                        height={30}
                        stroke="#cbd5e0"
                        fill="#f1f5f9"
                    />
                </LineChart>
            </div>
        </ReusableChart>
    );
};

export default TempTrendChart;
