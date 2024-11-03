import { Grid, IconButton, Theme, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface NavigateBackProps {
    to: any;
    label: string;
}

const NavigateBack = ({ to, label }: NavigateBackProps) => {
    const navigate = useNavigate();

    const isScreenSizeUpMd = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

    return (
        <Grid container item height={"60px"} alignItems={"center"} gap={"15px"} flexWrap={"nowrap"}>
            <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => navigate(to)}>
                <ArrowBackIcon sx={{ fontSize: { xs: 30, md: 50 } }} />
            </IconButton>
            <Typography variant="h2">{isScreenSizeUpMd ? label : ""}</Typography>
        </Grid>
    );
};

export default NavigateBack;
