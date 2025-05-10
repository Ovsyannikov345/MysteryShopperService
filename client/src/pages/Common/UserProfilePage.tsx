import { Avatar, Container, Grid2 as Grid, Pagination, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import useUserApi, { User } from "../../hooks/useUserApi";
import { useEffect, useMemo, useRef, useState } from "react";
import UserHeader from "../../components/headers/UserHeader";
import backgroundImage from "../../images/background.jpg";
import NavigateBack from "../../components/buttons/NavigateBack";
import ProfilePageSkeleton from "../../components/skeletons/ProfilePageSkeleton";
import ReviewCard from "../../components/info/ReviewCard";
import moment from "moment";
import { Roles } from "../../utils/enums/roles";
import { useNavigate, useParams } from "react-router-dom";
import ProfileCard from "../../components/info/ProfileCard";
import CompanyHeader from "../../components/headers/CompanyHeader";

const UserProfilePage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const { id } = useParams();

    const navigate = useNavigate();

    const { getUserData, getProfileImage } = useUserApi();

    const [userData, setUserData] = useState<User>();

    const [imageSrc, setImageSrc] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const reviewsPerPage = 5;

    const reviewHeaderRef = useRef<HTMLDivElement>(null);

    const userRole = useMemo(() => {
        return Number(localStorage.getItem("role")) as Roles;
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            if (!id) {
                navigate("/");
                return;
            }

            const response = await getUserData(id);

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
    }, [getProfileImage, getUserData, id, navigate, notifications]);

    const rating = useMemo(() => {
        if (!userData || userData.userReviews.length === 0) {
            return 0;
        }

        let rating = userData.userReviews.map((r) => r.grade).reduce((acc, val) => acc + val, 0) / userData.userReviews.length;

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

    return (
        <Grid container minHeight={"100%"} flexDirection={"column"}>
            {userRole === Roles.Company ? <CompanyHeader /> : userRole === Roles.User ? <UserHeader /> : <></>}
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
                                <Grid container>
                                    <Avatar
                                        sx={{ width: 150, height: 150 }}
                                        alt={`${userData.name} ${userData.surname}'s avatar`}
                                        src={imageSrc}
                                    />
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
                                    <Typography variant="subtitle1">{userData.workingExperience}</Typography>
                                    <Typography
                                        variant="subtitle1"
                                        bgcolor={theme.palette.divider}
                                        borderRadius={"10px"}
                                        p={"5px 10px"}
                                        mt={1}
                                    >
                                        {userData.description}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} mt={4}>
                                <ProfileCard title="Member for" value={moment(userData.createdAt).fromNow(true)} />
                                <ProfileCard title="Orders" value={userData.orders.length} />
                                <ProfileCard title="Reviews" value={userData.userReviews.length} />
                                <ProfileCard
                                    title="Rating"
                                    value={<Rating value={rating} precision={0.5} size="large" readOnly />}
                                />
                            </Grid>

                            <Typography variant="h5" mt={4} ref={reviewHeaderRef}>
                                Company Reviews
                            </Typography>
                            <Grid container spacing={3} mt={2} mb={3}>
                                {paginatedReviews.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        sender={{
                                            id: review.company.id,
                                            name: review.company.name,
                                            role: Roles.Company,
                                        }}
                                        grade={review.grade}
                                        text={review.text}
                                        createdAt={review.createdAt}
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
                        </>
                    )}
                </Container>
            </Grid>
        </Grid>
    );
};

export default UserProfilePage;
