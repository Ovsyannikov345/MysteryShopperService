import React, { useEffect, useState, useMemo } from "react";
import {
    Grid,
    Stack,
    TextField,
    Typography,
    Alert,
    Snackbar,
    Accordion,
    AccordionSummary,
    Button,
} from "@mui/material";
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

    const [isEditMode, setIsEditMode] = useState(false);

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
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
                
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
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            
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
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            
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
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            
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
                    justifyContent={"space-between"}
                    flexWrap={"nowrap"}
                    sx={{
                        paddingLeft: { xs: "15px", md: "40px" },
                        marginTop: { xs: "0", md: "40px" },
                    }}
                >
                    <NavigateBack label="Мои заказы" to={"/my-orders"} />
                </Grid>
                <Grid
                    container
                    item
                    pb={"46px"}
                    flexDirection={"column"}
                    sx={{
                        pl: { xs: "5px", md: "54px", lg: "115px" },
                        pr: { xs: "5px", md: "54px", lg: "115px" },
                        mt: { xs: 0, md: "15px" },
                    }}
                >
                    <Grid container alignItems={"center"} gap={"20px"}>
                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                            Информация о заказе
                        </Typography>
                        {!isEditMode ? (
                            <Button variant="contained" onClick={() => setIsEditMode(true)}>
                                Редактировать
                            </Button>
                        ) : (
                            <>
                                <Button variant="outlined" color="success" style={{ borderWidth: "2px" }}>
                                    Сохранить
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    style={{ borderWidth: "2px" }}
                                    onClick={() => setIsEditMode(false)}
                                >
                                    Отменить
                                </Button>
                            </>
                        )}
                    </Grid>

                    <Grid container item flexDirection={"column"} gap={"25px"} maxWidth={"660px"}>
                        <TextField
                            fullWidth
                            variant="standard"
                            label="Название"
                            multiline
                            value={order.title !== undefined ? order.title : ""}
                            InputProps={{
                                readOnly: true,
                                sx: { fontSize: { xs: "20px", md: "24px" } },
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
                                sx: { fontSize: { xs: "20px", md: "24px" } },
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
                                sx: { fontSize: { xs: "20px", md: "24px" } },
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
                                sx: { fontSize: { xs: "20px", md: "24px" } },
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
                                sx: { fontSize: { xs: "20px", md: "24px" } },
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
                                sx: { fontSize: { xs: "20px", md: "24px" } },
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
                        <Accordion sx={{ width: "100%" }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontSize={"20px"}>Заявки на выполнение</Typography>
                            </AccordionSummary>
                            <Stack gap={"15px"} sx={{ pl: "16px", pr: "16px" }}>
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
                        <Accordion sx={{ width: "100%" }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontSize={"20px"}>Отчеты</Typography>
                            </AccordionSummary>
                            <Stack gap={"15px"} sx={{ pl: "16px", pr: "16px" }}>
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
                        <Button variant="contained">Завершить заказ</Button>
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
