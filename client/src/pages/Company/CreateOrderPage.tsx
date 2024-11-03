import React from "react";
import { Grid } from "@mui/material";
import CompanyHeader from "../../components/headers/CompanyHeader";
import CreateOrderForm from "../../components/forms/CreateOrderForm";
import { createOrder, OrderToCreate } from "../../api/ordersApi";
import { useNavigate } from "react-router-dom";
import isApiError from "../../utils/isApiError";
import { useNotifications } from "@toolpad/core";

const CreateOrderPage = () => {
    const navigate = useNavigate();

    //const notifications = useNotifications();

    const create = async (orderData: OrderToCreate) => {
        const response = await createOrder(orderData);

        if (isApiError(response)) {
            displayError(response.message);
        } else {
            console.log(response);
            //navigate("/my-orders");
        }
    };

    const displayError = (message: string) => {
        //notifications.show(message, { severity: "error", autoHideDuration: 3000 });
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
                maxWidth={"1300px"}
                flexGrow={1}
                bgcolor={"#FFFFFF"}
            >
                <CreateOrderForm submitHandler={create} />
            </Grid>
        </Grid>
    );
};

export default CreateOrderPage;
