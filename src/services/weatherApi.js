import axios from "axios";

const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const AQI_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export const getCurrentWeather = async (lat, lon) => {
    const res = await axios.get(
        `${BASE_URL}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m&daily=sunrise,sunset,uv_index_max,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    );
    return res.data;
};

export const getAirQuality = async (lat, lon) => {
    const res = await axios.get(
        `${AQI_URL}?latitude=${lat}&longitude=${lon}&hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi&timezone=auto`
    );
    return res.data;
};

export const getHistoricalWeather = async (lat, lon, start, end) => {
    const res = await axios.get(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,sunrise,sunset,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant&timezone=auto`
    );
    return res.data;
};

export const getHistoricalAQI = async (lat, lon, start, end) => {
    const res = await axios.get(
        `${AQI_URL}?latitude=${lat}&longitude=${lon}&start_date=${start}&end_date=${end}&hourly=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,us_aqi&timezone=auto`
    );
    return res.data;
};
