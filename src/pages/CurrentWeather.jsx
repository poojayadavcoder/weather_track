import { useState, useEffect, lazy, Suspense } from "react";
import useLocation from "../hooks/useLocation";
import {
  getCurrentWeather,
  getAirQuality,
  getHistoricalWeather,
  getHistoricalAQI,
} from "../services/weatherApi";

import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

// Lazy loaded components
const WeatherDashboard = lazy(() => import("../components/Current/WeatherDashboard"));
const DatePicker = lazy(() => import("react-datepicker"));

const CurrentWeather = () => {
  const { location, error: locError, loading: locLoading } = useLocation();

  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (!location) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const isToday =
          selectedDate.toDateString() === new Date().toDateString();

        let weather;
        let aqi;

        if (isToday) {
          [weather, aqi] = await Promise.all([
            getCurrentWeather(location.lat, location.lon),
            getAirQuality(location.lat, location.lon),
          ]);
        } else {
          const dateStr = selectedDate.toISOString().split("T")[0];

          [weather, aqi] = await Promise.all([
            getHistoricalWeather(location.lat, location.lon, dateStr, dateStr),
            getHistoricalAQI(location.lat, location.lon, dateStr, dateStr),
          ]);
        }

        setWeatherData(weather);
        setAqiData(aqi);
        setError(null);
      } catch (err) {
        setError("Failed to fetch weather data for the selected date.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location, selectedDate]);

  // Loading State
  if (locLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-500 font-medium animate-pulse">
          {locLoading ? "Locating you..." : "Fetching weather data..."}
        </p>
      </div>
    );
  }

  // Error State
  if (locError || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-10 text-center">
        <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 max-w-md">
          <h2 className="text-xl font-bold mb-2">
            Oops! Something went wrong
          </h2>

          <p className="opacity-80">{locError || error}</p>

          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isToday =
    selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="w-full pt-5">
      {/* Header */}
      <div className="flex justify-between items-center px-10 mb-6 flex-wrap gap-4">

        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Weather Analysis
          </h1>

          <p className="text-gray-500 font-medium">
            Detailed metrics for{" "}
            {isToday ? "today" : selectedDate.toLocaleDateString()}.
          </p>
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-4 bg-white p-2 px-4 rounded-2xl shadow-sm border border-gray-100">

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
              Select Date
            </span>

            <div className="relative flex items-center gap-2">

              <Suspense fallback={<span>Loading...</span>}>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  maxDate={new Date()}
                  className="bg-transparent border-none outline-none text-sm font-semibold text-gray-700 cursor-pointer w-28"
                  dateFormat="MMM d, yyyy"
                />
              </Suspense>

              <Calendar className="w-4 h-4 text-gray-400 pointer-events-none" />

            </div>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <Suspense
        fallback={
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        <WeatherDashboard
          weatherData={weatherData}
          aqiData={aqiData}
          selectedDate={selectedDate}
        />
      </Suspense>
    </div>
  );
};

export default CurrentWeather;