import React from "react";
import { Grid, Typography, TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import validateUserEditData from "../../utils/validateUserEditData";

const UserEditForm = ({ userData, cancelHandler, applyCallback }) => {
    const formik = useFormik({
        initialValues: {
            surname: userData.surname,
            name: userData.name,
            patronymic: userData.patronymic,
            age: userData.age,
            city: userData.city,
            description: userData.description,
        },
        validate: validateUserEditData,
        onSubmit: async (values) => {
            const updatedUserData = {
                id: userData.id,
                surname: values.surname,
                name: values.name,
                patronymic: values.patronymic !== "" ? values.patronymic : null,
                age: values.age !== "" ? values.age : null,
                city: values.city !== "" ? values.city : null,
                description: values.description !== "" ? values.description : null,
            };

            applyCallback(updatedUserData);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
            <Grid
                container
                item
                flexDirection={"column"}
                mt={"20px"}
                gap={"10px"}
                sx={{
                    width: { xs: "290px", md: "570px", lg: "768px" },
                    paddingLeft: { xs: "31px", md: "46px", lg: 0 },
                }}
            >
                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                    Данные профиля
                </Typography>
                <Grid container item maxWidth={"768px"} columnGap={"15px"} rowGap={"20px"}>
                    <Grid container item sx={{ maxWidth: { xs: "259px", md: "246px" } }}>
                        <TextField
                            id="surname"
                            name="surname"
                            fullWidth
                            variant="outlined"
                            label="Фамилия"
                            value={formik.values.surname ?? ""}
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
                    </Grid>
                    <Grid container item sx={{ maxWidth: { xs: "259px", md: "246px" } }}>
                        <TextField
                            id="name"
                            name="name"
                            fullWidth
                            variant="outlined"
                            label="Имя"
                            value={formik.values.name ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && formik.errors.name !== undefined}
                            helperText={
                                formik.touched.name && formik.errors.name !== undefined ? formik.errors.name : ""
                            }
                            required
                        ></TextField>
                    </Grid>
                    <Grid container item sx={{ maxWidth: { xs: "259px", md: "246px" } }}>
                        <TextField
                            id="patronymic"
                            name="patronymic"
                            fullWidth
                            variant="outlined"
                            label="Отчество"
                            value={formik.values.patronymic ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.patronymic && formik.errors.patronymic !== undefined}
                            helperText={
                                formik.touched.patronymic && formik.errors.patronymic !== undefined
                                    ? formik.errors.patronymic
                                    : ""
                            }
                        ></TextField>
                    </Grid>
                    <Grid container item sx={{ maxWidth: { xs: "259px", md: "246px" } }}>
                        <TextField
                            id="age"
                            name="age"
                            fullWidth
                            variant="outlined"
                            label="Возраст"
                            value={formik.values.age ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.age && formik.errors.age !== undefined}
                            helperText={
                                formik.touched.age && formik.errors.age !== undefined ? formik.errors.age : ""
                            }
                        ></TextField>
                    </Grid>
                    <Grid container item sx={{ maxWidth: { xs: "259px", md: "246px" } }}>
                        <TextField
                            id="city"
                            name="city"
                            fullWidth
                            variant="outlined"
                            label="Город"
                            value={formik.values.city ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.city && formik.errors.city !== undefined}
                            helperText={
                                formik.touched.city && formik.errors.city !== undefined ? formik.errors.city : ""
                            }
                        ></TextField>
                    </Grid>
                    <Grid container item sx={{ maxWidth: { xs: "259px", md: "507px" } }}>
                        <TextField
                            id="description"
                            name="description"
                            fullWidth
                            variant="outlined"
                            multiline
                            maxRows={10}
                            label="Описание"
                            value={formik.values.description ?? ""}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.description && formik.errors.description !== undefined}
                            helperText={
                                formik.touched.description && formik.errors.description !== undefined
                                    ? formik.errors.description
                                    : ""
                            }
                        ></TextField>
                    </Grid>
                    <Grid container item gap={"15px"}>
                        <Grid container item maxWidth={"136px"}>
                            <Button type="submit" variant="contained">
                                СОХРАНИТЬ
                            </Button>
                        </Grid>
                        <Grid container item maxWidth={"108px"}>
                            <Button variant="outlined" onClick={() => cancelHandler()}>
                                ОТМЕНА
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};

export default UserEditForm;
