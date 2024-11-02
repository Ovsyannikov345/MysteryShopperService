import { Button, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import addNoun from "../utils/fieldsParser";

const CompanyOrder = ({ order }) => {
    const isScreenSizeUpMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

    const navigate = useNavigate();

    return (
        <>
            <Grid
                container
                item
                flexDirection={"column"}
                alignItems={"flex-start"}
                padding={"15px"}
                style={{ borderRadius: "10px", border: "2px solid #DDC12C" }}
            >
                <Typography
                    variant={isScreenSizeUpMd ? "h2" : "h3"}
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
                        variant={isScreenSizeUpMd ? "h2" : "h3"}
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
                    <Typography
                        variant={isScreenSizeUpMd ? "h2" : "h3"}
                        maxWidth={"100%"}
                        height={"38px"}
                        display={"flex"}
                        alignItems={"center"}
                    >
                        {order.completionTime != null ? addNoun(order.completionTime, ["день", "дня", "дней"]) : "Бессрочно"}
                    </Typography>
                    <Typography
                        variant={isScreenSizeUpMd ? "h2" : "h3"}
                        maxWidth={"100%"}
                        height={"38px"}
                        display={"flex"}
                        alignItems={"center"}
                    >
                        {order.price != null ? addNoun(order.price, ["бел. рубль", "бел. рубля", "бел. рублей"]) : "Бесплатно"}
                    </Typography>
                    <Typography
                        variant={isScreenSizeUpMd ? "h2" : "h3"}
                        maxWidth={"100%"}
                        height={"38px"}
                        display={"flex"}
                        alignItems={"center"}
                    >
                        {moment.utc(order.createdAt).format("DD/MM/YYYY")}
                    </Typography>
                </Stack>
                <Grid container item gap={"20px"} mt={"20px"}>
                    <Button variant="contained" onClick={() => navigate(`/my-orders/${order.id}`)}>
                        ПОДРОБНЕЕ
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default CompanyOrder;
