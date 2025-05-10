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
import PulseDot from "react-pulse-dot";
import { AccessTime, CallMade, CallReceived, Close, Done } from "@mui/icons-material";
import ReportModal, { ReportFormValues } from "../modals/ReportModal";
import useReportApi, { Report } from "../../hooks/useReportApi";
import ReportDisplayModal from "../modals/ReportDisplayModal";
import { Correction } from "../../hooks/useReportCorrectionApi";
import CorrectionDisplayModal from "../modals/CorrectionDisplayModal";
import ReviewModal, { ReviewFormValues } from "../modals/ReviewModal";
import useReviewApi from "../../hooks/useReviewApi";

interface UserOrderActionsProps {
    orderData: UserOrder;
    onAction: () => void;
}

const UserOrderActions = ({ orderData, onAction }: UserOrderActionsProps) => {
    const notification = useNotifications();

    const { requestOrder } = useOrderApi();

    const { createReport, uploadAttachment } = useReportApi();

    const { createCompanyReview } = useReviewApi();

    const status = orderData.status as UserOrderStatus;

    const [isLoading, setIsLoading] = useState(false);

    const [reportModalOpen, setReportModalOpen] = useState(false);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const [displayedReport, setDisplayedReport] = useState<Report | null>(null);

    const [displayedCorrection, setDisplayedCorrection] = useState<Correction | null>(null);

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

    const sendReport = async (values: ReportFormValues, files: File[]): Promise<boolean> => {
        const response = await createReport({
            orderId: orderData.order.id,
            ...values,
        });

        if ("error" in response) {
            notification.show("Error sending report", { severity: "error", autoHideDuration: 3000 });
            return false;
        }

        const uploadResults = await Promise.all(files.map((file) => uploadAttachment(response.id, file)));

        const failedUploads = uploadResults.filter((res) => res && "error" in res).length;

        notification.show(`Report sent. ${failedUploads > 0 ? `${failedUploads} uploads failed` : ""}`, {
            severity: "success",
            autoHideDuration: 3000,
        });
        onAction();
        return true;
    };

    const sendReview = async (review: ReviewFormValues) => {
        const response = await createCompanyReview(orderData.order.company.id, { ...review, orderId: orderData.order.id });

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
            return !orderData.order.companyReviews.some((r) => r.userId === orderData.user.id) ? (
                <Button variant="contained" sx={{ mt: "-6px", width: "205px" }} onClick={() => setReviewModalOpen(true)}>
                    Leave review
                </Button>
            ) : (
                <Button variant="contained" color="success" startIcon={<Done />} sx={{ mt: "-6px", width: "205px" }} disabled>
                    Review is sent
                </Button>
            );
        }

        if (orderData.status === UserOrderStatus.None) {
            return (
                <Button variant="contained" sx={{ mt: "-6px" }} onClick={sendRequest}>
                    Send request
                </Button>
            );
        }

        if (
            orderData.status === UserOrderStatus.InProgress &&
            (orderData.order.reports.length === 0 || orderData.order.reports.every((report) => report.reportCorrection))
        ) {
            return (
                <Button variant="contained" sx={{ mt: "-6px" }} onClick={() => setReportModalOpen(true)}>
                    Send report
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
                {getRejectActionHistory() || getAcceptActionHistory() || (
                    <TimelineItem>
                        <TimelineOppositeContent sx={{ pr: 0.5 }} />
                        <TimelineSeparator>
                            <TimelineDot sx={{ backgroundColor: "transparent", boxShadow: "none", margin: 0 }}>
                                <PulseDot style={{ fontSize: "13px" }} />
                            </TimelineDot>
                        </TimelineSeparator>
                        <TimelineContent sx={{ pl: 0.5 }}>
                            <Typography>Waiting for response...</Typography>
                        </TimelineContent>
                    </TimelineItem>
                )}
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
                <TimelineItem>
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
            <TimelineItem>
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
                <TimelineItem>
                    <TimelineOppositeContent sx={{ pr: 0.5 }} />
                    <TimelineSeparator>
                        <TimelineDot sx={{ backgroundColor: "transparent", boxShadow: "none", margin: 0 }}>
                            <PulseDot style={{ fontSize: "13px" }} />
                        </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent sx={{ pl: 0.5 }}>
                        <Typography>Waiting for your report...</Typography>
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
            <TimelineItem>
                <TimelineOppositeContent sx={{ pr: 0.5 }} />
                <TimelineSeparator>
                    <TimelineDot sx={{ backgroundColor: "transparent", boxShadow: "none", margin: 0 }}>
                        <PulseDot style={{ fontSize: "13px" }} />
                    </TimelineDot>
                </TimelineSeparator>
                <TimelineContent sx={{ pl: 0.5 }}>
                    <Typography>Waiting for company actions...</Typography>
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
                            <CallMade sx={{ width: "20px", height: "20px" }} />
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
                            <TimelineDot color="primary">
                                <CallReceived sx={{ width: "20px", height: "20px" }} />
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
                <Grid container mt={2}>
                    {isLoading ? <CircularProgress size={30} /> : getAvailableAction()}
                </Grid>
            </Grid>
            <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} onSubmit={sendReport} />
            <ReportDisplayModal
                open={displayedReport !== null}
                onClose={() => setDisplayedReport(null)}
                report={displayedReport}
            />
            <CorrectionDisplayModal
                open={displayedCorrection !== null}
                onClose={() => setDisplayedCorrection(null)}
                correction={displayedCorrection}
            />
            <ReviewModal open={reviewModalOpen} onClose={() => setReviewModalOpen(false)} onSubmit={sendReview} />
        </>
    );
};

export default UserOrderActions;
