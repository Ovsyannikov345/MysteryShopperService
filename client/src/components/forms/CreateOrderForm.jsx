import React from "react";
import { Grid, TextField, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import validateOrderData from "../../utils/validateOrderData";

const CreateOrderForm = ({ submitHandler }) => {
    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            place: "",
            completionTime: "",
            price: "",
        },
        validate: validateOrderData,
        onSubmit: (values) => {
            submitHandler(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container item maxWidth={"500px"} width={"500px"} gap={"15px"} mt={"50px"}>
                <Grid container item height={"69px"} justifyContent={"center"} alignItems={"center"}>
                    <Typography variant="h2" textAlign={"center"}>
                        Создание заказа
                    </Typography>
                </Grid>
                <TextField
                    id="title"
                    name="title"
                    fullWidth
                    variant="outlined"
                    label="Название"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && formik.errors.title !== undefined}
                    helperText={
                        formik.touched.title && formik.errors.title !== undefined ? formik.errors.title : ""
                    }
                    required
                />
                <TextField
                    id="description"
                    name="description"
                    fullWidth
                    variant="outlined"
                    label="Описание"
                    multiline
                    minRows={2}
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
                />
                <TextField
                    id="place"
                    name="place"
                    fullWidth
                    variant="outlined"
                    label="Место заказа"
                    value={formik.values.place}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.place && formik.errors.place !== undefined}
                    helperText={
                        formik.touched.place && formik.errors.place !== undefined ? formik.errors.place : ""
                    }
                    required
                />
                <Grid container item columnGap={"20px"} rowGap={"15px"}>
                    <Grid container item width={"200px"}>
                        <TextField
                            id="completionTime"
                            name="completionTime"
                            variant="outlined"
                            label="Дней на выполнение"
                            value={formik.values.completionTime}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.completionTime && formik.errors.completionTime !== undefined}
                            helperText={
                                formik.touched.completionTime && formik.errors.completionTime !== undefined
                                    ? formik.errors.completionTime
                                    : ""
                            }
                        />
                    </Grid>
                    <Grid container item width={"200px"}>
                        <TextField
                            id="price"
                            name="price"
                            fullWidth
                            variant="outlined"
                            label="Стоимость"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.price && formik.errors.price !== undefined}
                            helperText={
                                formik.touched.price && formik.errors.price !== undefined
                                    ? formik.errors.price
                                    : ""
                            }
                        />
                    </Grid>
                </Grid>
                <Typography variant="h3" color={"error"}>
                    После создания заказ изменить невозможно!
                </Typography>
                <Button type="submit" variant="contained" fullWidth>
                    СОЗДАТЬ
                </Button>
            </Grid>
        </form>
    );
};

export default CreateOrderForm;
