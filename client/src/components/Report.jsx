import { Grid, Avatar, Stack, Typography, Rating, Button } from "@mui/material";
import React from "react";

const Report = ({ report }) => {
    const finishReport = async () => {
        // TODO implement.
        console.log("finish");
    };

    // TODO implement link to user profile and make image a link.
    return (
        <Grid
            container
            item
            padding={"15px"}
            columnGap={"30px"}
            rowGap={"10px"}
            style={{ border: "2px solid #DDC12C", borderRadius: "10px" }}
        >
            <Button style={{ padding: "0px" }}>
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
                    <Rating value={0} readOnly />
                </Grid>
                <Grid container item width={"150px"} alignItems={"center"}>
                    <Button variant="outlined" fullWidth>
                        ПРОФИЛЬ
                    </Button>
                </Grid>
            </Stack>
            <Grid container item width={"100%"} flexDirection={"column"} gap={"10px"}>
                <Grid container item width={"100%"} flexDirection={"column"}>
                    <Typography variant="h2" height={"38px"}>
                        Отличное качество обслуживания
                    </Typography>
                    <Typography variant="h3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sollicitudin tincidunt mauris,
                        id vestibulum nibh porttitor sed.
                    </Typography>
                    <Rating value={0} readOnly style={{ marginTop: "5px" }} />
                </Grid>
                <Grid container item width={"143px"}>
                    <Button fullWidth variant="contained" onClick={finishReport}>
                        ЗАВЕРШИТЬ
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Report;
