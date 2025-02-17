import { Button, Collapse, Grid2 as Grid, Typography } from "@mui/material";
import { CompanyOrder, UserOrder } from "../../hooks/useOrderApi";
import UserOrderCard from "./UserOrderCard";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CompanyOrderCard from "./CompanyOrderCard";

const OrderCardSection = ({
    label,
    orders,
    open,
    onToggle,
}: {
    label: string;
    orders: UserOrder[] | CompanyOrder[];
    open: boolean;
    onToggle: () => void;
}) => {
    return (
        <>
            <Grid container size={12} alignItems={"center"} spacing={1}>
                <Typography variant="h5">{label}</Typography>
                <Button variant="contained" startIcon={open ? <Visibility /> : <VisibilityOff />} size="small" onClick={onToggle}>
                    {open ? "Hide" : `Show (${orders.length})`}
                </Button>
            </Grid>
            <Collapse in={open} sx={{ width: "100%" }}>
                <Grid container size={12} spacing={2} alignContent={"stretch"}>
                    {orders.map((order) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={order.id}>
                            {"order" in order ? <UserOrderCard orderData={order} /> : <CompanyOrderCard order={order} />}
                        </Grid>
                    ))}
                </Grid>
            </Collapse>
        </>
    );
};

export default OrderCardSection;
