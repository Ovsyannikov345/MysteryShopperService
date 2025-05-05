import {
    COMPANY_PROFILE_ROUTE,
    CREATE_ORDER_ROUTE,
    MY_ORDERS_ROUTE,
    ORDER_DETAILS_ROUTE,
    OWN_PROFILE_ROUTE,
    USER_PROFILE_ROUTE,
} from "./consts";
import CompanyOwnProfilePage from "../pages/Company/CompanyOwnProfilePage";
import CompanyProfilePage from "../pages/Common/CompanyProfilePage";
import UserProfilePage from "../pages/Common/UserProfilePage";
import OwnOrdersPage from "../pages/Company/OwnOrdersPage";
import CreateOrderPage from "../pages/Company/CreateOrderPage";
import CompanyOrderDetailsPage from "../pages/Company/CompanyOrderDetailsPage";

export const companyRoutes = [
    {
        path: MY_ORDERS_ROUTE,
        Component: OwnOrdersPage,
    },
    {
        path: ORDER_DETAILS_ROUTE,
        Component: CompanyOrderDetailsPage,
    },
    {
        path: USER_PROFILE_ROUTE,
        Component: UserProfilePage,
    },
    {
        path: CREATE_ORDER_ROUTE,
        Component: CreateOrderPage,
    },
    {
        path: COMPANY_PROFILE_ROUTE,
        Component: CompanyProfilePage,
    },
    {
        path: OWN_PROFILE_ROUTE,
        Component: CompanyOwnProfilePage,
    },
];
