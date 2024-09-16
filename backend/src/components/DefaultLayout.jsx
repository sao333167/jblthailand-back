import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { Sidebar } from ".";
import { ThemeContext } from "../contexts/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "../constants/ThemeConstants";
import MoonIcon from "../assets/icons/moon.svg";
import SunIcon from "../assets/icons/sun.svg";

export default function DefaultLayOut() {
    const { token } = useStateContext();
    const { theme, toggleTheme } = useContext(ThemeContext);

    if (!token) {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        if (theme === DARK_THEME) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [theme]);

    // console.log(theme);

    return (
        <main className="page-wrapper">
            {/* left of page */}
            <Sidebar />
            {/* right side/content of th page */}
            <div className="content-wrapper">
                <Outlet />
            </div>
            <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
            >
                <img
                    className="theme-icon"
                    src={theme === LIGHT_THEME ? SunIcon : MoonIcon}
                />
            </button>
        </main>
    );
}
