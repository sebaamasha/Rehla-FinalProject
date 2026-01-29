import { useEffect, useState, useCallback } from "react";

export default function useFetch(url, options = null) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNow = useCallback(async (override = null) => {
    if (!url) return;

    setLoading(true);
    setError("");

    try {
      // Add auth token to requests if available
      const token = localStorage.getItem("rehla_token");
      const fetchOptions = override || options || {};

      if (token) {
        fetchOptions.headers = {
          ...fetchOptions.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      const res = await fetch(url, fetchOptions);

      let json = null;
      const text = await res.text();
      json = text ? JSON.parse(text) : null;

      if (!res.ok) {
        const msg = json?.message || "Request failed";
        throw new Error(msg);
      }

      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchNow();
  }, [fetchNow]);

  return { data, loading, error, refetch: fetchNow, setData };
}
