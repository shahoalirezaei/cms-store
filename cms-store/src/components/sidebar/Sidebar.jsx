import React, { useRef, useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiCommentDetail, BiDollar } from "react-icons/bi";
import { LuUsers } from "react-icons/lu";
import { IoBagCheckOutline } from "react-icons/io5";
import { CiLogin, CiLogout } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

import "./Sidebar.css";

function Sidebar({ isOpen, onClose }) {
  const sidebarRef = useRef();
  const [isAdmin, setIsAdmin] = useState("false");
  const navigate = useNavigate();

  useEffect(() => {
    checkIsAdmin();
    function handleClickOutside(event) {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("touchend", handleClickOutside);

    return () => {
      document.removeEventListener("touchend", handleClickOutside);
    };
  }, [isOpen, onClose, isAdmin]);

  const checkIsAdmin = () => {
    const user = localStorage.getItem("user");
    if (user) {
      if (user.role === "admin") {
        setIsAdmin(true);
      }
    }
  };
  const redirectToLogIn = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    setIsAdmin(false)
  };

  return (
    <div
      ref={sidebarRef}
      className={`z-10  fixed bg-zinc-300 w-65 sm:w-70  pt-6 text-xl border-l-2 h-[100vh] transition-all duration-300 overflow-y-auto scrollbar-custom ${
        isOpen ? "left-0" : "-left-72"
      } md:!left-0`}
    >
      <div className="relative header-section-left flex justify-between w-full gap-x-3 items-center  border-zinc-500 px-5 pb-5">
        <img
          src="../src/img/Peter.jpg"
          className="header-admin-img w-14 h-14 rounded-full"
        />
        <div className="header-admin-info ">
          <h4 className="text-sm sm:text-base -mb-1.5">Shaho alirezaei</h4>
          <span className="text-zinc-400 text-[10px] sm:text-xs">Frontend Developer</span>
          
        </div>
        <div className="flex flex-col gap-y-2.5">
          <div>
            {!isAdmin ? (
              <button onClick={redirectToLogIn}>
                <CiLogin className="hover:text-blue-800" />
              </button>
            ) : (
              <button onClick={handleLogout}>
                <CiLogout className="hover:text-red-600" />
              </button>
            )}
          </div>

          <button>
            <IoSettingsOutline />
          </button>
        </div>
        <div className="absolute -bottom-5 left-0">
            {isAdmin ? (
              <span className="seen-btn text-xs py-1">Admin mode</span>
            ) : (
              <span className="btn-blue text-xs py-2">Demo mode</span>
            )}
          </div>
      </div>
      <ul className="sideber-links">
        <NavLink to="/">
          <IoHomeOutline />
          Dashboard
        </NavLink>
        <NavLink to="/products">
          <MdOutlineProductionQuantityLimits />
          Products
        </NavLink>
        <NavLink to="/comments">
          <BiCommentDetail />
          Comments
        </NavLink>
        <NavLink to="/users">
          <LuUsers />
          Users
        </NavLink>
        <NavLink to="/orders">
          <IoBagCheckOutline />
          Orders
        </NavLink>
        <NavLink to="/offs">
          <BiDollar />
          Offs
        </NavLink>
      </ul>
    </div>
  );
}

export default Sidebar;
