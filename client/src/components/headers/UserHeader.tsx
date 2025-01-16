import React from "react";

import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import Search from "@mui/icons-material/Search";

import Header from "./Header";

const UserHeader = () => {
    return (
        <Header
            actions={[
                { icon: <Search />, label: "Available Orders", onClick: () => console.log("Available Orders click") },
                { icon: <FormatListBulletedIcon />, label: "My Orders", onClick: () => console.log("My Orders click") },
            ]}
        />
    );
};

export default UserHeader;
