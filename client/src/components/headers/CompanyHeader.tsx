import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { CREATE_ORDER_ROUTE, MY_ORDERS_ROUTE } from "../../router/consts";
import { Add } from "@mui/icons-material";

const CompanyHeader = () => {
    const navigate = useNavigate();

    return (
        <Header
            actions={[
                { icon: <Add />, label: "Создать заказ", onClick: () => navigate(CREATE_ORDER_ROUTE) },
                { icon: <FormatListBulletedIcon />, label: "Мои заказы", onClick: () => navigate(MY_ORDERS_ROUTE) },
            ]}
        />
    );
};

export default CompanyHeader;
