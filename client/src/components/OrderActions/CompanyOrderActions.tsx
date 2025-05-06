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
import { useDialogs, useNotifications } from "@toolpad/core";
import { useState } from "react";
import PulseDot from "react-pulse-dot";
import { AccessTime, Close, Done, Feed } from "@mui/icons-material";
import { Report } from "../../hooks/useReportApi";
import ReportDisplayModal from "../modals/ReportDisplayModal";
import ReviewModal from "../modals/ReviewModal";
import useReviewApi from "../../hooks/useReviewApi";

interface CompanyOrderActionsProps {
    orderData: UserOrder;
    onAction: () => void;
}

const CompanyOrderActions = ({ orderData, onAction }: CompanyOrderActionsProps) => {
    const notification = useNotifications();

    const dialogs = useDialogs();

    const { expireOrder, completeOrder } = useOrderApi();

    const { createUserReview } = useReviewApi();

    const status = orderData.status as UserOrderStatus;

    const [isLoading, setIsLoading] = useState(false);

    //const [reportModalOpen, setReportModalOpen] = useState(false);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const [displayedReport, setDisplayedReport] = useState<Report | null>(null);

    // const sendReport = async (values: ReportFormValues, files: File[]): Promise<boolean> => {
    //     const response = await createReport({
    //         orderId: orderData.order.id,
    //         ...values,
    //     });

    //     if ("error" in response) {
    //         notification.show("Error sending report", { severity: "error", autoHideDuration: 3000 });
    //         return false;
    //     }

    //     const uploadResults = await Promise.all(files.map((file) => uploadAttachment(response.id, file)));

    //     const failedUploads = uploadResults.filter((res) => res && "error" in res).length;

    //     notification.show(`Report sent. ${failedUploads > 0 ? `${failedUploads} uploads failed` : ""}`, {
    //         severity: "success",
    //         autoHideDuration: 3000,
    //     });
    //     onAction();
    //     return true;
    // };

    const markAsExpired = async () => {
        setIsLoading(true);
        const response = await expireOrder(orderData.order.id, orderData.user.id);

        if (response && "error" in response) {
            notification.show("Error marking order as expired", { severity: "error", autoHideDuration: 3000 });
            setIsLoading(false);
            return;
        }

        notification.show("Order marked as expired", { severity: "success", autoHideDuration: 3000 });
        onAction();
        setIsLoading(false);
    };

    const markAsCompleted = async () => {
        setIsLoading(true);
        const response = await completeOrder(orderData.order.id, orderData.user.id);

        if (response && "error" in response) {
            notification.show("Error marking order as completed", { severity: "error", autoHideDuration: 3000 });
            setIsLoading(false);
            return;
        }

        notification.show("Order marked as completed", { severity: "success", autoHideDuration: 3000 });
        onAction();
        setIsLoading(false);
    };

    // TODO add review action
    const getAvailableAction = () => {
        if (orderData.status !== UserOrderStatus.InProgress) {
            return [];
        }

        if (
            orderData.order.reports.length === 0 &&
            moment.utc(orderData.acceptedAt).add(moment.duration(orderData.order.timeToComplete)).diff(moment.utc()) <= 0
        ) {
            return [
                <Button
                    variant="contained"
                    color="error"
                    sx={{ mt: "-6px" }}
                    onClick={async () => {
                        const confirmed = await dialogs.confirm(null, {
                            title: "Mark order as expired?",
                            okText: <Typography>Yes</Typography>,
                            cancelText: <Typography color="success">No</Typography>,
                            severity: "error",
                        });
                        if (confirmed) {
                            await markAsExpired();
                        }
                    }}
                >
                    Mark as expired
                </Button>,
            ];
        }

        if (orderData.order.reports.every((report) => report.reportCorrection)) {
            return [];
        }

        return (
            <>
                <Button
                    variant="contained"
                    color="success"
                    sx={{ mt: "-6px", width: "205px" }}
                    onClick={async () => {
                        const confirmed = await dialogs.confirm(null, {
                            title: "Mark order as completed?",
                            okText: <Typography color="success">Yes</Typography>,
                            cancelText: <Typography color="error">No</Typography>,
                            severity: "error",
                        });
                        if (confirmed) {
                            await markAsCompleted();
                        }
                    }}
                >
                    Complete order
                </Button>
                <Typography variant="subtitle1" sx={{ mx: 1 }}>
                    or
                </Typography>
                <Button variant="contained" sx={{ mt: "-6px", width: "205px" }}>
                    Request correction
                </Button>
            </>
        );
    };

    const getRequestActionHistory = () => {
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
                        <Typography>Request was received</Typography>
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
            <TimelineItem key={1}>
                <TimelineOppositeContent>
                    <Typography sx={{ p: 0, mt: 1 }}>{moment(orderData.updatedAt).calendar()}</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="error" sx={{}}>
                        <Close sx={{ width: "20px", height: "20px" }} />
                    </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography mt={1}>Request was rejected</Typography>
                </TimelineContent>
            </TimelineItem>
        );
    };

    const getAcceptActionHistory = () => {
        if (!orderData.acceptedAt) {
            return null;
        }

        return (
            <>
                <TimelineItem key={2}>
                    <TimelineOppositeContent>
                        <Typography sx={{ p: 0, mt: 1 }}>{moment(orderData.acceptedAt).calendar()}</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="success">
                            <Done sx={{ width: "20px", height: "20px" }} />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography mt={1}>Request was accepted</Typography>
                    </TimelineContent>
                </TimelineItem>
                {getExpiredActionHistory() || getReportActionHistory()}
            </>
        );
    };

    const getExpiredActionHistory = () => {
        if (orderData.status !== UserOrderStatus.Expired) {
            return null;
        }

        return (
            <TimelineItem key={3}>
                <TimelineOppositeContent>
                    <Typography sx={{ p: 0, mt: 1 }}>{moment(orderData.updatedAt).calendar()}</Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot color="error" sx={{}}>
                        <AccessTime sx={{ width: "20px", height: "20px" }} />
                    </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                    <Typography mt={1}>Order was marked as expired</Typography>
                </TimelineContent>
            </TimelineItem>
        );
    };

    const getReportActionHistory = () => {
        var pendingReportAction =
            orderData.order.reports.length === 0 || orderData.order.reports.every((report) => report.reportCorrection) ? (
                <TimelineItem key={4}>
                    <TimelineOppositeContent sx={{ pr: 0.5 }} />
                    <TimelineSeparator>
                        <TimelineDot sx={{ backgroundColor: "transparent", boxShadow: "none", margin: 0 }}>
                            <PulseDot style={{ fontSize: "13px" }} />
                        </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent sx={{ pl: 0.5 }}>
                        <Typography>Waiting for user report...</Typography>
                    </TimelineContent>
                </TimelineItem>
            ) : null;

        var pendingCompanyAction = (
            <TimelineItem key={5}>
                <TimelineOppositeContent sx={{ pr: 0.5 }} />
                <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: "transparent", boxShadow: "none", margin: 0 }}>
                        <PulseDot style={{ fontSize: "13px" }} />
                    </TimelineDot>
                </TimelineSeparator>
                <TimelineContent sx={{ pl: 0.5 }}>
                    <Typography>Waiting for your actions...</Typography>
                </TimelineContent>
            </TimelineItem>
        );

        var completedOrderAction =
            orderData.status === UserOrderStatus.Completed ? (
                <TimelineItem>
                    <TimelineOppositeContent>
                        <Typography sx={{ p: 0, mt: 1 }}>{moment(orderData.updatedAt).calendar()}</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="success">
                            <Done sx={{ width: "20px", height: "20px" }} />
                        </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography sx={{ p: 0, mt: 1 }}>Order was marked as completed</Typography>
                    </TimelineContent>
                </TimelineItem>
            ) : null;

        // TODO Add buttons for details and report correction
        var reportActions = orderData.order.reports.map((report) => (
            <>
                <TimelineItem key={report.id}>
                    <TimelineOppositeContent>
                        <Typography sx={{ p: 0, mt: 1 }}>{moment(report.createdAt).calendar()}</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="primary">
                            <Feed sx={{ width: "20px", height: "20px" }} />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography>Report was sent</Typography>
                        <Button size="small" variant="contained" onClick={() => setDisplayedReport(report as Report)}>
                            Details
                        </Button>
                    </TimelineContent>
                </TimelineItem>
                {report.reportCorrection && (
                    <TimelineItem key={report.reportCorrection.id}>
                        <TimelineOppositeContent>
                            <Typography sx={{ p: 0, mt: 1 }}>{moment(report.reportCorrection.createdAt).calendar()}</Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot>
                                <Feed sx={{ width: "20px", height: "20px" }} />
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent sx={{ pl: 0.5 }}>
                            <Typography>Correction was requested</Typography>
                        </TimelineContent>
                    </TimelineItem>
                )}
            </>
        ));

        return (
            <>
                {reportActions}
                {completedOrderAction || pendingReportAction || pendingCompanyAction}
            </>
        );
    };

    if (orderData.order.isClosed && status === UserOrderStatus.None) {
        return (
            <Grid container size={12} justifyContent={"center"}>
                <Typography variant="h5">Order is closed</Typography>
            </Grid>
        );
    }

    return (
        <>
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
                <Grid container width={"100%"} flexDirection={"column"} alignItems={"center"} gap={1}>
                    {isLoading ? <CircularProgress size={30} /> : getAvailableAction()}
                </Grid>
            </Grid>
            {/* <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} onSubmit={sendReport} /> */}
            <ReportDisplayModal
                open={displayedReport !== null}
                onClose={() => setDisplayedReport(null)}
                report={displayedReport}
            />
            <ReviewModal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} onSubmit={markAsCompleted} />
        </>
    );
};

export default CompanyOrderActions;
