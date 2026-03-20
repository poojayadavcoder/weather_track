import React, { memo, useMemo } from "react";
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
      <LineChart data={data} style={{ outline: "none" }}>
        <CartesianGrid {...gridStyle} />

        <XAxis dataKey="date" hide />
        <YAxis hide />

        <Tooltip cursor={false} />

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

export default memo(AQITrendChart);
