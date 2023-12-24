import React, { useState } from "react";
import { Grid, Snackbar, Alert } from "@mui/material";
import CompanyHeader from "../../components/headers/CompanyHeader";
import CreateOrderForm from "../../components/forms/CreateOrderForm";
import { createOrder } from "../../api/ordersApi";
import { useNavigate } from "react-router-dom";

const CreateOrderPage = () => {
    const navigate = useNavigate();

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const create = async (orderData) => {
        if (orderData.completionTime === "") {
            orderData.completionTime = null;
        }

        if (orderData.price === "") {
            orderData.price = null;
        }

        const response = await createOrder(orderData);

        if (!response) {
            displayError("Сервис временно недоступен");
            return;
        }

        if (response.status >= 300) {
            displayError("Ошибка при создании пользователя. Код: " + response.status);
            console.log(response)
            return;
        }

        navigate("/");
    };

    const displayError = (message) => {
        setErrorMessage(message);
        setError(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false);
    };

    return (
        <Grid
            container
            width={"100%"}
            height={"100vh"}
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
                maxWidth={"1300px"}
                flexGrow={1}
                bgcolor={"#FFFFFF"}
            >
                <CreateOrderForm submitHandler={create} />
            </Grid>
            <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default CreateOrderPage;
