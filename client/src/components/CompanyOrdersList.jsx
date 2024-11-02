import React from "react";
import { Grid, Typography } from "@mui/material";
import CompanyOrder from "./CompanyOrder";

const CompanyOrdersList = ({ orders }) => {
    return (
        <>
            {orders.length > 0 ? (
                <Grid container item flexDirection={"column"} gap={"10px"}>
                    {orders.map((order) => (
                        <CompanyOrder key={order.id} order={order} />
                    ))}
                </Grid>
            ) : (
                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                    Заказов пока нет
                </Typography>
            )}
        </>
    );
};

export default CompanyOrdersList;
