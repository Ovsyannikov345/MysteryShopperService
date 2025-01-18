import { Card, CardHeader, CardContent, CardActions, Skeleton, Grid2 as Grid } from "@mui/material";

const OrderCardSkeleton = () => {
    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={5}>
            <CardHeader
                avatar={<Skeleton variant="circular" width={40} height={40} />}
                title={<Skeleton variant="text" width="50%" />}
                subheader={<Skeleton variant="text" width="30%" />}
            />
            <CardContent>
                <Skeleton variant="text" width="70%" height={32} />
                <Grid container wrap="nowrap" spacing={1} mt={1}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="60%" />
                </Grid>
                <Grid container wrap="nowrap" spacing={1} mt={2}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="50%" />
                </Grid>
                <Grid container wrap="nowrap" spacing={1} mt={2}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="40%" />
                </Grid>
            </CardContent>
            <CardActions sx={{ flexGrow: 1, alignItems: "flex-end" }}>
                <Skeleton variant="rectangular" height={36} width="100%" />
            </CardActions>
        </Card>
    );
};

export default OrderCardSkeleton;
