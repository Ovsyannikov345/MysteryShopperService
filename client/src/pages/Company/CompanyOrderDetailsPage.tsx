import React, { useEffect, useState } from "react";
import {
    Grid2 as Grid,
    Container,
    useMediaQuery,
    useTheme,
    Typography,
    Avatar,
    Button,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from "@mui/material";
import backgroundImage from "../../images/background.jpg";
import { useDialogs, useNotifications } from "@toolpad/core";
import useOrderApi, { CompanyOrder } from "../../hooks/useOrderApi";
import NavigateBack from "../../components/buttons/NavigateBack";
import { useParams } from "react-router-dom";
import moment, { Duration } from "moment";
import MapModal from "../../components/modals/MapModal";
import useUserApi from "../../hooks/useUserApi";
import CompanyHeader from "../../components/headers/CompanyHeader";
import PulseDot from "react-pulse-dot";
import { UserOrderStatus } from "../../utils/enums/userOrderStatus";
import OrderRequest from "../../components/info/OrderRequest";
import useRequestApi from "../../hooks/useRequestApi";
import CompanyOrderActions from "../../components/OrderActions/CompanyOrderActions";
import OrderDetailsSkeleton from "../../components/skeletons/CompanyOrderDetailsSkeleton";

interface User {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    notification: string | null;
}

const CompanyOrderDetailsPage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const dialogs = useDialogs();

    const { getCompanyOrderDetails, finishOrder } = useOrderApi();

    const { getProfileImage } = useUserApi();

    const { acceptRequest, rejectRequest } = useRequestApi();

    const { id } = useParams();

    const [orderData, setOrderData] = useState<CompanyOrder>();

    const [users, setUsers] = useState<User[]>([]);

    const [selectedUserId, setSelectedUserId] = useState<string>();

    const [showFullDescription, setShowFullDescription] = useState(false);

    const [mapModalOpen, setMapModalOpen] = useState(false);

    const [reload, setReload] = useState(false);

    useEffect(() => {
        const loadOrderData = async () => {
            const response = await getCompanyOrderDetails(id!);

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            const order = response;

            setOrderData(order);

            const activeUserStatuses = [UserOrderStatus.InProgress, UserOrderStatus.Expired, UserOrderStatus.Completed];

            const users = await Promise.all(
                order.users
                    .filter((u) => activeUserStatuses.some((s) => s === u.status))
                    .map(async (userOrder): Promise<User> => {
                        const imageResponse = await getProfileImage(userOrder.user.id);

                        const user: User = {
                            id: userOrder.user.id,
                            firstName: userOrder.user.name,
                            lastName: userOrder.user.surname,
                            avatarUrl: null,
                            notification: null,
                        };

                        var userReports = order.reports.filter((r) => r.userId === userOrder.user.id);

                        if (
                            userOrder.status !== UserOrderStatus.Completed &&
                            userReports.length > 0 &&
                            userReports.some((r) => !r.reportCorrection)
                        ) {
                            user.notification = "New report";
                        }

                        if (imageResponse && "error" in imageResponse) {
                            return user;
                        }

                        return { ...user, avatarUrl: URL.createObjectURL(imageResponse.blob) };
                    })
            );

            setUsers(users);
        };

        const loadData = async () => {
            await loadOrderData();
        };

        loadData();
    }, [getCompanyOrderDetails, getProfileImage, id, notifications, reload]);

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

    const acceptOrderRequest = async (userId: string) => {
        const response = await acceptRequest(userId);

        if (response && "error" in response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        notifications.show("Request accepted", { severity: "success", autoHideDuration: 3000 });
        setReload((prev) => !prev);
    };

    const rejectOrderRequest = async (userId: string) => {
        const response = await rejectRequest(userId);

        if (response && "error" in response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        notifications.show("Request rejected", { severity: "success", autoHideDuration: 3000 });
        setReload((prev) => !prev);
    };

    const markAsFinished = async () => {
        if (!orderData) {
            return;
        }

        const response = await finishOrder(orderData.id);

        if (response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 5000 });
            return;
        }

        notifications.show("Order is marked as finished", { severity: "success", autoHideDuration: 3000 });
        setOrderData({ ...orderData, isClosed: true });
    };

    return (
        <>
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
                            {orderData ? (
                                <>
                                    <Grid
                                        container
                                        size={12}
                                        spacing={1}
                                        alignItems={"center"}
                                        justifyContent={"space-between"}
                                        wrap="nowrap"
                                    >
                                        <Typography variant="h5">{orderData.title}</Typography>
                                    </Grid>

                                    <Grid container size={12} spacing={2} justifyContent={"space-between"}>
                                        <Grid size={12}>
                                            <Typography variant="h6" gutterBottom>
                                                Order Info
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={
                                                    orderData.lat && orderData.lng
                                                        ? { "&:hover": { cursor: "pointer", textDecoration: "underline" } }
                                                        : {}
                                                }
                                                onClick={() => setMapModalOpen(true)}
                                            >
                                                <strong>Location:</strong> {orderData.place}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Price:</strong> {orderData.price ? orderData.price + " BYN" : "-"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Time to complete:</strong>{" "}
                                                {orderData.timeToComplete
                                                    ? getExpirationString(moment.duration(orderData.timeToComplete))
                                                    : "-"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Status:</strong> {orderData.isClosed ? "Closed" : "Open"}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Created:</strong>{" "}
                                                {moment(orderData.createdAt).format("MMMM Do YYYY, hh:mm a")}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    {orderData.description && (
                                        <Grid container size={12} flexDirection={"column"}>
                                            <Typography variant="h6" gutterBottom>
                                                Description
                                            </Typography>
                                            <Typography variant="subtitle1" gutterBottom sx={{ whiteSpace: "pre-wrap" }}>
                                                {orderData.description.length > 300 && !showFullDescription
                                                    ? orderData.description.slice(0, 300).trim() + "..."
                                                    : orderData.description}
                                            </Typography>
                                            {orderData.description.length > 300 && (
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
                                    {!orderData.isClosed &&
                                        (users.some((u) => u.notification) ||
                                            orderData.users.some((u) => u.status === UserOrderStatus.Requested)) && (
                                            <Grid container size={12} flexDirection={"column"}>
                                                {users.some((u) => u.notification) && (
                                                    <Grid
                                                        container
                                                        size={12}
                                                        spacing={1}
                                                        alignItems={"center"}
                                                        wrap="nowrap"
                                                        key={1}
                                                    >
                                                        <PulseDot color="warning" sx={{ width: "20px", height: "20px" }} />
                                                        <Typography variant="subtitle1">
                                                            {users.filter((u) => u.notification).length} new report(s)
                                                        </Typography>
                                                    </Grid>
                                                )}
                                                {orderData.users.some((u) => u.status === UserOrderStatus.Requested) && (
                                                    <Grid
                                                        container
                                                        size={12}
                                                        spacing={1}
                                                        alignItems={"center"}
                                                        wrap="nowrap"
                                                        key={2}
                                                    >
                                                        <PulseDot color="warning" sx={{ width: "20px", height: "20px" }} />
                                                        <Typography variant="subtitle1">
                                                            {
                                                                orderData.users.filter(
                                                                    (u) => u.status === UserOrderStatus.Requested
                                                                ).length
                                                            }{" "}
                                                            new request(s)
                                                        </Typography>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        )}

                                    {!orderData.isClosed && (
                                        <Grid container size={12} flexDirection={"column"} spacing={1}>
                                            <Typography variant="h6">Active requests</Typography>
                                            {orderData.users.filter((u) => u.status === UserOrderStatus.Requested).length > 0 ? (
                                                orderData.users
                                                    .filter((u) => u.status === UserOrderStatus.Requested)
                                                    .map((userOrder) => (
                                                        <>
                                                            <OrderRequest
                                                                key={userOrder.id}
                                                                id={userOrder.id}
                                                                user={{
                                                                    id: userOrder.user.id,
                                                                    firstName: userOrder.user.name,
                                                                    lastName: userOrder.user.surname,
                                                                    rating:
                                                                        userOrder.user.userReviews.reduce(
                                                                            (acc: number, review) => acc + review.grade,
                                                                            0
                                                                        ) / userOrder.user.userReviews.length,
                                                                }}
                                                                onAccept={acceptOrderRequest}
                                                                onReject={rejectOrderRequest}
                                                            />
                                                        </>
                                                    ))
                                            ) : (
                                                <Typography variant="body1">No active requests</Typography>
                                            )}
                                            <Grid size={6} mt={1}>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ width: "250px" }}
                                                    onClick={async () => {
                                                        const confirmed = await dialogs.confirm(
                                                            <Typography color="error" variant="subtitle2">
                                                                This action can't be undone
                                                            </Typography>,
                                                            {
                                                                title: "Finish the order?",

                                                                okText: <Typography>Yes</Typography>,
                                                                cancelText: <Typography color="success">No</Typography>,
                                                                severity: "error",
                                                            }
                                                        );
                                                        if (confirmed) {
                                                            await markAsFinished();
                                                        }
                                                    }}
                                                >
                                                    Finish order
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    )}

                                    <Grid container size={{ xs: 12, sm: 8, md: 6 }} flexDirection={"column"} spacing={1}>
                                        <Typography variant="h6" gutterBottom>
                                            Select user to see history
                                        </Typography>
                                        {users.length > 0 ? (
                                            <FormControl fullWidth>
                                                <InputLabel id="user-select-label">Select User</InputLabel>
                                                <Select
                                                    labelId="user-select-label"
                                                    value={selectedUserId}
                                                    label="Select User"
                                                    onChange={(e) => {
                                                        setSelectedUserId(e.target.value);
                                                        setTimeout(() => window.scrollBy({ behavior: "smooth", top: 400 }), 100);
                                                    }}
                                                    renderValue={(selectedId) => {
                                                        const user = users.find((u) => u.id === selectedId);
                                                        return user ? `${user.firstName} ${user.lastName}` : "";
                                                    }}
                                                >
                                                    {users.map((user) => (
                                                        <MenuItem key={user.id} value={user.id}>
                                                            <ListItem disableGutters>
                                                                <ListItemAvatar>
                                                                    <Avatar
                                                                        src={user.avatarUrl ?? ""}
                                                                        alt={`${user.firstName} ${user.lastName}`}
                                                                    />
                                                                </ListItemAvatar>
                                                                <ListItemText
                                                                    primary={`${user.firstName} ${user.lastName}`}
                                                                    secondary={
                                                                        user.notification ? (
                                                                            <Grid container alignItems={"center"} gap={1}>
                                                                                <PulseDot color="warning" />
                                                                                <Typography variant="body2">
                                                                                    {user.notification}
                                                                                </Typography>
                                                                            </Grid>
                                                                        ) : null
                                                                    }
                                                                />
                                                            </ListItem>
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        ) : (
                                            <Typography variant="body1">No users to display</Typography>
                                        )}
                                    </Grid>

                                    {selectedUserId && (
                                        <CompanyOrderActions
                                            orderData={orderData.users.find((u) => u.user.id === selectedUserId)!}
                                            onAction={() => setReload((prev) => !prev)}
                                        />
                                    )}
                                </>
                            ) : (
                                <OrderDetailsSkeleton />
                            )}
                        </Grid>
                    </Container>
                </Grid>
            </Grid>
            {orderData?.lat && orderData.lng && (
                <MapModal
                    isOpen={mapModalOpen}
                    onClose={() => setMapModalOpen(false)}
                    orderPosition={{ lat: orderData.lat, lng: orderData.lng }}
                    displayDistance={false}
                />
            )}
        </>
    );
};

export default CompanyOrderDetailsPage;
