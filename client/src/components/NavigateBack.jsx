import { Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const NavigateBack = ({ to, label }) => {
    const navigate = useNavigate();

    return (
        <Grid container item height={"60px"} alignItems={"center"} gap={"15px"}>
            <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => navigate(to)}>
                <ArrowBackIcon sx={{ fontSize: 50 }} />
            </IconButton>
            <Typography variant="h2">{label}</Typography>
        </Grid>
    );
};

export default NavigateBack;
