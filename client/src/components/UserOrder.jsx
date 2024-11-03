import { Button, Grid, Avatar, Typography, Rating, useMediaQuery } from "@mui/material";
import React from "react";
import moment from "moment";
import addNoun from "../utils/fieldsParser";
import { useNavigate } from "react-router-dom";

const UserOrder = ({ orderData }) => {
    const isScreenSizeUpMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

    const navigate = useNavigate();

    return (
        <>
            <Grid
                container
                item
                width={"100%"}
                flexDirection={"column"}
                alignItems={"flex-start"}
                gap={"27px"}
                padding={"15px"}
                style={{ borderRadius: "10px", border: "2px solid #DDC12C" }}
                sx={{padding: {xs: "5px", md: "15px"}, gap: {xs: "0", md: "27px"}}}
            >
                <Grid container item width={"100%"}>
                    <Grid container item xs={12} md={5} gap={"10px"} flexDirection={"column"} wrap="nowrap">
                        <Grid container item width={"100%"} gap={"10px"}>
                            <Avatar
                                src={`http://localhost:7201/api/companies/${
                                    orderData.company.id
                                }/avatar?jwt=${localStorage.getItem("accessToken")}`}
                                variant="square"
                                sx={{ width: 60, height: 60 }}
                            />
                            <Grid container item flexDirection={"column"} maxWidth={"70%"}>
                                <Typography
                                    variant="h3"
                                    overflow={"hidden"}
                                    whiteSpace={"nowrap"}
                                    textOverflow={"ellipsis"}
                                    height={"20px"}
                                    display={"flex"}
                                    alignItems={"center"}
                                >
                                    {orderData.company.name}
                                </Typography>
                                <Rating value={orderData.companyRating} precision={0.5} readOnly />
                            </Grid>
                        </Grid>
                        <Typography variant={isScreenSizeUpMd ? "h2" : "h3"} height={"38px"} display={"flex"} alignItems={"center"}>
                            {moment.utc(orderData.createdAt).format("DD/MM/YYYY")}
                        </Typography>
                    </Grid>
                    <Grid container item xs flexDirection={"column"}>
                        <Grid container item>
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
                                {orderData.title}
                            </Typography>
                        </Grid>
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
                            {orderData.place}
                        </Typography>
                        <Typography
                            variant={isScreenSizeUpMd ? "h2" : "h3"}
                            maxWidth={"100%"}
                            height={"38px"}
                            display={"flex"}
                            alignItems={"center"}
                        >
                            {orderData.completionTime != null
                                ? addNoun(orderData.completionTime, ["день", "дня", "дней"])
                                : "Бессрочно"}
                        </Typography>
                        <Typography
                            variant={isScreenSizeUpMd ? "h2" : "h3"}
                            maxWidth={"100%"}
                            height={"38px"}
                            display={"flex"}
                            alignItems={"center"}
                        >
                            {orderData.price != null
                                ? addNoun(orderData.price, ["бел. рубль", "бел. рубля", "бел. рублей"])
                                : "Бесплатно"}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item gap={"20px"}>
                    <Grid container item width={"137px"}>
                        <Button fullWidth variant="contained" onClick={() => navigate(`/orders/${orderData.id}`)}>
                            ПОДРОБНЕЕ
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default UserOrder;
