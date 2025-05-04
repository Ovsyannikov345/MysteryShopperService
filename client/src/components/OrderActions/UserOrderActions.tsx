import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { UserOrderStatus } from "../../utils/enums/userOrderStatus";
import { Button, CircularProgress, Grid2 as Grid, Typography } from "@mui/material";
import moment from "moment";
import useOrderApi, { UserOrder } from "../../hooks/useOrderApi";
import { useNotifications } from "@toolpad/core";
import { useState } from "react";

const UserOrderActions = ({ orderData, onAction }: { orderData: UserOrder; onAction: () => void }) => {
    const notification = useNotifications();

    const { requestOrder } = useOrderApi();

    const status = orderData.status as UserOrderStatus;

    const [isLoading, setIsLoading] = useState(false);

    const sendRequest = async () => {
        setIsLoading(true);

        const response = await requestOrder(orderData.order.id);

        setIsLoading(false);

        if (response && "error" in response) {
            notification.show("Error sending request", { severity: "error", autoHideDuration: 3000 });
            return;
        }

        notification.show("Request sent", { severity: "success", autoHideDuration: 3000 });
        onAction();
    };

    const getAvailableAction = () => {
        if (orderData.status === UserOrderStatus.None) {
            return (
                <Button variant="contained" sx={{ mt: "-6px" }} onClick={sendRequest}>
                    Send request
                </Button>
            );
        }
    };

    const getRequestActionHistory = () => {
        if (orderData.status === UserOrderStatus.None) {
            return null;
        }

        return (
            <>
                <TimelineItem>
                    <TimelineOppositeContent>
                        <Typography sx={{ p: 0 }}>{moment(orderData.requestedAt).calendar()}</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography>Request was sent</Typography>
                    </TimelineContent>
                </TimelineItem>
                {getRejectActionHistory() || getAcceptActionHistory()}
            </>
        );
    };

    const getRejectActionHistory = () => {
        if (orderData.status !== UserOrderStatus.Rejected) {
            return null;
        }

        return (
            <TimelineItem>
                <TimelineOppositeContent>
                    <Typography sx={{ p: 0 }}>{moment(orderData.updatedAt).calendar()}</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="primary" />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Typography>Request was rejected</Typography>
                </TimelineContent>
            </TimelineItem>
        );
    };

    const getAcceptActionHistory = () => {
        return <Typography>Request is accepted</Typography>;
    };

    if (orderData.order.isClosed && status === UserOrderStatus.None) {
        return (
            <Grid container size={12} justifyContent={"center"}>
                <Typography variant="h5">Order is closed</Typography>
            </Grid>
        );
    }

    return (
        <Grid container size={12} flexDirection={"column"} alignItems={"center"}>
            <Timeline sx={{ p: 0, width: "100%" }}>
                <TimelineItem>
                    <TimelineOppositeContent>
                        <Typography sx={{ p: 0 }}>{moment(orderData.createdAt).calendar()}</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography>This is the start of your interaction history</Typography>
                    </TimelineContent>
                </TimelineItem>
                {getRequestActionHistory()}
            </Timeline>
            <Grid container mt={2}>
                {isLoading ? <CircularProgress size={30} /> : getAvailableAction()}
            </Grid>
        </Grid>
    );
};

export default UserOrderActions;
