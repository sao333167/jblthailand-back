import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./pages/dashboard";
import Staffs from "./pages/staffs";
import Customers from "./pages/customers";
import Detail from "./pages/customers/detial";
import NotFound from "./pages/NotFound";
import Loans from "./pages/Loans";
import Withdraws from "./pages/withdraw";
import OrderStatus from "./pages/orderStatus";
import SystemSetting from "./pages/setting";
import Durations from "./pages/durations";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Navigate to="/dashboard" />,
            },
            {
                path: "/dashboard",
                element: <Dashboard />,
            },
            {
                path: "/customers",
                element: <Customers />,
            },
            {
                path: "/customers/:uuid/detail",
                element: <Detail />,
            },
            {
                path: "/loans",
                element: <Loans />,
            },
            {
                path: "/withdraws",
                element: <Withdraws />,
            },
            {
                path: "/order-status",
                element: <OrderStatus />,
            },
            {
                path: "/staffs",
                element: <Staffs />,
            },
            {
                path: "/setting",
                element: <SystemSetting />,
            },
            {
                path: "/durations",
                element: <Durations />,
            },
        ],
    },

    // GuestLayout
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
        ],
    },

    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router;
