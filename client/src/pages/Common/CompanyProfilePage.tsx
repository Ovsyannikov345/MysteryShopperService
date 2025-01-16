import { useEffect, useMemo, useRef, useState } from "react";
import useCompanyApi, { Company } from "../../hooks/useCompanyApi";
import { useNotifications } from "@toolpad/core";
import CompanyHeader from "../../components/headers/CompanyHeader";
import { Avatar, Container, Grid2 as Grid, Pagination, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
import backgroundImage from "../../images/background.jpg";
import moment from "moment";
import ProfileCard from "../../components/info/ProfileCard";
import NavigateBack from "../../components/NavigateBack";
import ProfilePageSkeleton from "../../components/skeletons/ProfilePageSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import ReviewCard from "../../components/info/ReviewCard";
import { Roles } from "../../utils/enums/roles";

const CompanyOwnProfilePage = () => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const notifications = useNotifications();

    const { id } = useParams();

    const navigate = useNavigate();

    const { getCompanyData, getProfileImage } = useCompanyApi();

    const [companyData, setCompanyData] = useState<Company>();

    const [imageSrc, setImageSrc] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const reviewsPerPage = 5;

    const reviewHeaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            if (!id) {
                navigate("/");
                return;
            }

            const response = await getCompanyData(id);

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
    }, [getCompanyData, getProfileImage, id, navigate, notifications]);

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

    return (
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
                    {!companyData ? (
                        <ProfilePageSkeleton />
                    ) : (
                        <>
                            <Grid container spacing={4} alignItems="center" sx={{ p: isMediumScreen ? 1 : 4 }} mt={isMediumScreen ? 2 : 0}>
                                <Grid container>
                                    <Avatar sx={{ width: 150, height: 150 }} alt={companyData.name + " avatar"} src={imageSrc} />
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
                            <Grid container spacing={1} mt={4}>
                                <ProfileCard title="Member for" value={moment(companyData.createdAt).fromNow(true)} />
                                <ProfileCard title="Orders" value={companyData.orders.length} />
                                <ProfileCard title="Reviews" value={companyData.companyReviews.length} />
                                <ProfileCard title="Rating" value={<Rating value={rating} precision={0.5} size="large" readOnly />} />
                            </Grid>
                            <Typography variant="h5" mt={4} ref={reviewHeaderRef}>
                                User Reviews
                            </Typography>
                            <Grid container spacing={3} mt={2} mb={3}>
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
                                    count={Math.ceil((companyData?.companyReviews.length || 0) / reviewsPerPage)}
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

export default CompanyOwnProfilePage;
