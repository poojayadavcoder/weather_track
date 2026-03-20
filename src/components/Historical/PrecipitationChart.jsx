import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import ReusableChart from "../Common/ReusableChart";

const PrecipitationChart = ({ weatherData }) => {
    return (
        <ReusableChart
            category="HYDROLOGY · STATISTICS"
            title="Precipitation"
            subtitle="TOTAL DAILY RAINFALL (MM)"
            height={300}
        >
            <BarChart data={weatherData}>
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip
                    cursor={{ fill: "#f8fafc" }}
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
                                        Rainfall: {payload[0].value} mm
                                    </p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />
                <Bar dataKey="precip" radius={[4, 4, 0, 0]}>
                    {weatherData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.precip > 0 ? "#3b82f6" : "#e2e8f0"}
                        />
                    ))}
                </Bar>
                <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={() => (
                        <span className="text-xs font-bold text-[#4a5568] px-2">
                            Daily Precipitation
                        </span>
                    )}
                />
            </BarChart>
        </ReusableChart>
    );
};

export default PrecipitationChart;
