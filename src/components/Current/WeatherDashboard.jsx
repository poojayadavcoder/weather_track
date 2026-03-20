import React, { lazy, Suspense, memo, useMemo } from "react";
import WeatherCard from "../WeatherCard";
import { Droplets, CloudRain, Sun, Wind } from "lucide-react";

// Lazy load heavy chart component
const WeatherCharts = lazy(() => import("./WeatherCharts"));

const WeatherDashboard = ({ weatherData, aqiData, selectedDate }) => {
  if (!weatherData || !aqiData) return null;

  const isToday = useMemo(
    () => selectedDate.toDateString() === new Date().toDateString(),
    [selectedDate]
  );

  const targetDate = useMemo(() => {
    const date = isToday ? new Date() : new Date(selectedDate);
    if (!isToday) date.setHours(12, 0, 0, 0);
    return date;
  }, [selectedDate, isToday]);

  const currentHourStr = useMemo(() => {
    return (
      targetDate.getFullYear() +
      "-" +
      String(targetDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(targetDate.getDate()).padStart(2, "0") +
      "T" +
      String(targetDate.getHours()).padStart(2, "0") +
      ":00"
    );
  }, [targetDate]);

  const hourIdx = useMemo(() => {
    const idx = weatherData.hourly.time.findIndex((t) =>
      t.startsWith(currentHourStr)
    );
    return idx === -1 ? 0 : idx;
  }, [weatherData, currentHourStr]);

  const aqiHourIdx = useMemo(() => {
    const idx = aqiData.hourly.time.findIndex((t) =>
      t.startsWith(currentHourStr)
    );
    return idx === -1 ? 0 : idx;
  }, [aqiData, currentHourStr]);

  // Weather values
  const currentTemp = Math.round(weatherData.hourly.temperature_2m[hourIdx]);
  const feelsLike = currentTemp;
  const humidity = weatherData.hourly.relative_humidity_2m[hourIdx];
  const precipitation = weatherData.hourly.precipitation[hourIdx];
  const windSpeed = Math.round(weatherData.hourly.wind_speed_10m[hourIdx]);

  // Daily data
  const daily = weatherData.daily;
  const minTemp = daily.temperature_2m_min?.[0]
    ? Math.round(daily.temperature_2m_min[0])
    : 0;

  const maxTemp = daily.temperature_2m_max?.[0]
    ? Math.round(daily.temperature_2m_max[0])
    : 0;

  const precipProb = daily.precipitation_probability_max?.[0] ?? 0;
  const uvIndex = daily.uv_index_max?.[0] ?? 0;
  const sunrise = daily.sunrise?.[0];
  const sunset = daily.sunset?.[0];

  // AQI values
  const usAqi = aqiData.hourly.us_aqi[aqiHourIdx];
  const pm2_5 = aqiData.hourly.pm2_5[aqiHourIdx];
  const pm10 = aqiData.hourly.pm10[aqiHourIdx];
  const co = aqiData.hourly.carbon_monoxide[aqiHourIdx];
  const no2 = aqiData.hourly.nitrogen_dioxide[aqiHourIdx];
  const o3 = aqiData.hourly.ozone[aqiHourIdx];

  const getAqiStatus = (val) => {
    if (val <= 50) return "Good";
    if (val <= 100) return "Moderate";
    return "Unhealthy";
  };

  return (
    <div className="flex flex-col gap-6 p-2 xl:p-6 lg:px-10 bg-gray-50/50 min-h-screen">

      {/* Top weather stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 xl:grid-cols-12 gap-6 items-stretch">

        <div className="lg:col-span-4 h-full">
          <WeatherCard
            variant="primary"
            title="Current Conditions"
            data={{
              temp: currentTemp,
              feelsLike,
              min: minTemp,
              max: maxTemp,
              precip: precipProb,
            }}
          />
        </div>

        <div className="lg:col-span-2">
          <WeatherCard
            variant="stat"
            title="Atmosphere"
            label="Humidity"
            value={humidity}
            subValue="%"
            subtitle="Relative Humidity"
            icon={Droplets}
          />
        </div>

        <div className="lg:col-span-2">
          <WeatherCard
            variant="stat"
            title="Atmosphere"
            label="Precipitation"
            value={precipitation}
            subValue="mm"
            subtitle="Last hour"
            icon={CloudRain}
          />
        </div>

        <div className="lg:col-span-2">
          <WeatherCard
            variant="stat"
            title="Sun Cycle"
            label="UV Index"
            value={uvIndex}
            subValue={uvIndex > 5 ? "(High)" : "(Low)"}
            subtitle="Peak today"
            icon={Sun}
          />
        </div>

        <div className="lg:col-span-2">
          <WeatherCard
            variant="stat"
            title="Wind"
            label="Max Speed"
            value={windSpeed}
            subValue="km/h"
            subtitle="Current speed"
            icon={Wind}
          />
        </div>
      </div>

      {/* AQI + Sun cycle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        <WeatherCard
          variant="aqi"
          label="Air Quality Index"
          badge={getAqiStatus(usAqi)}
          data={{ aqi: usAqi, pm2_5, pm10, co, no2, o3 }}
        />

        <WeatherCard
          variant="sun"
          data={{ sunrise, sunset }}
        />

      </div>

      {/* Charts (lazy loaded) */}
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <WeatherCharts
          weatherData={weatherData}
          aqiData={aqiData}
          selectedDate={selectedDate}
        />
      </Suspense>
    </div>
  );
};

export default memo(WeatherDashboard);