import CreateOrderPage from "../pages/Company/CreateOrderPage";
import CompanyProfilePage from "../pages/Company/CompanyProfilePage";
import MyOrdersPage from "../pages/Company/MyOrdersPage";
import CompanyOrderDetails from "../pages/Company/CompanyOrderDetails";
import UserProfilePage from '../pages/User/UserProfilePage';

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
        Component: CompanyProfilePage,
    },
];
