import LoginPage from "../pages/LoginPage";
import RegistrationPage from "../pages/RegistrationPage";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "./consts";

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: LoginPage,
    },
    {
        path: REGISTER_ROUTE,
        Component: RegistrationPage,
    },
];
