import React from "react";
import { Grid, Typography, Rating, Avatar, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CompanyReview = ({ companyReview }) => {
    const navigate = useNavigate();

    return (
        <Grid
            container
            item
            padding={"15px"}
            gap={"8px"}
            style={{ border: "2px solid #DDC12C", borderRadius: "10px" }}
        >
            <Button style={{padding: 0}} onClick={() => navigate(`/user/${companyReview.User.id}`)}>
                <Avatar
                    src={
                        companyReview.User.id !== undefined
                            ? `http://localhost:5000/api/users/${
                                  companyReview.User.id
                              }/avatar?jwt=${localStorage.getItem("jwt")}`
                            : ""
                    }
                    variant="square"
                    sx={{ width: 60, height: 60 }}
                />
            </Button>
            <Stack direction={"row"} justifyContent={"space-between"} flexGrow={1}>
                <Typography variant="h2" height={"35px"} style={{ borderBottom: "2px solid #DDC12C" }}>
                    {companyReview.User.surname + " " + companyReview.User.name}
                </Typography>
                <Rating name="read-only" value={companyReview.grade} readOnly />
            </Stack>
            <Typography variant="h3" pl={"67px"} width={"100%"}>
                {companyReview.text}
            </Typography>
        </Grid>
    );
};

export default CompanyReview;
