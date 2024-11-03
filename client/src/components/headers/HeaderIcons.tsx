import React, { useState } from "react";
import { IconButton, Stack, Menu } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountIcon from "@mui/icons-material/AccountCircleOutlined";
import SupportIcon from "@mui/icons-material/SupportAgentOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import SupportRequestModal from "../modals/SupportRequestModal";
import NotificationList from "../modals/NotificationsModal/NotificationList";
import { useNotifications } from "@toolpad/core/useNotifications";

const HeaderIcons = () => {
    const [requestModalOpen, setRequestModalOpen] = useState(false);

    const [notificationAnchorEl, setNotificationAnchorEl] = useState<Element | null>(null);

    const navigate = useNavigate();

    const notifications = useNotifications();

    const handleMenuOpen = (event: any) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setNotificationAnchorEl(null);
    };

    const displayError = (message: string) => {
        notifications.show(message, { severity: "error", autoHideDuration: 3000 });
    };

    const displaySuccess = (message: string) => {
        notifications.show(message, { severity: "success", autoHideDuration: 3000 });
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
                <IconButton style={{ padding: 0, color: "#000000" }} onClick={(e) => handleMenuOpen(e)}>
                    <NotificationsIcon sx={{ fontSize: { xs: 30, md: 40, lg: 60 } }} />
                </IconButton>
                <IconButton style={{ padding: 0, color: "#000000" }} onClick={(e) => navigate("/profile")}>
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
                <NotificationList notifications={[]} />
            </Menu>
        </>
    );
};

export default HeaderIcons;
