import CompanyProfilePage from "../pages/Company/CompanyProfilePage";
import AvailableOrdersPage from "../pages/User/AvailableOrdersPage";
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
        Component: "My orders page",
    },
    {
        path: "/my-orders/:id",
        Component: "Order details page",
    },
    {
        path: "/company/:id",
        Component: CompanyProfilePage,
    },
    {
        path: "/user/:id",
        Component: UserProfilePage,
    },
    {
        path: "/user",
        Component: UserProfilePage,
    },
];
