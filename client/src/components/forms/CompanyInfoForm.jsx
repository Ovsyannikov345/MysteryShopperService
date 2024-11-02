import { Grid, TextField, Typography, Button } from "@mui/material";
import React from "react";
import { useFormik } from "formik";
import InputMask from "react-input-mask";
import validateCompanyData from "../../utils/validateCompanyData";
import { useTheme } from "@emotion/react";
import { registerCompany } from "../../api/authApi.ts";
import { useNavigate } from "react-router-dom";

const CompanyInfoForm = ({ authData, errorHandler }) => {
    const theme = useTheme();

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: "",
            contactSurname: "",
            contactName: "",
            contactPatronymic: "",
            contactEmail: "",
            contactPhone: "",
        },
        validate: validateCompanyData,
        onSubmit: (values) => {
            const companyData = {
                name: values.name,
                ...authData,
                contactPersonInfo: {
                    name: values.contactName,
                    surname: values.contactSurname,
                    patronymic: values.contactPatronymic,
                    phone: values.contactPhone,
                    email: values.contactEmail,
                },
            };

            registerCompany(companyData).then((response) => {
                if (!response) {
                    errorHandler("Сервис временно недоступен");
                    return;
                }

                if (response.status >= 300) {
                    errorHandler("Ошибка при создании компании. Код: " + response.status);
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
                    pt={"28px"}
                    pb={"31px"}
                    boxShadow={14}
                    borderRadius={4}
                    sx={{
                        height: "580px",
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
                        id="name"
                        name="name"
                        fullWidth
                        variant="standard"
                        label="Название компании"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && formik.errors.name !== undefined}
                        helperText={
                            formik.touched.name && formik.errors.name !== undefined ? formik.errors.name : ""
                        }
                        required
                    ></TextField>
                    <Typography style={{ width: "100%" }}>Данные контактного лица</Typography>
                    <TextField
                        sx={{
                            "& .MuiInput-underline:before": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                            "& .MuiInput-underline:after": {
                                borderBottomColor: theme.palette.primary.main,
                            },
                        }}
                        id="contactSurname"
                        name="contactSurname"
                        fullWidth
                        variant="standard"
                        label="Фамилия"
                        value={formik.values.contactSurname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contactSurname && formik.errors.contactSurname !== undefined}
                        helperText={
                            formik.touched.contactSurname && formik.errors.contactSurname !== undefined
                                ? formik.errors.contactSurname
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
                        id="contactName"
                        name="contactName"
                        fullWidth
                        variant="standard"
                        label="Имя"
                        value={formik.values.contactName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contactName && formik.errors.contactName !== undefined}
                        helperText={
                            formik.touched.contactName && formik.errors.contactName !== undefined
                                ? formik.errors.contactName
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
                        id="contactPatronymic"
                        name="contactPatronymic"
                        fullWidth
                        variant="standard"
                        label="Отчество"
                        value={formik.values.contactPatronymic}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contactPatronymic && formik.errors.contactPatronymic !== undefined}
                        helperText={
                            formik.touched.contactPatronymic && formik.errors.contactPatronymic !== undefined
                                ? formik.errors.contactPatronymic
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
                        id="contactEmail"
                        name="contactEmail"
                        fullWidth
                        variant="standard"
                        label="Эл. почта"
                        value={formik.values.contactEmail}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.contactEmail && formik.errors.contactEmail !== undefined}
                        helperText={
                            formik.touched.contactEmail && formik.errors.contactEmail !== undefined
                                ? formik.errors.contactEmail
                                : ""
                        }
                        required
                    ></TextField>
                    <InputMask
                        mask="+375(99)999-99-99"
                        value={formik.values.contactPhone}
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
                                id="contactPhone"
                                name="contactPhone"
                                fullWidth
                                variant="standard"
                                label="Номер телефона"
                                value={formik.values.contactPhone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.contactPhone && formik.errors.contactPhone !== undefined}
                                helperText={
                                    formik.touched.contactPhone && formik.errors.contactPhone !== undefined
                                        ? formik.errors.contactPhone
                                        : ""
                                }
                                required
                            ></TextField>
                        )}
                    </InputMask>
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

export default CompanyInfoForm;
