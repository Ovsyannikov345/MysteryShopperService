import CreateOrderPage from "../pages/Company/CreateOrderPage";
import MyOrdersPage from "../pages/Company/MyOrdersPage";
import CompanyOrderDetails from "../pages/Company/CompanyOrderDetails";
import UserProfilePage from '../pages/User/UserProfilePage';
import CompanyOwnProfilePage from "../pages/Company/CompanyOwnProfilePage";
import CompanyProfilePage from "../pages/Company/CompanyProfilePage";

export const companyRoutes = [
    {
        path: "/my-orders",
        Component: MyOrdersPage,
    },
    {
        path: "/my-orders/:id",
        Component: CompanyOrderDetails,
    },
    {
        path: "/user/:id",
        Component: UserProfilePage,
    },
    {
        path: "/orders/create",
        Component: CreateOrderPage,
    },
    {
        path: "/company/:id",
        Component: CompanyProfilePage,
    },
    {
        path: "/company",
        Component: CompanyOwnProfilePage,
    },
];
