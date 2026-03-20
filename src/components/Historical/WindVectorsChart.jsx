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

const WindVectorsChart = ({ weatherData }) => {
    return (
        <ReusableChart
            category="AERODYNAMICS · VECTORS"
            title="Wind Velocity"
            subtitle="SPEED AND DIRECTION TRENDS"
            height={300}
        >
            <LineChart data={weatherData} style={{ outline: "none" }}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
                                    <p className="text-xs font-bold text-gray-400 mb-1">
                                        {new Date(
                                            payload[0].payload.date,
                                        ).toDateString()}
                                    </p>
                                    <p className="text-sm font-bold text-blue-600">
                                        Max Speed: {payload[0].value} km/h
                                    </p>
                                    <p className="text-[10px] font-bold text-gray-400">
                                        Direction: {payload[0].payload.windDir}°
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Line
                    type="monotone"
                    dataKey="wind"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={({ cx, cy, payload }) => (
                        <g transform={`translate(${cx},${cy})`}>
                            <path
                                d="M0 -6 L3 4 L0 1 L-3 4 Z"
                                fill="#3b82f6"
                                transform={`rotate(${payload.windDir})`}
                            />
                        </g>
                    )}
                    name="Wind Vector"
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "20px" }}
                    formatter={() => (
                        <span className="text-[10px] md:text-xs font-bold text-[#4a5568] px-1 md:px-2">
                            Wind Speed & Direction
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

export default WindVectorsChart;
