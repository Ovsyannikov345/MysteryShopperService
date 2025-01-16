import { AVAILABLE_ORDERS_ROUTE, COMPANY_PROFILE_ROUTE, OWN_PROFILE_ROUTE } from "./consts";
import CompanyProfilePage from "../pages/Common/CompanyProfilePage";
import UserOwnProfilePage from "../pages/User/UserOwnProfilePage";
import UserProfilePage from "../pages/Common/UserProfilePage";
import AvailableOrdersPage from "../pages/User/AvailableOrdersPage";

// TODO remove commented code.

export const userRoutes = [
    {
        path: AVAILABLE_ORDERS_ROUTE,
        Component: AvailableOrdersPage,
    },
    // {
    //     path: "/orders/:id",
    //     Component: UserOrderDetails,
    // },
    // {
    //     path: "/my-orders",
    //     Component: OrdersInProgressPage,
    // },
    {
        path: COMPANY_PROFILE_ROUTE,
        Component: CompanyProfilePage,
    },
    {
        path: "/user/:id",
        Component: UserProfilePage,
    },
    {
        path: OWN_PROFILE_ROUTE,
        Component: UserOwnProfilePage,
    },
];
