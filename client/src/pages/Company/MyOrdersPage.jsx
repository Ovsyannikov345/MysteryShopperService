import React, { useEffect, useMemo, useState } from "react";
import { Grid, Typography, Snackbar, Alert } from "@mui/material";
import CompanyHeader from "../../components/headers/CompanyHeader";
import SortSelector from "../../components/SortSelector";
import { getOrders } from "../../api/ordersApi";
import CompanyOrdersList from "../../components/CompanyOrdersList";
import { deleteOrder } from "../../api/ordersApi";

const MyOrdersPage = () => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [orders, setOrders] = useState([]);
    const [sortOption, setSortOption] = useState("date desc");

    const sortedOrders = useMemo(() => {
        switch (sortOption) {
            case "date asc":
                return [...orders].sort(
                    (a, b) => new Date(a.createdAt.slice(0, -1)) - new Date(b.createdAt.slice(0, -1))
                );
            case "date desc":
                return [...orders].sort(
                    (a, b) => new Date(b.createdAt.slice(0, -1)) - new Date(a.createdAt.slice(0, -1))
                );
            default:
                return [...orders];
        }
    }, [orders, sortOption]);

    useEffect(() => {
        const loadOrders = async () => {
            const response = await getOrders();

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
                displayError("Ошибка при создании заказа. Код: " + response.status);
                return;
            }

            setOrders(response.data);
        };

        loadOrders();
    }, []);

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

    const removeOrder = async (id) => {
        const response = await deleteOrder(id);

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
            displayError("Ошибка при удалении заказа. Код: " + response.status);
            return;
        }

        setOrders(orders.filter((order) => order.id !== id));
        displaySuccess("Заказ успешно удален");
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
                alignItems={"center"}
                maxWidth={"1500px"}
                flexGrow={1}
                bgcolor={"#FFFFFF"}
            >
                <Grid container item maxWidth={"867px"} mt={"40px"} gap={"5px"}>
                    <Grid container item justifyContent={"space-between"} alignItems={"center"}>
                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                            Ваши заказы
                        </Typography>
                        <Grid container item width={"201px"}>
                            <SortSelector
                                options={[
                                    { value: "date desc", name: "Сначала новые" },
                                    { value: "date asc", name: "Сначала старые" },
                                ]}
                                value={sortOption}
                                changeHandler={setSortOption}
                            />
                        </Grid>
                    </Grid>
                    <CompanyOrdersList orders={sortedOrders} deleteHandler={removeOrder} />
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

export default MyOrdersPage;
