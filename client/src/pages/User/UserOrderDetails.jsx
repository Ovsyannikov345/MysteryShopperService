import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, TextField, Button, Snackbar, Alert, Avatar, Rating } from "@mui/material";
import { useTheme } from "@emotion/react";
import UserHeader from "../../components/headers/UserHeader";
import NavigateBack from "../../components/NavigateBack";
import { getOrder } from "../../api/ordersApi";
import moment from "moment";
import addNoun from "../../utils/fieldsParser";

const UserOrderDetails = () => {
    const theme = useTheme();

    const navigate = useNavigate();

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const { id } = useParams();

    const [order, setOrder] = useState(null);

    const companyRating = useMemo(() => {
        try {
            let sum = 0;
            let count = 0;

            order.Company.Orders.forEach((order) =>
                order.CompanyReviews.forEach((review) => {
                    sum += review.grade;
                    count++;
                })
            );

            if (count === 0) {
                return 0;
            }

            return sum / count;
        } catch {
            return 0;
        }
    }, [order]);

    useEffect(() => {
        const loadOrder = async () => {
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
                displayError("Ошибка при загрузке заказа. Код: " + response.status);
                return;
            }

            setOrder(response.data);
            console.log(response.data);
        };

        loadOrder();
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

    const sendRequest = async () => {
        console.log("request");
        // TODO implement.
    }

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
            <UserHeader />
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
                    <NavigateBack label="Назад" to={-1} />
                </Grid>
                {order && (
                    <Grid container item mt={"15px"} pl={"150px"} pb={"46px"} flexDirection={"column"}>
                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                            Информация о заказчике
                        </Typography>
                        <Grid container item columnGap={"50px"} wrap="nowrap">
                            <Avatar
                                src={
                                    order.Company.id !== undefined
                                        ? `http://localhost:5000/api/companies/${
                                              order.Company.id
                                          }/avatar?jwt=${localStorage.getItem("jwt")}`
                                        : ""
                                }
                                variant="square"
                                sx={{ width: 130, height: 130 }}
                            />
                            <Grid container item flexDirection={"column"}>
                                <Grid container item alignItems={"center"} gap={"10px"}>
                                    <Typography
                                        variant="h2"
                                        height={"69px"}
                                        display={"flex"}
                                        alignItems={"center"}
                                    >
                                        {order.Company.name}
                                    </Typography>
                                    <Rating value={companyRating} precision={0.5} readOnly />
                                </Grid>
                                <Grid container item maxWidth={"150px"} height={"52px"}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => navigate(`/company/${order.Company.id}`)}
                                    >
                                        ПРОФИЛЬ
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                            Детали заказа
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
                            {order.Requests.length === 0 ? (
                                <Button variant="contained" fullWidth style={{ marginTop: "10px" }} onClick={sendRequest}>
                                    ОТПРАВИТЬ ЗАЯВКУ
                                </Button>
                            ) : !order.Requests[0].accepted ? (
                                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                    {order.Requests[0].rejected ? "Заявка отклонена" : "Заявка отправлена"}
                                </Typography>
                            ) : (
                                <></>
                            )}
                        </Grid>
                    </Grid>
                )}
            </Grid>
            <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default UserOrderDetails;
