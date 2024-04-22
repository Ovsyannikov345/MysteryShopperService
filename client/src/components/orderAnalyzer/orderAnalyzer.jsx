import React, { useState } from "react";
import { Typography, Grid, Button, CircularProgress } from "@mui/material";

const OrderAnalyzer = () => {
    const [isLoading, setIsLoading] = useState(false);

    const analyze = async () => {
        // TODO implement.
    }

    return (
        <>
            <Grid item>
                <Button
                    variant="contained"
                    style={{ width: "110px", height: "40px" }}
                    onClick={() => setIsLoading(true)}
                >
                    {!isLoading ? "AI Анализ" : <CircularProgress size={"27px"} color="inherit"/>}
                </Button>
            </Grid>
            <Typography>Text</Typography>
        </>
    );
};

export default OrderAnalyzer;
