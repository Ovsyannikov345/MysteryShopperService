import React, { useState } from "react";
import { Dialog, Typography, Grid, Button, TextField } from "@mui/material";
//import { createRequest } from "../../api/supportRequestApi";

// TODO Rework

interface SupportRequestModalProps {
    isOpen: boolean;
    acceptHandler: Function;
    declineHandler: Function;
    errorHandler: Function;
}

const SupportRequestModal = ({ isOpen, acceptHandler, declineHandler, errorHandler }: SupportRequestModalProps) => {
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

        //const response = await createRequest(request.text);

        // if (response.status >= 300) {
        //     errorHandler("Сервис временно недоступен");
        //     return;
        // }

        setRequest({
            text: "",
        });
        acceptHandler();
    };

    return (
        <Dialog
            open={isOpen}
            onClose={closeModal}
            PaperProps={{
                style: { margin: 0, borderRadius: "10px" },
                sx: { maxWidth: { xs: "310px", md: "483px" } },
            }}
        >
            <Grid
                container
                item
                flexDirection={"column"}
                alignItems={"center"}
                gap={"20px"}
                sx={{
                    width: { xs: "310px", md: "483px" },
                    pl: { xs: "5px", md: "28px" },
                    pr: { xs: "5px", md: "28px" },
                    pb: { xs: "9px", md: "25px" },
                }}
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
