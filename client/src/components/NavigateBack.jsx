import { Grid, IconButton, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const NavigateBack = ({ to, label }) => {
    const navigate = useNavigate();

    const isScreenSizeUpMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

    return (
        <Grid container item height={"60px"} alignItems={"center"} gap={"15px"} flexWrap={"nowrap"}>
            <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => navigate(to)}>
                <ArrowBackIcon sx={{ fontSize: {xs: 30, md: 50} }} />
            </IconButton>
            <Typography variant="h2">{isScreenSizeUpMd ? label : ""}</Typography>
        </Grid>
    );
};

export default NavigateBack;
