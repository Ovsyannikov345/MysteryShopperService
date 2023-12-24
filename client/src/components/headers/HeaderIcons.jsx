import React from "react";
import { Grid, IconButton, Stack } from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import SupportIcon from "@mui/icons-material/SupportAgentOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";

const HeaderIcons = () => {
    const navigate = useNavigate();

    return (
        <Stack direction={"row"} gap={"40px"}>
            <IconButton onClick={(e) => navigate("/profile")} style={{ padding: 0, color: "#000000" }}>
                <AccountIcon sx={{ fontSize: 60 }} />
            </IconButton>
            <IconButton style={{ padding: 0, color: "#000000" }}>
                <SupportIcon sx={{ fontSize: 60 }} />
            </IconButton>
            <IconButton
                onClick={(e) => {
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("role");
                    window.location.reload();
                }}
                style={{ padding: 0, color: "#000000" }}
            >
                <LogoutIcon sx={{ fontSize: 60 }} />
            </IconButton>
        </Stack>
    );
};

export default HeaderIcons;
