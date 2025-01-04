import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";

export const publicRoutes = [
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/register",
        Component: RegistrationPage,
    },
];
