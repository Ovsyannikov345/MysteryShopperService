import { UserOrder } from "./../../hooks/useOrderApi";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid2 as Grid, Typography } from "@mui/material";
import moment from "moment";
import { NavigateNext, AccessTime, TimerOutlined, CheckCircle, CancelOutlined, TimerOffOutlined } from "@mui/icons-material";
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

    const calculateExpiration = () => {
        const currentMoment = moment();
        const expirationDuration = moment.duration(orderData.order.timeToComplete);
        const expirationMoment = moment(orderData.updatedAt).add(expirationDuration);
        const duration = moment.duration(expirationMoment.diff(currentMoment));

        const days = Math.floor(duration.asDays());
        const hours = duration.hours();

        let readableExpiration = "in ";
        if (days > 0) {
            readableExpiration += `${days} ${days > 1 ? "days" : "day"}`;
        }
        if (hours > 0) {
            readableExpiration += `${days > 0 ? " and " : ""}${hours} ${hours > 1 ? "hours" : "hour"}`;
        }

        return `Expires ${readableExpiration}`;
    };

    // TODO reduce code duplication.

    const getCardContent = () => {
        if (orderData.status === UserOrderStatus.Requested) {
            return (
                <CardContent style={{ width: "100%" }}>
                    <Typography variant="h6" component="div">
                        {orderData.order.title}
                    </Typography>
                    <Grid container wrap="nowrap" spacing={1} mt={1}>
                        <AccessTime />
                        <Typography variant="body1">{moment(orderData.createdAt).fromNow()}</Typography>
                    </Grid>
                </CardContent>
            );
        }

        if (orderData.status === UserOrderStatus.InProgress) {
            return (
                <CardContent>
                    <Typography variant="h6" component="div">
                        {orderData.order.title}
                    </Typography>
                    <Grid container wrap="nowrap" spacing={1} mt={1}>
                        <TimerOutlined />
                        <Typography variant="body1">{calculateExpiration()}</Typography>
                    </Grid>
                    {orderData.order.disputes.length > 0 ? (
                        <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                            <PulseDot color="danger" style={{ fontSize: "15px" }} />
                            <Typography variant="body1">Active dispute</Typography>
                        </Grid>
                    ) : (
                        (orderData.order.reports.length === 0 ||
                            orderData.order.reports.every((rep) => rep.reportCorrection)) && (
                            <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                                <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                                <Typography variant="body1">Report requested</Typography>
                            </Grid>
                        )
                    )}
                </CardContent>
            );
        }

        if (orderData.status === UserOrderStatus.Completed) {
            return (
                <CardContent>
                    <Typography variant="h6" component="div">
                        {orderData.order.title}
                    </Typography>
                    <Grid container wrap="nowrap" spacing={1} mt={1}>
                        <CheckCircle />
                        <Typography variant="body1">{moment(orderData.updatedAt).format("MMMM Do YYYY, hh:mm")}</Typography>
                    </Grid>
                    {orderData.order.userReviews.length === 0 && (
                        <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                            <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                            <Typography variant="body1">Rate the company</Typography>
                        </Grid>
                    )}
                </CardContent>
            );
        }

        if (orderData.status === UserOrderStatus.Rejected) {
            return (
                <CardContent>
                    <Typography variant="h6" component="div">
                        {orderData.order.title}
                    </Typography>
                    <Grid container wrap="nowrap" spacing={1} mt={1}>
                        <CancelOutlined />
                        <Typography variant="body1">{moment(orderData.updatedAt).format("MMMM Do YYYY, hh:mm")}</Typography>
                    </Grid>
                </CardContent>
            );
        }

        if (orderData.status === UserOrderStatus.Expired) {
            return (
                <CardContent>
                    <Typography variant="h6" component="div">
                        {orderData.order.title}
                    </Typography>
                    <Grid container wrap="nowrap" spacing={1} mt={1}>
                        <TimerOffOutlined />
                        <Typography variant="body1">{moment(orderData.updatedAt).format("MMMM Do YYYY, hh:mm")}</Typography>
                    </Grid>
                </CardContent>
            );
        }
    };

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={5}>
            <CardHeader
                avatar={<Avatar src={imageSrc} alt={`${orderData.order.company.name}'s avatar`}></Avatar>}
                title={orderData.order.company.name}
                subheader={moment(orderData.createdAt).format("LL")}
                sx={{ pb: 0 }}
            />
            {getCardContent()}
            <CardActions sx={{ flexGrow: 1, alignItems: "flex-end" }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<NavigateNext />}
                    onClick={() => navigate(ORDER_DETAILS_ROUTE.replace(/:.*/, orderData.order.id))}
                >
                    Details
                </Button>
            </CardActions>
        </Card>
    );
};

export default UserOrderCard;
