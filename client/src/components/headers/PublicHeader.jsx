import React from "react";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

const PublicHeader = () => {
    const theme = useTheme();

    return (
        <Grid
            container
            width={"100%"}
            height={"160px"}
            bgcolor={theme.palette.primary.main}
            pl={"42px"}
            alignItems={"center"}
        >
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
        </Grid>
    );
};

export default PublicHeader;
