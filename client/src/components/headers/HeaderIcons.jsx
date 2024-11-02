import React, { useState } from "react";
import { IconButton, Stack, Snackbar, Alert, Menu } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import SupportIcon from "@mui/icons-material/SupportAgentOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import SupportRequestModal from "../modals/SupportRequestModal";
import NotificationList from "../modals/NotificationsModal/NotificationList";

const HeaderIcons = () => {
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [requestModalOpen, setRequestModalOpen] = useState(false);

    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

    const navigate = useNavigate();

    const handleMenuOpen = (event) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setNotificationAnchorEl(null);
    };

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
            <Stack direction={"row"} sx={{ gap: { xs: "20px", lg: "40px" } }}>
                <IconButton style={{ padding: 0, color: "#000000" }} onClick={handleMenuOpen}>
                    <NotificationsIcon sx={{ fontSize: { xs: 30, md: 40, lg: 60 } }} />
                </IconButton>
                <IconButton onClick={(e) => navigate("/profile")} style={{ padding: 0, color: "#000000" }}>
                    <AccountIcon sx={{ fontSize: { xs: 30, md: 40, lg: 60 } }} />
                </IconButton>
                <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => setRequestModalOpen(true)}>
                    <SupportIcon sx={{ fontSize: { xs: 30, md: 40, lg: 60 } }} />
                </IconButton>
                <IconButton
                    onClick={(e) => {
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("role");
                        window.location.reload();
                    }}
                    style={{ padding: 0, color: "#000000" }}
                >
                    <LogoutIcon sx={{ fontSize: { xs: 30, md: 40, lg: 60 } }} />
                </IconButton>
            </Stack>
            <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        PaperProps={{
                            style: {
                                width: 450,
                            },
                        }}
                    >
                        <NotificationList notifications={[
                            {
                                id: 1,
                                type: "requestAccepted",
                                title: "Заявка приянта",
                                description: "Вы можете приступать к выполнению заказа"
                            },
                            {
                                id: 2,
                                type: "requestRejected",
                                title: "Заявка отклонена",
                                description: "Но вы все еще можете найти другой заказ"
                            },
                            {
                                id: 3,
                                type: "reportAccepted",
                                title: "Отчет принят",
                                description: "Заказчик приянл отчет. Не забудьте оценить заказ!"
                            },
                        ]} />
                    </Menu>
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
