import React from "react";
import { Grid2 as Grid, Skeleton } from "@mui/material";

const CompanyOrderDetailsSkeleton = () => {
    return (
        <>
            {/* Title */}
            <Grid container size={12} spacing={1}>
                <Skeleton variant="text" width="60%" height={40} />
            </Grid>

            {/* Order Info */}
            <Grid container size={12} spacing={2}>
                <Grid size={12}>
                    <Skeleton variant="text" width="30%" height={32} />
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="45%" />
                    <Skeleton variant="text" width="60%" />
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

            {/* Active requests */}
            <Grid container size={12} flexDirection={"column"} spacing={1}>
                <Skeleton variant="text" width="30%" height={32} />
                <Grid container spacing={2}>
                    {[1, 2].map((index) => (
                        <Grid key={index} size={12}>
                            <Skeleton variant="rectangular" width="100%" height={100} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </>
    );
};

export default CompanyOrderDetailsSkeleton;
