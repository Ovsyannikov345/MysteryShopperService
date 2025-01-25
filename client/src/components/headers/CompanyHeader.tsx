import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { CREATE_ORDER_ROUTE, MY_ORDERS_ROUTE } from "../../router/consts";

const CompanyHeader = () => {
    const navigate = useNavigate();

    return (
        <Header
            actions={[
                { icon: <AddIcon />, label: "Create Order", onClick: () => navigate(CREATE_ORDER_ROUTE) },
                { icon: <FormatListBulletedIcon />, label: "My Orders", onClick: () => navigate(MY_ORDERS_ROUTE) },
            ]}
        />
    );
};

export default CompanyHeader;
