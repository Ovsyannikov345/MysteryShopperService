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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "../../images/logo-cropped2.png";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import ProfileIcon from "@mui/icons-material/Person";
import { OWN_PROFILE_ROUTE } from "../../router/consts";
import useAuthApi from "../../hooks/useAuthApi";
import SupportRequestModal from "../modals/SupportRequestModal";
import NotificationList from "../lists/NotificationMenu";
import { PersonOutline, SupportAgentOutlined } from "@mui/icons-material";

const Header = ({ actions }: { actions: { icon: ReactNode; label: string; onClick: () => void }[] }) => {
    const theme = useTheme();

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const navigate = useNavigate();

    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<Element | null>(null);

    const [actionsMenuAnchorEl, setActionsMenuAnchorEl] = useState<Element | null>(null);

    const [supportRequestModalOpen, setSupportRequestModalOpen] = useState(false);

    const { logout } = useAuthApi();

    const onLogout = async () => {
        await logout();
    };

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
                                    sx={{ display: isMediumScreen ? "flex" : "none" }}
                                >
                                    <MenuIcon fontSize={isSmallScreen ? "medium" : "large"} />
                                </IconButton>
                                <Button
                                    onClick={() => navigate("/")}
                                    sx={{
                                        p: 0,
                                        display: isMediumScreen ? "none" : "flex",
                                        minWidth: "auto",
                                    }}
                                >
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        style={{
                                            maxWidth: isMediumScreen ? "130px" : "200px",
                                            height: "auto",
                                            borderRadius: "10px",
                                        }}
                                    />
                                </Button>
                                <Grid container spacing={5} sx={{ display: isMediumScreen ? "none" : "flex" }}>
                                    {actions.map((action) => (
                                        <Button
                                            key={action.label}
                                            variant="text"
                                            color="secondary"
                                            style={{ fontSize: "18px", padding: "10px", borderRadius: "0px" }}
                                            startIcon={action.icon}
                                            sx={{ textTransform: "capitalize", borderBottom: "3px solid black" }}
                                            onClick={action.onClick}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid container gap={isSmallScreen ? "0px" : "10px"} alignItems={"center"}>
                                <NotificationList />
                                <Tooltip title="Поддержка">
                                    <IconButton color="secondary" onClick={() => setSupportRequestModalOpen(true)}>
                                        <SupportAgentOutlined fontSize={isSmallScreen ? "medium" : "large"} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Аккаунт">
                                    <IconButton
                                        color="secondary"
                                        onClick={(event) => {
                                            setProfileMenuAnchorEl(event.currentTarget);
                                        }}
                                    >
                                        <PersonOutline fontSize={isSmallScreen ? "medium" : "large"} />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </Box>
            <Menu
                id="profile-menu"
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
                    Мой профиль
                </MenuItem>
                <MenuItem key={2} sx={{ mr: "5px" }} onClick={onLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Выход
                </MenuItem>
            </Menu>
            <Menu
                id="actions-menu"
                anchorEl={actionsMenuAnchorEl}
                open={Boolean(actionsMenuAnchorEl)}
                onClose={() => setActionsMenuAnchorEl(null)}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
                anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
            >
                {actions.map((action) => (
                    <MenuItem key={action.label} onClick={action.onClick}>
                        <ListItemIcon sx={{ mr: "5px" }}>{action.icon}</ListItemIcon>
                        {action.label}
                    </MenuItem>
                ))}
            </Menu>

            <SupportRequestModal open={supportRequestModalOpen} onClose={() => setSupportRequestModalOpen(false)} />
        </>
    );
};

export default Header;
