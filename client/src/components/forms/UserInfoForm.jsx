import { Grid, TextField, Typography, Button } from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import InputMask from "react-input-mask";
import validateUserData from "../../utils/validateUserData";
import { useTheme } from "@emotion/react";
import { registerUser } from "../../api/authApi.ts";
import { useNavigate } from "react-router-dom";

const UserInfoForm = ({ authData, errorHandler }) => {
    const theme = useTheme();

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            surname: "",
            name: "",
            patronymic: "",
            age: "",
            phone: "",
            city: "",
        },
        validate: validateUserData,
        onSubmit: (values) => {
            const userData = {
                ...authData,
                ...values,
            };

            registerUser(userData).then((response) => {
                if (!response) {
                    errorHandler("Сервис временно недоступен");
                    return;
                }

                if (response.status >= 300) {
                    errorHandler("Ошибка при создании пользователя. Код: " + response.status);
                    return;
                }

                navigate("/login");
            });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container alignItems={"center"} sx={{ width: { xs: "300px", md: "500px" } }}>
                <Grid
                    container
                    item
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    paddingLeft={"139px"}
                    paddingRight={"139px"}
                    pt={"28px"}
                    pb={"31px"}
                    boxShadow={14}
                    borderRadius={4}
                    sx={{
                        height: "600px",
                        width: "100%",
                        paddingLeft: { xs: "40px", md: "139px" },
                        paddingRight: { xs: "40px", md: "139px" },
                    }}
                >
                    <Typography variant="h5">Расскажите о себе</Typography>
                    <TextField
                        sx={{
                            "& .MuiInput-underline:before": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                        }}
                        id="surname"
                        name="surname"
                        fullWidth
                        variant="standard"
                        label="Фамилия"
                        value={formik.values.surname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.surname && formik.errors.surname !== undefined}
                        helperText={
                            formik.touched.surname && formik.errors.surname !== undefined
                                ? formik.errors.surname
                                : ""
                        }
                        required
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
                        id="name"
                        name="name"
                        fullWidth
                        variant="standard"
                        label="Имя"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name !== undefined}
                        helperText={
                            formik.touched.name && formik.errors.name !== undefined ? formik.errors.name : ""
                        }
                        required
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
                        id="patronymic"
                        name="patronymic"
                        fullWidth
                        variant="standard"
                        label="Отчество"
                        value={formik.values.patronymic}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.patronymic && formik.errors.patronymic !== undefined}
                        helperText={
                            formik.touched.patronymic && formik.errors.patronymic !== undefined
                                ? formik.errors.patronymic
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
                        id="age"
                        name="age"
                        fullWidth
                        variant="standard"
                        label="Возраст"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.age && formik.errors.age !== undefined}
                        helperText={
                            formik.touched.age && formik.errors.age !== undefined ? formik.errors.age : ""
                        }
                    ></TextField>
                    <InputMask
                        mask="+375(99)999-99-99"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        {() => (
                            <TextField
                                sx={{
                                    "& .MuiInput-underline:before": {
                                        borderBottomColor: theme.palette.primary.main,
                                    },
                                    "& .MuiInput-underline:after": {
                                        borderBottomColor: theme.palette.primary.main,
                                    },
                                }}
                                id="phone"
                                name="phone"
                                fullWidth
                                variant="standard"
                                label="Номер телефона"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.phone && formik.errors.phone !== undefined}
                                helperText={
                                    formik.touched.phone && formik.errors.phone !== undefined
                                        ? formik.errors.phone
                                        : ""
                                }
                                required
                            ></TextField>
                        )}
                    </InputMask>
                    <TextField
                        sx={{
                            "& .MuiInput-underline:before": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                        }}
                        id="city"
                        name="city"
                        fullWidth
                        variant="standard"
                        label="Город"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.city && formik.errors.city !== undefined}
                        helperText={
                            formik.touched.city && formik.errors.city !== undefined ? formik.errors.city : ""
                        }
                    ></TextField>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        type="submit"
                        style={{ textTransform: "uppercase" }}
                    >
                        Зарегистрироваться
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default UserInfoForm;
