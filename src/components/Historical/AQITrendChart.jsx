import React, { memo, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ReusableChart from "../Common/ReusableChart";

const gridStyle = {
  strokeDasharray: "3 3",
  vertical: false,
  stroke: "#f1f5f9",
};

const pm25Dot = { r: 2, fill: "#ed64a6" };
const pm10Dot = { r: 2, fill: "#1a202c" };

const AQITrendChart = ({ aqiData }) => {
  const data = useMemo(() => aqiData || [], [aqiData]);

  return (
    <ReusableChart
      category="ANALYTICS · ATMOSPHERE"
      title="Air Quality Index"
      subtitle="PM10 AND PM2.5 LEVELS"
      height={300}
    >
      <LineChart data={data}>
        <CartesianGrid {...gridStyle} />

        <XAxis dataKey="date" hide />
        <YAxis hide />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="pm2_5"
          stroke="#f43f5e"
          strokeWidth={2}
          dot={pm25Dot}
          isAnimationActive={false}
          name="PM 2.5"
        />

        <Line
          type="monotone"
          dataKey="pm10"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={pm10Dot}
          isAnimationActive={false}
          name="PM 10"
        />

        <Legend
          verticalAlign="bottom"
          iconType="circle"
          formatter={(value) => (
            <span className="text-xs font-bold text-[#4a5568] px-2">
              {value}
            </span>
          )}
        />
      </LineChart>
    </ReusableChart>
  );
};

export default memo(AQITrendChart);
