import { Button, Grid, Avatar, Typography, Rating } from "@mui/material";
import React, { useMemo } from "react";
import moment from "moment";
import addNoun from "../utils/fieldsParser";
import { useNavigate } from "react-router-dom";

const UserOrder = ({ orderData }) => {
    const navigate = useNavigate();

    const rating = useMemo(() => {
        try {
            let sum = 0;
            let count = 0;

            orderData.Company.Orders.forEach((order) =>
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
    }, [orderData.Company.Orders]);

    return (
        <Grid
            container
            item
            width={"100%"}
            flexDirection={"column"}
            alignItems={"flex-start"}
            gap={"27px"}
            padding={"15px"}
            style={{ borderRadius: "10px", border: "2px solid #DDC12C" }}
        >
            <Grid container item width={"100%"}>
                <Grid container item xs={4} gap={"10px"} flexDirection={"column"} wrap="nowrap">
                    <Grid container item width={"100%"} gap={"10px"}>
                        <Avatar
                            src={`http://localhost:5000/api/companies/${
                                orderData.Company.id
                            }/avatar?jwt=${localStorage.getItem("jwt")}`}
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
                                {orderData.Company.name}
                            </Typography>
                            <Rating value={rating} precision={0.5} readOnly />
                        </Grid>
                    </Grid>
                    <Typography variant="h2" height={"38px"} display={"flex"} alignItems={"center"}>
                        {moment.utc(orderData.createdAt).format("DD/MM/YYYY")}
                    </Typography>
                </Grid>

                <Grid container item xs flexDirection={"column"}>
                    <Grid container item>
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
                            {orderData.title}
                        </Typography>
                    </Grid>
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
                        {orderData.place}
                    </Typography>
                    <Typography
                        variant="h2"
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
                        variant="h2"
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
            <Grid container item width={"137px"}>
                <Button fullWidth variant="contained" onClick={() => navigate(`/orders/${orderData.id}`)}>
                    ПОДРОБНЕЕ
                </Button>
            </Grid>
        </Grid>
    );
};

export default UserOrder;
