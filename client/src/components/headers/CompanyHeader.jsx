import React from "react";
import { Grid, Stack, Typography, SpeedDial, SpeedDialAction, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import Logo from "./Logo";
import HeaderIcons from "./HeaderIcons";
import MenuIcon from "@mui/icons-material/Menu";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AssignmentIcon from "@mui/icons-material/Assignment";

const CompanyHeader = () => {
    const isScreenSizeUpMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

    const theme = useTheme();

    const actions = [
        { icon: <AddBoxIcon />, name: "Создать заказ", link: "/orders/create" },
        { icon: <AssignmentIcon />, name: "Мои заказы", link: "/my-orders" },
    ];

    const navigate = useNavigate();

    return (
        <Grid
            container
            width={"100%"}
            bgcolor={theme.palette.primary.main}
            pl={"42px"}
            alignItems={"center"}
            sx={{ height: { xs: "85px", md: "160px" }, justifyContent: { xs: "flex-end", md: "space-between" } }}
        >
            {isScreenSizeUpMd ? (
                <Stack direction={"row"} sx={{ gap: { xs: "30px", lg: "93px" } }}>
                    <Logo />
                    <Typography variant="h1" textAlign={"center"}>
                        <Grid container item height={"100%"} alignItems={"center"}>
                            <Link to={"/orders/create"} style={{ textDecoration: "none", color: "#000000" }}>
                                <Typography variant="h1" sx={{ fontSize: { xs: "24px", lg: "32px" } }}>
                                    Создать заказ
                                </Typography>
                            </Link>
                        </Grid>
                    </Typography>
                </Stack>
            ) : (
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: "absolute", top: 10, left: 16 }}
                    icon={<MenuIcon />}
                    direction="down"
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => navigate(action.link)}
                        />
                    ))}
                </SpeedDial>
            )}
            <Stack
                direction={"row"}
                sx={{ marginRight: { xs: "10px", lg: "50px" }, gap: { xs: "20px", lg: "50px" } }}
            >
                {isScreenSizeUpMd && (
                    <Typography variant="h1" textAlign={"center"}>
                        <Grid container item height={"100%"} alignItems={"center"}>
                            <Link to={"/my-orders"} style={{ textDecoration: "none", color: "#000000" }}>
                                <Typography variant="h1" sx={{ fontSize: { xs: "24px", lg: "32px" } }}>
                                    Мои заказы
                                </Typography>
                            </Link>
                        </Grid>
                    </Typography>
                )}
                <HeaderIcons />
            </Stack>
        </Grid>
    );
};

export default CompanyHeader;
