import CompanyProfilePage from "../pages/Company/CompanyProfilePage";
import { COMPANY_PROFILE_ROUTE } from "./consts";

// TODO remove commented code.

export const userRoutes = [
    // {
    //     path: "/orders",
    //     Component: AvailableOrdersPage,
    // },
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
    // {
    //     path: "/user/:id",
    //     Component: UserProfilePage,
    // },
    // {
    //     path: "/profile",
    //     Component: UserProfilePage,
    // },
];
