import { Avatar, Button, Card, CardActions, CardHeader, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { USER_PROFILE_ROUTE } from "../../router/consts";
import { useEffect, useState } from "react";
import useUserApi from "../../hooks/useUserApi";

export interface RequestUser {
    id: string;
    firstName: string;
    lastName: string;
    rating: number;
}

export interface OrderRequestProps {
    id: string;
    user: RequestUser;
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
}

const OrderRequest = ({ id, user, onAccept, onReject }: OrderRequestProps) => {
    const navigate = useNavigate();

    const [avatarSrc, setAvatarSrc] = useState<string>("");

    const { getProfileImage } = useUserApi();

    useEffect(() => {
        const loadAvatar = async () => {
            const response = await getProfileImage(user.id);
            if (response && "error" in response) {
                return;
            }

            setAvatarSrc(URL.createObjectURL(response.blob));
        };

        loadAvatar();
    }, [user.id, getProfileImage]);

    return (
        <Card sx={{ maxWidth: 345, borderRadius: 3, boxShadow: 3 }}>
            <CardHeader
                avatar={
                    <Avatar
                        src={avatarSrc}
                        alt={`${user.firstName} ${user.lastName}`}
                        onClick={() => {
                            navigate(USER_PROFILE_ROUTE.replace(":id", user.id));
                        }}
                        sx={{ "&:hover": { cursor: "pointer" } }}
                    />
                }
                title={`${user.firstName} ${user.lastName}`}
                subheader={<Rating value={user.rating} precision={0.5} readOnly size="small" />}
                slotProps={{
                    title: { sx: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "160px" } },
                }}
            />
            <CardActions sx={{ justifyContent: "flex-end", gap: 1 }}>
                <Button variant="text" color="success" onClick={() => onAccept(id)}>
                    Принять
                </Button>
                <Button variant="text" color="error" onClick={() => onReject(id)}>
                    Отклонить
                </Button>
            </CardActions>
        </Card>
    );
};

export default OrderRequest;
