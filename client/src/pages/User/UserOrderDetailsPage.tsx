import React, { useEffect, useMemo, useState } from "react";
import { Grid2 as Grid, Container, useMediaQuery, useTheme, Typography, Stack, Rating, Avatar, Button } from "@mui/material";
import UserHeader from "../../components/headers/UserHeader";
import backgroundImage from "../../images/background.jpg";
import { useNotifications } from "@toolpad/core";
import useOrderApi, { UserOrder } from "../../hooks/useOrderApi";
import NavigateBack from "../../components/buttons/NavigateBack";
import { useNavigate, useParams } from "react-router-dom";
import moment, { Duration } from "moment";
import useCompanyApi from "../../hooks/useCompanyApi";
import { ArrowRight } from "@mui/icons-material";
import MapModal from "../../components/modals/MapModal";
import UserOrderActions from "../../components/OrderActions/UserOrderActions";
import { COMPANY_PROFILE_ROUTE } from "../../router/consts";
import UserOrderDetailsSkeleton from "../../components/skeletons/UserOrderDetailsSkeleton";

const UserOrderDetailsPage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const notifications = useNotifications();

    const navigate = useNavigate();

    const { getOrderDetails } = useOrderApi();

    const { getProfileImage } = useCompanyApi();

    const { id } = useParams();

    const [orderData, setOrderData] = useState<UserOrder>();

    const [showFullDescription, setShowFullDescription] = useState(false);

    const [mapModalOpen, setMapModalOpen] = useState(false);

    const [companyImageSrc, setCompanyImageSrc] = useState("");

    const [reload, setReload] = useState(false);

    const companyRating = useMemo(() => {
        if (!orderData || orderData.order.company.companyReviews.length === 0) {
            return 0;
        }

        return (
            orderData.order.company.companyReviews.reduce((sum: number, r) => sum + r.grade, 0) /
            orderData.order.company.companyReviews.length
        );
    }, [orderData]);

    useEffect(() => {
        const loadOrderData = async () => {
            const response = await getOrderDetails(id!);

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            setOrderData(response);
        };

        const loadData = async () => {
            await loadOrderData();
        };

        loadData();
    }, [getOrderDetails, id, notifications, reload]);

    useEffect(() => {
        const loadCompanyImage = async () => {
            if (!orderData) {
                return;
            }

            const imageResponse = await getProfileImage(orderData.order.company.id);

            if ("error" in imageResponse) {
                return;
            }

            setCompanyImageSrc(URL.createObjectURL(imageResponse.blob));
        };

        loadCompanyImage();
    }, [getProfileImage, orderData]);

    const getExpirationString = (duration: Duration) => {
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();

        let readableExpiration = "";
        if (days > 0) {
            readableExpiration += `${days} ${days > 1 ? "days" : "day"}`;
        }
        if (hours > 0) {
            readableExpiration += `${days > 0 ? " and " : ""}${hours} ${hours > 1 ? "hours" : "hour"}`;
        }

        return readableExpiration;
    };

    // TODO Add AI analysis of description

    return (
        <>
            <Grid container minHeight={"100%"} flexDirection={"column"}>
                <UserHeader />
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
                    {!isMediumScreen && (
                        <Container
                            maxWidth="md"
                            style={{ paddingLeft: 0 }}
                            sx={{
                                mt: isMediumScreen ? 0 : 2,
                            }}
                        >
                            <NavigateBack to={-1} label="Back" />
                        </Container>
                    )}
                    <Container
                        maxWidth="md"
                        sx={{
                            mt: isMediumScreen ? 0 : 2,
                            mb: isMediumScreen ? 0 : 2,
                            bgcolor: "white",
                            borderRadius: isMediumScreen ? 0 : "10px",
                        }}
                    >
                        {isMediumScreen && (
                            <Grid mt={3}>
                                <NavigateBack to={-1} label="Back" />
                            </Grid>
                        )}
                        <Grid
                            container
                            spacing={4}
                            alignItems="flex-start"
                            sx={{ p: isMediumScreen ? 1 : 4 }}
                            mt={isMediumScreen ? 2 : 0}
                        >
                            {!orderData ? (
                                <UserOrderDetailsSkeleton />
                            ) : (
                                <>
                                    <Grid container size={12} flexDirection={"column"} spacing={1}>
                                        <Typography variant="h5">{orderData.order.title}</Typography>
                                    </Grid>

                                    <Grid container size={12} spacing={2} justifyContent={"space-between"}>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Order Info
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={
                                                    orderData.order.lat && orderData.order.lng
                                                        ? { "&:hover": { cursor: "pointer", textDecoration: "underline" } }
                                                        : {}
                                                }
                                                onClick={() => setMapModalOpen(true)}
                                            >
                                                <strong>Location:</strong> {orderData.order.place}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Price:</strong>{" "}
                                                {orderData.order.price ? orderData.order.price + " BYN" : "-"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Time to complete:</strong>{" "}
                                                {orderData.order.timeToComplete
                                                    ? getExpirationString(moment.duration(orderData.order.timeToComplete))
                                                    : "-"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Status:</strong> {orderData.order.isClosed ? "Closed" : "Open"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Created:</strong>{" "}
                                                {moment(orderData.order.createdAt).format("MMMM Do YYYY, hh:mm a")}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, md: 6 }}>
                                            <Grid container spacing={1} alignItems={"center"}>
                                                <Typography variant="h6" gutterBottom>
                                                    Company Info
                                                </Typography>
                                            </Grid>
                                            <Grid container wrap="nowrap" spacing={2}>
                                                <Grid mt={0.5}>
                                                    <Avatar
                                                        sx={{ width: 50, height: 50 }}
                                                        alt={`${orderData.order.company.name}'s avatar`}
                                                        src={companyImageSrc}
                                                    />
                                                </Grid>
                                                <Grid container flexDirection={"column"} spacing={0}>
                                                    <Typography variant="body1">{orderData.order.company.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {orderData.order.company.email}
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <Rating
                                                            value={companyRating}
                                                            precision={0.5}
                                                            readOnly
                                                            size={isSmallScreen ? "small" : "medium"}
                                                        />
                                                        <Typography variant="body2">
                                                            ({orderData.order.company.companyReviews.length} reviews)
                                                        </Typography>
                                                    </Stack>
                                                    <Button
                                                        variant="contained"
                                                        fullWidth
                                                        endIcon={<ArrowRight />}
                                                        sx={{ mt: 1 }}
                                                        onClick={() =>
                                                            navigate(
                                                                COMPANY_PROFILE_ROUTE.replace(/:.*/, orderData.order.company.id)
                                                            )
                                                        }
                                                    >
                                                        Profile
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    {orderData.order.description && (
                                        <Grid container size={12} flexDirection={"column"}>
                                            <Typography variant="h6" gutterBottom>
                                                Description
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                                                {orderData.order.description.length > 300 && !showFullDescription
                                                    ? orderData.order.description.slice(0, 300).trim() + "..."
                                                    : orderData.order.description}
                                            </Typography>
                                            {orderData.order.description.length > 300 && (
                                                <Grid>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        onClick={() => setShowFullDescription((prev) => !prev)}
                                                    >
                                                        {showFullDescription ? "Show less" : "Show more"}
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Grid>
                                    )}

                                    <UserOrderActions orderData={orderData} onAction={() => setReload((prev) => !prev)} />
                                </>
                            )}
                        </Grid>
                    </Container>
                </Grid>
            </Grid>
            {orderData?.order.lat && orderData.order.lng && (
                <MapModal
                    isOpen={mapModalOpen}
                    onClose={() => setMapModalOpen(false)}
                    orderPosition={{ lat: orderData!.order.lat!, lng: orderData!.order.lng! }}
                />
            )}
        </>
    );
};

export default UserOrderDetailsPage;
