import React from "react";
import { Grid, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useTheme } from "@emotion/react";
import Logo from "./Logo";
import HeaderIcons from "./HeaderIcons";

const UserHeader = () => {
    const theme = useTheme();

    return (
        <Grid
            container
            width={"100%"}
            height={"160px"}
            bgcolor={theme.palette.primary.main}
            pl={"42px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            flexShrink={1}
            wrap="nowrap"
        >
            <Stack gap={"93px"} direction={"row"} flexShrink={1}>
                <Logo />
                <Typography variant="h1" textAlign={"center"}>
                    <Grid container item height={"100%"} alignItems={"center"}>
                        <Link to={"/orders"} style={{ textDecoration: "none", color: "#000000" }}>
                            Доступные заказы
                        </Link>
                    </Grid>
                </Typography>
            </Stack>
            <Stack gap={"50px"} direction={"row"} mr={"50px"}>
                <Typography variant="h1" textAlign={"center"}>
                    <Grid container item height={"100%"} alignItems={"center"}>
                        <Link to={"/my-orders"} style={{ textDecoration: "none", color: "#000000" }}>
                            Мои заказы
                        </Link>
                    </Grid>
                </Typography>
                <HeaderIcons />
            </Stack>
        </Grid>
    );
};

export default UserHeader;
