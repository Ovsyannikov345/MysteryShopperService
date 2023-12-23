import { Grid, TextField, Typography, Button, Alert, Snackbar } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api/authApi";
import PublicHeader from "../components/headers/PublicHeader";
import { useTheme } from "@emotion/react";

const LoginPage = () => {
    const theme = useTheme();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false);
    };

    const submit = async () => {
        const response = await login(loginData);

        if (!response) {
            setErrorMessage("Сервис временно недоступен");
            setError(true);
            return;
        }

        if (response.status === 500) {
            setErrorMessage("Повторите попытку позже");
            setError(true);
            return;
        }

        if (response.status >= 300) {
            setErrorMessage("Неверные данные аккаунта");
            setError(true);
            return;
        }

        localStorage.setItem("role", response.data.role);
        localStorage.setItem("jwt", response.data.token);
        window.location.reload();
    };

    return (
        <Grid container width={"100%"} height={"100%"}>
            <PublicHeader />
            <Grid container flexDirection={"column"} alignItems={"center"}>
                <Grid container width={498} alignItems={"center"}>
                    <Grid
                        container
                        item
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        paddingLeft={"139px"}
                        paddingRight={"139px"}
                        pt={"28px"}
                        pb={"83px"}
                        boxShadow={14}
                        borderRadius={4}
                        gap={4}
                        style={{ height: "400px", width: "100%" }}
                    >
                        <Typography variant="h5">Вход</Typography>
                        <TextField
                        sx={{
                            "& .MuiInput-underline:before": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                        }}
                            fullWidth
                            variant="standard"
                            label="Эл. почта"
                            type="email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        ></TextField>
                        <Grid item>
                            <TextField
                            sx={{
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: theme.palette.primary.main,
                                },
                            }}
                                fullWidth
                                variant="standard"
                                type="password"
                                label="Пароль"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            ></TextField>
                            <Link to={"/register"} style={{ color: "#DDC12C", textDecoration: "none" }}>
                                Зарегистрироваться
                            </Link>
                        </Grid>
                        <Button variant="contained" color="primary" fullWidth onClick={submit}>
                            Войти
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default LoginPage;
