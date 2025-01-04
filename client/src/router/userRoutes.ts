import AvailableOrdersPage from "../pages/User/AvailableOrdersPage";
import OrdersInProgressPage from "../pages/User/OrdersInProgressPage";
import UserOrderDetails from "../pages/User/UserOrderDetails";
import UserProfilePage from "../pages/User/UserProfilePage";

export const userRoutes = [
    {
        path: "/orders",
        Component: AvailableOrdersPage,
    },
    {
        path: "/orders/:id",
        Component: UserOrderDetails,
    },
    {
        path: "/my-orders",
        Component: OrdersInProgressPage,
    },
    // {
    //     path: "/company/:id",
    //     Component: CompanyProfilePage,
    // },
    {
        path: "/user/:id",
        Component: UserProfilePage,
    },
    {
        path: "/user",
        Component: UserProfilePage,
    },
];
