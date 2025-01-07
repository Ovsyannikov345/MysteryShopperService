import { Avatar, Grid2 as Grid, Paper, Rating, Typography, useMediaQuery, useTheme } from "@mui/material";

interface ReviewCardProps {
    senderName: string;
    grade: number;
    text: string;
}

// TODO Add avatars.

const ReviewCard = ({ senderName, grade, text }: ReviewCardProps) => {
    const theme = useTheme();

    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

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
                        <Avatar sx={{ width: 56, height: 56 }} />
                        <Grid container direction={"column"} spacing={0} mt={"-5px"}>
                            <Typography variant="h6">{senderName}</Typography>
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
