import React from "react";
import { Grid } from "@mui/material";
import CompanyHeader from './../../components/headers/CompanyHeader';

const CompanyProfilePage = () => {
    return (
        <Grid
            container
            width={"100%"}
            height={"100vh"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            bgcolor={"#E7E7E7"}
        >
            <CompanyHeader />
            <Grid
                container
                item
                flexDirection={"column"}
                alignItems={"center"}
                maxWidth={"1300px"}
                flexGrow={1}
                bgcolor={"#FFFFFF"}
            >
                <h1>This is company profile page</h1>
            </Grid>
        </Grid>
    );
};

export default CompanyProfilePage;
