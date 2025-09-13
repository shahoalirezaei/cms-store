// cms-store/src/hooks/useAuthFetch.js
import { useContext } from "react";
import LoadingContext from "../context/LoadingContext";

export const useAuthFetch = () => {
  const { setLoading } = useContext(LoadingContext);
  const API_BASE = import.meta.env.VITE_API_URL;

  if (!API_BASE) {
  console.warn(
    "⚠️ VITE_API_URL is not set! Make sure to configure Environment Variables in Vercel."
  );

  const authFetch = async (url, method = "GET", body = null) => {
    setLoading(true);
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    let fullUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      fullUrl = API_BASE + (url.startsWith("/") ? url : `/${url}`);
    } else {
      fullUrl = url.replace("http://localhost:8001", API_BASE);
    }

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((data && data.message) || "Something went wrong");
      }
      return { error: null, data };
    } catch (error) {
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  return { authFetch };
};
