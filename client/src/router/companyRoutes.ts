import CompanyOwnProfilePage from "../pages/Company/CompanyOwnProfilePage";
import CompanyProfilePage from "../pages/Common/CompanyProfilePage";
import { COMPANY_PROFILE_ROUTE, MY_ORDERS_ROUTE, OWN_PROFILE_ROUTE, USER_PROFILE_ROUTE } from "./consts";
import UserProfilePage from "../pages/Common/UserProfilePage";
import OwnOrdersPage from "../pages/Company/OwnOrdersPage";

// TODO remove commented code

export const companyRoutes = [
    {
        path: MY_ORDERS_ROUTE,
        Component: OwnOrdersPage,
    },
    // {
    //     path: "/my-orders/:id",
    //     Component: CompanyOrderDetails,
    // },
    {
        path: USER_PROFILE_ROUTE,
        Component: UserProfilePage,
    },
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
