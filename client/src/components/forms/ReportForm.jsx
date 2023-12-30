import React from "react";
import { Grid, TextField, Typography, Button, Rating } from "@mui/material";
import { useFormik } from "formik";
import { useTheme } from "@emotion/react";
import validateReportData from "../../utils/validateReportData";

const ReportForm = ({ submitHandler, errorHadler }) => {
    const theme = useTheme();

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            grade: null,
        },
        validate: validateReportData,
        onSubmit: (values) => {
            if (values.grade == null) {
                errorHadler("Введите оценку");
            }

            submitHandler({ ...values, grade: parseInt(values.grade) });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                Отправьте отчет
            </Typography>
            <Grid container item flexDirection={"column"} gap={"25px"} alignItems={"flex-start"}>
                <TextField
                    id="title"
                    name="title"
                    fullWidth
                    variant="standard"
                    label="Краткий отзыв"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && formik.errors.title !== undefined}
                    helperText={
                        formik.touched.title && formik.errors.title !== undefined ? formik.errors.title : ""
                    }
                    InputProps={{
                        style: { fontSize: "24px" },
                    }}
                    sx={{
                        "& .MuiInput-underline:before": {
                            borderBottomColor: theme.palette.primary.main,
                        },
                        "& .MuiInput-underline:after": {
                            borderBottomColor: theme.palette.primary.main,
                        },
                    }}
                />
                <TextField
                    id="description"
                    name="description"
                    fullWidth
                    variant="standard"
                    label="Описание"
                    multiline
                    maxRows={7}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && formik.errors.description !== undefined}
                    helperText={
                        formik.touched.description && formik.errors.description !== undefined
                            ? formik.errors.description
                            : ""
                    }
                    InputProps={{
                        style: { fontSize: "24px" },
                    }}
                    sx={{
                        "& .MuiInput-underline:before": {
                            borderBottomColor: theme.palette.primary.main,
                        },
                        "& .MuiInput-underline:after": {
                            borderBottomColor: theme.palette.primary.main,
                        },
                    }}
                />
                <Grid container flexDirection={"column"} gap={"31px"} alignItems={"flex-start"}>
                    <Typography variant="h3" height={"20px"} display={"flex"} alignItems={"center"}>
                        Оцените результат
                    </Typography>
                    <Rating
                        id="grade"
                        name="grade"
                        size="large"
                        value={parseInt(formik.values.grade)}
                        onChange={formik.handleChange}
                        sx={{
                            fontSize: "45px",
                        }}
                    />
                </Grid>
                <Button variant="contained" fullWidth type="submit">
                    Отправить отчет
                </Button>
            </Grid>
        </form>
    );
};

export default ReportForm;
