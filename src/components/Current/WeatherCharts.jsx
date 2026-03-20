import React, { useState, useMemo, memo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import ReusableChart from "../Common/ReusableChart";

const WeatherCharts = ({ weatherData, aqiData, selectedDate }) => {
  if (!weatherData || !aqiData) return null;

  const [hourlyMetric, setHourlyMetric] = useState("temp");
  const [precipMetric, setPrecipMetric] = useState("precip");

  const isToday = useMemo(
    () => selectedDate.toDateString() === new Date().toDateString(),
    [selectedDate]
  );

  const targetDate = useMemo(() => {
    const d = new Date(selectedDate);
    if (!isToday) d.setHours(0, 0, 0, 0);
    return isToday ? new Date() : d;
  }, [selectedDate, isToday]);

  const currentHourStr = useMemo(() => {
    return targetDate.toISOString().slice(0, 13) + ":00";
  }, [targetDate]);

  const startIdx = useMemo(() => {
    let idx = weatherData.hourly.time.findIndex((t) =>
      t.startsWith(currentHourStr)
    );
    return idx === -1 ? 0 : idx;
  }, [weatherData, currentHourStr]);


  const hourlyChartData = useMemo(() => {
    return weatherData.hourly.time
      .slice(startIdx, startIdx + 24)
      .map((time, i) => {
        const idx = startIdx + i;
        const date = new Date(time);

        return {
          time: date.toLocaleTimeString([], { hour: "numeric" }),
          temp: weatherData.hourly.temperature_2m[idx],
          vis: weatherData.hourly.visibility[idx] / 1000,
          precip: weatherData.hourly.precipitation[idx],
          humid: weatherData.hourly.relative_humidity_2m[idx],
        };
      });
  }, [weatherData, startIdx]);


  const aqiTrendData = useMemo(() => {
    const start = Math.max(0, startIdx - 12);
    const end = startIdx + 24;

    return aqiData.hourly.time.slice(start, end).map((time, i) => {
      const idx = start + i;
      const date = new Date(time);

      return {
        time: date.toLocaleTimeString([], { hour: "2-digit" }),
        pm2_5: aqiData.hourly.pm2_5[idx],
        pm10: aqiData.hourly.pm10[idx],
      };
    });
  }, [aqiData, startIdx]);

  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <ReusableChart
          category="HOURLY FORECAST"
          title="Temperature & Visibility"
          height={320}
          actions={
            <>
              <button
                onClick={() => setHourlyMetric("temp")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                  hourlyMetric === "temp"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500"
                }`}
              >
                Temp
              </button>
              <button
                onClick={() => setHourlyMetric("vis")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                  hourlyMetric === "vis"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500"
                }`}
              >
                Vis
              </button>
            </>
          }
        >
          <AreaChart data={hourlyChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" interval={3} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={hourlyMetric}
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={0.2}
              fill="#3b82f6"
              dot={false}
            />
          </AreaChart>
        </ReusableChart>

        <ReusableChart
          category="HOURLY FORECAST"
          title="Precipitation & Humidity"
          height={320}
          actions={
            <>
              <button
                onClick={() => setPrecipMetric("precip")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                  precipMetric === "precip"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500"
                }`}
              >
                Precip
              </button>
              <button
                onClick={() => setPrecipMetric("humid")}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold ${
                  precipMetric === "humid"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-500"
                }`}
              >
                Humid
              </button>
            </>
          }
        >
          <BarChart data={hourlyChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" interval={3} />
            <Tooltip />
            <Bar dataKey={precipMetric} fill="#3b82f6" barSize={20} />
          </BarChart>
        </ReusableChart>
      </div>

      <ReusableChart
        category="TREND ANALYSIS"
        title="PM10 & PM2.5 Hourly Distribution"
        height={300}
      >
        <LineChart data={aqiTrendData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" interval={4} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="pm2_5"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="pm10"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ReusableChart>
    </div>
  );
};

export default memo(WeatherCharts);