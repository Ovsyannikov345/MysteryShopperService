import { Dialog, Grid2 as Grid } from "@mui/material";
import OrderDetailsMap from "../maps/OrderDetailsMap";

interface MapModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderPosition: { lat: number; lng: number };
    displayDistance?: boolean;
}

const MapModal = ({ isOpen, onClose, orderPosition, displayDistance = true }: MapModalProps) => {
    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
            <Grid container>
                <OrderDetailsMap orderPosition={orderPosition} displayDistance={displayDistance} />
            </Grid>
        </Dialog>
    );
};

export default MapModal;
