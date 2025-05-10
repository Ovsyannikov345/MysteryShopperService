import React from "react";
import { Grid2 as Grid, Skeleton, Stack } from "@mui/material";

const UserOrderDetailsSkeleton = () => {
    return (
        <>
            {/* Title */}
            <Grid container size={12} flexDirection={"column"} spacing={1}>
                <Skeleton variant="text" width="60%" height={40} />
            </Grid>

            {/* Order and Company Info section */}
            <Grid container size={12} spacing={2} justifyContent={"space-between"}>
                {/* Order Info */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="text" width="30%" height={32} />
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="45%" />
                    <Skeleton variant="text" width="60%" />
                </Grid>

                {/* Company Info */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Skeleton variant="text" width="35%" height={32} />
                    <Grid container wrap="nowrap" spacing={2}>
                        {/* Company Avatar */}
                        <Grid mt={0.5}>
                            <Skeleton variant="circular" width={50} height={50} />
                        </Grid>
                        {/* Company Details */}
                        <Grid container flexDirection={"column"} spacing={0}>
                            <Skeleton variant="text" width="60%" />
                            <Skeleton variant="text" width="80%" />
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Skeleton variant="rounded" width={120} height={24} />
                                <Skeleton variant="text" width={80} />
                            </Stack>
                            <Skeleton variant="rectangular" width="100%" height={36} sx={{ mt: 1 }} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

            {/* Description */}
            <Grid container size={12} flexDirection={"column"}>
                <Skeleton variant="text" width="30%" height={32} />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="80%" />
                <Grid mt={1}>
                    <Skeleton variant="rectangular" width={120} height={32} />
                </Grid>
            </Grid>

            {/* Order Actions */}
            <Grid container size={12} flexDirection={"column"} spacing={1}>
                <Grid container spacing={2}>
                    <Grid size={12}>
                        <Skeleton variant="rectangular" width="100%" height={100} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default UserOrderDetailsSkeleton;
