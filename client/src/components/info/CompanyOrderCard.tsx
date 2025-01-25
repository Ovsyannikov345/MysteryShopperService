import { CompanyOrder } from "./../../hooks/useOrderApi";
import { Button, Card, CardActions, CardContent, Grid2 as Grid, Typography } from "@mui/material";
import moment from "moment";
import { NavigateNext, Map, Timer, MonetizationOn } from "@mui/icons-material";
import "react-pulse-dot/dist/index.css";

export default function CompanyOrderCard({ order }: { order: CompanyOrder }) {
    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={5}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {order.title}
                </Typography>
                <Grid container wrap="nowrap" spacing={1}>
                    <Map />
                    <Typography variant="body1">{order.place}</Typography>
                </Grid>
                <Grid container wrap="nowrap" spacing={1} mt={1}>
                    <Timer />
                    <Typography variant="body1">
                        {moment.duration(order.timeToComplete).days()} days {moment.duration(order.timeToComplete).hours()} hours
                    </Typography>
                </Grid>
                <Grid container wrap="nowrap" spacing={1} mt={1}>
                    <MonetizationOn />
                    <Typography variant="body1">{order.price} BYN</Typography>
                </Grid>
            </CardContent>
            <CardActions sx={{ flexGrow: 1, alignItems: "flex-end" }}>
                {/* TODO implement */}
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<NavigateNext />}
                    onClick={() => console.log("navigated to order " + order.id)}
                >
                    Details
                </Button>
            </CardActions>
        </Card>
    );
}
