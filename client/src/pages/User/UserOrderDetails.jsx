import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Grid, Typography, TextField, Button, Snackbar, Alert, Avatar, Rating } from "@mui/material";
import { useTheme } from "@emotion/react";
import UserHeader from "../../components/headers/UserHeader";
import NavigateBack from "../../components/NavigateBack";
import { getOrder } from "../../api/ordersApi";
import moment from "moment";
import addNoun from "../../utils/fieldsParser";
import { createRequest } from "../../api/requestApi";
import ReportForm from "../../components/forms/ReportForm";
import { createReport } from "../../api/reportApi";
import CompanyReviewForm from "../../components/forms/CompanyReviewForm";
import { createCompanyReview } from "../../api/companyReviewApi.ts";
import OrderDetailsMap from "../../components/maps/OrderDetailsMap";
// import OrderAnalyzer from "../../components/orderAnalyzer/OrderAnalyzer";

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
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
                
            }

            if (response.status >= 300) {
                displayError("Ошибка при загрузке заказа. Код: " + response.status);
                return;
            }

            setOrder({
                ...response.data,
                description:
                    'Заказ на услуги тайного покупателя Добрый день, уважаемые специалисты! Я владелец бизнеса "Салон татуировок и пирсинга" и хотел бы нанять тайного покупателя для проверки качества наших услуг. О нашем бизнесе: Наш салон предоставляет профессиональные услуги по нанесению татуировок и пирсинга. Мы гордимся тем, что наши мастера имеют высокий уровень квалификации и многолетний опыт работы. Наш салон расположен в центре города, по адресу: ул. Центральная, д. 10. Время работы нашего салона: с понедельника по пятницу с 10:00 до 20:00, суббота и воскресенье с 11:00 до 19:00. О заказе: Нам требуется проверить качество наших услуг по нанесению татуировок. Тайный покупатель должен посетить наш салон в любое удобное для него время в течение следующего месяца и заказать татуировку по своему выбору. При этом мы просим тайного покупателя оценить следующие аспекты: Качество обслуживания: как к нему отнеслись сотрудники салона, был ли он доволен уровнем сервиса, время ожидания и т.д. Профессионализм мастера: качество нанесения татуировки, степень болезненности процесса, внимание мастера к деталям и т.д. Состояние салона: чистота и гигиена помещения, наличие всех необходимых средств защиты и стерильности, соответствие салона всем санитарным нормам и т.д. Требования к тайному покупателю: Возраст от 18 лет. Опыт нанесения татуировок (желательно, но не обязательно). Умение адекватно и объективно оценивать качество услуг. Готовность предоставить отчет о проведенной проверке в течение трех дней после посещения салона. Ожидания от выполненной работы: Мы ожидаем, что тайный покупатель предоставит нам подробный отчет о проведенной проверке, включая оценку качества обслуживания, профессионализма мастера и состояния салона. Мы также хотели бы получить фотографии татуировки, нанесенной тайным покупателем, для оценки качества работы мастера. Бюджет: готов выделить до 500$ за выполнение задания. Срок выполнения заказа: в течение следующего месяца. Контактная информация: Имя: Иван Иванов Телефон: +7 (123) 456-78-90 Электронная почта: ivanov@mail.ru Характеристики покупателя: Возраст: 16 Пол: Мужской Род занятости: Художник тату Опыт работы тайным покупателем: нет',
            });
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
        const response = await createRequest(id);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            
        }

        if (response.status >= 300) {
            displayError("Ошибка при создании запроса. Код: " + response.status);
            return;
        }

        order.Requests.push(response.data);
        displaySuccess("Заявка успешно отправлена");
    };

    const sendReport = async (reportData) => {
        const response = await createReport(id, reportData);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            
        }

        if (response.status >= 300) {
            displayError("Ошибка при создании отчета. Код: " + response.status);
            return;
        }

        order.Reports.push(response.data);
        displaySuccess("Отчет успешно отправлен");
    };

    const sendReview = async (reviewData) => {
        if (reviewData.text === "" || reviewData.grade === 0) {
            displayError("Заполните форму");
            return;
        }

        reviewData.OrderId = order.id;

        let response = await createCompanyReview(reviewData);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            
        }

        if (response.status >= 300) {
            displayError("Ошибка при создании отзыва. Код: " + response.status);
            return;
        }

        order.CompanyReviews.push(response.data);
        displaySuccess("Отзыв отправлен");

        response = await getOrder(id);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            
        }

        if (response.status >= 300) {
            displayError("Ошибка при загрузке заказа. Код: " + response.status);
            return;
        }

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
                    sx={{ paddingLeft: { xs: "15px", md: "40px" }, marginTop: { xs: "15px", md: "40px" } }}
                >
                    <NavigateBack label="Назад" to={-1} />
                </Grid>
                {order && (
                    <Grid
                        container
                        item
                        pb={"46px"}
                        flexDirection={"column"}
                        sx={{
                            paddingLeft: { xs: "14px", md: "53px", lg: "150px" },
                            marginTop: { xs: "10px", md: "15px" },
                        }}
                    >
                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                            Информация о заказчике
                        </Typography>
                        <Grid container item wrap="nowrap" sx={{ gap: { xs: "5px", md: "50px" } }}>
                            <Avatar
                                src={
                                    order.Company.id !== undefined
                                        ? `http://localhost:5000/api/companies/${
                                              order.Company.id
                                          }/avatar?jwt=${localStorage.getItem("accessToken")}`
                                        : ""
                                }
                                variant="square"
                                sx={{ width: { xs: 60, md: 130 }, height: { xs: 60, md: 130 } }}
                            />
                            <Grid container item flexDirection={"column"}>
                                <Grid container item alignItems={"center"} sx={{ gap: { xs: "0", md: "10px" } }}>
                                    <Typography
                                        variant="h2"
                                        height={"69px"}
                                        display={"flex"}
                                        alignItems={"center"}
                                        sx={{
                                            fontSize: { xs: "20px", md: "24px" },
                                            height: { xs: "29px", md: "69px" },
                                        }}
                                    >
                                        {order.Company.name}
                                    </Typography>
                                    <Rating value={companyRating} precision={0.5} readOnly />
                                </Grid>
                                <Grid
                                    container
                                    item
                                    sx={{
                                        maxWidth: { xs: "118px", md: "150px" },
                                        height: { xs: "36px", md: "52px" },
                                        mt: { xs: "5px", md: 0 },
                                    }}
                                >
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
                        <Grid
                            container
                            item
                            flexDirection={"column"}
                            gap={"25px"}
                            maxWidth={"660px"}
                            sx={{ maxWidth: { xs: "310px", md: "660px" }, ml: { xs: "-7px", md: 0 } }}
                        >
                            <TextField
                                fullWidth
                                variant="standard"
                                label="Название"
                                value={order.title !== undefined ? order.title : ""}
                                InputProps={{
                                    readOnly: true,
                                    sx: { fontSize: { xs: "18px", md: "24px" } },
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
                                    sx: { fontSize: { xs: "18px", md: "24px" } },
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
                            {/* <OrderAnalyzer orderText={order.description} errorHandler={displayError} /> */}
                            <TextField
                                fullWidth
                                variant="standard"
                                label="Место"
                                placeholder="Место отсутствует"
                                value={order.place !== undefined ? order.place : ""}
                                InputProps={{
                                    readOnly: true,
                                    sx: { fontSize: { xs: "18px", md: "24px" } },
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
                            <OrderDetailsMap orderPosition={{ lat: order.lat, lng: order.lng }} />
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
                                    sx: { fontSize: { xs: "18px", md: "24px" } },
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
                                    sx: { fontSize: { xs: "18px", md: "24px" } },
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
                                    sx: { fontSize: { xs: "18px", md: "24px" } },
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
                                <Button
                                    variant="contained"
                                    fullWidth
                                    style={{ marginTop: "10px" }}
                                    onClick={sendRequest}
                                >
                                    ОТПРАВИТЬ ЗАЯВКУ
                                </Button>
                            ) : !order.Requests[0].accepted ? (
                                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                    {order.Requests[0].rejected ? "Заявка отклонена" : "Заявка отправлена"}
                                </Typography>
                            ) : order.Reports.length === 0 ? (
                                <ReportForm submitHandler={sendReport} errorHadler={displayError} />
                            ) : order.CompanyReviews.length === 0 ? (
                                <>
                                    <Typography
                                        variant="h2"
                                        height={"69px"}
                                        display={"flex"}
                                        alignItems={"center"}
                                    >
                                        Ваш отчет отправлен
                                    </Typography>
                                    <CompanyReviewForm submitHandler={sendReview} />
                                </>
                            ) : (
                                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                    Ваш отзыв отправлен
                                </Typography>
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
            <Snackbar open={success} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default UserOrderDetails;
