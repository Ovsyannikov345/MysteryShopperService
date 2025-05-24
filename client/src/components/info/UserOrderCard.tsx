import { UserOrder } from "./../../hooks/useOrderApi";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid2 as Grid, Typography } from "@mui/material";
import moment from "moment";
import { CheckCircle, TimerOffOutlined, InfoOutlined, Cancel } from "@mui/icons-material";
import useCompanyApi from "../../hooks/useCompanyApi";
import { useEffect, useState } from "react";
import { UserOrderStatus } from "../../utils/enums/userOrderStatus";
import PulseDot from "react-pulse-dot";
import "react-pulse-dot/dist/index.css";
import { ORDER_DETAILS_ROUTE } from "../../router/consts";
import { useNavigate } from "react-router-dom";

const UserOrderCard = ({ orderData }: { orderData: UserOrder }) => {
    const navigate = useNavigate();

    const { getProfileImage: getCompanyProfileImage } = useCompanyApi();

    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const loadImage = async () => {
            const imageResponse = await getCompanyProfileImage(orderData.order.company.id);

            if ("error" in imageResponse) {
                return;
            }

            setImageSrc(URL.createObjectURL(imageResponse.blob));
        };

        loadImage();
    }, [getCompanyProfileImage, orderData.order.company.id]);

    const getCardContent = () => {
        if (orderData.status === UserOrderStatus.Requested) {
            return (
                <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                    <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                    <Typography variant="body1">Заявка отправлена {moment(orderData.createdAt).fromNow()}</Typography>
                </Grid>
            );
        }

        if (orderData.status === UserOrderStatus.Rejected) {
            return (
                <Grid container wrap="nowrap" spacing={1} mt={1}>
                    <Cancel color="error" />
                    <Typography variant="body1">{moment(orderData.updatedAt).format("LL, HH:mm")}</Typography>
                </Grid>
            );
        }

        if (orderData.status === UserOrderStatus.InProgress) {
            return (
                <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                    <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                    <Typography variant="body1">
                        {orderData.order.reports.length === 0 || orderData.order.reports.every((rep) => rep.reportCorrection)
                            ? "Ожидаем ваш отчет..."
                            : "Ожидаем ответ от компании..."}
                    </Typography>
                </Grid>
            );
        }

        if (orderData.status === UserOrderStatus.Completed) {
            return (
                <>
                    <Grid container wrap="nowrap" spacing={1} mt={1}>
                        <CheckCircle color="success" />
                        <Typography variant="body1">{moment(orderData.updatedAt).format("LL, HH:mm")}</Typography>
                    </Grid>
                    {orderData.order.userReviews.length === 0 && (
                        <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                            <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                            <Typography variant="body1">Оцените компанию</Typography>
                        </Grid>
                    )}
                </>
            );
        }

        if (orderData.status === UserOrderStatus.Expired) {
            return (
                <Grid container wrap="nowrap" spacing={1} mt={1}>
                    <TimerOffOutlined color="error" />
                    <Typography variant="body1">{moment(orderData.updatedAt).format("LL, HH:mm")}</Typography>
                </Grid>
            );
        }
    };

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={3}>
            <CardHeader
                avatar={<Avatar src={imageSrc} alt={`${orderData.order.company.name}'s avatar`}></Avatar>}
                title={orderData.order.company.name}
                subheader={moment(orderData.order.createdAt).format("LL")}
                sx={{ pb: 0 }}
            />
            <CardContent>
                <Typography variant="h6" component="div">
                    {orderData.order.title}
                </Typography>
                {getCardContent()}
            </CardContent>
            <CardActions sx={{ flexGrow: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    startIcon={<InfoOutlined />}
                    onClick={() => navigate(ORDER_DETAILS_ROUTE.replace(/:.*/, orderData.order.id))}
                >
                    Подробнее
                </Button>
            </CardActions>
        </Card>
    );
};

export default UserOrderCard;
