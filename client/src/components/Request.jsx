import { Grid, Avatar, Stack, Typography, Rating, Button } from "@mui/material";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Request = ({ request, acceptHandler, declineHandler }) => {
    const navigate = useNavigate();

    const rating = useMemo(() => {
        try {
            let sum = 0;
            let count = 0;

            request.User.Reports.forEach((report) =>
                report.UserReviews.forEach((review) => {
                    sum += review.grade;
                    count++;
                })
            );

            if (count === 0) {
                return 0;
            }

            return sum / count;
        } catch {
            return 0;
        }
    }, [request.User.Reports]);

    return (
        <Grid
            container
            item
            padding={"15px"}
            columnGap={"30px"}
            rowGap={"20px"}
            style={{ border: "2px solid #DDC12C", borderRadius: "10px" }}
        >
            <Button style={{ padding: "0px" }} onClick={() => navigate(`/user/${request.User.id}`)}>
                <Avatar
                    src={
                        request.User.id !== undefined
                            ? `http://localhost:5000/api/users/${
                                  request.User.id
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
                        {[request.User.surname, request.User.name, request.User.patronymic].join(" ")}
                    </Typography>
                    <Rating value={rating} precision={0.5} readOnly />
                </Grid>
                <Grid container item width={"150px"} alignItems={"center"}>
                    <Button variant="outlined" fullWidth onClick={() => navigate(`/user/${request.User.id}`)}>
                        ПРОФИЛЬ
                    </Button>
                </Grid>
            </Stack>
            <Grid container item width={"100%"} gap={"20px"}>
                <Grid container item width={"143px"}>
                    <Button fullWidth variant="contained" onClick={() => acceptHandler(request.id)}>
                        ПРИНЯТЬ
                    </Button>
                </Grid>
                <Grid container item width={"150px"}>
                    <Button fullWidth variant="outlined" onClick={() => declineHandler(request.id)}>
                        ОТКЛОНИТЬ
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Request;
