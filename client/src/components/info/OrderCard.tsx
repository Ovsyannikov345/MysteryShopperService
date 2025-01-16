import { useNavigate } from "react-router-dom";
import { Order } from "./../../hooks/useOrderApi";
import { Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid2 as Grid, Typography } from "@mui/material";
import moment from "moment";
import { Timer, Map, MonetizationOn } from "@mui/icons-material";
import useCompanyApi from "../../hooks/useCompanyApi";
import { useEffect, useState } from "react";

const OrderCard = ({ orderData }: { orderData: Order }) => {
    const navigate = useNavigate();

    const { getProfileImage: getCompanyProfileImage } = useCompanyApi();

    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const loadImage = async () => {
            const imageResponse = await getCompanyProfileImage(orderData.company.id);

            if ("error" in imageResponse) {
                return;
            }

            setImageSrc(URL.createObjectURL(imageResponse.blob));
        };

        loadImage();
    }, [getCompanyProfileImage, orderData.company.id]);

    return (
        <Card sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }} elevation={5}>
            <CardHeader
                avatar={<Avatar src={imageSrc} alt={`${orderData.company.name}'s avatar`}></Avatar>}
                title={orderData.company.name}
                subheader={moment(orderData.createdAt).format("LL")}
            />
            <CardContent>
                <Typography variant="h6" component="div">
                    {orderData.title}
                </Typography>
                <Grid container wrap="nowrap" spacing={1}>
                    <Map />
                    <Typography variant="body1">{orderData.place}</Typography>
                </Grid>
                <Grid container wrap="nowrap" spacing={1} mt={1}>
                    <Timer />
                    <Typography variant="body1">
                        {moment.duration(orderData.timeToComplete).days()} days{" "}
                        {moment.duration(orderData.timeToComplete).hours()} hours
                    </Typography>
                </Grid>
                <Grid container wrap="nowrap" spacing={1} mt={1}>
                    <MonetizationOn />
                    <Typography variant="body1">{orderData.price} BYN</Typography>
                </Grid>
            </CardContent>
            <CardActions sx={{ flexGrow: 1, alignItems: "flex-end" }}>
                {/* TODO implement */}
                <Button variant="contained" fullWidth onClick={() => console.log("navigated to order " + orderData.id)}>
                    Details
                </Button>
            </CardActions>
        </Card>
    );
};

export default OrderCard;
