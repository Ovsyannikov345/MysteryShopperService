import React, { useState } from "react";
import { IconButton, Stack, Snackbar, Alert } from "@mui/material";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import SupportIcon from "@mui/icons-material/SupportAgentOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import SupportRequestModal from "../modals/SupportRequestModal";

const HeaderIcons = () => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [requestModalOpen, setRequestModalOpen] = useState(false);

    const navigate = useNavigate();

    const displayError = (message) => {
        setErrorMessage(message);
        setError(true);
    };

    const displaySuccess = (message) => {
        setSuccessMessage(message);
        setSuccess(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false);
        setSuccess(false);
    };

    return (
        <>
            <SupportRequestModal
                isOpen={requestModalOpen}
                acceptHandler={() => {
                    setRequestModalOpen(false);
                    displaySuccess("Ваш запрос отправлен");
                }}
                declineHandler={() => setRequestModalOpen(false)}
                errorHandler={displayError}
            />
            <Stack direction={"row"} gap={"40px"}>
                <IconButton onClick={(e) => navigate("/profile")} style={{ padding: 0, color: "#000000" }}>
                    <AccountIcon sx={{ fontSize: 60 }} />
                </IconButton>
                <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => setRequestModalOpen(true)}>
                    <SupportIcon sx={{ fontSize: 60 }} />
                </IconButton>
                <IconButton
                    onClick={(e) => {
                        localStorage.removeItem("jwt");
                        localStorage.removeItem("role");
                        window.location.reload();
                    }}
                    style={{ padding: 0, color: "#000000" }}
                >
                    <LogoutIcon sx={{ fontSize: 60 }} />
                </IconButton>
            </Stack>
            <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={success} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="success" sx={{ width: "100%" }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default HeaderIcons;
