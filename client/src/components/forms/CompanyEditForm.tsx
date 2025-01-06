import { Box, Button, Grid2 as Grid, LinearProgress, TextField, Typography } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import InputMask from "react-input-mask";
import CompanyEditFormValidationSchema from "./validation/companyEditValidationSchema";
import { useState } from "react";

export interface CompanyEditData {
    name: string;
    contactPerson: {
        name: string;
        surname: string;
        patronymic?: string;
        phone: string;
        email: string;
    };
}

interface CompanyEditFormProps {
    initialValues: CompanyEditData;
    onSubmit: (updatedData: CompanyEditData) => Promise<void>;
}

// TODO fix form reset

const CompanyEditForm = ({ initialValues, onSubmit }: CompanyEditFormProps) => {
    const [loading, setLoading] = useState(false);

    let initialFormValues = {
        companyName: initialValues.name,
        contactPersonName: initialValues.contactPerson.name,
        contactPersonSurname: initialValues.contactPerson.surname,
        contactPersonPatronymic: initialValues.contactPerson.patronymic,
        contactPersonPhone: initialValues.contactPerson.phone,
        contactPersonEmail: initialValues.contactPerson.email,
    };

    return (
        <Formik
            initialValues={initialFormValues}
            validationSchema={CompanyEditFormValidationSchema}
            onSubmit={async (values) => {
                setLoading(true);
                await onSubmit({
                    name: values.companyName,
                    contactPerson: {
                        name: values.contactPersonName,
                        surname: values.contactPersonSurname,
                        patronymic: values.contactPersonPatronymic,
                        phone: values.contactPersonPhone,
                        email: values.contactPersonEmail,
                    },
                });
                setLoading(false);
            }}
        >
            {({ values, handleChange, handleBlur, touched, errors, resetForm, dirty }) => (
                <Form>
                    <Grid container spacing={2} mt={2} mb={2}>
                        <Grid size={{ xs: 12 }}>
                            <Field
                                as={TextField}
                                label="Company Name"
                                fullWidth
                                name="companyName"
                                value={values.companyName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={<ErrorMessage name="companyName" />}
                                error={touched.companyName && Boolean(errors.companyName)}
                            />
                        </Grid>
                        <Grid size={12}>
                            <Typography>Contact person</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Field
                                as={TextField}
                                label="Name"
                                fullWidth
                                name="contactPersonName"
                                value={values.contactPersonName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={<ErrorMessage name="contactPersonName" />}
                                error={touched.contactPersonName && Boolean(errors.contactPersonName)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Field
                                as={TextField}
                                label="Surname"
                                fullWidth
                                name="contactPersonSurname"
                                value={values.contactPersonSurname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={<ErrorMessage name="contactPersonSurname" />}
                                error={touched.contactPersonSurname && Boolean(errors.contactPersonSurname)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Field
                                as={TextField}
                                label="Patronymic (Optional)"
                                fullWidth
                                name="contactPersonPatronymic"
                                value={values.contactPersonPatronymic}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={<ErrorMessage name="contactPersonPatronymic" />}
                                error={touched.contactPersonPatronymic && Boolean(errors.contactPersonPatronymic)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputMask
                                mask="+375(99)999-99-99"
                                value={values.contactPersonPhone}
                                disabled={false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                {() => (
                                    <Field
                                        as={TextField}
                                        label="Phone"
                                        fullWidth
                                        name="contactPersonPhone"
                                        value={values.contactPersonPhone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        helperText={<ErrorMessage name="contactPersonPhone" />}
                                        error={touched.contactPersonPhone && Boolean(errors.contactPersonPhone)}
                                    />
                                )}
                            </InputMask>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                as={TextField}
                                label="Email"
                                fullWidth
                                name="contactPersonEmail"
                                value={values.contactPersonEmail}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                helperText={<ErrorMessage name="contactPersonEmail" />}
                                error={touched.contactPersonEmail && Boolean(errors.contactPersonEmail)}
                            />
                        </Grid>
                        {loading ? (
                            <Box sx={{ width: "100%" }}>
                                <LinearProgress />
                            </Box>
                        ) : (
                            <Grid container>
                                <Button variant="contained" type="submit">
                                    Save
                                </Button>
                                <Button variant="outlined" onClick={() => resetForm()}>
                                    Cancel
                                </Button>
                            </Grid>
                        )}
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default CompanyEditForm;
