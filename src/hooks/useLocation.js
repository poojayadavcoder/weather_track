import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem("user_location");
    return saved ? JSON.parse(saved) : null;
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!location);

  useEffect(() => {
    if (location) return; // already cached

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000 * 60 * 60,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        setLocation(coords);
        localStorage.setItem("user_location", JSON.stringify(coords));
        setLoading(false);
      },
      (err) => {
        setError(err.message || "Failed to get location.");
        setLoading(false);
      },
      options
    );
  }, [location]);

  return { location, error, loading };
};

export default useLocation;