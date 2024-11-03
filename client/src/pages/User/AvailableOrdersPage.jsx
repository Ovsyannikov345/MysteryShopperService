import React, { useEffect, useMemo, useState } from "react";
import { Grid, Typography, Snackbar, Alert, useMediaQuery, IconButton, Dialog } from "@mui/material";
import UserHeader from "../../components/headers/UserHeader";
import SortSelector from "../../components/SortSelector";
import { getOrders } from "../../api/ordersApi";
import UserOrder from "../../components/UserOrder";
import moment from "moment";
import OrderFilter from "../../components/OrdersFilter";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

const AvailableOrdersPage = () => {
    const displayFilter = useMediaQuery((theme) => theme.breakpoints.up(1250));

    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [orders, setOrders] = useState([]);
    const [sortOption, setSortOption] = useState("date desc");
    const [searchQuery, setSearchQuery] = useState({
        name: "",
        place: "",
        minRating: null,
        minPrice: null,
        maxPrice: null,
        minDays: null,
        maxDays: null,
        startDate: null,
        endDate: null,
    });

    const sortedOrders = useMemo(() => {
        switch (sortOption) {
            case "date asc":
                return [...orders].sort((a, b) => new Date(a.createdAt.slice(0, -1)) - new Date(b.createdAt.slice(0, -1)));
            case "date desc":
                return [...orders].sort((a, b) => new Date(b.createdAt.slice(0, -1)) - new Date(a.createdAt.slice(0, -1)));
            default:
                return [...orders];
        }
    }, [orders, sortOption]);

    const sortedAndFilteredOrders = useMemo(() => {
        const startDate = searchQuery.startDate != null ? moment(searchQuery.startDate, "YYYY-MM-DD") : null;
        const endDate = searchQuery.endDate != null ? moment(searchQuery.endDate, "YYYY-MM-DD") : null;

        return sortedOrders.filter(
            (order) =>
                (order.title.toLowerCase().includes(searchQuery.name.toLowerCase()) ||
                    order.company.name.toLowerCase().includes(searchQuery.name.toLowerCase())) &&
                order.place.toLowerCase().includes(searchQuery.place.toLowerCase()) &&
                (searchQuery.minRating == null || order.companyRating >= searchQuery.minRating) &&
                (searchQuery.minPrice == null || (order.price ?? 0) >= searchQuery.minPrice) &&
                (searchQuery.maxPrice == null || (order.price ?? 0) <= searchQuery.maxPrice) &&
                (searchQuery.minDays == null || (order.completionTime ?? 0) >= searchQuery.minDays) &&
                (searchQuery.maxDays == null || (order.completionTime ?? 0) <= searchQuery.maxDays) &&
                (startDate == null || moment(order.createdAt, "YYYY-MM-DD").isSameOrAfter(startDate)) &&
                (endDate == null || moment(order.createdAt, "YYYY-MM-DD").isSameOrBefore(endDate))
        );
    }, [searchQuery, sortedOrders]);

    useEffect(() => {
        const loadOrders = async () => {
            const response = await getOrders();

            if (!response.status >= 300) {
                displayError(response.message);
                return;
            }

            const calculateCompanyRating = (company) => {
                if (company.companyReviews.length === 0) {
                    return 0;
                }

                return (
                    company.companyReviews.map((r) => r.grade).reduce((acc, val) => (acc += val), 0) /
                    company.companyReviews.length
                );
            };

            let loadedOrders = response.data.map(order => {
                return {...order, companyRating: calculateCompanyRating(order.company)};
            })

            setOrders(loadedOrders);
        };

        loadOrders();
    }, []);

    const displayError = (message) => {
        setErrorMessage(message);
        setError(true);
    };

    const displaySuccess = (message) => {
        setSuccessMessage(message);
        setSuccess(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false);
        setSuccess(false);
    };

    return (
        <Grid
            container
            width={"100%"}
            minHeight={"100vh"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            bgcolor={"#E7E7E7"}
        >
            <UserHeader />
            <Grid container item alignItems={"flex-start"} maxWidth={"1500px"} gap={"70px"} flexGrow={1} bgcolor={"#FFFFFF"}>
                {displayFilter ? (
                    <OrderFilter queryHandler={setSearchQuery} successHandler={displaySuccess} />
                ) : (
                    <Dialog
                        open={filterModalOpen}
                        onClose={() => setFilterModalOpen(false)}
                        PaperProps={{ style: { margin: 0 } }}
                    >
                        <OrderFilter queryHandler={setSearchQuery} successHandler={displaySuccess} />
                    </Dialog>
                )}
                <Grid
                    container
                    item
                    maxWidth={"867px"}
                    mt={"40px"}
                    gap={"10px"}
                    pb={"40px"}
                    sx={{ paddingLeft: { md: "19px", lg: 0 }, paddingRight: { md: "19px", lg: 0 } }}
                >
                    <Grid
                        container
                        item
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        mb={"-5px"}
                        sx={{ marginLeft: { xs: "10px", md: "0px" } }}
                    >
                        {displayFilter ? (
                            <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                Доступные заказы
                            </Typography>
                        ) : (
                            <Grid container item xs="auto" gap={"10px"}>
                                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                    Доступные заказы
                                </Typography>
                                <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => setFilterModalOpen(true)}>
                                    <FilterAltOutlinedIcon sx={{ fontSize: 30 }} />
                                </IconButton>
                            </Grid>
                        )}
                        <Grid container item width={"201px"}>
                            <SortSelector
                                options={[
                                    { value: "date desc", name: "Сначала новые" },
                                    { value: "date asc", name: "Сначала старые" },
                                ]}
                                value={sortOption}
                                changeHandler={setSortOption}
                            />
                        </Grid>
                    </Grid>
                    {sortedAndFilteredOrders.length > 0 ? (
                        sortedAndFilteredOrders.map((order) => <UserOrder key={order.id} orderData={order} />)
                    ) : (
                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                            Заказы по запросу не найдены
                        </Typography>
                    )}
                </Grid>
            </Grid>
            <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default AvailableOrdersPage;
