import CreateOrderPage from "../pages/Company/CreateOrderPage";
import CompanyProfilePage from "../pages/Company/CompanyProfilePage";
import MyOrdersPage from "../pages/Company/MyOrdersPage";

export const companyRoutes = [
    {
        path: "/my-orders",
        Component: MyOrdersPage,
    },
    {
        path: "/my-orders/:id",
        Component: "Order details page",
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
