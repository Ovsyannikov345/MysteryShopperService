import React, { useState } from "react";
import { Grid, Typography, TextField, Rating, Button } from "@mui/material";
import { useTheme } from "@emotion/react";

const CompanyReviewForm = ({ submitHandler }) => {
    const theme = useTheme();

    const [review, setReview] = useState({
        text: "",
        grade: 0,
    });

    return (
        <Grid container item flexDirection={"column"} alignItems={"flex-start"} mt={"-25px"}>
            <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                Оцените заказчика
            </Typography>
            <TextField
                variant="standard"
                fullWidth
                label="Ваш отзыв"
                multiline
                InputProps={{
                    style: { fontSize: "24px" },
                }}
                sx={{
                    "& .MuiInput-underline:before": {
                        borderBottomColor: theme.palette.primary.main,
                    },
                    "& .MuiInput-underline:after": {
                        borderBottomColor: theme.palette.primary.main,
                    },
                }}
                value={review.text}
                onChange={(e) => setReview({ ...review, text: e.target.value })}
            />
            <Rating
                id="grade"
                name="grade"
                size="large"
                sx={{
                    fontSize: "45px",
                    mt: "25px",
                }}
                value={review.grade}
                onChange={(e, newValue) => {
                    if (newValue != null) {
                        setReview({ ...review, grade: newValue });
                    }
                }}
            />
            <Grid container item height={"52px"} mt={"25px"}>
                <Button variant="contained" fullWidth onClick={() => submitHandler(review)}>
                    ОСТАВИТЬ ОЦЕНКУ
                </Button>
            </Grid>
        </Grid>
    );
};

export default CompanyReviewForm;
