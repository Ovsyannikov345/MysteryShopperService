import { Grid, Avatar, Stack, Typography, Rating, Button } from "@mui/material";
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ReportReviewModal from "./modals/ReportReviewModal";
import { createUserReview } from "../api/userReviewApi";

const Report = ({ report, errorHandler, successHandler }) => {
    const navigate = useNavigate();

    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    const rating = useMemo(() => {
        try {
            let sum = 0;
            let count = 0;

            report.User.Reports.forEach((report) => {
                if (report.UserReview != null) {
                    sum += report.UserReview.grade;
                    count++;
                }
            });

            if (count === 0) {
                return 0;
            }

            return sum / count;
        } catch {
            return 0;
        }
    }, [report.User.Reports]);

    const finishReport = async (reviewData) => {
        reviewData.ReportId = report.id;

        const response = await createUserReview(reviewData);

        if (!response) {
            errorHandler("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
            window.location.reload();
        }

        if (response.status >= 300) {
            errorHandler("Ошибка при отправке отзыва. Код: " + response.status);
            return;
        }

        successHandler();
        setReviewModalOpen(false);
    };

    return (
        <>
            <ReportReviewModal
                isOpen={reviewModalOpen}
                acceptHandler={finishReport}
                declineHandler={() => setReviewModalOpen(false)}
            />
            <Grid
                container
                item
                padding={"15px"}
                columnGap={"30px"}
                rowGap={"10px"}
                style={{ border: "2px solid #DDC12C", borderRadius: "10px" }}
            >
                <Button style={{ padding: "0px" }} onClick={() => navigate(`/user/${report.User.id}`)}>
                    <Avatar
                        src={
                            report.User.id !== undefined
                                ? `http://localhost:5000/api/users/${
                                      report.User.id
                                  }/avatar?jwt=${localStorage.getItem("jwt")}`
                                : ""
                        }
                        variant="square"
                        sx={{ width: 60, height: 60 }}
                    />
                </Button>
                <Stack direction={"row"} justifyContent={"space-between"} flexGrow={1}>
                    <Grid container item flexDirection={"column"} alignItems={"flex-start"} gap={"14px"}>
                        <Typography variant="h3" height={"20px"}>
                            {[report.User.surname, report.User.name, report.User.patronymic].join(" ")}
                        </Typography>
                        <Rating value={rating} readOnly />
                    </Grid>
                    <Grid container item width={"150px"} alignItems={"center"}>
                        <Button variant="outlined" fullWidth onClick={() => navigate(`/user/${report.User.id}`)}>
                            ПРОФИЛЬ
                        </Button>
                    </Grid>
                </Stack>
                <Grid container item width={"100%"} flexDirection={"column"} gap={"10px"}>
                    <Grid container item width={"100%"} flexDirection={"column"}>
                        <Typography variant="h2" height={"38px"}>
                            {report.title}
                        </Typography>
                        <Typography variant="h3">{report.description}</Typography>
                        <Rating value={report.grade} readOnly style={{ marginTop: "5px" }} />
                    </Grid>
                    {report.UserReview == null && (
                        <Grid container item width={"143px"}>
                            <Button fullWidth variant="contained" onClick={() => setReviewModalOpen(true)}>
                                ЗАВЕРШИТЬ
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </>
    );
};

export default Report;
