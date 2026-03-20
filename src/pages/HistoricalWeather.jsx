import React, { useEffect, useState, useCallback } from "react";
import useLocation from "../hooks/useLocation";
import { getHistoricalWeather, getHistoricalAQI } from "../services/weatherApi";
import { AlertCircle, Activity } from "lucide-react";

import HistoricalControls from "../components/Historical/HistoricalControls";
import TempTrendChart from "../components/Historical/TempTrendChart";
import SunCycleChart from "../components/Historical/SunCycleChart";
import PrecipitationChart from "../components/Historical/PrecipitationChart";
import WindVectorsChart from "../components/Historical/WindVectorsChart";
import AQITrendChart from "../components/Historical/AQITrendChart";

const HistoricalWeather = () => {
  const { location } = useLocation();

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d;
  });

  const [endDate, setEndDate] = useState(new Date());

  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetch = useCallback(async () => {
    if (!location?.lat || !location?.lon) {
      setError("Please allow location access to fetch data.");
      return;
    }

    const diffDays = Math.ceil(Math.abs(endDate - startDate) / 86400000);

    if (diffDays > 730) {
      setError("Date range cannot exceed 2 years.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const startStr = startDate.toISOString().slice(0, 10);
      const endStr = endDate.toISOString().slice(0, 10);

      const [weather, aqi] = await Promise.all([
        getHistoricalWeather(location.lat, location.lon, startStr, endStr),
        getHistoricalAQI(location.lat, location.lon, startStr, endStr),
      ]);


      const maxTempVal = Math.max(...weather.daily.temperature_2m_max);
      const peakIdx = weather.daily.temperature_2m_max.indexOf(maxTempVal);

      const weatherProcessed = weather.daily.time.map((time, i) => {
        const dateObj = new Date(time);

        const sunriseDate = new Date(weather.daily.sunrise[i]);
        const sunsetDate = new Date(weather.daily.sunset[i]);

        return {
          date: time,
          label:
            i % 150 === 0
              ? `${dateObj.toLocaleString("default", {
                  month: "short",
                })} ${dateObj.getFullYear()}`
              : "",
          tempMax: weather.daily.temperature_2m_max[i],
          tempMin: weather.daily.temperature_2m_min[i],
          tempMean: weather.daily.temperature_2m_mean[i],

          isPeak: i === peakIdx,
          peakVal: i === peakIdx ? maxTempVal : null,

          sunrise:
            sunriseDate.getHours() + sunriseDate.getMinutes() / 60,

          sunset:
            sunsetDate.getHours() + sunsetDate.getMinutes() / 60,

          precip: weather.daily.precipitation_sum[i],
          wind: weather.daily.wind_speed_10m_max[i],
          windDir: weather.daily.wind_direction_10m_dominant[i],
        };
      });


      const aqiProcessed = [];

      for (let i = 0; i < aqi.hourly.time.length; i += 24) {
        const pm25Slice = aqi.hourly.pm2_5.slice(i, i + 24);
        const pm10Slice = aqi.hourly.pm10.slice(i, i + 24);

        const avgPm25 =
          pm25Slice.reduce((a, b) => a + b, 0) / pm25Slice.length;

        const avgPm10 =
          pm10Slice.reduce((a, b) => a + b, 0) / pm10Slice.length;

        aqiProcessed.push({
          date: aqi.hourly.time[i].slice(0, 10),
          pm2_5: Number(avgPm25.toFixed(1)),
          pm10: Number(avgPm10.toFixed(1)),
        });
      }

      setWeatherData(weatherProcessed);
      setAqiData(aqiProcessed);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch historical data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [location, startDate, endDate]);

  useEffect(() => {
    if (!location) return;
    handleFetch();
  }, [location, handleFetch]);

  return (
    <div className="w-full p-4 md:p-10 bg-[#f8fbff] min-h-screen font-['Poppins']">
      <div className="max-w-[1400px] mx-auto">

        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">

          <h1 className="text-3xl font-semibold text-[#2d3a54]">
            Historical Analytics
          </h1>

          <HistoricalControls
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            handleFetch={handleFetch}
            loading={loading}
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 mb-8 border border-red-100">
            <AlertCircle className="w-5 h-5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-20 text-gray-500">
            Loading historical data...
          </div>
        )}

        {weatherData && !loading && (
          <div className="grid grid-cols-1 gap-8 mb-12">

            <TempTrendChart weatherData={weatherData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SunCycleChart weatherData={weatherData} />
              <PrecipitationChart weatherData={weatherData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WindVectorsChart weatherData={weatherData} />
              <AQITrendChart aqiData={aqiData} />
            </div>

          </div>
        )}

        {!weatherData && !loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-100">

            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <Activity className="w-12 h-12 text-gray-200" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No data analyzed yet
            </h2>

            <p className="text-gray-400 max-w-sm text-center">
              Select a date range and analyze historical weather patterns.
            </p>

          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalWeather;