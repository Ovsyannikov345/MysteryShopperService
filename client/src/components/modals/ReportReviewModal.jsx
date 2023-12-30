import React, { useState } from "react";
import { Dialog, Typography, Grid, Button, TextField, Rating } from "@mui/material";

const ReportReviewModal = ({ isOpen, acceptHandler, declineHandler }) => {
    const [review, setReview] = useState({
        text: "",
        grade: 0,
    });

    const closeModal = () => {
        declineHandler();
    };

    return (
        <Dialog open={isOpen} onClose={closeModal}>
            <Grid
                container
                item
                width={"483px"}
                pl={"28px"}
                pr={"28px"}
                pb={"25px"}
                flexDirection={"column"}
                alignItems={"center"}
            >
                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"} mb={"20px"}>
                    Оцените отчет
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Ваше мнение"
                    multiline
                    minRows={3}
                    value={review.text}
                    onChange={(e) => setReview({ ...review, text: e.target.value })}
                />
                <Grid container flexDirection={"column"} gap={"5px"} alignItems={"flex-start"} mt={"10px"}>
                    <Typography variant="h3" height={"20px"} display={"flex"} alignItems={"center"}>
                        Ваша оценка
                    </Typography>
                    <Rating
                        id="grade"
                        name="grade"
                        size="large"
                        sx={{
                            fontSize: "45px",
                        }}
                        value={review.grade}
                        onChange={(e, newValue) => {
                            if (newValue != null) {
                                setReview({ ...review, grade: newValue });
                            }
                        }}
                    />
                </Grid>
                <Grid container item mt={"20px"}>
                    <Button variant="contained" fullWidth onClick={() => acceptHandler(review)}>
                        ОТПРАВИТЬ ОТЗЫВ
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default ReportReviewModal;
