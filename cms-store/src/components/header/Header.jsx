import React, { useEffect, useState } from "react";
import { AiOutlineBell } from "react-icons/ai";
import { BsBrightnessHigh } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { BsMenuButtonWide } from "react-icons/bs";
import routes from "../../routes/router";
import { useNavigate } from "react-router-dom";
// import './Header.css'

function Header({ toggleSidebar }) {

  const allRoute = routes;
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredRoutes = searchTerm
    ? allRoute.filter((route) => {
        return route.title.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];
 

  return (
    <div className="header w-full flex justify-between items-center mt-2.5">
      <button className="text-zinc-900 text-3xl md:hidden"
      onClick={toggleSidebar}
      >
        <BsMenuButtonWide />
      </button>
      <div className="search-box relative justify-between hidden sm:flex items-center shadow-md rounded-2xl pr-1 w-2xs md:w-[440px] bg-white h-[45px] ">
        <input
          type="text"
          placeholder="Search pages (e.g. orders, users...)"
          className="border-0 outline-0 w-full bg-inherit px-5 py-2.5 rounded-2xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="flex justify-center items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:ring-blue-200 font-medium rounded-xl text-sm h-[38px]  px-5 py-1 btn-blue">
          <CiSearch />
        </button>
        {searchTerm && (
          <ul className="absolute top-[100%] mt-2 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredRoutes.length ? (
              filteredRoutes.map((route) => (
                <li
                  key={route.path}
                  onClick={() => {
                    navigate(route.path);
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {route.title}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-400">No match found</li>
            )}
          </ul>
        )}
      </div>
      <div className="flex gap-x-7 md:gap-x-3.5">
        <div className="relative header-right-icon btn-blue sm:h-[38px] sm:flex sm:items-center">
          <AiOutlineBell />
          <span className="absolute w-5 h-5 text-xs rounded-xl -top-2.5 -left-1.5 text-white bg-gray-400 flex justify-center items-center">3</span>
        </div>
        <div className="header-right-icon btn-blue sm:h-[38px] flex items-center">
          <BsBrightnessHigh />
        </div>
      </div>
    </div>
  );
}

export default Header;
