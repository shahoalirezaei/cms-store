import { useEffect, useState } from "react";
import routes from "./routes/router";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import GlobalLoader from "./components/GlobalLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useRoutes } from "react-router-dom";

function App() {
  const router = useRoutes(routes);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 const [isSiteLoading, setIsSiteLoading] = useState(true);
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSiteLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isSiteLoading) {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full animate-ping bg-blue-300 opacity-50"></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="text-blue-500 font-semibold tracking-wide animate-pulse">Loading</span>
        </div>
      </div>
    </div>
  );
}


  return (
    <>
      <GlobalLoader />
      <ToastContainer position="top-right" autoClose={5000} theme="light" />
      {!isLoginPage && (
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        className={`px-5 pt-5 flex flex-col w-full min-h-[100vh] ${
          !isLoginPage ? "md:pl-[300px]" : ""
        } `}
      >
        {!isLoginPage && (
          <Header toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        )}

        {router}
        {!isLoginPage && <Footer />}
      </div>
    </>
  );
}

export default App;
