import {
    Box,
    Button,
    FormControl,
    Grid2 as Grid,
    InputLabel,
    LinearProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import InputMask from "react-input-mask";
import { useState } from "react";
import { genderLabels, Genders } from "../../utils/enums/genders";
import userEditValidationSchema from "./validation/userEditValidationSchema";
import moment, { Moment } from "moment";
import { DatePicker } from "@mui/x-date-pickers";

export interface UserEditData {
    name: string;
    surname: string;
    birthDate?: Moment;
    gender: Genders;
    workingExperience?: string;
    city?: string;
    phone: string;
    description?: string;
}

interface UserEditFormProps {
    initialValues: UserEditData;
    onSubmit: (updatedData: UserEditData) => Promise<void>;
}

const UserEditForm = ({ initialValues, onSubmit }: UserEditFormProps) => {
    const [loading, setLoading] = useState(false);

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={userEditValidationSchema}
            onSubmit={async (values) => {
                setLoading(true);
                await onSubmit(values);
                setLoading(false);
            }}
        >
            {({ values, handleChange, setFieldValue, handleBlur, validateField, touched, errors }) => (
                <Form>
                    <Grid container spacing={2} mt={2} mb={2}>
                        {/* Name Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                name="name"
                                as={TextField}
                                label="Имя"
                                fullWidth
                                error={touched.name && Boolean(errors.name)}
                                helperText={<ErrorMessage name="name" />}
                            />
                        </Grid>

                        {/* Surname Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                name="surname"
                                as={TextField}
                                label="Фамиоия"
                                fullWidth
                                error={touched.surname && Boolean(errors.surname)}
                                helperText={<ErrorMessage name="surname" />}
                            />
                        </Grid>

                        {/* Birthdate Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <DatePicker
                                sx={{ width: "100%" }}
                                name="birthDate"
                                label="Дата рождения (необязательно)"
                                value={values.birthDate ? moment(values.birthDate) : null}
                                disableFuture
                                minDate={moment().subtract(100, "years")}
                                onChange={(value: Moment | null) => {
                                    setFieldValue("birthDate", value);
                                    validateField("birthDate");
                                }}
                                slotProps={{
                                    textField: {
                                        helperText: errors.birthDate,
                                    },
                                }}
                            />
                        </Grid>

                        {/* Gender Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth error={touched.gender && Boolean(errors.gender)}>
                                <InputLabel id="gender-select-label">Пол</InputLabel>
                                <Field
                                    as={Select}
                                    labelId="gender-select-label"
                                    id="gender"
                                    name="gender"
                                    value={values.gender}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    label="Пол"
                                    error={touched.gender && Boolean(errors.gender)}
                                >
                                    {Object.keys(Genders)
                                        .filter((key) => isNaN(Number(key)))
                                        .map((key) => {
                                            const value = Genders[key as keyof typeof Genders];
                                            return (
                                                <MenuItem key={key} value={value}>
                                                    {genderLabels[value]}
                                                </MenuItem>
                                            );
                                        })}
                                </Field>
                            </FormControl>
                        </Grid>

                        {/* City Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <Field
                                name="city"
                                as={TextField}
                                label="Город (необязательно)"
                                fullWidth
                                error={touched.city && Boolean(errors.city)}
                                helperText={<ErrorMessage name="city" />}
                            />
                        </Grid>

                        {/* Phone Field */}
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <InputMask mask="+375(99)999-99-99" value={values.phone} disabled={false} onChange={handleChange}>
                                {() => (
                                    <TextField
                                        label="Телефон"
                                        name="phone"
                                        fullWidth
                                        error={touched.phone && Boolean(errors.phone)}
                                        helperText={touched.phone && errors.phone}
                                    />
                                )}
                            </InputMask>
                        </Grid>

                        {/* Working Experience Field */}
                        <Grid size={12}>
                            <Field
                                name="workingExperience"
                                as={TextField}
                                label="Опыт работы (необязательно)"
                                fullWidth
                                error={touched.workingExperience && Boolean(errors.workingExperience)}
                                helperText={<ErrorMessage name="workingExperience" />}
                            />
                        </Grid>

                        {/* Description Field */}
                        <Grid size={12}>
                            <Field
                                name="description"
                                as={TextField}
                                label="Описание (необязательно)"
                                multiline
                                minRows={3}
                                fullWidth
                                error={touched.description && Boolean(errors.description)}
                                helperText={
                                    errors.description ? (
                                        <ErrorMessage name="description" />
                                    ) : (
                                        <Typography
                                            variant="subtitle2"
                                            color="textSecondary"
                                            textAlign={"end"}
                                            sx={{ mt: "-30px" }}
                                        >
                                            {values.description?.length ?? 0}/500
                                        </Typography>
                                    )
                                }
                            />
                        </Grid>

                        {loading && (
                            <Box sx={{ width: "100%" }}>
                                <LinearProgress />
                            </Box>
                        )}
                        <Grid container>
                            <Button variant="contained" type="submit" disabled={loading}>
                                Сохранить
                            </Button>
                            <Button
                                type="reset"
                                variant="outlined"
                                disabled={loading}
                                onClick={() => setFieldValue("initialValues", initialValues)}
                            >
                                Отмена
                            </Button>
                        </Grid>
                    </Grid>
                </Form>
            )}
        </Formik>
    );
};

export default UserEditForm;
