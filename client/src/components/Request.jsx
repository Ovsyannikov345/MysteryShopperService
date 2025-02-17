import { Grid, Avatar, Stack, Typography, Rating, Button, useMediaQuery } from "@mui/material";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Request = ({ request, acceptHandler, declineHandler }) => {
    const isScreenSizeUpMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

    const navigate = useNavigate();

    const rating = useMemo(() => {
        try {
            let sum = 0;
            let count = 0;

            request.User.Reports.forEach((report) => {
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
            <Grid container item xs={12} wrap="nowrap">
                <Button style={{ padding: "0px" }} onClick={() => navigate(`/user/${request.User.id}`)}>
                    <Avatar
                        src={
                            request.User.id !== undefined
                                ? `http://localhost:5000/api/users/${
                                      request.User.id
                                  }/avatar?jwt=${localStorage.getItem("accessToken")}`
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
                    {isScreenSizeUpMd && (
                        <Grid container item width={"150px"} alignItems={"center"}>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate(`/user/${request.User.id}`)}
                            >
                                ПРОФИЛЬ
                            </Button>
                        </Grid>
                    )}
                </Stack>
            </Grid>
            <Grid container item width={"100%"} columnGap={"20px"} rowGap={"10px"}>
                <Grid container item width={"143px"}>
                    <Button fullWidth variant="contained" onClick={() => acceptHandler(request.id)}>
                        ПРИНЯТЬ
                    </Button>
                </Grid>
                <Grid container item sx={{ width: { xs: "143px", md: "150px" } }}>
                    <Button fullWidth variant="outlined" onClick={() => declineHandler(request.id)}>
                        ОТКЛОНИТЬ
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Request;
