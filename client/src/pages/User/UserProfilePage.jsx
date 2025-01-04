import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@emotion/react";
import { Avatar, Grid, IconButton, TextField, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/EditOutlined";
import UserHeader from "./../../components/headers/UserHeader";
import CompanyHeader from "../../components/headers/CompanyHeader";
import NavigateBack from "../../components/NavigateBack";
import ProfileCards from "../../components/ProfileCards";
import UserReview from "../../components/UserReview";
import { getProfile, getUser, updateAvatar, updateUser } from "../../api/userApi";
import UserEditForm from "./../../components/forms/UserEditForm";
import addNoun from "./../../utils/fieldsParser";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useNotifications } from "@toolpad/core/useNotifications";

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
    const notifications = useNotifications();

    const theme = useTheme();

    const { id } = useParams();

    const [readonly, setReadonly] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [userData, setUserData] = useState({});

    const [image, setImage] = useState(undefined);

    useEffect(() => {
        const loadData = async () => {
            const response = id !== undefined ? await getUser(id) : await getProfile();

            if (response.status >= 300) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            setUserData(response.data);
            setReadonly(id !== undefined);
        };

        loadData();
    }, [id]);

    const rating = useMemo(() => {
        try {
            if (userData.userReviews.length === 0) {
                return "-";
            }

            const result = (userData.userReviews.map(r => r.grade).reduce((acc, val) => acc += val, 0) / userData.userReviews.length).toFixed(2);

            return isNaN(result) ? "-" : result;
        } catch {
            return "-";
        }
    }, [userData.userReviews]);

    const applyChanges = async (updatedUserData) => {
        const response = await updateUser(userData.id, updatedUserData);

        if (response.status >= 300) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        const imageSuccess = await sendImage();

        if (imageSuccess) {
            setUserData(response.data);
            setEditMode(false);
            
        }
    };

    const sendImage = async () => {
        if (image === undefined) {
            return true;
        }

        const response = await updateAvatar(userData.id, image);

        if (response.status >= 300) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return false;
        }

        setImage(undefined);

        return true;
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
            {localStorage.getItem("role") === "company" ? <CompanyHeader /> : <UserHeader />}
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
                    mt={"40px"}
                    justifyContent={"space-between"}
                    flexWrap={"nowrap"}
                    sx={{
                        paddingLeft: { xs: "23px", lg: "40px" },
                        paddingRight: { xs: "23px", lg: "40px" },
                        marginTop: { xs: "0", md: "40px" },
                    }}
                >
                    <NavigateBack
                        label={id === undefined ? "Доступные заказы" : "Назад"}
                        to={id === undefined ? "/orders" : -1}
                    />
                    {!readonly && !editMode && userData.id !== undefined && (
                        <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => setEditMode(true)}>
                            <EditIcon sx={{ fontSize: { xs: 30, md: 40, lg: 50 } }}></EditIcon>
                        </IconButton>
                    )}
                </Grid>
                <Grid
                    container
                    item
                    mt={"40px"}
                    pb={"46px"}
                    sx={{
                        paddingLeft: { xs: "1px", md: "33px", lg: "150px" },
                        marginTop: { xs: "0", md: "40px" },
                    }}
                >
                    <Grid
                        container
                        item
                        alignItems={editMode ? "center" : "flex-start"}
                        sx={{ paddingLeft: { xs: "1px", md: "46px", lg: "0px" }, gap: { xs: "5px", md: "50px" } }}
                    >
                        <Avatar
                            src={
                                userData.id !== undefined
                                    ? `http://localhost:5000/api/users/${
                                          userData.id
                                      }/avatar?jwt=${localStorage.getItem("accessToken")}`
                                    : ""
                            }
                            variant="square"
                            sx={{
                                width: { xs: 60, md: 130 },
                                height: { xs: 60, md: 130 },
                                marginLeft: { xs: editMode ? "43px" : "0", md: "46px", lg: 0 },
                            }}
                        />
                        {!editMode ? (
                            <Grid flexDirection={"column"} gap={"10px"} sx={{ maxWidth: { xs: "253px", md: "430px" } }}>
                                <Typography variant="h2" height={"36px"} sx={{ fontSize: { xs: "20px", md: "24px" } }}>
                                    {[userData.surname, userData.name, userData.patronymic].join(" ")}
                                </Typography>
                                <Typography variant="h3" height={"26px"}>
                                    {(userData.city ?? "") +
                                        (userData.city != null && userData.age != null ? ", " : "") +
                                        (userData.age != null ? addNoun(userData.age, ["год", "года", "лет"]) : "")}
                                </Typography>
                                <Typography variant="h3" sx={{ maxWidth: { xs: "253px", md: "641px" } }}>
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
                                    userData.createdAt !== undefined ? moment.utc(userData.createdAt).format("DD-MM-YYYY") : "-"
                                }
                                ordersCount={userData.orders !== undefined ? userData.orders.length : "-"}
                                rating={rating}
                            />
                            <Grid
                                container
                                item
                                flexDirection={"column"}
                                sx={{
                                    paddingLeft: { xs: "1px", md: "46px", lg: "0px" },
                                    marginTop: { xs: "10px", md: "50px" },
                                }}
                            >
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
                                            sx: { fontSize: { xs: "20px", md: "24px" } },
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
                                            sx: { fontSize: { xs: "20px", md: "24px" } },
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
                                <Grid
                                    container
                                    item
                                    flexDirection={"column"}
                                    sx={{
                                        marginTop: { xs: "10px", md: "50px" },
                                        paddingLeft: { xs: "5px", md: 0 },
                                    }}
                                >
                                    {userData.Reports.filter((report) => report.UserReview != null).length > 0 ? (
                                        <>
                                            <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                                Отзывы
                                            </Typography>

                                            <Grid container item maxWidth={"700px"} flexDirection={"column"} gap={"25px"}>
                                                {userData.Reports.filter((report) => report.UserReview != null).map((report) => (
                                                    <UserReview key={report.UserReview.id} userReview={report.UserReview} />
                                                ))}
                                            </Grid>
                                        </>
                                    ) : (
                                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                            Отзывов пока нет
                                        </Typography>
                                    )}
                                </Grid>
                            ) : (
                                <></>
                            )}{" "}
                        </>
                    ) : (
                        <UserEditForm userData={userData} cancelHandler={() => setEditMode(false)} applyCallback={applyChanges} />
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default UserProfilePage;
