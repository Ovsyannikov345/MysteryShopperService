import React, { useEffect, useMemo, useRef, useState } from "react";
import { Grid2 as Grid, Typography, Container, useTheme, useMediaQuery } from "@mui/material";
import UserHeader from "../../components/headers/UserHeader";
import backgroundImage from "../../images/background.jpg";
import useOrderApi, { UserOrder } from "../../hooks/useOrderApi";
import { useNotifications } from "@toolpad/core";
import OrderCardSkeleton from "../../components/skeletons/OrderCardSkeleton";
import { UserOrderStatus } from "../../utils/enums/userOrderStatus";
import OrderCardSection from "../../components/info/OrderCardSection";

// TODO rework?
const UserOrdersPage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const headerRef = useRef<HTMLDivElement>(null);

    const { getUserOrders } = useOrderApi();

    const [orders, setOrders] = useState<UserOrder[]>();

    useEffect(() => {
        const loadOrders = async () => {
            const response = await getUserOrders();

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            console.log(response);
            setOrders(response);
        };

        loadOrders();
    }, [getUserOrders, notifications]);

    const pendingOrders = useMemo(() => {
        return orders?.filter((o) => o.status === UserOrderStatus.Requested);
    }, [orders]);

    const ordersInProgress = useMemo(() => {
        return orders?.filter((o) => o.status === UserOrderStatus.InProgress);
    }, [orders]);

    const completedOrders = useMemo(() => {
        return orders?.filter((o) => o.status === UserOrderStatus.Completed);
    }, [orders]);

    const rejectedOrders = useMemo(() => {
        return orders?.filter((o) => o.status === UserOrderStatus.Rejected);
    }, [orders]);

    const expiredOrders = useMemo(() => {
        return orders?.filter((o) => o.status === UserOrderStatus.Expired);
    }, [orders]);

    return (
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
                <Container
                    maxWidth="md"
                    sx={{
                        mt: isMediumScreen ? 0 : 2,
                        mb: isMediumScreen ? 0 : 2,
                        bgcolor: "white",
                        borderRadius: isMediumScreen ? 0 : "10px",
                    }}
                >
                    <Grid
                        container
                        spacing={2}
                        alignItems="flex-start"
                        sx={{ p: isMediumScreen ? 1 : 4 }}
                        mt={isMediumScreen ? 2 : 0}
                    >
                        <Grid container justifyContent={"flex-start"} alignItems={"center"} size={12}>
                            <Typography ref={headerRef} variant="h4">
                                Your orders
                            </Typography>
                        </Grid>
                        {orders ? (
                            orders.length > 0 ? (
                                <>
                                    {pendingOrders && <OrderCardSection label="Pending" orders={pendingOrders} />}
                                    {ordersInProgress && <OrderCardSection label="In Progress" orders={ordersInProgress} />}
                                    {completedOrders && <OrderCardSection label="Completed" orders={completedOrders} />}
                                    {rejectedOrders && <OrderCardSection label="Rejected" orders={rejectedOrders} />}
                                    {expiredOrders && <OrderCardSection label="Expired" orders={expiredOrders} />}
                                </>
                            ) : (
                                <Typography variant="h6">You have no orders</Typography>
                            )
                        ) : (
                            <Grid container size={12} spacing={2} alignContent={"stretch"}>
                                {[1, 2, 3, 4].map((id) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={id}>
                                        <OrderCardSkeleton />
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
};

export default UserOrdersPage;
