import React, { ReactNode, useState } from "react";
import {
    Grid2 as Grid,
    useMediaQuery,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    AppBar,
    Toolbar,
    Box,
    Tooltip,
    IconButton,
    Avatar,
    Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../../images/logo-cropped2.png";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ProfileIcon from "@mui/icons-material/Person";
import { OWN_PROFILE_ROUTE } from "../../router/consts";
import useAuthApi from "../../hooks/useAuthApi";

const Header = ({ actions }: { actions: { icon: ReactNode; label: string; onClick: () => void }[] }) => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const navigate = useNavigate();

    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<Element | null>(null);

    const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState<Element | null>(null);

    const { logout } = useAuthApi();

    const onLogout = async () => {
        await logout();
    };

    // TODO fix navigation options display on medium screens.

    return (
        <>
            <Box id="header">
                <AppBar position="static">
                    <Toolbar style={{ justifyContent: "space-between" }}>
                        <Grid container mt={"5px"} mb={"5px"}>
                            <Grid container gap={"60px"} alignItems={"center"}>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={(event) => {
                                        setActionsMenuAnchorEl(event.currentTarget);
                                    }}
                                    sx={{ display: isSmallScreen ? "flex" : "none" }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <img
                                    src={logo}
                                    alt="Logo"
                                    style={{
                                        maxWidth: isSmallScreen ? "130px" : "200px",
                                        height: "auto",
                                        cursor: "pointer",
                                        borderRadius: "10px",
                                        display: isSmallScreen ? "none" : "flex",
                                    }}
                                    onClick={() => navigate("/")}
                                />
                                <Grid container spacing={5} sx={{ display: isMediumScreen ? "none" : "flex" }}>
                                    {actions.map((action) => (
                                        <Paper
                                            key={action.label}
                                            elevation={6}
                                            sx={{ borderRadius: "10px", bgcolor: theme.palette.primary.light }}
                                        >
                                            <Button
                                                variant="text"
                                                color="secondary"
                                                style={{ fontSize: "18px", padding: "10px", borderRadius: "10px" }}
                                                startIcon={action.icon}
                                                sx={{ textTransform: "capitalize" }}
                                                onClick={action.onClick}
                                            >
                                                {action.label}
                                            </Button>
                                        </Paper>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid container gap={isSmallScreen ? "0px" : "10px"} alignItems={"center"}>
                                {/* TODO implement */}
                                <Tooltip title="Notifications">
                                    <IconButton color="secondary">
                                        <NotificationsRoundedIcon fontSize={isSmallScreen ? "medium" : "large"} />
                                    </IconButton>
                                </Tooltip>
                                {/* TODO implement */}
                                <Tooltip title="Support">
                                    <IconButton color="secondary">
                                        <SupportAgentRoundedIcon fontSize={isSmallScreen ? "medium" : "large"} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Account">
                                    <IconButton
                                        onClick={(event) => {
                                            setProfileMenuAnchorEl(event.currentTarget);
                                        }}
                                    >
                                        <Avatar sx={{ width: { xs: 30, sm: 50 }, height: { xs: 30, sm: 50 } }} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
            <Menu
                id="menu"
                anchorEl={profileMenuAnchorEl}
                open={Boolean(profileMenuAnchorEl)}
                onClose={() => setProfileMenuAnchorEl(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem key={1} onClick={() => navigate(OWN_PROFILE_ROUTE)}>
                    <ListItemIcon sx={{ mr: "5px" }}>
                        <ProfileIcon fontSize="small" />
                    </ListItemIcon>
                    My profile
                </MenuItem>
                <MenuItem key={2} sx={{ mr: "5px" }} onClick={onLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
            <Menu
                id="menu"
                anchorEl={actionsMenuAnchorEl}
                open={Boolean(actionsMenuAnchorEl)}
                onClose={() => setActionsMenuAnchorEl(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                {actions.map((action) => (
                    <MenuItem key={action.label} onClick={action.onClick}>
                        <ListItemIcon sx={{ mr: "5px" }}>{action.icon}</ListItemIcon>
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default Header;
