import CompanyProfilePage from "../pages/CompanyProfilePage";

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
        Component: "Order Creation Page",
    },
    {
        path: "/company",
        Component: CompanyProfilePage,
    },
];
