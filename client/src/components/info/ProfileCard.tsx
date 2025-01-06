import { Card, CardContent, Grid2 as Grid, Typography, useTheme } from "@mui/material";

interface ProfileCardProps {
    title: string;
    value: any;
}

const ProfileCard = ({ title, value }: ProfileCardProps) => {
    const theme = useTheme();

    return (
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
                variant="outlined"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 1,
                    borderWidth: "2px",
                    borderColor: theme.palette.primary.dark,
                }}
            >
                <CardContent sx={{ p: 1 }}>
                    <Typography variant="h6" textAlign={"center"}>
                        {title}
                    </Typography>
                    <Typography variant="h4" color={theme.palette.primary.dark} textAlign={"center"}>
                        {value}
                    </Typography>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ProfileCard;
