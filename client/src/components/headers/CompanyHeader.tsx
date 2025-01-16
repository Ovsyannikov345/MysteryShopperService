import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import Header from "./Header";

const CompanyHeader = () => {
    return (
        <Header
            actions={[
                { icon: <AddIcon />, label: "Create Order", onClick: () => console.log("Create Order click") },
                { icon: <FormatListBulletedIcon />, label: "My Orders", onClick: () => console.log("My Orders click") },
            ]}
        />
    );
};

export default CompanyHeader;
