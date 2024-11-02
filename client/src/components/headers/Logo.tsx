import React from "react";
import { Grid, Theme, Typography, useMediaQuery } from "@mui/material";

const Logo = () => {
    const isScreenSizeUpLg = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

    return (
        <Grid
            container
            item
            height={"86px"}
            bgcolor={"white"}
            borderRadius={"20px"}
            alignItems={"center"}
            justifyContent={"center"}
            sx={{
                width: {
                    lg: "325px",
                    xs: "86px",
                },
            }}
        >
            <Typography fontSize={36} fontWeight={700}>
                {isScreenSizeUpLg ? "Mystery Shopper" : "M"}
            </Typography>
        </Grid>
    );
};

export default Logo;
