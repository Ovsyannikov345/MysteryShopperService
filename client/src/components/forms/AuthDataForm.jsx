import { Grid, TextField, Typography, Button, FormControlLabel, Checkbox } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import validateRegistrationData from "../../utils/validateRegistrationData";
import { useTheme } from "@emotion/react";
import { checkEmail } from "../../api/authApi";

const AuthDataForm = ({ nextStepHandler, errorHandler }) => {
    const theme = useTheme();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            passwordRepeat: "",
        },
        validate: validateRegistrationData,
        onSubmit: (values) => {
            checkEmail(formik.values.email).then((response) => {
                if (!response) {
                    errorHandler("Сервис временно недоступен");
                    return;
                }

                if (response.status >= 300) {
                    errorHandler("Ошибка при проверке почты. Попробуйте позже");
                    return;
                }

                if (!response.data.available) {
                    formik.errors.email = "Почта уже используется";
                    errorHandler("Почта уже используется");
                    return;
                }

                nextStepHandler(values, isCompany);
            });
        },
    });

    const [isCompany, setIsCompany] = useState(false);

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container alignItems={"center"} sx={{ width: { xs: "300px", md: "498px" } }}>
                <Grid
                    container
                    item
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    pt={"28px"}
                    pb={"30px"}
                    boxShadow={14}
                    borderRadius={4}
                    sx={{
                        height: "481px",
                        width: "100%",
                        paddingLeft: { xs: "40px", md: "139px" },
                        paddingRight: { xs: "40px", md: "139px" },
                    }}
                >
                    <Typography variant="h5">Регистрация</Typography>
                    <TextField
                        sx={{
                            "& .MuiInput-underline:before": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                        }}
                        id="email"
                        name="email"
                        fullWidth
                        variant="standard"
                        label="Эл. почта"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && formik.errors.email !== undefined}
                        helperText={
                            formik.touched.email && formik.errors.email !== undefined ? formik.errors.email : ""
                        }
                    ></TextField>
                    <TextField
                        sx={{
                            "& .MuiInput-underline:before": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                        }}
                        id="password"
                        name="password"
                        fullWidth
                        variant="standard"
                        type="password"
                        label="Пароль"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && formik.errors.password !== undefined}
                        helperText={
                            formik.touched.password && formik.errors.password !== undefined
                                ? formik.errors.password
                                : ""
                        }
                    ></TextField>
                    <TextField
                        sx={{
                            "& .MuiInput-underline:before": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                        }}
                        id="passwordRepeat"
                        name="passwordRepeat"
                        fullWidth
                        variant="standard"
                        type="password"
                        label="Повторите пароль"
                        value={formik.values.passwordRepeat}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.passwordRepeat && formik.errors.passwordRepeat !== undefined}
                        helperText={
                            formik.touched.passwordRepeat && formik.errors.passwordRepeat !== undefined
                                ? formik.errors.passwordRepeat
                                : ""
                        }
                    ></TextField>
                    <Grid container item>
                        <FormControlLabel
                            control={
                                <Checkbox checked={isCompany} onChange={(e) => setIsCompany(e.target.checked)} />
                            }
                            label="Я организация"
                        />
                        <Link to={"/login"} style={{ color: "#DDC12C", textDecoration: "none" }}>
                            У меня уже есть учетная запись
                        </Link>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Далее
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default AuthDataForm;
