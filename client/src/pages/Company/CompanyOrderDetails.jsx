import React, { useEffect, useState, useMemo } from "react";
import { Grid, Stack, TextField, Typography, Alert, Snackbar, Accordion, AccordionSummary } from "@mui/material";
import CompanyHeader from "./../../components/headers/CompanyHeader";
import NavigateBack from "../../components/NavigateBack";
import { useTheme } from "@emotion/react";
import { useParams } from "react-router-dom";
import { getOrder } from "../../api/ordersApi";
import { acceptRequest, rejectRequest } from "../../api/requestApi";
import moment from "moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Request from "../../components/Request";
import Report from "../../components/Report";
import addNoun from "../../utils/fieldsParser";

const CompanyOrderDetails = () => {
    const theme = useTheme();

    const { id } = useParams();

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [order, setOrder] = useState({});

    const filteredRequests = useMemo(() => {
        if (order.Requests === undefined) {
            return [];
        }

        return order.Requests.filter((request) => !request.accepted && !request.rejected);
    }, [order.Requests]);

    useEffect(() => {
        const loadOrderData = async () => {
            const response = await getOrder(id);

            if (!response) {
                displayError("Сервис временно недоступен");
                return;
            }

            if (response.status === 401) {
                localStorage.removeItem("jwt");
                localStorage.removeItem("role");
                window.location.reload();
            }

            if (response.status >= 300) {
                displayError("Ошибка при загрузке профиля. Код: " + response.status);
                console.log(response);
                return;
            }

            setOrder(response.data);
            console.log(response.data);
        };

        loadOrderData();
    }, [id]);

    const displayError = (message) => {
        setErrorMessage(message);
        setError(true);
    };

    const displaySuccess = (message) => {
        setSuccessMessage(message);
        setSuccess(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false);
        setSuccess(false);
    };

    const acceptRequestHandler = async (id) => {
        const response = await acceptRequest(id);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
            window.location.reload();
        }

        if (response.status >= 300) {
            displayError("Ошибка при принятии заявки. Код: " + response.status);
            console.log(response);
            return;
        }

        setOrder({
            ...order,
            Requests: order.Requests.filter((request) => request.id !== id),
        });
        displaySuccess("Заявка принята");
    };

    const declineRequestHandler = async (id) => {
        const response = await rejectRequest(id);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
            window.location.reload();
        }

        if (response.status >= 300) {
            displayError("Ошибка при отклонении заявки. Код: " + response.status);
            console.log(response);
            return;
        }

        setOrder({
            ...order,
            Requests: order.Requests.filter((request) => request.id !== id),
        });
        displaySuccess("Заявка отклонена");
    };

    const reloadOrder = async () => {
        const response = await getOrder(id);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
            window.location.reload();
        }

        if (response.status >= 300) {
            displayError("Ошибка при загрузке профиля. Код: " + response.status);
            console.log(response);
            return;
        }

        displaySuccess("Отзыв отправлен");
        setOrder(response.data);
    };

    return (
        <Grid
            container
            width={"100%"}
            minHeight={"100vh"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            bgcolor={"#E7E7E7"}
        >
            <CompanyHeader />
            <Grid
                container
                item
                flexDirection={"column"}
                alignItems={"flex-start"}
                maxWidth={"1300px"}
                flexGrow={1}
                bgcolor={"#FFFFFF"}
            >
                <Grid
                    container
                    item
                    pr={"40px"}
                    pl={"40px"}
                    mt={"40px"}
                    justifyContent={"space-between"}
                    flexWrap={"nowrap"}
                >
                    <NavigateBack label="Мои заказы" to={"/my-orders"} />
                </Grid>
                <Grid container item mt={"15px"} pl={"150px"} pb={"46px"} flexDirection={"column"}>
                    <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                        Информация о заказе
                    </Typography>
                    <Grid container item flexDirection={"column"} gap={"25px"} maxWidth={"660px"}>
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Название"
                            value={order.title !== undefined ? order.title : ""}
                            InputProps={{
                                readOnly: true,
                                style: { fontSize: "24px" },
                            }}
                            sx={{
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                            }}
                        />
                        <TextField
                            id="description"
                            name="description"
                            fullWidth
                            variant="standard"
                            label="Описание"
                            placeholder="Описание отсутствует"
                            multiline
                            maxRows={7}
                            value={order.description !== undefined ? order.description : ""}
                            InputProps={{
                                readOnly: true,
                                style: { fontSize: "24px" },
                            }}
                            sx={{
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Место"
                            placeholder="Место отсутствует"
                            value={order.place !== undefined ? order.place : ""}
                            InputProps={{
                                readOnly: true,
                                style: { fontSize: "24px" },
                            }}
                            sx={{
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Заказ размещен"
                            value={
                                order.createdAt !== undefined
                                    ? moment.utc(order.createdAt).format("DD/MM/YYYY")
                                    : ""
                            }
                            InputProps={{
                                readOnly: true,
                                style: { fontSize: "24px" },
                            }}
                            sx={{
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Время на выполнение"
                            value={
                                order.completionTime !== undefined && order.completionTime != null
                                    ? addNoun(order.completionTime, ["день", "дня", "дней"])
                                    : "Бессрочно"
                            }
                            InputProps={{
                                readOnly: true,
                                style: { fontSize: "24px" },
                            }}
                            sx={{
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                            }}
                        />
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Стоимость"
                            value={
                                order.price !== undefined && order.price != null
                                    ? addNoun(order.price, ["бел. рубль", "бел. рубля", "бел. рублей"])
                                    : "Бесплатно"
                            }
                            InputProps={{
                                readOnly: true,
                                style: { fontSize: "24px" },
                            }}
                            sx={{
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                            }}
                        />
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontSize={"20px"}>Заявки на выполнение</Typography>
                            </AccordionSummary>
                            <Stack gap={"15px"}>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => (
                                        <Request
                                            key={request.id}
                                            request={request}
                                            acceptHandler={acceptRequestHandler}
                                            declineHandler={declineRequestHandler}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="h2" fontSize={"20px"} ml={"15px"} mb={"15px"}>
                                        Заявок пока нет
                                    </Typography>
                                )}
                            </Stack>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontSize={"20px"}>Отчеты</Typography>
                            </AccordionSummary>
                            <Stack gap={"15px"}>
                                {order.Reports && order.Reports.length > 0 ? (
                                    order.Reports.map((report) => (
                                        <Report
                                            key={report.id}
                                            report={report}
                                            errorHandler={displayError}
                                            successHandler={reloadOrder}
                                        />
                                    ))
                                ) : (
                                    <Typography variant="h2" fontSize={"20px"} ml={"15px"} mb={"15px"}>
                                        Отчетов пока нет
                                    </Typography>
                                )}
                            </Stack>
                        </Accordion>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default CompanyOrderDetails;
