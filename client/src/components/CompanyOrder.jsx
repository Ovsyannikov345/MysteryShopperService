import { Button, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const CompanyOrder = ({ order, deleteHandler }) => {
    const navigate = useNavigate();

    return (
        <Grid
            container
            item
            flexDirection={"column"}
            alignItems={"flex-start"}
            padding={"15px"}
            style={{ borderRadius: "10px", border: "2px solid #DDC12C" }}
        >
            <Typography
                variant="h2"
                style={{ borderBottom: "2px solid #DDC12C" }}
                overflow={"hidden"}
                whiteSpace={"nowrap"}
                textOverflow={"ellipsis"}
                maxWidth={"100%"}
                height={"38px"}
                display={"flex"}
                alignItems={"center"}
            >
                {order.title}
            </Typography>
            <Stack direction={"column"} maxWidth={"100%"}>
                <Typography
                    variant="h2"
                    overflow={"hidden"}
                    whiteSpace={"nowrap"}
                    textOverflow={"ellipsis"}
                    maxWidth={"100%"}
                    height={"38px"}
                    display={"flex"}
                    alignItems={"center"}
                >
                    {order.place}
                </Typography>
                <Typography variant="h2" maxWidth={"100%"} height={"38px"} display={"flex"} alignItems={"center"}>
                    {order.completionTime != null ? order.completionTime + " дней" : "Бессрочно"}
                </Typography>
                <Typography variant="h2" maxWidth={"100%"} height={"38px"} display={"flex"} alignItems={"center"}>
                    {order.price != null ? order.price + " бел. рублей" : "Бессрочно"}
                </Typography>
                <Typography variant="h2" maxWidth={"100%"} height={"38px"} display={"flex"} alignItems={"center"}>
                    {moment.utc(order.createdAt).format("DD/MM/YYYY")}
                </Typography>
            </Stack>
            <Grid container item gap={"20px"} mt={"20px"}>
                <Button variant="contained" onClick={() => navigate(`/my-orders/${order.id}`)}>
                    ПОДРОБНЕЕ
                </Button>
                <Button variant="outlined" onClick={() => deleteHandler(order.id)}>
                    УДАЛИТЬ
                </Button>
            </Grid>
        </Grid>
    );
};

export default CompanyOrder;
