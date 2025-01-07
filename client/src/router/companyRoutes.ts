import CompanyOwnProfilePage from "../pages/Company/CompanyOwnProfilePage";
import CompanyProfilePage from "../pages/Company/CompanyProfilePage";
import { COMPANY_PROFILE_ROUTE, OWN_PROFILE_ROUTE } from "./consts";

// TODO remove commented code

export const companyRoutes = [
    // {
    //     path: "/my-orders",
    //     Component: MyOrdersPage,
    // },
    // {
    //     path: "/my-orders/:id",
    //     Component: CompanyOrderDetails,
    // },
    // {
    //     path: "/user/:id",
    //     Component: UserProfilePage,
    // },
    // {
    //     path: "/orders/create",
    //     Component: CreateOrderPage,
    // },
    {
        path: COMPANY_PROFILE_ROUTE,
        Component: CompanyProfilePage,
    },
    {
        path: OWN_PROFILE_ROUTE,
        Component: CompanyOwnProfilePage,
    },
];
