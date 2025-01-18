import React, { useEffect, useState, useRef } from "react";
import {
    Grid2 as Grid,
    Container,
    useMediaQuery,
    useTheme,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Button,
    Collapse,
    Pagination,
} from "@mui/material";
import UserHeader from "../../components/headers/UserHeader";
import backgroundImage from "../../images/background.jpg";
import { useNotifications } from "@toolpad/core";
import useOrderApi, { Order, OrderQueryFilter } from "../../hooks/useOrderApi";
import { OrderSortOptions } from "../../utils/enums/orderSortOptions";
import { FilterAlt } from "@mui/icons-material";
import OrderFilter from "../../components/filters/OrderFilter";
import { PagedResult } from "../../hooks/utils/responses";
import OrderCard from "../../components/info/OrderCard";
import OrderCardSkeleton from "../../components/skeletons/OrderCardSkeleton";

// TODO fix constant image load error.

const AvailableOrdersPage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const { getAvailableOrders } = useOrderApi();

    const [currentPage, setCurrentPage] = useState(1);

    const [orders, setOrders] = useState<PagedResult<Order>>();

    const [selectedSortOption, setSelectedSortOption] = useState<OrderSortOptions>(OrderSortOptions.DateDescending);

    const [displayFilter, setDisplayFilter] = useState(false);

    const [filter, setFilter] = useState<OrderQueryFilter>(
        localStorage.getItem("orderFilter") ? JSON.parse(localStorage.getItem("orderFilter")!) : {}
    );

    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const loadOrders = async () => {
            const response = await getAvailableOrders(currentPage, selectedSortOption, filter ?? {});

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            setOrders(response);
        };

        loadOrders();
    }, [currentPage, filter, getAvailableOrders, notifications, selectedSortOption]);

    const formatSortOption = (key: string): string => {
        const isDescending = key.includes("Descending");
        const field = key.replace("Descending", "").replace("Ascending", "");
        const arrow = isDescending ? "↓" : "↑";
        return `${field.trim()} ${arrow}`;
    };

    const changePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const changeSortOption = (event: SelectChangeEvent<OrderSortOptions>) => {
        setSelectedSortOption(Number(event.target.value) as OrderSortOptions);
    };

    const changeFilter = (filter: OrderQueryFilter) => {
        setFilter(filter);
        localStorage.setItem("orderFilter", JSON.stringify(filter));
    };

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
                        spacing={4}
                        alignItems="flex-start"
                        sx={{ p: isMediumScreen ? 1 : 4 }}
                        mt={isMediumScreen ? 2 : 0}
                    >
                        <Grid container justifyContent={"space-between"} alignItems={"center"} size={12}>
                            <Typography ref={headerRef} variant="h4">
                                Available orders
                            </Typography>
                            <FormControl>
                                <InputLabel id="sort-label">Order by</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    label="Order by"
                                    value={selectedSortOption}
                                    onChange={changeSortOption}
                                    sx={{ width: "190px" }}
                                >
                                    {Object.keys(OrderSortOptions)
                                        .filter((key) => isNaN(Number(key)))
                                        .map((key) => (
                                            <MenuItem
                                                key={OrderSortOptions[key as keyof typeof OrderSortOptions]}
                                                value={OrderSortOptions[key as keyof typeof OrderSortOptions].toString()}
                                            >
                                                {formatSortOption(key)}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid container flexDirection={"column"} alignItems={"flex-start"} spacing={2} mt={-2}>
                            <Button
                                variant="contained"
                                startIcon={<FilterAlt />}
                                onClick={() => setDisplayFilter(!displayFilter)}
                            >
                                {displayFilter ? "Hide Filters" : "Show Filters"}
                            </Button>
                            <Collapse in={displayFilter}>
                                <OrderFilter filter={filter} onFilterChange={changeFilter} />
                            </Collapse>
                        </Grid>
                        <Grid container size={12} spacing={2} alignContent={"stretch"}>
                            {orders ? (
                                orders.pageContent.length > 0 ? (
                                    orders.pageContent.map((order) => (
                                        <Grid size={{ xs: 12, sm: 6 }} key={order.id}>
                                            <OrderCard orderData={order} />
                                        </Grid>
                                    ))
                                ) : (
                                    <Typography variant="h6">No orders found</Typography>
                                )
                            ) : (
                                [1, 2, 3, 4].map((id) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={id}>
                                        <OrderCardSkeleton />
                                    </Grid>
                                ))
                            )}
                        </Grid>

                        <Grid container size={12} justifyContent={"center"}>
                            {orders && orders.totalPages > 1 && (
                                <Pagination
                                    count={orders.totalPages}
                                    page={orders.currentPage}
                                    shape="rounded"
                                    color="primary"
                                    onChange={changePage}
                                />
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
};

export default AvailableOrdersPage;
