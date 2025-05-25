import { CompanyOrder } from "./../../hooks/useOrderApi";
import { Button, Card, CardActions, CardContent, Grid2 as Grid, Typography } from "@mui/material";
import { Map, Person, InfoOutlined } from "@mui/icons-material";
import "react-pulse-dot/dist/index.css";
import { UserOrderStatus } from "../../utils/enums/userOrderStatus";
import PulseDot from "react-pulse-dot";
import { useNavigate } from "react-router-dom";
import { ORDER_DETAILS_ROUTE } from "../../router/consts";

export default function CompanyOrderCard({ order }: { order: CompanyOrder }) {
    const navigate = useNavigate();

    const activeUsersCount = order.users.filter(
        (u) => u.status === UserOrderStatus.Requested || u.status === UserOrderStatus.InProgress
    ).length;

    const isNewRequests = order.users.some((u) => u.status === UserOrderStatus.Requested);

    const isNewReports = order.reports.some(
        (r) => !r.reportCorrection && !order.users.some((u) => u.user.id === r.userId && u.status === UserOrderStatus.Completed)
    );

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={3}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {order.title}
                </Typography>
                <Grid container wrap="nowrap" spacing={1}>
                    <Map />
                    <Typography variant="body1">{order.place ? order.place : "Нет адреса"}</Typography>
                </Grid>
                {!order.isClosed && (
                    <>
                        <Grid container wrap="nowrap" spacing={1}>
                            <Person />
                            <Typography variant="body1">{activeUsersCount} пользователь(ей)</Typography>
                        </Grid>
                        {isNewRequests && (
                            <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                                <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                                <Typography variant="body1">Новые заявки</Typography>
                            </Grid>
                        )}
                        {isNewReports && (
                            <Grid container wrap="nowrap" alignItems={"center"} spacing={0.5} mt={1} ml={"-3px"}>
                                <PulseDot color="#e3bf00" style={{ fontSize: "15px" }} />
                                <Typography variant="body1">Новые отчеты</Typography>
                            </Grid>
                        )}
                    </>
                )}
            </CardContent>
            <CardActions sx={{ flexGrow: 1, alignItems: "flex-end", justifyContent: "flex-end" }}>
                <Button
                    variant="contained"
                    startIcon={<InfoOutlined />}
                    onClick={() => navigate(ORDER_DETAILS_ROUTE.replace(/:.*/, order.id))}
                >
                    Подробнее
                </Button>
            </CardActions>
        </Card>
    );
}
