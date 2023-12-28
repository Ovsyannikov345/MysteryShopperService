import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { Avatar, Grid, IconButton, TextField, Typography, Alert, Snackbar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/EditOutlined";
import UserHeader from "./../../components/headers/UserHeader";
import NavigateBack from "../../components/NavigateBack";
import ProfileCards from "../../components/ProfileCards";
import UserReview from "../../components/UserReview";
import { getProfile, updateAvatar, updateUser } from "../../api/userApi";
import UserEditForm from "./../../components/forms/UserEditForm";
import addNoun from "./../../utils/fieldsParser";
import moment from "moment";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const UserProfilePage = () => {
    const theme = useTheme();

    const [editMode, setEditMode] = useState(false);

    const [userData, setUserData] = useState({});

    const [image, setImage] = useState(undefined);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const response = await getProfile();

            if (!response) {
                displayError("Сервис временно недоступен");
                return;
            }

            if (response.status === 401) {
                localStorage.removeItem("jwt");
                localStorage.removeItem("role");
                window.location.reload();
            }

            if (response.status >= 300) {
                displayError("Ошибка при загрузке профиля. Код: " + response.status);
                console.log(response);
                return;
            }

            setUserData(response.data);
            console.log(response.data);
        };

        loadData();
    }, []);

    const rating = useMemo(() => {
        // try {
        //     if (companyData.Orders.length === 0) {
        //         return "-";
        //     }

        //     let totalGrade = 0;
        //     let count = 0;

        //     companyData.Orders.forEach((order) => {
        //         order.CompanyReviews.forEach((review) => {
        //             totalGrade += review.grade;
        //             count++;
        //         });
        //     });

        //     return (totalGrade / count).toFixed(2);
        // } catch {
        //     return "-";
        // }

        return "-";
    }, []);

    const displayError = (message) => {
        setErrorMessage(message);
        setError(true);
    };

    const closeSnackbar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setError(false);
    };

    const applyChanges = async (updatedCompanyData) => {
        console.log("apply");
        // const response = await updateCompany(companyData.id, updatedCompanyData);

        // if (!response) {
        //     displayError("Сервис временно недоступен");
        //     return;
        // }

        // if (response.status === 401) {
        //     localStorage.removeItem("jwt");
        //     localStorage.removeItem("role");
        //     window.location.reload();
        // }

        // if (response.status >= 300) {
        //     displayError("Ошибка при изменении данных. Код: " + response.status);
        //     return;
        // }

        // const imageSuccess = await sendImage();

        // if (imageSuccess) {
        //     setCompanyData(response.data);
        //     setEditMode(false);
        //     window.location.reload();
        // }
    };

    const sendImage = async () => {
        console.log("image sent");
        return true;

        // if (image === undefined) {
        //     return true;
        // }

        // const response = await updateAvatar(companyData.id, image);

        // if (!response) {
        //     displayError("Сервис временно недоступен");
        //     return false;
        // }

        // if (response.status === 401) {
        //     localStorage.removeItem("jwt");
        //     localStorage.removeItem("role");
        //     window.location.reload();
        // }

        // if (response.status >= 300) {
        //     displayError("Ошибка при отправке изображения. Код: " + response.status);
        //     console.log(response);
        //     return false;
        // }

        // setImage(undefined);

        // return true;
    };

    return (
        <Grid
            container
            width={"100%"}
            minHeight={"100vh"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            bgcolor={"#E7E7E7"}
        >
            <UserHeader />
            <Grid
                container
                item
                flexDirection={"column"}
                alignItems={"flex-start"}
                maxWidth={"1300px"}
                flexGrow={1}
                bgcolor={"#FFFFFF"}
            >
                <Grid
                    container
                    item
                    pr={"40px"}
                    pl={"40px"}
                    mt={"40px"}
                    justifyContent={"space-between"}
                    flexWrap={"nowrap"}
                >
                    <NavigateBack label="Доступные заказы" to={"/orders"} />
                    {!editMode && (
                        <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => setEditMode(true)}>
                            <EditIcon sx={{ fontSize: 50 }}></EditIcon>
                        </IconButton>
                    )}
                </Grid>
                <Grid container item pl={"150px"} mt={"40px"} pb={"46px"}>
                    <Grid container item gap={"50px"} alignItems={"flex-start"}>
                        <Avatar
                            src={
                                userData.id !== undefined
                                    ? `http://localhost:5000/api/users/${
                                          userData.id
                                      }/avatar?jwt=${localStorage.getItem("jwt")}`
                                    : ""
                            }
                            variant="square"
                            sx={{ width: 130, height: 130 }}
                        />
                        {!editMode ? (
                            <Grid flexDirection={"column"} gap={"10px"}>
                                <Typography variant="h2" height={"36px"}>
                                    {[userData.surname, userData.name, userData.patronymic].join(" ")}
                                </Typography>
                                <Typography variant="h3" height={"26px"}>
                                    {userData.city + ", " + addNoun(userData.age, ["год", "года", "лет"])}
                                </Typography>
                                <Typography variant="h3" maxWidth={"641px"}>
                                    {userData.description}
                                </Typography>
                            </Grid>
                        ) : (
                            <Button component="label" variant="outlined">
                                {image !== undefined ? image.name : "ВЫБРАТЬ ФАЙЛ"}
                                <VisuallyHiddenInput
                                    type="file"
                                    name="avatar"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    accept="image/png"
                                />
                            </Button>
                        )}
                    </Grid>
                    {!editMode ? (
                        <>
                            <ProfileCards
                                registrationDate={
                                    userData.createdAt !== undefined
                                        ? moment.utc(userData.createdAt).format("DD-MM-YYYY")
                                        : "-"
                                }
                                ordersCount={userData.Orders !== undefined ? userData.Orders.length : "-"}
                                rating={rating}
                            />
                            <Grid container item mt={"50px"} flexDirection={"column"}>
                                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                    Контактная информация
                                </Typography>
                                <Grid container item flexDirection={"column"} gap={"25px"} maxWidth={"394px"}>
                                    <TextField
                                        variant="standard"
                                        label="Эл. почта"
                                        value={userData.email ?? ""}
                                        InputProps={{
                                            readOnly: true,
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
                                        variant="standard"
                                        label="Телефон"
                                        value={userData.phone ?? ""}
                                        InputProps={{
                                            readOnly: true,
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
                                </Grid>
                            </Grid>
                            {userData.Reports !== undefined ? (
                                <Grid container item mt={"50px"} flexDirection={"column"}>
                                    {userData.Reports.map(report => report.UserReviews).length > 0 ? (
                                        <>
                                            <Typography
                                                variant="h2"
                                                height={"69px"}
                                                display={"flex"}
                                                alignItems={"center"}
                                            >
                                                Отзывы
                                            </Typography>

                                            <Grid
                                                container
                                                item
                                                maxWidth={"700px"}
                                                flexDirection={"column"}
                                                gap={"25px"}
                                            >
                                                {userData.Reports.map((report) =>
                                                    report.UserReviews.map((review) => (
                                                        <UserReview key={review.id} userReview={review} />
                                                    ))
                                                )}
                                            </Grid>
                                        </>
                                    ) : (
                                        <Typography
                                            variant="h2"
                                            height={"69px"}
                                            display={"flex"}
                                            alignItems={"center"}
                                        >
                                            Отзывов пока нет
                                        </Typography>
                                    )}
                                </Grid>
                            ) : (
                                <></>
                            )}{" "}
                        </>
                    ) : (
                        <UserEditForm
                            userData={userData}
                            cancelHandler={() => setEditMode(false)}
                            applyCallback={applyChanges}
                        />
                    )}
                </Grid>
            </Grid>
            <Snackbar open={error} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert onClose={closeSnackbar} severity="error" sx={{ width: "100%" }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Grid>
    );
};

export default UserProfilePage;
