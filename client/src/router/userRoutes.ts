import {
    AVAILABLE_ORDERS_ROUTE,
    COMPANY_PROFILE_ROUTE,
    MY_ORDERS_ROUTE,
    ORDER_DETAILS_ROUTE,
    OWN_PROFILE_ROUTE,
    USER_PROFILE_ROUTE,
} from "./consts";
import CompanyProfilePage from "../pages/Common/CompanyProfilePage";
import UserOwnProfilePage from "../pages/User/UserOwnProfilePage";
import UserProfilePage from "../pages/Common/UserProfilePage";
import AvailableOrdersPage from "../pages/User/AvailableOrdersPage";
import UserOrdersPage from "../pages/User/OrdersInProgressPage";
import UserOrderDetailsPage from "../pages/User/UserOrderDetailsPage";

export const userRoutes = [
    {
        path: AVAILABLE_ORDERS_ROUTE,
        Component: AvailableOrdersPage,
    },
    {
        path: ORDER_DETAILS_ROUTE,
        Component: UserOrderDetailsPage,
    },
    {
        path: MY_ORDERS_ROUTE,
        Component: UserOrdersPage,
    },
    {
        path: COMPANY_PROFILE_ROUTE,
        Component: CompanyProfilePage,
    },
    {
        path: USER_PROFILE_ROUTE,
        Component: UserProfilePage,
    },
    {
        path: OWN_PROFILE_ROUTE,
        Component: UserOwnProfilePage,
    },
];
