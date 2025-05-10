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
import { AccessTime, CallMade, CallReceived, Close, Done } from "@mui/icons-material";
import { Report } from "../../hooks/useReportApi";
import ReportDisplayModal from "../modals/ReportDisplayModal";
import ReviewModal, { ReviewFormValues } from "../modals/ReviewModal";
import useReviewApi from "../../hooks/useReviewApi";
import useReportCorrectionApi, { Correction } from "../../hooks/useReportCorrectionApi";
import CorrectionModal, { CorrectionFormValues } from "../modals/CorrectionModal";
import CorrectionDisplayModal from "../modals/CorrectionDisplayModal";

// TODO Remove disputes from everywhere

interface CompanyOrderActionsProps {
    orderData: UserOrder;
    onAction: () => void;
}

const CompanyOrderActions = ({ orderData, onAction }: CompanyOrderActionsProps) => {
    const notification = useNotifications();

    const dialogs = useDialogs();

    const { expireOrder, completeOrder } = useOrderApi();

    const { createCorrection } = useReportCorrectionApi();

    const { createUserReview } = useReviewApi();

    const status = orderData.status as UserOrderStatus;

    const [isLoading, setIsLoading] = useState(false);

    const [correctionModalOpen, setCorrectionModalOpen] = useState(false);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const [displayedReport, setDisplayedReport] = useState<Report | null>(null);

    const [displayedCorrection, setDisplayedCorrection] = useState<Correction | null>(null);

    const sendCorrection = async (values: CorrectionFormValues): Promise<boolean> => {
        const report = orderData.order.reports.find((r) => !r.reportCorrection);

        if (!report) {
            notification.show("Failed to determine report to send correction for", { severity: "error", autoHideDuration: 3000 });
            return false;
        }

        const response = await createCorrection({
            ...values,
            reportId: report.id,
        });

        if ("error" in response) {
            notification.show("Error sending correction", { severity: "error", autoHideDuration: 3000 });
            return false;
        }

        notification.show("Correction sent", { severity: "success", autoHideDuration: 3000 });
        onAction();
        return true;
    };

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

    const sendReview = async (review: ReviewFormValues) => {
        const response = await createUserReview(orderData.user.id, { ...review, orderId: orderData.order.id });

        if (response && "error" in response) {
            notification.show("Error sending review", { severity: "error", autoHideDuration: 3000 });
            return false;
        }

        notification.show("Review is sent", { severity: "success", autoHideDuration: 3000 });
        onAction();
        return true;
    };

    const getAvailableAction = () => {
        if (orderData.status === UserOrderStatus.Completed) {
            return !orderData.order.userReviews.some((r) => r.userId === orderData.user.id) ? (
                <Button variant="contained" sx={{ mt: "-6px", width: "205px" }} onClick={() => setReviewModalOpen(true)}>
                    Leave review
                </Button>
            ) : (
                <Button variant="contained" color="success" startIcon={<Done/>} sx={{ mt: "-6px", width: "205px" }} disabled>
                    Review is sent
                </Button>
            );
        }

        if (orderData.status !== UserOrderStatus.InProgress) {
            return [];
        }

        const lastReport =
            orderData.order.reports.length > 0 ? orderData.order.reports[orderData.order.reports.length - 1] : null;
        const startTime = lastReport?.reportCorrection ? lastReport.reportCorrection.createdAt : orderData.acceptedAt;
        const endTime = orderData.order.timeToComplete
            ? moment.utc(startTime).add(moment.duration(orderData.order.timeToComplete))
            : null;

        if (endTime && moment.utc().isAfter(endTime)) {
            return (
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
                </Button>
            );
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
                <Button variant="contained" sx={{ mt: "-6px", width: "205px" }} onClick={() => setCorrectionModalOpen(true)}>
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
        const lastReport =
            orderData.order.reports.length > 0 ? orderData.order.reports[orderData.order.reports.length - 1] : null;
        const startTime = lastReport?.reportCorrection ? lastReport.reportCorrection.createdAt : orderData.acceptedAt;
        const endTime = orderData.order.timeToComplete
            ? moment.utc(startTime).add(moment.duration(orderData.order.timeToComplete))
            : null;

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
                        {endTime && endTime.isAfter(moment.utc()) ? (
                            <Typography>{moment.duration(moment.utc().diff(endTime)).humanize()} remaining</Typography>
                        ) : endTime ? (
                            <Typography color="error">
                                Expired {moment.duration(endTime.diff(moment.utc())).humanize()} ago
                            </Typography>
                        ) : (
                            <Typography>No expiration</Typography>
                        )}
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

        var reportActions = orderData.order.reports.map((report) => (
            <>
                <TimelineItem key={report.id}>
                    <TimelineOppositeContent>
                        <Typography sx={{ p: 0, mt: 1 }}>{moment(report.createdAt).calendar()}</Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                        <TimelineDot color="primary">
                            <CallReceived sx={{ width: "20px", height: "20px" }} />
                        </TimelineDot>
                        <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                        <Typography>Report was received</Typography>
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
                            <TimelineDot color="primary">
                                <CallMade sx={{ width: "20px", height: "20px" }} />
                            </TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Typography>Correction was requested</Typography>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => setDisplayedCorrection(report.reportCorrection!)}
                            >
                                Details
                            </Button>
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
            <CorrectionModal open={correctionModalOpen} onClose={() => setCorrectionModalOpen(false)} onSubmit={sendCorrection} />
            <CorrectionDisplayModal
                open={displayedCorrection !== null}
                onClose={() => setDisplayedCorrection(null)}
                correction={displayedCorrection}
            />
            <ReportDisplayModal
                open={displayedReport !== null}
                onClose={() => setDisplayedReport(null)}
                report={displayedReport}
            />
            <ReviewModal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} onSubmit={sendReview} />
        </>
    );
};

export default CompanyOrderActions;
