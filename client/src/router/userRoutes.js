import CompanyProfilePage from "../pages/Company/CompanyProfilePage";
import UserProfilePage from "../pages/User/UserProfilePage";

export const userRoutes = [
    {
        path: "/orders",
        Component: "Orders page",
    },
    {
        path: "/orders/:id",
        Component: "Order details page",
    },
    {
        path: "/my-orders",
        Component: "My orders page",
    },
    {
        path: "/my-orders/:id",
        Component: "Order details page",
    },
    {
        path: "/company/:id",
        Component: CompanyProfilePage,
    },
    {
        path: "/user",
        Component: UserProfilePage,
    },
];
