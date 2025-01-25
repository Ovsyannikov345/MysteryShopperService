import { CompanyOrder } from "./../../hooks/useOrderApi";
import { Button, Card, CardActions, CardContent, Grid2 as Grid, Typography } from "@mui/material";
import { NavigateNext, Map, Person } from "@mui/icons-material";
import "react-pulse-dot/dist/index.css";
import { UserOrderStatus } from "../../utils/enums/userOrderStatus";
import PulseDot from "react-pulse-dot";

export default function CompanyOrderCard({ order }: { order: CompanyOrder }) {
    const activeUsersCount = order.users.filter(
        (u) => u.status === UserOrderStatus.Requested || u.status === UserOrderStatus.InProgress
    ).length;

    const isNewRequests = order.users.some((u) => u.status === UserOrderStatus.Requested);

    const isNewReports = order.reports.some(
        (r) => !r.reportCorrection && !order.users.some((u) => u.id === r.userId && u.status === UserOrderStatus.Completed)
    );

    const isActiveDisputes = order.disputes.some((d) => !d.companyText);

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={5}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {order.id}
                </Typography>
                <Grid container wrap="nowrap" spacing={1}>
                    <Map />
                    <Typography variant="body1">{order.place}</Typography>
                </Grid>
                {!order.isClosed && (
                    <>
                        <Grid container wrap="nowrap" spacing={1}>
                            <Person />
                            <Typography variant="body1">{activeUsersCount} active user(s)</Typography>
                        </Grid>
                        {isNewRequests && (
                            <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                                <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                                <Typography variant="body1">New requests</Typography>
                            </Grid>
                        )}
                        {isNewReports && (
                            <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                                <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                                <Typography variant="body1">New reports</Typography>
                            </Grid>
                        )}
                        {isActiveDisputes && (
                            <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                                <PulseDot color="danger" style={{ fontSize: "15px" }} />
                                <Typography variant="body1">Active dispute</Typography>
                            </Grid>
                        )}
                    </>
                )}
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
