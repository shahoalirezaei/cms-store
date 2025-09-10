import { createContext, useContext, useState } from "react";

// Create the context
const LoadingContext = createContext();

// Custom hook for using context (exported as useLoading)
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};


export default LoadingContext;
