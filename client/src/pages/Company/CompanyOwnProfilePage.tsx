import { useEffect, useMemo, useRef, useState } from "react";
import useCompanyApi, { Company } from "../../hooks/useCompanyApi";
import { useNotifications } from "@toolpad/core";
import CompanyHeader from "../../components/headers/CompanyHeader";
import { Avatar, Button, Collapse, Container, Grid2 as Grid, Pagination, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Reviews } from "@mui/icons-material";
import backgroundImage from "../../images/background.jpg";
import ProfilePageSkeleton from "../../components/skeletons/ProfilePageSkeleton";
import CompanyEditForm, { CompanyEditData } from "../../components/forms/CompanyEditForm";
import UpdateProfileImageModal from "../../components/modals/UpdateProfileImageModal";
import ReviewCard from "../../components/info/ReviewCard";
import { Roles } from "../../utils/enums/roles";

const CompanyOwnProfilePage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const { getMyCompanyData, getProfileImage, updateCompanyData, updateProfileImage } = useCompanyApi();

    const [companyData, setCompanyData] = useState<Company>();

    const [imageSrc, setImageSrc] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [displayReviews, setDisplayReviews] = useState(false);

    const reviewsPerPage = 5;

    const reviewHeaderRef = useRef<HTMLDivElement>(null);

    const [isChangingImage, setIsChangingImage] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            const response = await getMyCompanyData();

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            setCompanyData(response);

            const imageResponse = await getProfileImage(response.id);

            if ("error" in imageResponse) {
                return;
            }

            setImageSrc(URL.createObjectURL(imageResponse.blob));
        };

        loadProfile();
    }, [getMyCompanyData, getProfileImage, notifications]);

    const rating = useMemo(() => {
        if (!companyData || companyData.companyReviews.length === 0) {
            return 0;
        }

        let rating = companyData.companyReviews.map((c) => c.grade).reduce((acc, val) => (acc += val)) / companyData.companyReviews.length;

        return parseFloat(rating.toFixed(2));
    }, [companyData]);

    const paginatedReviews = useMemo(() => {
        if (!companyData || companyData.companyReviews.length === 0) {
            return [];
        }

        const startIndex = (currentPage - 1) * reviewsPerPage;

        const endIndex = startIndex + reviewsPerPage;

        return companyData.companyReviews.slice(startIndex, endIndex);
    }, [companyData, currentPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        reviewHeaderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleDataUpdate = async (updatedData: CompanyEditData) => {
        if (!companyData) {
            return;
        }

        const response = await updateCompanyData({
            ...updatedData,
            id: companyData.id,
            contactPerson: {
                ...updatedData.contactPerson,
                id: companyData.contactPerson.id,
                patronymic: updatedData.contactPerson.patronymic,
            },
        });

        if ("error" in response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        setCompanyData(response);
        notifications.show("Changes saved", { severity: "success", autoHideDuration: 3000 });
    };

    const handleImageSave = async (file: File): Promise<boolean> => {
        const response = await updateProfileImage(file);

        if (response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });

            return false;
        }

        notifications.show("Image saved", { severity: "success", autoHideDuration: 3000 });

        const imageResponse = await getProfileImage(companyData!.id);

        if ("error" in imageResponse) {
            return true;
        }

        setImageSrc(URL.createObjectURL(imageResponse.blob));

        return true;
    };

    return (
        <>
            <Grid container minHeight={"100%"} flexDirection={"column"}>
                <CompanyHeader />
                <Grid
                    container
                    flexDirection={"column"}
                    flexGrow={1}
                    sx={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundAttachment: "fixed",
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <Container
                        maxWidth="md"
                        sx={{
                            mt: isMediumScreen ? 0 : 2,
                            mb: isMediumScreen ? 0 : 2,
                            bgcolor: "white",
                            borderRadius: isMediumScreen ? 0 : "10px",
                        }}
                    >
                        {!companyData ? (
                            <ProfilePageSkeleton />
                        ) : (
                            <>
                                <Grid
                                    container
                                    spacing={4}
                                    alignItems="flex-start"
                                    sx={{ p: isMediumScreen ? 1 : 4 }}
                                    mt={isMediumScreen ? 2 : 0}
                                >
                                    <Grid container direction="column" alignItems={"center"}>
                                        <Avatar sx={{ width: 150, height: 150 }} alt={companyData.name + " avatar"} src={imageSrc} />
                                        <Button variant="contained" onClick={() => setIsChangingImage(true)}>
                                            Choose image
                                        </Button>
                                    </Grid>
                                    <Grid>
                                        <Typography variant="h4" fontWeight="bold">
                                            {companyData.name}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Contact Person: {companyData.contactPerson.name} {companyData.contactPerson.surname}
                                        </Typography>
                                        <Typography variant="subtitle1">Phone: {companyData.contactPerson.phone}</Typography>
                                        <Typography variant="subtitle1">Email: {companyData.contactPerson.email}</Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="h5" ref={reviewHeaderRef}>
                                    Rating
                                </Typography>
                                <Rating value={rating} precision={0.5} size="large" readOnly sx={{ mt: 1 }} />
                                <Grid container mt={1} mb={2}>
                                    <Button variant="contained" startIcon={<Reviews />} onClick={() => setDisplayReviews(!displayReviews)}>
                                        {displayReviews ? "Hide Reviews" : `Show Reviews (${companyData.companyReviews.length})`}
                                    </Button>
                                </Grid>
                                <Collapse in={displayReviews}>
                                    <Grid container spacing={3} mt={1} mb={3}>
                                        {paginatedReviews.map((review, index) => (
                                            <ReviewCard
                                                key={index}
                                                sender={{
                                                    id: review.user.id,
                                                    name: review.user.name + " " + review.user.surname,
                                                    role: Roles.User,
                                                }}
                                                grade={review.grade}
                                                text={review.text}
                                            />
                                        ))}
                                    </Grid>
                                    <Grid container justifyContent="center" mb={3}>
                                        <Pagination
                                            count={Math.ceil((companyData.companyReviews.length || 0) / reviewsPerPage)}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                        />
                                    </Grid>
                                </Collapse>
                                <Typography variant="h5">Edit information</Typography>
                                <CompanyEditForm initialValues={companyData} onSubmit={handleDataUpdate} />
                            </>
                        )}
                    </Container>
                </Grid>
            </Grid>
            <UpdateProfileImageModal open={isChangingImage} onClose={() => setIsChangingImage(false)} onSave={handleImageSave} />
        </>
    );
};

export default CompanyOwnProfilePage;
