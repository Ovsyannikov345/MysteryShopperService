import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";

interface NavigateBackProps {
    to: any;
    label: string;
}

const NavigateBack = ({ to, label }: NavigateBackProps) => {
    const navigate = useNavigate();

    return (
        <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate(to)}>
            {label}
        </Button>
    );
};

export default NavigateBack;
