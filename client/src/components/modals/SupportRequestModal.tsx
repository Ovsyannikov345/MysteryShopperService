import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    IconButton,
    LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useSupportRequestApi from "../../hooks/useSupportRequestApi";
import { useNotifications } from "@toolpad/core";

interface SupportRequestModalProps {
    open: boolean;
    onClose: () => void;
}

const SupportRequestModal = ({ open, onClose }: SupportRequestModalProps) => {
    const [message, setMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const notifications = useNotifications();

    const { createSupportRequest } = useSupportRequestApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (message.length === 0) {
            notifications.show("Provide the description", { severity: "error", autoHideDuration: 3000 });
            return;
        }

        setIsLoading(true);

        const response = await createSupportRequest({ text: message });

        setIsLoading(false);

        if ("error" in response) {
            notifications.show(response.message, { severity: "error", autoHideDuration: 3000 });
            return;
        }

        notifications.show("Request is sent", { severity: "success", autoHideDuration: 3000 });
        setMessage("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Support Request
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            autoFocus
                            multiline
                            minRows={4}
                            maxRows={10}
                            fullWidth
                            label="Describe your issue"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    {!isLoading ? (
                        <>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">
                                Send Request
                            </Button>
                        </>
                    ) : (
                        <LinearProgress sx={{ width: "100%" }} />
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default SupportRequestModal;
