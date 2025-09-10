import React from "react";
import { useLoading } from "../context/LoadingContext";

function GlobalLoader() {
  const { loading } = useLoading();

  if (!loading) return null; 

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[1000] flex items-center justify-center">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
        <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold">
          Loading
        </span>
      </div>
    </div>
  );
}

export default GlobalLoader;
