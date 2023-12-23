import React from "react";
import { Button } from "@mui/material";

const CompanyProfilePage = () => {
    return (
        <>
            <h1>This is company profile with jwt {localStorage.getItem("jwt")}</h1>
            <Button
                onClick={() => {
                    localStorage.removeItem("jwt");
                    localStorage.removeItem("role");
                    window.location.reload();
                }}
            >
                CLEAR
            </Button>
        </>
    );
};

export default CompanyProfilePage;
