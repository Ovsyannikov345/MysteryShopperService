import React from "react";
import { Grid, Typography, Rating, Avatar, Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    name: string;
    surname: string;
}

interface CompanyReviewData {
    id: string;
    text: string;
    grade: number;
    user: User;
}

interface CompanyReviewProps {
    companyReview: CompanyReviewData;
}

const CompanyReview = ({ companyReview }: CompanyReviewProps) => {
    const navigate = useNavigate();

    return (
        <Grid container item padding={"15px"} gap={"8px"} style={{ border: "2px solid #DDC12C", borderRadius: "10px" }}>
            <Button style={{ padding: 0 }} onClick={() => navigate(`/user/${companyReview.user.id}`)}>
                <Avatar
                    src={`http://localhost:5000/api/users/${companyReview.user.id}/avatar?jwt=${localStorage.getItem("accessToken")}`}
                    variant="square"
                    sx={{ width: 60, height: 60 }}
                />
            </Button>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                flexGrow={1}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
            >
                <Typography
                    variant="h2"
                    height={"35px"}
                    style={{ borderBottom: "2px solid #DDC12C" }}
                    sx={{ fontSize: { xs: "20px", md: "24px" } }}
                >
                    {companyReview.user.surname + " " + companyReview.user.name}
                </Typography>
                <Rating name="read-only" value={companyReview.grade} readOnly />
            </Stack>
            <Typography variant="h3" pl={"67px"} width={"100%"} sx={{ paddingLeft: { xs: "0", md: "67px" } }}>
                {companyReview.text}
            </Typography>
        </Grid>
    );
};

export default CompanyReview;
