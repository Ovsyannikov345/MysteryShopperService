import React, { useEffect, useState } from "react";
import { Container, Grid2 as Grid, useMediaQuery, useTheme } from "@mui/material";
import CompanyHeader from "../../components/headers/CompanyHeader";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@toolpad/core";
import backgroundImage from "../../images/background.jpg";
import OrderCreationForm, { OrderCreationData } from "../../components/forms/OrderCreationForm";
import useOrderApi, { OrderToCreate } from "../../hooks/useOrderApi";
import { ORDER_DETAILS_ROUTE } from "../../router/consts";

const CreateOrderPage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const navigate = useNavigate();

    const notifications = useNotifications();

    const { createOrder } = useOrderApi();

    const [loading, setLoading] = useState(false);

    const handleCreate = async (orderData: OrderCreationData) => {
        const order: OrderToCreate = {
            title: orderData.title,
            description: orderData.description,
            place: orderData.place,
            timeToComplete: `${orderData.daysToComplete ?? "0"}.${orderData.hoursToComplete ?? "00"}:00:00`,
            price: orderData.price,
            lat: orderData.lat,
            lng: orderData.lng,
        };

        if (order.timeToComplete === "0.00:00:00") {
            order.timeToComplete = undefined;
        }

        setLoading(true);

        const response = await createOrder(order);

        setLoading(false);

        if ("error" in response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        notifications.show("Order created", { severity: "success", autoHideDuration: 3000 });
        navigate(ORDER_DETAILS_ROUTE.replace(":id", response.id));
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <Grid container minHeight={"100%"} flexDirection={"column"}>
            <CompanyHeader />
            <Grid
                container
                flexDirection={"column"}
                flexGrow={1}
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: "fixed",
                    backdropFilter: "blur(8px)",
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        mt: isMediumScreen ? 0 : 2,
                        mb: isMediumScreen ? 0 : 2,
                        bgcolor: "white",
                        borderRadius: isMediumScreen ? 0 : "10px",
                    }}
                >
                    <OrderCreationForm submitHandler={handleCreate} loading={loading} />
                </Container>
            </Grid>
        </Grid>
    );
};

export default CreateOrderPage;
