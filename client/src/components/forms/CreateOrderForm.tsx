import React from "react";
import { Grid, TextField, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import validateOrderData from "../../utils/validateOrderData";
import OrderCreationMap from "../maps/OrderCreationMap";
import { LatLng } from "leaflet";

export interface OrderCreationData {
    title: string;
    description: string;
    place: string;
    timeToComplete: number | undefined;
    price: number | undefined;
    lat: number | undefined;
    lng: number | undefined;
}

const CreateOrderForm = ({ submitHandler }: { submitHandler: Function }) => {
    const formik = useFormik<OrderCreationData>({
        initialValues: {
            title: "",
            description: "",
            place: "",
            timeToComplete: 0,
            price: 0,
            lat: undefined,
            lng: undefined,
        },
        validate: validateOrderData,
        onSubmit: (values) => {
            let newOrder = { ...values };

            newOrder.timeToComplete = values.timeToComplete === 0 ? undefined : values.timeToComplete;
            newOrder.price = values.price === 0 ? undefined : values.price;

            submitHandler(newOrder);
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
                            id="timeToComplete"
                            name="timeToComplete"
                            variant="outlined"
                            label="Дней на выполнение"
                            value={formik.values.timeToComplete !== 0 ? formik.values.timeToComplete : ""}
                            onChange={(e) =>
                                formik.setFieldValue("timeToComplete", e.target.value ? parseInt(e.target.value) : 0)
                            }
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
                            value={formik.values.price !== 0 ? formik.values.price : ""}
                            onChange={(e) => formik.setFieldValue("price", e.target.value ? parseInt(e.target.value) : 0)}
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
