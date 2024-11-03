import { Grid, TextField, Typography, Button } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api/authApi";
import PublicHeader from "../components/headers/PublicHeader";
import { useTheme } from "@mui/material/styles";
import { useNotifications } from "@toolpad/core/useNotifications";
import isApiError from "../utils/isApiError";
import { Roles } from "../api/enums";

const LoginPage = () => {
    const notifications = useNotifications();

    const theme = useTheme();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const submit = async () => {
        let response = await login(loginData);

        if (isApiError(response)) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
        } else {
            localStorage.setItem("role", response.role === Roles.User ? "user" : "company");
            localStorage.setItem("accessToken", response.accessToken);
            window.location.reload();
        }
    };

    return (
        <Grid container width={"100%"} height={"100%"}>
            <PublicHeader />
            <Grid container flexDirection={"column"} alignItems={"center"}>
                <Grid container alignItems={"center"} sx={{ width: { xs: "300px", md: "498px" } }}>
                    <Grid
                        container
                        item
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        pt={"28px"}
                        pb={"83px"}
                        boxShadow={14}
                        borderRadius={4}
                        gap={4}
                        sx={{
                            height: "400px",
                            width: "100%",
                            paddingLeft: { xs: "40px", md: "139px" },
                            paddingRight: { xs: "40px", md: "139px" },
                        }}
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
        </Grid>
    );
};

export default LoginPage;
