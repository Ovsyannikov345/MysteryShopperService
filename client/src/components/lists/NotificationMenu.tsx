import React, { useEffect, useMemo, useState } from "react";
import {
    ListItemText,
    Typography,
    Skeleton,
    MenuItem,
    Tooltip,
    IconButton,
    Badge,
    Menu,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import useNotificationApi, { Notification } from "../../hooks/useNotificationApi";
import { useNotifications } from "@toolpad/core";
import moment from "moment";
import PulseDot from "react-pulse-dot";
import { NotificationsOutlined } from "@mui/icons-material";

const NotificationMenu = () => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const notifications = useNotifications();

    const { getNotifications, readNotification } = useNotificationApi();

    const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<Element | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [notificationList, setNotificationList] = useState<Notification[]>([]);

    const unreadCount = useMemo(() => notificationList.filter((n) => !n.isRead).length, [notificationList]);

    useEffect(() => {
        const loadNotifications = async () => {
            setIsLoading(true);

            const response = await getNotifications();

            setIsLoading(false);

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            setNotificationList(response);
        };

        loadNotifications();
    }, [getNotifications, notifications]);

    const readSelectedNotification = async (id: string) => {
        const selectedNotification = notificationList.find((n) => n.id === id);

        if (!selectedNotification || selectedNotification.isRead) {
            return;
        }

        const response = await readNotification(id);

        if (response && "error" in response) {
            return;
        }

        const updatedNotifications = notificationList.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
        );

        setNotificationList(updatedNotifications);
    };

    return (
        <>
            <Tooltip title="Уведомления">
                <IconButton
                    color="secondary"
                    onClick={(event) => {
                        setNotificationsAnchorEl(event.currentTarget);
                    }}
                >
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsOutlined fontSize={isSmallScreen ? "medium" : "large"} />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                id="notifications-menu"
                anchorEl={notificationsAnchorEl}
                open={Boolean(notificationsAnchorEl)}
                onClose={() => setNotificationsAnchorEl(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        sx: {
                            "&::-webkit-scrollbar": {
                                width: "6px",
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "transparent",
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#aaa",
                                borderRadius: "4px",
                            },
                            scrollbarWidth: "thin", // For Firefox
                            scrollbarColor: "#aaa transparent", // For Firefox
                        },
                    },
                }}
            >
                {isLoading ? (
                    [1, 2, 3].map((index) => (
                        <MenuItem key={index} sx={{ paddingTop: 0, width: "280px" }}>
                            <Skeleton
                                width="100%"
                                height={"60px"}
                                variant="rectangular"
                                animation="wave"
                                sx={{ borderRadius: 2 }}
                            ></Skeleton>
                        </MenuItem>
                    ))
                ) : notificationList.length > 0 ? (
                    <>
                        {notificationList.map((notification) => (
                            <MenuItem
                                key={notification.id}
                                sx={{ width: "280px", "&:hover": { backgroundColor: "primary.light" } }}
                                onClick={() => readSelectedNotification(notification.id)}
                                onMouseEnter={() => readSelectedNotification(notification.id)}
                            >
                                <ListItemText
                                    primary={<Typography sx={{ textWrap: "balance" }}>{notification.text}</Typography>}
                                    secondary={
                                        <>
                                            {!notification.isRead && <PulseDot color="#e3bf00" style={{ marginLeft: "-6px" }} />}
                                            <Typography component="span" variant="body2" color="text.secondary">
                                                {moment(notification.createdAt).calendar()}
                                            </Typography>
                                        </>
                                    }
                                />
                            </MenuItem>
                        ))}
                    </>
                ) : (
                    <Typography
                        variant="body1"
                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                        height={"50px"}
                        width={"280px"}
                    >
                        Нет уведомлений
                    </Typography>
                )}
            </Menu>
        </>
    );
};

export default NotificationMenu;
