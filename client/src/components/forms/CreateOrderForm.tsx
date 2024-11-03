import React from "react";
import { Grid, TextField, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import validateOrderData from "../../utils/validateOrderData";
import OrderCreationMap from "../maps/OrderCreationMap";
import { LatLng } from "leaflet";
import { OrderToCreate } from "../../api/ordersApi";

const CreateOrderForm = ({ submitHandler }: { submitHandler: Function }) => {
    const formik = useFormik<OrderToCreate>({
        initialValues: {
            title: "",
            description: "",
            place: "",
            timeToComplete: null,
            price: null,
            lat: null,
            lng: null,
        },
        validate: validateOrderData,
        onSubmit: (values) => {
            submitHandler(values);
        },
    });

    const setNewLocation = (newLocation: LatLng, address: any) => {
        const addressString = [address.city, address.state, address.road, address.house_number].join(", ");

        formik.setFieldValue("place", addressString);
        formik.setFieldValue("lat", newLocation.lat);
        formik.setFieldValue("lng", newLocation.lng);
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            <Grid container item gap={"15px"} mt={"20px"} sx={{ width: { xs: "310px", md: "700px" } }}>
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
                    helperText={formik.touched.title && formik.errors.title !== undefined ? formik.errors.title : ""}
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
                        formik.touched.description && formik.errors.description !== undefined ? formik.errors.description : ""
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
                    helperText={formik.touched.place && formik.errors.place !== undefined ? formik.errors.place : ""}
                    required
                />
                <OrderCreationMap onLocationChange={setNewLocation} />
                <Grid container item columnGap={"20px"} rowGap={"15px"}>
                    <Grid container item width={"200px"}>
                        <TextField
                            id="completionTime"
                            name="completionTime"
                            variant="outlined"
                            label="Дней на выполнение"
                            value={formik.values.timeToComplete}
                            onChange={e => formik.setFieldValue("timeToComplete", `${parseInt(e.target.value) * 24}:00:00`)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.timeToComplete && formik.errors.timeToComplete !== undefined}
                            helperText={
                                formik.touched.timeToComplete && formik.errors.timeToComplete !== undefined
                                    ? formik.errors.timeToComplete
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
                            helperText={formik.touched.price && formik.errors.price !== undefined ? formik.errors.price : ""}
                        />
                    </Grid>
                </Grid>
                <Button type="submit" variant="contained" fullWidth>
                    СОЗДАТЬ
                </Button>
            </Grid>
        </form>
    );
};

export default CreateOrderForm;
