import { Avatar, Button, Collapse, Container, Grid2 as Grid, Pagination, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import useUserApi, { User } from "../../hooks/useUserApi";
import { useEffect, useMemo, useRef, useState } from "react";
import UserHeader from "../../components/headers/UserHeader";
import backgroundImage from "../../images/background.jpg";
import NavigateBack from "../../components/NavigateBack";
import ProfilePageSkeleton from "../../components/skeletons/ProfilePageSkeleton";
import { Reviews } from "@mui/icons-material";
import ReviewCard from "../../components/info/ReviewCard";
import UpdateProfileImageModal from "../../components/modals/UpdateProfileImageModal";
import moment from "moment";
import { Roles } from "../../utils/enums/roles";
import UserEditForm, { UserEditData } from "../../components/forms/UserEditForm";

const UserOwnProfilePage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const { getMyUserData, getProfileImage, updateUserData, updateProfileImage } = useUserApi();

    const [userData, setUserData] = useState<User>();

    const [imageSrc, setImageSrc] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [displayReviews, setDisplayReviews] = useState(false);

    const reviewsPerPage = 5;

    const reviewHeaderRef = useRef<HTMLDivElement>(null);

    const [isChangingImage, setIsChangingImage] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            const response = await getMyUserData();

            console.log(response);

            if ("error" in response) {
                notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
                return;
            }

            setUserData(response);

            const imageResponse = await getProfileImage(response.id);

            if ("error" in imageResponse) {
                return;
            }

            setImageSrc(URL.createObjectURL(imageResponse.blob));
        };

        loadProfile();
    }, []);

    const rating = useMemo(() => {
        if (!userData || userData.userReviews.length === 0) {
            return 0;
        }

        let rating = userData.userReviews.map((r) => r.grade).reduce((acc, val) => (acc += val)) / userData.userReviews.length;

        return parseFloat(rating.toFixed(2));
    }, [userData]);

    const paginatedReviews = useMemo(() => {
        if (!userData || userData.userReviews.length === 0) {
            return [];
        }

        const startIndex = (currentPage - 1) * reviewsPerPage;

        const endIndex = startIndex + reviewsPerPage;

        return userData.userReviews.slice(startIndex, endIndex);
    }, [userData, currentPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
        reviewHeaderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleDataUpdate = async (updatedData: UserEditData) => {
        if (!userData) {
            return;
        }

        const response = await updateUserData({
            ...updatedData,
            id: userData.id,
            birthDate: updatedData.birthDate ? moment(updatedData.birthDate).toDate() : undefined,
            workingExperience: updatedData.workingExperience ? updatedData.workingExperience : undefined,
            city: updatedData.city ? updatedData.city : undefined,
            description: updatedData.description ? updatedData.description : undefined,
        });

        if ("error" in response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        setUserData(response);
        notifications.show("Changes saved", { severity: "success", autoHideDuration: 3000 });
    };

    const handleImageSave = async (file: File): Promise<boolean> => {
        const response = await updateProfileImage(file);

        if (response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });

            return false;
        }

        notifications.show("Image saved", { severity: "success", autoHideDuration: 3000 });

        const imageResponse = await getProfileImage(userData!.id);

        if ("error" in imageResponse) {
            return true;
        }

        setImageSrc(URL.createObjectURL(imageResponse.blob));

        return true;
    };

    return (
        <>
            <Grid container minHeight={"100%"} flexDirection={"column"}>
                <UserHeader />
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
                    {!isMediumScreen && (
                        <Container
                            maxWidth="md"
                            style={{ paddingLeft: 0 }}
                            sx={{
                                mt: isMediumScreen ? 0 : 2,
                            }}
                        >
                            <NavigateBack to={-1} label="Back" />
                        </Container>
                    )}
                    <Container
                        maxWidth="md"
                        sx={{
                            mt: isMediumScreen ? 0 : 2,
                            mb: isMediumScreen ? 0 : 2,
                            bgcolor: "white",
                            borderRadius: isMediumScreen ? 0 : "10px",
                        }}
                    >
                        {isMediumScreen && (
                            <Grid mt={3}>
                                <NavigateBack to={-1} label="Back" />
                            </Grid>
                        )}
                        {!userData ? (
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
                                        <Avatar
                                            sx={{ width: 150, height: 150 }}
                                            alt={`${userData.name} ${userData.surname}'s avatar`}
                                            src={imageSrc}
                                        />
                                        <Button variant="contained" onClick={() => setIsChangingImage(true)}>
                                            Choose image
                                        </Button>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: "grow" }}>
                                        <Typography variant="h4" fontWeight="bold">
                                            {`${userData.name} ${userData.surname}`}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            {userData.birthDate ? moment.utc().diff(moment(userData.birthDate), "year") + "y.o." : ""}
                                            {userData.birthDate && userData.city && ", "}
                                            {userData.city ? userData.city : ""}
                                        </Typography>
                                        <Typography variant="subtitle1">{userData.description}</Typography>
                                    </Grid>
                                </Grid>
                                <Typography variant="h5" ref={reviewHeaderRef}>
                                    Rating
                                </Typography>
                                <Rating value={rating} precision={0.5} size="large" readOnly sx={{ mt: 1 }} />
                                <Grid container mt={1} mb={2}>
                                    <Button variant="contained" startIcon={<Reviews />} onClick={() => setDisplayReviews(!displayReviews)}>
                                        {displayReviews ? "Hide Reviews" : `Show Reviews (${userData.userReviews.length})`}
                                    </Button>
                                </Grid>
                                <Collapse in={displayReviews}>
                                    <Grid container spacing={3} mt={1} mb={3}>
                                        {paginatedReviews.map((review, index) => (
                                            <ReviewCard
                                                key={index}
                                                sender={{
                                                    id: review.company.id,
                                                    name: review.company.name,
                                                    role: Roles.Company,
                                                }}
                                                grade={review.grade}
                                                text={review.text}
                                            />
                                        ))}
                                    </Grid>
                                    <Grid container justifyContent="center" mb={3}>
                                        <Pagination
                                            count={Math.ceil((userData.userReviews.length || 0) / reviewsPerPage)}
                                            page={currentPage}
                                            onChange={handlePageChange}
                                            color="primary"
                                        />
                                    </Grid>
                                </Collapse>
                                <Typography variant="h5">Edit information</Typography>
                                <UserEditForm initialValues={userData} onSubmit={handleDataUpdate} />
                            </>
                        )}
                    </Container>
                </Grid>
            </Grid>
            <UpdateProfileImageModal open={isChangingImage} onClose={() => setIsChangingImage(false)} onSave={handleImageSave} />
        </>
    );
};

export default UserOwnProfilePage;
