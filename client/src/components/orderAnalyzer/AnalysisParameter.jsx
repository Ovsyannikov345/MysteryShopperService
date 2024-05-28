import { Grid, Typography } from "@mui/material";
import React from "react";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

const AnalysisParameter = ({ name, value }) => {
    const getIcon = (value) => {
        switch (value) {
            case 1:
                return <SentimentVeryDissatisfiedIcon color="error" />;
            case 2:
                return <SentimentDissatisfiedIcon color="error" />;
            case 3:
                return <SentimentNeutralIcon color="primary" />;
            case 4:
                return <SentimentSatisfiedIcon color="success" />;
            case 5:
                return <SentimentVerySatisfiedIcon color="success" />;
            default:
                return <SentimentVeryDissatisfiedIcon color="error" />;
        }
    };

    return (
        <Grid container item justifyContent={"space-between"} gap={"10px"}>
            <Typography>
                {name}: <b>{value}/5</b>
            </Typography>
            {getIcon(value)}
        </Grid>
    );
};

export default AnalysisParameter;
