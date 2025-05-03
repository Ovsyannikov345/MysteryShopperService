import { Dialog, Grid2 as Grid } from "@mui/material";
import OrderDetailsMap from "../maps/OrderDetailsMap";

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderPosition: { lat: number; lng: number };
}

const MapModal = ({ isOpen, onClose, orderPosition }: MapModalProps) => {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
            <Grid container>
                <OrderDetailsMap orderPosition={orderPosition} />
            </Grid>
        </Dialog>
    );
};

export default MapModal;
