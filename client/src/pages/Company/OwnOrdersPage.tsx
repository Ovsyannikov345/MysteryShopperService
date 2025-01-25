import { useEffect, useMemo, useRef, useState } from "react";
import useOrderApi, { CompanyOrder } from "../../hooks/useOrderApi";
import { useNotifications } from "@toolpad/core";
import backgroundImage from "../../images/background.jpg";
import { Container, Grid2 as Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import CompanyHeader from "../../components/headers/CompanyHeader";
import OrderCardSection from "../../components/info/OrderCardSection";
import OrderCardSkeleton from "../../components/skeletons/OrderCardSkeleton";

export default function OwnOrdersPage() {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const headerRef = useRef<HTMLDivElement>(null);

    const notifications = useNotifications();

    const { getCompanyOrders } = useOrderApi();

    const [orders, setOrders] = useState<CompanyOrder[]>();

    const [displayOptions, setDisplayOptions] = useState({
        active: true,
        finished: false,
    });

    useEffect(() => {
        const loadOrders = async () => {
            const response = await getCompanyOrders();

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            setOrders(response);
        };

        loadOrders();
    }, [getCompanyOrders, notifications]);

    const activeOrders = useMemo(() => {
        return orders?.filter((o) => !o.isClosed);
    }, [orders]);

    const finishedOrders = useMemo(() => {
        return orders?.filter((o) => o.isClosed);
    }, [orders]);

    return (
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
                                    {activeOrders && (
                                        <OrderCardSection
                                            label="Active"
                                            orders={activeOrders}
                                            open={displayOptions.active}
                                            onToggle={() =>
                                                setDisplayOptions({ ...displayOptions, active: !displayOptions.active })
                                            }
                                        />
                                    )}
                                    {finishedOrders && (
                                        <OrderCardSection
                                            label="Finished"
                                            orders={finishedOrders}
                                            open={displayOptions.finished}
                                            onToggle={() =>
                                                setDisplayOptions({ ...displayOptions, finished: !displayOptions.finished })
                                            }
                                        />
                                    )}
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
}
