import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { LIGHT_THEME } from "../../constants/ThemeConstants";
import { useStateContext } from "../../contexts/ContextProvider";
import LogoBlue from "../../assets/images/logo_blue.svg";
import LogoWhite from "../../assets/images/logo_white.svg";
import { MdOutlineClose, MdOutlineGridView } from "react-icons/md";
import { IoCashOutline } from "react-icons/io5";
import { LuUserSquare2 } from "react-icons/lu";
import {
    RiListUnordered,
    RiListSettingsFill,
    RiLogoutBoxRLine,
} from "react-icons/ri";
import { BiSolidBellRing } from "react-icons/bi";

import { RiCashLine } from "react-icons/ri";
import { FaListOl, FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import "./Sidebar.scss";
import { SidebarContext } from "../../contexts/SidebarContext";
import axiosClient from "../../axios";

export default function Sidebar() {
    const { onLogout,fetchUnreadLoans,unreadLoans } = useStateContext();
    const { theme } = useContext(ThemeContext);
    const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
    

    const navbarRef = useRef(null);

    // closing the navbar when clicked outside the sidebar area
    const handleClickOutside = (event) => {
        if (
            navbarRef.current &&
            !navbarRef.current.contains(event.target) &&
            event.target.className !== "sidebar-open-btn"
        ) {
            closeSidebar();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        
        fetchUnreadLoans();
        const intervalId = setInterval(fetchUnreadLoans, 180000); // 5 minutes

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);


    }, []);

   


  

    return (
        <nav
            className={`sidebar ${isSidebarOpen ? " sidebar-show" : " "}`}
            ref={navbarRef}
        >
            <div className="sidebar-top">
                <div className="sidebar-brand">
                    <img
                        src={theme === LIGHT_THEME ? LogoBlue : LogoWhite}
                        alt=""
                    />
                    <span className="sidebar-brand-text">JBL Systeme.</span>
                </div>
                <button className="sidebar-close-btn" onClick={closeSidebar}>
                    <MdOutlineClose size={24} />
                </button>
            </div>
            <div className="sidebar-body">
                <div className="sidebar-menu">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <NavLink
                                to={"/"}
                                activeclassname="active"
                                className="menu-link "
                            >
                                <span className="menu-link-icon">
                                    <MdOutlineGridView size={16} />
                                </span>
                                <span className="menu-link-text">
                                    Dashboard
                                </span>
                            </NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink
                                to={"/customers"}
                                activeclassname="active"
                                className="menu-link"
                            >
                                <span className="menu-link-icon">
                                    <FaUser size={16} />
                                </span>
                                <span className="menu-link-text">
                                    All Members
                                </span>
                            </NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink
                                to={"/loans"}
                                activeclassname="active"
                                className="menu-link"
                            >
                                <span className="menu-link-icon">
                                    <RiCashLine size={19} />
                                </span>
                                <div className="menu-link-text">
                                    <div className="flex items-center">
                                        <span>Disposit List</span>
                                        {unreadLoans.length > 0 && (
                                            <div className="relative ml-4">
                                                <div className="absolute animate-bounce flex justify-center -mt-2 ml-3 items-center p-1 w-5 h-5 bg-red-600 rounded-full">
                                                    <span className="text-[11px]">
                                                        {unreadLoans.length}
                                                    </span>
                                                </div>
                                                <BiSolidBellRing size={20} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink
                                to={"/withdraws"}
                                activeclassname="active"
                                className="menu-link"
                            >
                                <span className="menu-link-icon">
                                    <IoCashOutline size={17} />
                                </span>
                                <span className="menu-link-text">
                                    Withdraw List
                                </span>
                            </NavLink>
                        </li>
                        <li className="menu-item">
                            <NavLink
                                to={"/order-status"}
                                activeclassname="active"
                                className="menu-link"
                            >
                                <span className="menu-link-icon">
                                    <RiListUnordered size={16} />
                                </span>
                                <span className="menu-link-text">
                                    Order Status
                                </span>
                            </NavLink>
                        </li>
                        {/* <li className="menu-item">
                            <NavLink
                                to={"/durations"}
                                activeclassname="active"
                                className="menu-link"
                            >
                                <span className="menu-link-icon">
                                    <FaListOl  size={16} />
                                </span>
                                <span className="menu-link-text">
                                   Durations
                                </span>
                            </NavLink>
                        </li> */}
                        <li className="menu-item">
                            <NavLink
                                to={"/staffs"}
                                activeclassname="active"
                                className="menu-link"
                            >
                                <span className="menu-link-icon">
                                    <LuUserSquare2 size={16} />
                                </span>
                                <span className="menu-link-text">
                                    Staff Managerment
                                </span>
                            </NavLink>
                        </li>
                    </ul>
                </div>

                <div className="sidebar-menu sidebar-menu2">
                    <ul className="menu-list">
                        <li className="menu-item">
                            <NavLink
                                to={"/setting"}
                                activeclassname="active"
                                className="menu-link"
                            >
                                <span className="menu-link-icon">
                                    <RiListSettingsFill size={16} />
                                </span>
                                <span className="menu-link-text">Setting</span>
                            </NavLink>
                        </li>
                        <li className="menu-item">
                            <div
                                onClick={onLogout}
                                className="menu-link cursor-pointer"
                            >
                                <span className="menu-link-icon">
                                    <RiLogoutBoxRLine size={16} />
                                </span>
                                <span className="menu-link-text">Logout</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
