import React, { useEffect, useState } from "react";
import { Typography, Grid2 as Grid, CircularProgress, Dialog, useTheme, useMediaQuery, Button } from "@mui/material";
import useAnalysisApi, { OrderAnalysisResult } from "../../hooks/useAnalysisApi";
import { AccessTime, Block, Done, DoneAll, QuestionMark, Replay, SentimentDissatisfied } from "@mui/icons-material";

interface AISummaryModalProps {
    open: boolean;
    onClose: () => void;
    orderId: string;
}

const AISummaryModal = ({ open, onClose, orderId }: AISummaryModalProps) => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const { getOrderAnalysis } = useAnalysisApi();

    const [isLoading, setIsLoading] = useState(false);

    const [isError, setIsError] = useState(true);

    const [reload, setReload] = useState(false);

    const [analysisResult, setAnalysisResult] = useState<OrderAnalysisResult | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const loadAnalysis = async () => {
            setIsError(false);
            setIsLoading(true);

            const response = await getOrderAnalysis(orderId);

            setIsLoading(false);

            if ("error" in response || response.compatibility == null || response.timeToComplete == null) {
                setIsError(true);
                return;
            }

            setAnalysisResult(response);
        };

        loadAnalysis();
    }, [getOrderAnalysis, orderId, reload, open]);

    const getParameterIcon = (value: number | null) => {
        switch (value) {
            case 1:
                return <Block color="error" />;
            case 2:
                return <Block color="error" />;
            case 3:
                return <QuestionMark color="primary" />;
            case 4:
                return <Done color="success" />;
            case 5:
                return <DoneAll color="success" />;
            default:
                return <QuestionMark color="action" />;
        }
    };

    const renderCompatibility = (label: string, value: number | null) => (
        <Grid container size={12} spacing={1}>
            {getParameterIcon(value)}
            <Typography variant="body1">
                {label}: {value ? value + " из 5" : "-"}
            </Typography>
        </Grid>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth={"sm"} fullWidth slotProps={{ paper: { sx: { borderRadius: 5 } } }}>
            <Grid container size={12} flexDirection={"column"} paddingX={isSmallScreen ? 4 : 8} paddingTop={2} spacing={1}>
                <Grid container size={12} justifyContent={"center"}>
                    <Typography variant="h6" gutterBottom textAlign={"center"}>
                        Результат AI анализа
                    </Typography>
                </Grid>
                {isLoading && (
                    <Grid container size={12} flexDirection={"column"} alignItems={"center"} mt={2} mb={1} spacing={2}>
                        <CircularProgress />
                        <Typography variant="body1" color="text.secondary" textAlign={"center"}>
                            Создаем ваш анализ...
                        </Typography>
                    </Grid>
                )}
                {isError && (
                    <Grid container size={12} flexDirection={"column"} alignItems={"center"} mt={2} mb={1} spacing={2}>
                        <SentimentDissatisfied color="error" sx={{ fontSize: 48 }} />
                        <Typography variant="body1" color="text.secondary" textAlign="center">
                            Упс! Что-то пошло не так.
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<Replay />}
                            onClick={() => setReload((prev) => !prev)}
                            sx={{ mt: 1 }}
                        >
                            Повторить
                        </Button>
                    </Grid>
                )}
                {!isLoading && !isError && analysisResult && (
                    <>
                        <Grid container size={12}>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                Анализ совместимости
                            </Typography>
                        </Grid>
                        <Grid container size={12}>
                            {renderCompatibility("Возраст", analysisResult.compatibility!.age)}
                            {renderCompatibility("Пол", analysisResult.compatibility!.gender)}
                            {renderCompatibility("Профессия", analysisResult.compatibility!.profession)}
                            {renderCompatibility("Опыт", analysisResult.compatibility!.experience)}
                        </Grid>
                        <Grid container size={12} mt={2}>
                            <Grid container size={12}>
                                <Typography variant="body1" color="text.secondary" gutterBottom>
                                    Время выполнения
                                </Typography>
                            </Grid>
                            <Grid container size={12} spacing={1}>
                                <AccessTime />
                                <Typography variant="body1">
                                    {analysisResult.timeToComplete !== null && analysisResult.timeToComplete !== 0
                                        ? `${analysisResult.timeToComplete} ч.`
                                        : "-"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Grid>
            <Grid container size={12} justifyContent={"flex-end"} m={2}>
                <Button variant="contained" onClick={onClose}>
                    Закрыть
                </Button>
            </Grid>
        </Dialog>
    );
};

export default AISummaryModal;
