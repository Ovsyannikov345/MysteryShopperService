import CreateOrderPage from "../pages/Company/CreateOrderPage";
import CompanyProfilePage from "../pages/Company/CompanyProfilePage";

export const companyRoutes = [
    {
        path: "/my-orders",
        Component: "My orders page",
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
