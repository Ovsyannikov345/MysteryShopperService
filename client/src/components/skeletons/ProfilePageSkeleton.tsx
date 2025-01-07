import React from "react";
import { Grid2 as Grid, Paper, Skeleton, Typography, useMediaQuery, useTheme } from "@mui/material";

const ProfilePageSkeleton = () => {
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <Grid container spacing={4} alignItems="center" sx={{ p: isMediumScreen ? 1 : 4 }} mt={isMediumScreen ? 2 : 0}>
                <Grid container>
                    <Skeleton variant="circular" width={120} height={120} />
                </Grid>
                <Grid>
                    <Typography variant="h4" fontWeight="bold">
                        <Skeleton width={200} />
                    </Typography>
                    <Typography variant="subtitle1">
                        <Skeleton width={250} />
                    </Typography>
                    <Typography variant="subtitle1">
                        <Skeleton width={180} />
                    </Typography>
                    <Typography variant="subtitle1">
                        <Skeleton width={220} />
                    </Typography>
                </Grid>
            </Grid>
            <Grid container spacing={1} mt={4}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: isMediumScreen ? 1 : 3,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                <Skeleton width="80%" />
                            </Typography>
                            <Typography variant="h6">
                                <Skeleton width="50%" />
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="h5" mt={4}>
                <Skeleton width={200} />
            </Typography>
            <Grid container spacing={3} mt={2} mb={3}>
                {Array.from({ length: 3 }).map((_, index) => (
                    <Grid size={12} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: isMediumScreen ? 1 : 3,
                            }}
                        >
                            <Grid container direction={"column"} spacing={2}>
                                <Grid container alignItems="center">
                                    <Skeleton variant="circular" width={56} height={56} />
                                    <Grid container direction={"column"} spacing={0} mt={"-5px"}>
                                        <Typography variant="h6">
                                            <Skeleton width={120} />
                                        </Typography>
                                        <Skeleton width={120} />
                                    </Grid>
                                </Grid>
                                <Grid mt={"-5px"}>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                        <Skeleton width="80%" />
                                        <Skeleton width="60%" />
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default ProfilePageSkeleton;
