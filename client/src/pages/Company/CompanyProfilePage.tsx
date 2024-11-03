import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Avatar, Grid, IconButton, TextField, Typography, Button } from "@mui/material";
import CompanyHeader from "./../../components/headers/CompanyHeader";
import NavigateBack from "../../components/NavigateBack";
import EditIcon from "@mui/icons-material/EditOutlined";
import { styled } from "@mui/material/styles";
import moment from "moment";
import ProfileCards from "../../components/ProfileCards";
import { useTheme } from "@mui/material/styles";
import { Company, CompanyToUpdate, getCompany, getProfile, updateAvatar, UpdatedCompanyData } from "../../api/companyApi";
import { updateCompany } from "../../api/companyApi";
import CompanyReview from "../../components/CompanyReview";
import CompanyEditForm from "../../components/forms/CompanyEditForm";
import UserHeader from "../../components/headers/UserHeader";
import { useParams } from "react-router-dom";
import { ApiError } from "../../api";
import { useNotifications } from "@toolpad/core/useNotifications";
import isApiError from "../../utils/isApiError";

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

const CompanyProfilePage = () => {
    const theme = useTheme();

    const { id } = useParams();

    const notifications = useNotifications();

    const [readonly, setReadonly] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [companyData, setCompanyData] = useState<Company>();

    const [image, setImage] = useState<any>(undefined);

    const displayError = useCallback(
        (message: string) => {
            notifications.show(message, { severity: "error", autoHideDuration: 3000 });
        },
        [notifications]
    );

    useEffect(() => {
        const isApiError = (response: Company | ApiError): response is ApiError => {
            return (response as ApiError).message !== undefined;
        };

        const loadData = async () => {
            const response = id !== undefined ? await getCompany(id) : await getProfile();

            if (isApiError(response)) {
                displayError(response.message);
            } else {
                setCompanyData(response);
                setReadonly(id !== undefined);
            }
        };

        loadData();
    }, [id, displayError]);

    const rating = useMemo(() => {
        if (companyData === undefined || companyData.companyReviews.length === 0) {
            return "-";
        }

        let rating =
            companyData.companyReviews.map((r) => r.grade).reduce((acc, val) => (acc += val)) / companyData.companyReviews.length;

        return rating.toFixed(2);
    }, [companyData]);

    const applyChanges = async (updatedCompanyData: CompanyToUpdate) => {
        if (companyData === undefined) {
            return;
        }

        const response = await updateCompany(companyData.id, updatedCompanyData);

        if (isApiError(response)) {
            displayError(response.message);
            return;
        } else {
            var newCompanyData = { ...companyData };

            newCompanyData.name = response.name;
            newCompanyData.email = response.email;
            newCompanyData.contactPerson = response.contactPerson;
            setCompanyData(newCompanyData);
        }

        await sendImage();

        setEditMode(false);
        window.location.reload();
    };

    const sendImage = async () => {
        if (image === undefined || companyData === undefined) {
            return;
        }

        const isApiError = (response: boolean | ApiError): response is ApiError => {
            return (response as ApiError).message !== undefined;
        };

        const response = await updateAvatar(companyData.id, image);

        if (isApiError(response)) {
            displayError(response.message);
        } else {
            setImage(undefined);
        }
    };

    if (!companyData) {
        return <></>;
    }

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
                    justifyContent={"space-between"}
                    flexWrap={"nowrap"}
                    sx={{
                        paddingLeft: { xs: "23px", lg: "40px" },
                        paddingRight: { xs: "23px", lg: "40px" },
                        marginTop: { xs: "0", md: "40px" },
                    }}
                >
                    <NavigateBack label={id === undefined ? "Мои заказы" : "Назад"} to={id === undefined ? "/my-orders" : -1} />
                    {!readonly && !editMode && companyData?.id !== undefined && (
                        <IconButton style={{ padding: 0, color: "#000000" }} onClick={() => setEditMode(true)}>
                            <EditIcon sx={{ fontSize: { xs: 30, md: 40, lg: 50 } }}></EditIcon>
                        </IconButton>
                    )}
                </Grid>
                <Grid
                    container
                    item
                    pb={"46px"}
                    sx={{
                        paddingLeft: { xs: "1px", md: "33px", lg: "150px" },
                        marginTop: { xs: "0", md: "40px" },
                    }}
                >
                    <Grid container item alignItems={"center"} sx={{ gap: { xs: "5px", md: "50px" } }}>
                        <Avatar
                            src={`http://localhost:7201/api/companies/${companyData.id}/avatar?jwt=${localStorage.getItem("accessToken")}`}
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
                                    {companyData.name}
                                </Typography>
                                <Typography variant="h3">{companyData.email}</Typography>
                            </Grid>
                        ) : (
                            <Button component="label" variant="outlined">
                                {image !== undefined ? image.name : "ВЫБРАТЬ ФАЙЛ"}
                                <VisuallyHiddenInput
                                    type="file"
                                    name="avatar"
                                    onChange={(e) => setImage(e.target.files![0])}
                                    accept="image/png"
                                />
                            </Button>
                        )}
                    </Grid>
                    {!editMode ? (
                        <>
                            <ProfileCards
                                registrationDate={
                                    companyData.createdAt !== undefined
                                        ? moment.utc(companyData.createdAt).format("DD-MM-YYYY")
                                        : "-"
                                }
                                ordersCount={companyData.orders.length}
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
                                        label="ФИО контактного лица"
                                        value={[
                                            companyData.contactPerson.surname,
                                            companyData.contactPerson.name,
                                            companyData.contactPerson.patronymic,
                                        ].join(" ")}
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
                                        label="Эл. почта"
                                        value={companyData.contactPerson.email}
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
                                        value={companyData.contactPerson.phone}
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
                            <Grid
                                container
                                item
                                flexDirection={"column"}
                                sx={{
                                    marginTop: { xs: "10px", md: "50px" },
                                    paddingLeft: { xs: "5px", md: 0 },
                                }}
                            >
                                {companyData.companyReviews.length > 0 ? (
                                    <>
                                        <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                            Отзывы
                                        </Typography>

                                        <Grid container item maxWidth={"700px"} flexDirection={"column"} gap={"25px"}>
                                            {companyData.companyReviews.map((review) => (
                                                <CompanyReview key={review.id} companyReview={review} />
                                            ))}
                                        </Grid>
                                    </>
                                ) : (
                                    <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                                        Отзывов пока нет
                                    </Typography>
                                )}
                            </Grid>
                        </>
                    ) : (
                        <CompanyEditForm
                            companyData={companyData}
                            cancelHandler={() => setEditMode(false)}
                            applyCallback={applyChanges}
                        />
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default CompanyProfilePage;
