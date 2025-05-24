import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Correction } from "../../hooks/useReportCorrectionApi";

interface CorrectionDisplayModalProps {
    open: boolean;
    onClose: () => void;
    correction: Correction | null;
}

const CorrectionDisplayModal = ({ open, onClose, correction }: CorrectionDisplayModalProps) => {
    if (!correction) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Детали правок
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                        <Typography variant="subtitle2">Описание</Typography>
                        <Typography variant="body1">{correction.description}</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default CorrectionDisplayModal;
