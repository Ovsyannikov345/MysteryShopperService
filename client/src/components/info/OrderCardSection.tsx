import { Button, Grid2 as Grid, Typography } from "@mui/material";
import { CompanyOrder, UserOrder } from "../../hooks/useOrderApi";
import UserOrderCard from "./UserOrderCard";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import CompanyOrderCard from "./CompanyOrderCard";
import { useMemo, useState } from "react";
import moment from "moment";

const OrderCardSection = ({ label, orders }: { label: string; orders: UserOrder[] | CompanyOrder[] }) => {
    const [showAll, setShowAll] = useState(false);

    const sortedOrders = useMemo(
        () => orders.sort((a, b) => moment(b.updatedAt).toDate().getTime() - moment(a.updatedAt).toDate().getTime()),
        [orders]
    );

    const shownOrders = useMemo(() => (showAll ? sortedOrders : sortedOrders.slice(0, 4)), [sortedOrders, showAll]);

    if (orders.length === 0) {
        return null;
    }

    return (
        <>
            <Grid container size={12} alignItems={"center"} spacing={1}>
                <Typography variant="h5">{label}</Typography>
            </Grid>
            <Grid container size={12} spacing={2} alignContent={"stretch"}>
                {shownOrders.map((order) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={order.id}>
                        {"order" in order ? <UserOrderCard orderData={order} /> : <CompanyOrderCard order={order} />}
                    </Grid>
                ))}
            </Grid>
            {orders.length > 4 && (
                <Button
                    variant="contained"
                    endIcon={!showAll ? <ArrowDownward /> : <ArrowUpward />}
                    sx={{ borderWidth: 2 }}
                    onClick={() => setShowAll((prev) => !prev)}
                >
                    {!showAll ? `Show more (${orders.length - shownOrders.length})` : "Show less"}
                </Button>
            )}
        </>
    );
};

export default OrderCardSection;
