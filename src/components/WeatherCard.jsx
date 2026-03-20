import React, { useEffect, useState } from "react";
import {CloudSun,Sun,Activity,} from "lucide-react";

const WeatherCard = ({
  variant = "stat",
  title,
  label,
  value,
  subtitle,
  subValue,
  icon: Icon,
  badge,
  footerItems = [],
  data = {}, 
}) => {
  if (variant === "primary") {

    return (
      <div className="bg-blue-500 text-white rounded-3xl p-4 flex flex-col justify-between h-full shadow-xl">
        <div>
          <p className="text-xs font-normal tracking-widest uppercase mb-4">
            {title}
          </p>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <CloudSun className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xl font-semibold">Clear Sky</p>
              <p className="text-[13px] opacity-85">Feels like {data?.feelsLike}°C</p>
            </div>
          </div>
        </div>
        
        <div className="my-3">
          <h2 className="text-6xl font-semibold tracking-tighter flex items-start">
            {data?.temp}<span className="text-3xl ml-1 font-normal mt-5 opacity-85">°C</span>
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
          <div>
            <p className="text-[10px] uppercase opacity-80 mb-1">Min</p>
            <p className="font-semibold">{data?.min}°C</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-80 mb-1">Max</p>
            <p className="font-semibold">{data?.max}°C</p>
          </div>
          <div>
            <p className="text-[10px] uppercase opacity-80 mb-1">Precip Prob</p>
            <p className="font-semibold">{data?.precip}%</p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "aqi") {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-lg">
                <p className="text-[10px] font-semibold text-blue-600 uppercase">ENVIRONMENTAL HEALTH</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-full">
                    <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <p className="font-semibold text-gray-800">Air Quality Index</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge === "Good" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{badge}</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "AQI", value: data?.aqi, unit: "" },
            { label: "PM2.5", value: data?.pm2_5, unit: "µg" },
            { label: "PM10", value: data?.pm10, unit: "µg" },
            { label: "CO", value: data?.co, unit: "µg" },
            { label: "NO2", value: data?.no2, unit: "µg" },
            { label: "O3", value: data?.o3, unit: "µg" }
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-2xl">
              <p className="text-[10px] font-bold text-gray-700 mb-1">{item.label}</p>
              <p className="text-lg font-bold text-blue-600 leading-none">
                {item.value} <span className="text-[10px] font-medium text-gray-500">{item.unit}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "sun") {
    const getSunPosition = (sunriseISO, sunsetISO) => {
      if (!sunriseISO || !sunsetISO) return { x: 50, y: 0 };
      
      const now = new Date();
      const rise = new Date(sunriseISO);
      const set = new Date(sunsetISO);

      const progress = (now - rise) / (set - rise);
      const clamped = Math.min(Math.max(progress, 0), 1);

      const x = clamped * 100;
      const y = Math.sin(clamped * Math.PI) * 70;

      return { x, y };
    };

    const [sunPos, setSunPos] = useState({ x: 50, y: 0 });

    useEffect(() => {
      const update = () => {
        setSunPos(getSunPosition(data?.sunrise, data?.sunset));
      };

      update();
      const interval = setInterval(update, 60000);
      return () => clearInterval(interval);
    }, [data?.sunrise, data?.sunset]);

    const formatTime = (isoString) => {
        if (!isoString) return "";
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full relative overflow-hidden">
        <p className="text-[10px] font-semibold text-blue-600 uppercase mb-4">SUN CYCLE (IST)</p>
        
        <div className="flex items-center gap-3 mb-12">
            <div className="bg-blue-50 p-2 rounded-full">
                <Sun className="w-5 h-5 text-blue-600" />
            </div>
            <p className="font-semibold text-gray-800">Sunrise & Sunset</p>
        </div>

        <div className="relative h-24 mb-6">
            <div className="absolute inset-x-0 top-0 border-t-2 border-dashed border-gray-100 rounded-[100%] h-48"></div>
            <div
              className="absolute transition-all duration-1000 text-yellow-400"
              style={{
                left: `${sunPos.x}%`,
                bottom: `${sunPos.y}px`,
                transform: "translate(-50%, 50%)"
              }}
            >
                <div className="relative">
                    <Sun className="w-6 h-6 fill-current" />
                    <div className="absolute inset-0 bg-yellow-400/30 blur-md rounded-full -z-10 animate-pulse"></div>
                </div>
            </div>

        </div>

        <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] text-gray-700 font-semibold mb-1">Sunrise</p>
                <p className="text-2xl font-semibold text-gray-900">{formatTime(data?.sunrise)}</p>
            </div>
            <div>
                <p className="text-[10px] text-gray-700 font-semibold mb-1 text-right">Sunset</p>
                <p className="text-2xl font-semibold text-gray-900">{formatTime(data?.sunset)}</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl py-6 px-3 shadow-sm border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <p className="text-[11px] font-semibold text-blue-600 uppercase mb-4">
          {title}
        </p>
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-blue-50 p-2 rounded-xl">
            {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          </div>
          <p className="font-semibold text-gray-800">{label}</p>
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-1">
          <h2 className="text-3xl font-semibold text-gray-900">{value}</h2>
          <span className="text-sm font-medium text-gray-500 uppercase">
            {subValue}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 font-medium mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default WeatherCard;
