import { Avatar, Grid2 as Grid, IconButton, Paper, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Roles } from "../../utils/enums/roles";
import { COMPANY_PROFILE_ROUTE, USER_PROFILE_ROUTE } from "../../router/consts";

interface ReviewCardProps {
    sender: {
        id: string;
        name: string;
        role: Roles;
    };
    grade: number;
    text: string;
}

// TODO Add avatars.

const ReviewCard = ({ sender, grade, text }: ReviewCardProps) => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    const navigate = useNavigate();

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
                            <Avatar sx={{ width: 56, height: 56 }} />
                        </IconButton>
                        <Grid container direction={"column"} spacing={0} mt={"-5px"}>
                            <Typography variant="h6">{sender.name}</Typography>
                            <Rating value={grade} precision={0.5} readOnly sx={{ ml: "-2px" }} />
                        </Grid>
                    </Grid>
                    <Grid mt={"-5px"}>
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
