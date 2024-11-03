import React from "react";
import { Grid, Stack, Typography, useMediaQuery, SpeedDial, SpeedDialAction } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Theme, useTheme } from "@mui/material/styles";
import Logo from "./Logo";
import HeaderIcons from "./HeaderIcons";
import MenuIcon from "@mui/icons-material/Menu";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const UserHeader = () => {
    const isScreenSizeUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

    const actions = [
        { icon: <AssignmentIcon />, name: "Доступные заказы", link: "/orders" },
        { icon: <AssignmentIndIcon />, name: "Мои заказы", link: "/my-orders" },
    ];

    const theme = useTheme();

    const navigate = useNavigate();

    return (
        <Grid
            container
            width={"100%"}
            bgcolor={theme.palette.primary.main}
            pl={"42px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexShrink={1}
            wrap="nowrap"
            sx={{ height: { xs: "85px", md: "160px" }, justifyContent: { xs: "flex-end", md: "space-between" } }}
        >
            {isScreenSizeUpMd ? (
                <Stack direction={"row"} flexShrink={1} sx={{ gap: { xs: "30px", lg: "93px" } }}>
                    <Logo />
                    <Typography variant="h1" textAlign={"center"}>
                        <Grid container item height={"100%"} alignItems={"center"}>
                            <Link to={"/orders"} style={{ textDecoration: "none", color: "#000000" }}>
                                <Typography variant="h1" sx={{ fontSize: { xs: "24px", lg: "32px" } }}>
                                    Доступные заказы
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
            <Stack direction={"row"} sx={{ marginRight: { xs: "10px", lg: "50px" }, gap: { xs: "20px", lg: "50px" } }}>
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

export default UserHeader;
