import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { userRoutes } from "./userRoutes";
import { companyRoutes } from "./companyRoutes";
import { LOGIN_ROUTE, OWN_PROFILE_ROUTE } from "./consts";
import { Roles } from "../utils/enums/roles";

const AppRouter = () => {
    const [jwt, setJwt] = useState(localStorage.getItem("accessToken"));

    const [role, setRole] = useState(Number(localStorage.getItem("role")) as Roles);

    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("auth", () => {
            setJwt(localStorage.getItem("accessToken"));
            setRole(Number(localStorage.getItem("role")) as Roles);
            navigate("/");
        });
    }, [navigate]);

    if (jwt && role === Roles.User) {
        return (
            <Routes>
                {userRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
                <Route key="*" path="*" element={<Navigate to={OWN_PROFILE_ROUTE} />} />
            </Routes>
        );
    }

    if (jwt && role === Roles.Company) {
        return (
            <Routes>
                {companyRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
                <Route key="*" path="*" element={<Navigate to={OWN_PROFILE_ROUTE} />} />
            </Routes>
        );
    }

    return (
        <Routes>
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route key="*" path="*" element={<Navigate to={LOGIN_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;
