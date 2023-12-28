import { Grid, Avatar, Stack, Typography, Rating, Button } from "@mui/material";
import React from "react";

const Request = ({ request }) => {
    const acceptRequest = async () => {
        // TODO implement.
        console.log("accept");
    };

    const declineRequest = async () => {
        // TODO implement.
        console.log("decline");
    };
    // TODO implement link to user profile and make image a link.
    return (
        <Grid
            container
            item
            padding={"15px"}
            columnGap={"30px"}
            rowGap={"20px"}
            style={{ border: "2px solid #DDC12C", borderRadius: "10px" }}
        >
            <Button style={{ padding: "0px" }}>
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
                    <Rating value={0} readOnly />
                </Grid>
                <Grid container item width={"150px"} alignItems={"center"}>
                    <Button variant="outlined" fullWidth>
                        ПРОФИЛЬ
                    </Button>
                </Grid>
            </Stack>
            <Grid container item width={"100%"} gap={"20px"}>
                <Grid container item width={"143px"}>
                    <Button fullWidth variant="contained" onClick={acceptRequest}>
                        ПРИНЯТЬ
                    </Button>
                </Grid>
                <Grid container item width={"150px"}>
                    <Button fullWidth variant="outlined" onClick={declineRequest}>
                        ОТКЛОНИТЬ
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Request;
