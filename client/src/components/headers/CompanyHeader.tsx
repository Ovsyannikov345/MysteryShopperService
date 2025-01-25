import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { MY_ORDERS_ROUTE } from "../../router/consts";

const CompanyHeader = () => {
    const navigate = useNavigate();

    return (
        <Header
            actions={[
                // TODO implement
                { icon: <AddIcon />, label: "Create Order", onClick: () => console.log("Create Order click") },
                { icon: <FormatListBulletedIcon />, label: "My Orders", onClick: () => navigate(MY_ORDERS_ROUTE) },
            ]}
        />
    );
};

export default CompanyHeader;
