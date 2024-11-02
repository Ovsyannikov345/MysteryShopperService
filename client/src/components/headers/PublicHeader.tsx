import React from "react";
import { Grid } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import Logo from "./Logo";

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
            <Logo />
        </Grid>
    );
};

export default PublicHeader;
