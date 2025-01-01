import React, { useState } from "react";
import { Container, Grid2, TextField, Typography, Button, CircularProgress } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { useNotifications } from "@toolpad/core/useNotifications";
import { login } from "../api/authApi";
import isApiError from "../utils/isApiError";
import { Roles } from "../api/enums";
import backgroundImage from "../images/background.jpg";
import logo from "../images/logo-cropped.png";

const LoginPage = () => {
    const notifications = useNotifications();

    const theme = useTheme();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        setLoading(true);

        let response = await login(loginData);

        setLoading(false);

        if (isApiError(response)) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
        } else {
            localStorage.setItem("role", response.role === Roles.User ? "user" : "company");
            localStorage.setItem("accessToken", response.accessToken);
            window.location.reload();
        }
    };

    return (
        <Grid2
            container
            direction="column"
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backdropFilter: "blur(8px)",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Grid2
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        padding: 4,
                        boxShadow: 4,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        backdropFilter: "blur(16px)",
                        opacity: 0.95,
                    }}
                >
                    <img src={logo} alt="logo" style={{ width: "150px" }} />

                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Эл. почта"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        sx={{ mb: 2, mt: 2 }}
                    />

                    <TextField
                        fullWidth
                        variant="outlined"
                        type="password"
                        label="Пароль"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        sx={{ mb: 2 }}
                    />

                    {loading ? (
                        <CircularProgress sx={{ mt: 2 }}></CircularProgress>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={submit}
                                sx={{ height: 48, borderRadius: 2, mb: 1 }}
                            >
                                Войти
                            </Button>
                            <Typography sx={{ mb: 1 }}>или</Typography>
                            <Button
                                variant="outlined"
                                color="inherit"
                                fullWidth
                                onClick={() => navigate("/register")}
                                sx={{ height: 48, borderRadius: 2 }}
                            >
                                Регистрация
                            </Button>
                        </>
                    )}
                </Grid2>
            </Container>
        </Grid2>
    );
};

export default LoginPage;
