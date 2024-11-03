import React, { ReactElement } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Typography, Button, Grid } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AirlineStopsIcon from "@mui/icons-material/AirlineStops";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Notification {
    id: string;
    type: string;
    title: string;
    description: string;
    icon: ReactElement | undefined;
}

interface NotificationListProps {
    notifications: Notification[];
}

const NotificationList = ({ notifications }: NotificationListProps) => {
    notifications.forEach((notification) => {
        switch (notification.type) {
            case "newRequest":
                notification.icon = <PersonAddIcon />;
                break;
            case "newReport":
                notification.icon = <PostAddIcon />;
                break;
            case "requestAccepted":
            case "reportAccepted":
                notification.icon = <CheckCircleIcon />;
                break;
            case "requestRejected":
                notification.icon = <AirlineStopsIcon />;
                break;
            default:
                notification.icon = <CheckCircleIcon />;
                break;
        }
    });

    return (
        <List sx={{ minWidth: "100%" }}>
            {notifications.length > 0 &&
                notifications.map((notification) => (
                    <ListItem key={notification.id} alignItems="center">
                        <ListItemIcon sx={{ minWidth: "30px", alignSelf: "flex-start", mt: "8px" }}>
                            {notification.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={notification.title}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2" color="text.primary">
                                        {notification.description}
                                    </Typography>
                                </>
                            }
                        />
                        <Grid item ml={"10px"}>
                            <Button variant="contained" size="small">
                                Подробнее
                            </Button>
                        </Grid>
                    </ListItem>
                ))}
            {!notifications.length && (
                <Typography variant="h6" textAlign={"center"}>
                    Нет уведомлений
                </Typography>
            )}
        </List>
    );
};

export default NotificationList;
