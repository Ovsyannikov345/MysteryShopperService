import { Button, Grid2 as Grid, SelectChangeEvent } from "@mui/material";
import { useState } from "react";
import { OrderQueryFilter } from "../../hooks/useOrderApi";

interface EstateFilterProps {
    filter?: OrderQueryFilter;
    onFilterChange: (filter?: OrderQueryFilter) => void;
}

const OrderFilter = ({ filter, onFilterChange }: EstateFilterProps) => {
    const [filters, setFilters] = useState<OrderQueryFilter | undefined>(filter);

    const handleChange = (field: keyof OrderQueryFilter) => (event: React.ChangeEvent<any> | SelectChangeEvent<any>) => {
        const value = event.target.value;
        setFilters((prev) => ({
            ...prev,
            [field]: value === "" ? undefined : value,
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
    };

    const handleClearFilters = () => {
        setFilters(undefined);
        onFilterChange(undefined);
    };

    return (
        <Grid container spacing={2} size={{ xs: 12, sm: 8, lg: 6 }}>
            {/* TODO Add filter fields. */}
            {/* <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Address" fullWidth value={filters.address || ""} onChange={handleChange("address")} />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField label="Min Area" type="number" fullWidth value={filters.minArea || ""} onChange={handleChange("minArea")} />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField label="Max Area" type="number" fullWidth value={filters.maxArea || ""} onChange={handleChange("maxArea")} />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    label="Min Rooms"
                    type="number"
                    fullWidth
                    value={filters.minRoomsCount || ""}
                    onChange={handleChange("minRoomsCount")}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField
                    label="Max Rooms"
                    type="number"
                    fullWidth
                    value={filters.maxRoomsCount || ""}
                    onChange={handleChange("maxRoomsCount")}
                />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField label="Min Price" type="number" fullWidth value={filters.minPrice || ""} onChange={handleChange("minPrice")} />
            </Grid>
            <Grid size={{ xs: 6 }}>
                <TextField label="Max Price" type="number" fullWidth value={filters.maxPrice || ""} onChange={handleChange("maxPrice")} />
            </Grid> */}
            <Grid container spacing={2}>
                <Button variant="contained" color="primary" onClick={handleApplyFilters}>
                    Apply Filters
                </Button>
                <Button variant="outlined" onClick={handleClearFilters}>
                    Clear filters
                </Button>
            </Grid>
        </Grid>
    );
};

export default OrderFilter;
