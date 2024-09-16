import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.scss";
import router from "./router.jsx";
import { ContextProvider } from "./contexts/ContextProvider.jsx";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import { SidebarProvider } from "./contexts/SidebarContext.jsx";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ContextProvider>
                     <ReactNotifications />
            <ThemeProvider>
                <SidebarProvider>
                    <RouterProvider router={router} />
                </SidebarProvider>
            </ThemeProvider>
        </ContextProvider>
    </React.StrictMode>
);
