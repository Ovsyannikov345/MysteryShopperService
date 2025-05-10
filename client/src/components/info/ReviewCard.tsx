import { Avatar, Grid2 as Grid, IconButton, Paper, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../utils/enums/roles";
import { COMPANY_PROFILE_ROUTE, USER_PROFILE_ROUTE } from "../../router/consts";
import useCompanyApi from "../../hooks/useCompanyApi";
import useUserApi from "../../hooks/useUserApi";
import { useEffect, useState } from "react";
import moment, { Moment } from "moment";

interface ReviewCardProps {
    sender: {
        id: string;
        name: string;
        role: Roles;
    };
    grade: number;
    text: string;
    createdAt: Moment;
}

const ReviewCard = ({ sender, grade, text, createdAt }: ReviewCardProps) => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const navigate = useNavigate();

    const { getProfileImage: getCompanyProfileImage } = useCompanyApi();

    const { getProfileImage: getUserProfileImage } = useUserApi();

    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const loadImage = async () => {
            const imageResponse =
                sender.role === Roles.Company ? await getCompanyProfileImage(sender.id) : await getUserProfileImage(sender.id);

            if ("error" in imageResponse) {
                return;
            }

            setImageSrc(URL.createObjectURL(imageResponse.blob));
        };

        loadImage();
    }, [getCompanyProfileImage, getUserProfileImage, sender.id, sender.role]);

    const handleOpenProfile = () => {
        let route = sender.role === Roles.Company ? COMPANY_PROFILE_ROUTE : USER_PROFILE_ROUTE;

        navigate(route.replace(":id", sender.id));
    };

    return (
        <Grid size={12}>
            <Paper
                elevation={0}
                sx={{
                    p: isMediumScreen ? 1 : 3,
                    border: "2px solid",
                    borderColor: theme.palette.primary.dark,
                    borderRadius: "20px",
                }}
            >
                <Grid container direction={"column"} spacing={2}>
                    <Grid container>
                        <IconButton sx={{ p: 0 }} onClick={handleOpenProfile}>
                            <Avatar sx={{ width: 56, height: 56 }} src={imageSrc} alt={`${sender.name}'s avatar`} />
                        </IconButton>
                        <Grid container direction={"column"} spacing={0} mt={"-5px"}>
                            <Typography variant="h6">{sender.name}</Typography>
                            <Typography variant="subtitle1">{moment(createdAt).format("MMMM Do YYYY, HH:mm")}</Typography>
                        </Grid>
                    </Grid>
                    <Grid mt={"-5px"}>
                        <Rating value={grade} precision={0.5} readOnly sx={{ ml: "-2px" }} />
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {text}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

export default ReviewCard;
