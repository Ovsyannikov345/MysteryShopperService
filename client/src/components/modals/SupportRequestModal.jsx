import React, { useState } from "react";
import { Dialog, Typography, Grid, Button, TextField } from "@mui/material";
import { createRequest } from "../../api/supportRequestApi";

const SupportRequestModal = ({ isOpen, acceptHandler, declineHandler, errorHandler }) => {
    const [request, setRequest] = useState({
        text: "",
    });

    const closeModal = () => {
        declineHandler();
    };

    const sendRequest = async () => {
        if (request.text === "") {
            errorHandler("Заполните описание проблемы");
            return;
        }

        const response = await createRequest(request);

        if (!response) {
            errorHandler("Сервис временно недоступен");
            return;
        }

        if (response.status === 401) {
            localStorage.removeItem("jwt");
            localStorage.removeItem("role");
            window.location.reload();
        }

        if (response.status >= 300) {
            errorHandler("Ошибка при отправке запроса. Код: " + response.status);
            return;
        }

        setRequest({
            text: "",
        });
        acceptHandler();
    };

    return (
        <Dialog open={isOpen} onClose={closeModal}>
            <Grid
                container
                item
                width={"483px"}
                pl={"28px"}
                pr={"28px"}
                pb={"25px"}
                flexDirection={"column"}
                alignItems={"center"}
                gap={"20px"}
            >
                <Typography variant="h2" height={"69px"} display={"flex"} alignItems={"center"}>
                    Опишите вашу проблему
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    label="Описание"
                    multiline
                    minRows={4}
                    required
                    value={request.text}
                    onChange={(e) => setRequest({ ...request, text: e.target.value })}
                />
                <Grid container item>
                    <Button variant="contained" fullWidth onClick={sendRequest}>
                        ОТПРАВИТЬ
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default SupportRequestModal;
