import React, { useState } from "react";
import { Typography, Grid, Button, CircularProgress } from "@mui/material";
import { getCompletionTime, getCompatibility } from "../../api/mistralApi";
import AnalysisParameter from "./AnalysisParameter";

// TODO rework

const OrderAnalyzer = ({ orderText, errorHandler }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const analyze = async () => {
        setIsLoading(true);

        let response = await getCompletionTime(orderText);

        if (!response || response.status >= 300) {
            errorHandler("Ошибка во время анализа времени. Попробуйте еще раз");
            setIsLoading(false);
            return;
        }

        let result = { ...response.data };

        response = await getCompatibility(orderText);

        if (!response || response.status >= 300) {
            errorHandler("Ошибка во время анализа совместимости. Попробуйте еще раз");
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
                <Grid container item width={"260px"}>
                    <Typography>
                        Время выполнения:{" "}
                        <b>
                            {analysis.startInterval}-{analysis.endInterval} ч.
                        </b>
                    </Typography>
                    <Typography>
                        Оценка совместимости:{" "}
                        <b>
                            {(
                                (analysis.age + analysis.gender + analysis.profession + analysis.experience) /
                                4
                            ).toFixed(1)}
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
