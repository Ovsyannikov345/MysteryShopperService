import CreateOrderPage from "../pages/Company/CreateOrderPage";
import CompanyProfilePage from "../pages/Company/CompanyProfilePage";
import MyOrdersPage from "../pages/Company/MyOrdersPage";
import CompanyOrderDetails from "../pages/Company/CompanyOrderDetails";

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
        Component: "User details page",
    },
    {
        path: "/orders/create",
        Component: CreateOrderPage,
    },
    {
        path: "/company",
        Component: CompanyProfilePage,
    },
];
