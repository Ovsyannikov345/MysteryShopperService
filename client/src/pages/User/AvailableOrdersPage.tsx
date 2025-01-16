import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import UserHeader from "../../components/headers/UserHeader";
import backgroundImage from "../../images/background.jpg";
import { useNotifications } from "@toolpad/core";
import useOrderApi, { OrderQueryFilter } from "../../hooks/useOrderApi";
import { OrderSortOptions } from "../../utils/enums/orderSortOptions";
import { FilterAlt } from "@mui/icons-material";
import OrderFilter from "../../components/filters/OrderFilter";

const AvailableOrdersPage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const { getAvailableOrders } = useOrderApi();

    const [orders, setOrders] = useState();

    const [selectedSortOption, setSelectedSortOption] = useState<OrderSortOptions>(OrderSortOptions.DateDescending);

    const [displayFilter, setDisplayFilter] = useState(false);

    const [filter, setFilter] = useState<OrderQueryFilter | undefined>(
        localStorage.getItem("orderFilter") ? JSON.parse(localStorage.getItem("orderFilter")!) : undefined
    );

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const loadOrders = async () => {
            const response = await getAvailableOrders();

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            }

            console.log(response);
        };

        loadOrders();
    }, [getAvailableOrders, notifications]);

    const formatSortOption = (key: string): string => {
        const isDescending = key.includes("Descending");
        const field = key.replace("Descending", "").replace("Ascending", "");
        const arrow = isDescending ? "↓" : "↑";
        return `${field.trim()} ${arrow}`;
    };

    const changeSortOption = (event: SelectChangeEvent<OrderSortOptions>) => {
        setSelectedSortOption(Number(event.target.value) as OrderSortOptions);
    };

    const changeFilter = (filter?: OrderQueryFilter) => {
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
                    {/* TODO implement
                    {!orders && <OrdersPageSkeleton />} */}

                    <Grid container spacing={4} alignItems="flex-start" sx={{ p: isMediumScreen ? 1 : 4 }} mt={isMediumScreen ? 2 : 0}>
                        <Grid container justifyContent={"space-between"} size={12}>
                            <Typography variant="h5">Available orders</Typography>
                            <FormControl>
                                <InputLabel id="sort-label">Order by</InputLabel>
                                <Select
                                    labelId="sort-label"
                                    label="Order by"
                                    value={selectedSortOption}
                                    onChange={changeSortOption}
                                    sx={{ width: "180px" }}
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
                        <Grid container flexDirection={"column"} alignItems={"flex-start"} spacing={2} mb={5}>
                            <Button variant="text" startIcon={<FilterAlt />} onClick={() => setDisplayFilter(!displayFilter)}>
                                {displayFilter ? "Hide Filters" : "Show Filters"}
                            </Button>
                            <Collapse in={displayFilter}>
                                <OrderFilter filter={filter} onFilterChange={changeFilter} />
                            </Collapse>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
};

export default AvailableOrdersPage;
