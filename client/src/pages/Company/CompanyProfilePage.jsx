import React, { useEffect, useMemo, useState } from "react";
import { Avatar, Grid, IconButton, TextField, Typography, Alert, Snackbar } from "@mui/material";
import CompanyHeader from "./../../components/headers/CompanyHeader";
import NavigateBack from "../../components/NavigateBack";
import EditIcon from "@mui/icons-material/EditOutlined";

import moment from "moment";
import ProfileCards from "../../components/ProfileCards";
import { useTheme } from "@emotion/react";
import { getProfile } from "../../api/companyApi";

const CompanyProfilePage = () => {
    const theme = useTheme();

    const [editMode, setEditMode] = useState(false);

    const [companyData, setCompanyData] = useState({});

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const loadData = async () => {
            const response = await getProfile();

            if (!response) {
                displayError("Сервис временно недоступен");
                return;
            }

            if (response.status >= 300) {
                displayError("Ошибка при загрузке профиля. Код: " + response.status);
                console.log(response);
                return;
            }

            setCompanyData(response.data);
        };

        loadData();
    }, []);

    const rating = useMemo(() => {
        try {
            let totalGrade = 0;
            let count = 0;

            companyData.Orders.forEach((order) => {
                order.CompanyReviews.forEach((review) => {
                    totalGrade += review.grade;
                    count++;
                });
            });

            return (totalGrade / count).toFixed(2);
        } catch {
            return "-";
        }
    }, [companyData.Orders]);

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

    return (
        <Grid
            container
            width={"100%"}
            height={"100vh"}
            flexDirection={"column"}
            justifyContent={"flex-start"}
            alignItems={"center"}
            bgcolor={"#E7E7E7"}
        >
            <CompanyHeader />
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
                    <NavigateBack label="Мои заказы" />
                    {!editMode && (
                        <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => setEditMode(true)}>
                            <EditIcon sx={{ fontSize: 50 }}></EditIcon>
                        </IconButton>
                    )}
                </Grid>
                <Grid container item pl={"150px"} mt={"40px"}>
                    <Grid container item gap={"50px"}>
                        <Avatar src="" sx={{ width: 130, height: 130 }} />
                        <Grid flexDirection={"column"} gap={"10px"}>
                            <Typography variant="h2" height={"36px"}>
                                {companyData.name}
                            </Typography>
                            <Typography variant="h3">{companyData.email}</Typography>
                        </Grid>
                    </Grid>
                    <ProfileCards
                        registrationDate={
                            companyData.createdAt !== undefined
                                ? moment.utc(companyData.createdAt).format("DD-MM-YYYY")
                                : "-"
                        }
                        ordersCount={companyData.Orders !== undefined ? companyData.Orders.length : "-"}
                        rating={rating}
                    />
                    {companyData.ContactPerson !== undefined ? (
                        <Grid container item mt={"50px"} flexDirection={"column"}>
                            <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                Контактная информация
                            </Typography>
                            <Grid container item flexDirection={"column"} gap={"25px"} maxWidth={"394px"}>
                                <TextField
                                    variant="standard"
                                    label="ФИО контактного лица"
                                    value={[
                                        companyData.ContactPerson.surname,
                                        companyData.ContactPerson.name,
                                        companyData.ContactPerson.patronymic,
                                    ].join(" ")}
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
                                    label="Эл. почта"
                                    value={companyData.ContactPerson.email}
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
                                    value={companyData.ContactPerson.phone}
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
                    ) : (
                        <></>
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

export default CompanyProfilePage;
