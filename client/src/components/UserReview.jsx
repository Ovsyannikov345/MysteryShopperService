import React from "react";
import { Grid, Typography, Rating, Avatar, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UserReview = ({ userReview }) => {
    const navigate = useNavigate();

    return (
        <Grid
            container
            item
            padding={"15px"}
            gap={"8px"}
            style={{ border: "2px solid #DDC12C", borderRadius: "10px" }}
        >
            <Button style={{ padding: 0 }} onClick={() => navigate(`/company/${userReview.Company.id}`)}>
                <Avatar
                    src={
                        userReview.Company.id !== undefined
                            ? `http://localhost:5000/api/companies/${
                                  userReview.Company.id
                              }/avatar?jwt=${localStorage.getItem("jwt")}`
                            : ""
                    }
                    variant="square"
                    sx={{ width: 60, height: 60 }}
                />
            </Button>
            <Stack direction={"row"} justifyContent={"space-between"} flexGrow={1}>
                <Typography variant="h2" height={"35px"} style={{ borderBottom: "2px solid #DDC12C" }}>
                    {userReview.Company.name}
                </Typography>
                <Rating name="read-only" value={userReview.grade} readOnly />
            </Stack>
            <Typography variant="h3" pl={"67px"} width={"100%"}>
                {userReview.text}
            </Typography>
        </Grid>
    );
};

export default UserReview;
