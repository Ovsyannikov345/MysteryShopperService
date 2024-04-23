import React, { useState } from "react";
import { Typography, Grid, Button, CircularProgress } from "@mui/material";
import { getCompletionTime, getCompatibility } from "../../api/mistralApi";
import addNoun from "../../utils/fieldsParser";
import AnalysisParameter from "./AnalysisParameter";

const OrderAnalyzer = ({ errorHandler }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const analyze = async () => {
        setIsLoading(true);

        let response = await getCompletionTime();

        if (!response || response.status >= 300) {
            errorHandler(response.error);
            setIsLoading(false);
            return;
        }

        let result = { ...response.data };

        response = await getCompatibility();

        if (!response || response.status >= 300) {
            errorHandler(response.error);
            setIsLoading(false);
            return;
        }

        result = { ...result, ...response.data };

        setAnalysis(result);
        setIsLoading(false);
    };

    return (
        <>
            {!analysis ? (
                <Grid item>
                    <Button variant="contained" style={{ width: "110px", height: "40px" }} onClick={analyze}>
                        {!isLoading ? "AI Анализ" : <CircularProgress size={"27px"} color="inherit" />}
                    </Button>
                </Grid>
            ) : (
                <Grid container item width={"250px"}>
                    <Typography>
                        Время выполнения:{" "}
                        <b>
                            {analysis.timeStart}-{addNoun(analysis.timeEnd, ["час", "часа", "часов"])}
                        </b>
                    </Typography>
                    <AnalysisParameter name={"Возраст"} value={analysis.age} />
                    <AnalysisParameter name={"Пол"} value={analysis.gender} />
                    <AnalysisParameter name={"Род деятельности"} value={analysis.profession} />
                    <AnalysisParameter name={"Опыт"} value={analysis.experience} />
                </Grid>
            )}
        </>
    );
};

export default OrderAnalyzer;
