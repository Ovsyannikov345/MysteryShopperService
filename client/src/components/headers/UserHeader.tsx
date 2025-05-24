import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Search from "@mui/icons-material/Search";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { AVAILABLE_ORDERS_ROUTE, MY_ORDERS_ROUTE } from "../../router/consts";

const UserHeader = () => {
    const navigate = useNavigate();

    return (
        <Header
            actions={[
                { icon: <Search />, label: "Доступные заказы", onClick: () => navigate(AVAILABLE_ORDERS_ROUTE) },
                { icon: <FormatListBulletedIcon />, label: "Мои заказы", onClick: () => navigate(MY_ORDERS_ROUTE) },
            ]}
        />
    );
};

export default UserHeader;
