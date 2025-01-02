import React, { useState } from "react";
import {
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    Grid2 as Grid,
    FormControl,
    Container,
    useTheme,
    CircularProgress,
    Typography,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
} from "@mui/material";
import InputMask from "react-input-mask";
import { Formik, Field, Form, ErrorMessage } from "formik";
import backgroundImage from "../images/background.jpg";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@toolpad/core";
import { Apartment, ArrowBack, Person } from "@mui/icons-material";
import { checkEmail } from "../api/authApi";
import getRegistrationValidationSchema from "./../utils/getRegistrationValidationSchema";

const RegistrationPage = () => {
    const theme = useTheme();

    const navigate = useNavigate();

    const notifications = useNotifications();

    const [loading, setLoading] = useState(false);

    const [activeStep, setActiveStep] = useState(0);

    const [userType, setUserType] = useState<"user" | "company" | undefined>();

    const steps = ["Auth data", "Account type", "Info"];

    const initialValues = {
        email: "",
        password: "",
        passwordRepeat: "",
        name: "",
        surname: "",
        birthDate: "",
        gender: "Male",
        workingExperience: "",
        city: "",
        phone: "",
        description: "",
        companyName: "",
        contactPersonName: "",
        contactPersonSurname: "",
        contactPersonPatronymic: "",
        contactPersonPhone: "",
        contactPersonEmail: "",
    };

    const handleFirstStep = async (values: typeof initialValues, setErrors: Function) => {
        setLoading(true);

        let response = await checkEmail(values!.email);

        setLoading(false);

        if (!response.data.available) {
            setErrors({
                email: "Email is taken",
            });

            return;
        }

        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleSecondStep = (type: "user" | "company") => {
        setUserType(type);
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleThirdStep = (values: typeof initialValues) => {
        console.log(values);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    return (
        <Grid
            container
            direction="column"
            spacing={2}
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                backdropFilter: "blur(8px)",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/login")}>
                    Login
                </Button>
            </Container>
            <Container maxWidth="xs" sx={{ zIndex: 1 }}>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        padding: 4,
                        boxShadow: 4,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper,
                        backdropFilter: "blur(16px)",
                        opacity: 0.95,
                    }}
                >
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ width: "100%", mb: 2 }}>
                        {steps.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={getRegistrationValidationSchema(userType)}
                        onSubmit={(values, { setErrors }) => {
                            console.log(values);

                            if (activeStep === 0) {
                                handleFirstStep(values, setErrors);
                            } else if (activeStep === 2) {
                                console.log(123123);
                                handleThirdStep(values);
                            }
                        }}
                    >
                        {({ values, handleChange, handleBlur, touched, errors, setFieldValue }) => (
                            <Form>
                                <div>
                                    {activeStep === 0 && (
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Email"
                                                    fullWidth
                                                    name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="email" />}
                                                    error={touched.email && Boolean(errors.email)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Password"
                                                    type="password"
                                                    fullWidth
                                                    name="password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="password" />}
                                                    error={touched.password && Boolean(errors.password)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Repeat Password"
                                                    type="password"
                                                    fullWidth
                                                    name="passwordRepeat"
                                                    value={values.passwordRepeat}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="passwordRepeat" />}
                                                    error={touched.passwordRepeat && Boolean(errors.passwordRepeat)}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}

                                    {activeStep === 1 && (
                                        <Grid container spacing={2}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<Person />}
                                                onClick={() => {
                                                    handleSecondStep("user");
                                                }}
                                            >
                                                user
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<Apartment />}
                                                onClick={() => {
                                                    handleSecondStep("company");
                                                }}
                                            >
                                                company
                                            </Button>
                                        </Grid>
                                    )}

                                    {activeStep === 2 && userType === "company" && (
                                        <Grid container spacing={2}>
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
                                            <Typography>Contact person</Typography>
                                            <Grid size={{ xs: 12 }}>
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
                                            <Grid size={{ xs: 12 }}>
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
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Patronymic"
                                                    fullWidth
                                                    name="contactPersonPatronymic"
                                                    value={values.contactPersonPatronymic}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="contactPersonPatronymic" />}
                                                    error={
                                                        touched.contactPersonPatronymic && Boolean(errors.contactPersonPatronymic)
                                                    }
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
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
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
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
                                        </Grid>
                                    )}

                                    {activeStep === 2 && userType === "user" && (
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Name"
                                                    fullWidth
                                                    name="name"
                                                    value={values.name}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="name" />}
                                                    error={touched.name && Boolean(errors.name)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Surname"
                                                    fullWidth
                                                    name="surname"
                                                    value={values.surname}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="surname" />}
                                                    error={touched.surname && Boolean(errors.surname)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Birthdate (optional)"
                                                    type="date"
                                                    fullWidth
                                                    name="birthDate"
                                                    value={values.birthDate}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    InputLabelProps={{ shrink: true }}
                                                    helperText={<ErrorMessage name="birthDate" />}
                                                    error={touched.birthDate && Boolean(errors.birthDate)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <FormControl>
                                                    <FormLabel id="radio-buttons-group-label">Gender</FormLabel>
                                                    <RadioGroup
                                                        aria-labelledby="radio-buttons-group-label"
                                                        defaultValue="male"
                                                        name="radio-buttons-group"
                                                        row
                                                        value={values.gender}
                                                        onChange={(e) => setFieldValue("gender", e.target.value)}
                                                    >
                                                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <InputMask
                                                    mask="+375(99)999-99-99"
                                                    value={values.phone}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                >
                                                    {
                                                        <Field
                                                            as={TextField}
                                                            label="Phone"
                                                            fullWidth
                                                            name="phone"
                                                            value={values.phone}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            helperText={<ErrorMessage name="phone" />}
                                                            error={touched.phone && Boolean(errors.phone)}
                                                        />
                                                    }
                                                </InputMask>
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="City (optional)"
                                                    fullWidth
                                                    name="city"
                                                    value={values.city}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="city" />}
                                                    error={touched.city && Boolean(errors.city)}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Field
                                                    as={TextField}
                                                    label="Working Experience (optional)"
                                                    fullWidth
                                                    name="workingExperience"
                                                    value={values.workingExperience}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={<ErrorMessage name="workingExperience" />}
                                                    error={touched.workingExperience && Boolean(errors.workingExperience)}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}

                                    {loading ? (
                                        <Grid container justifyContent={"center"} spacing={2} sx={{ mt: 2 }}>
                                            <CircularProgress></CircularProgress>
                                        </Grid>
                                    ) : (
                                        <Grid container justifyContent={"flex-end"} spacing={2} sx={{ mt: 2 }}>
                                            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
                                                Back
                                            </Button>
                                            {activeStep !== 1 && (
                                                <Button type="submit" variant="contained">
                                                    {activeStep === steps.length - 1 ? "Submit" : "Next"}
                                                </Button>
                                            )}
                                        </Grid>
                                    )}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Grid>
            </Container>
        </Grid>
    );
};

export default RegistrationPage;
