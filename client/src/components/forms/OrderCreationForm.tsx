import React from "react";
import { Grid2 as Grid, TextField, Typography, Button, InputAdornment } from "@mui/material";
import { Field, Form, Formik } from "formik";
import OrderCreationMap from "../maps/OrderCreationMap";
import { LatLng } from "leaflet";
import orderCreateValidationSchema from "./validation/orderCreateValidationSchema";

export interface OrderCreationData {
    title: string;
    description: string;
    place: string;
    lng: number | undefined;
    lat: number | undefined;
    daysToComplete: number | undefined;
    hoursToComplete: number | undefined;
    price: number | undefined;
}

export default function OrderCreationForm({
    submitHandler,
    loading,
}: {
    submitHandler: (orderData: OrderCreationData) => void;
    loading: boolean;
}) {
    const setNewLocation = (setFieldValue: Function, newLocation: LatLng, address: string) => {
        setFieldValue("place", address);
        setFieldValue("lat", newLocation.lat);
        setFieldValue("lng", newLocation.lng);
    };

    const initialValues: OrderCreationData = {
        title: "",
        description: "",
        place: "",
        lng: undefined,
        lat: undefined,
        daysToComplete: undefined,
        hoursToComplete: undefined,
        price: undefined,
    };

    return (
        <Grid container flexDirection={"column"} p={2} pt={3}>
            <Typography variant="h4" gutterBottom textAlign={"center"}>
                Create New Order
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={orderCreateValidationSchema}
                onSubmit={(values, errors) => {
                    console.log(1);
                    console.log(errors);

                    submitHandler(values);
                }}
            >
                {({ values, errors, touched, setFieldValue }) => (
                    <Form>
                        <Grid container spacing={3}>
                            <Grid size={12}>
                                <Typography variant="h6">General info</Typography>
                            </Grid>
                            <Grid size={12}>
                                <Field
                                    name="title"
                                    label="Title"
                                    as={TextField}
                                    fullWidth
                                    error={touched.title && Boolean(errors.title)}
                                    helperText={touched.title && errors.title}
                                />
                            </Grid>

                            <Grid size={12}>
                                <Field
                                    name="description"
                                    label="Description"
                                    as={TextField}
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                />
                            </Grid>

                            <Grid container size={12}>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <Field
                                        name="price"
                                        label="Price"
                                        type="number"
                                        as={TextField}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">BYN</InputAdornment>,
                                        }}
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                display: "none",
                                            },
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                        }}
                                        error={touched.price && Boolean(errors.price)}
                                        helperText={touched.price && errors.price}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container size={{ xs: 12, sm: 6 }}>
                                <Grid size={12}>
                                    <Typography variant="h6">Time to complete</Typography>
                                </Grid>
                                <Grid size={6}>
                                    <Field
                                        name="daysToComplete"
                                        label="Days"
                                        type="number"
                                        as={TextField}
                                        fullWidth
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                display: "none",
                                            },
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                        }}
                                        error={touched.daysToComplete && Boolean(errors.daysToComplete)}
                                        helperText={touched.daysToComplete && errors.daysToComplete}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <Field
                                        name="hoursToComplete"
                                        label="Hours"
                                        type="number"
                                        as={TextField}
                                        fullWidth
                                        sx={{
                                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                                display: "none",
                                            },
                                            "& input[type=number]": {
                                                MozAppearance: "textfield",
                                            },
                                        }}
                                        error={touched.hoursToComplete && Boolean(errors.hoursToComplete)}
                                        helperText={touched.hoursToComplete && errors.hoursToComplete}
                                    />
                                </Grid>
                                {values.daysToComplete === 0 && values.hoursToComplete === 0 && (
                                    <Typography color="error">Time to complete must be greater than 0</Typography>
                                )}
                            </Grid>

                            <Grid container size={12}>
                                <Grid size={12}>
                                    <Typography variant="h6">Location</Typography>
                                </Grid>
                                <Grid size={12}>
                                    <Field
                                        name="place"
                                        placeholder="Set a location on the map"
                                        as={TextField}
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                readOnly: true,
                                            },
                                        }}
                                        error={touched.place && Boolean(errors.place)}
                                        helperText={touched.place && errors.place}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <OrderCreationMap
                                        onLocationChange={(newLocation: LatLng, address: string) =>
                                            setNewLocation(setFieldValue, newLocation, address)
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <Grid size={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    loading={loading}
                                >
                                    Create Order
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Grid>
    );
}
