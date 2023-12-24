import React from "react";
import { Grid, Typography } from "@mui/material";

const Logo = () => {
    return (
        <Grid
            container
            item
            width={"325px"}
            height={"86px"}
            bgcolor={"white"}
            borderRadius={"20px"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Typography fontSize={36} fontWeight={700}>
                Mystery Shopper
            </Typography>
        </Grid>
    );
};

export default Logo;
