import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { OrderQueryFilter } from "../../hooks/useOrderApi";
import { useNotifications } from "@toolpad/core";

interface EstateFilterProps {
    filter: OrderQueryFilter;
    onFilterChange: (filter: OrderQueryFilter) => void;
}

const OrderFilter = ({ filter, onFilterChange }: EstateFilterProps) => {
    const notifications = useNotifications();

    const [filters, setFilters] = useState<OrderQueryFilter>(filter);

    const handleChange = (field: keyof OrderQueryFilter, value: any) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value === "" ? undefined : value,
        }));
    };

    const handleApplyFilters = () => {
        onFilterChange(filters);
        notifications.show("Filters applied", { severity: "info", autoHideDuration: 2000 });
    };

    const handleClearFilters = () => {
        setFilters({});
        onFilterChange({});
        notifications.show("Filters cleared", { severity: "info", autoHideDuration: 2000 });
    };

    const timeSpanToHours = (span: string) => {
        const parts = span.split(".");

        return Number(parts[0]) * 24 + Number(parts[1].split(":")[0]);
    };

    const hoursToTimeSpan = (hours: number) => {
        if (hours === 0) {
            return undefined;
        }

        return `${Math.floor(hours / 24)}.${hours % 24}:00:00`;
    };

    return (
        <Grid container spacing={2} size={{ xs: 12, sm: 6 }}>
            {/* Text Filter */}
            <Grid size={12}>
                <TextField
                    label="Search Text"
                    placeholder="Title or address"
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    value={filters.text || ""}
                    onChange={(e) => handleChange("text", e.target.value)}
                />
            </Grid>

            {/* Time to Complete */}
            <Grid size={12}>
                <Typography>Time to complete (hours)</Typography>
            </Grid>
            <Grid size={5.5}>
                <TextField
                    label="From"
                    variant="outlined"
                    fullWidth
                    autoComplete="off"
                    type="number"
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    value={filters.minTimeToComplete ? timeSpanToHours(filters.minTimeToComplete) : ""}
                    onChange={(e) => {
                        handleChange("minTimeToComplete", hoursToTimeSpan(Number(e.target.value)));
                    }}
                />
            </Grid>
            <Grid container size={1} alignItems={"center"} justifyContent={"center"}>
                <Typography>—</Typography>
            </Grid>
            <Grid size={5.5}>
                <TextField
                    label="To"
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    type="number"
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    value={filters.maxTimeToComplete ? timeSpanToHours(filters.maxTimeToComplete) : ""}
                    onChange={(e) => {
                        handleChange("maxTimeToComplete", hoursToTimeSpan(Number(e.target.value)));
                    }}
                />
            </Grid>

            {/* Price */}
            <Grid size={12}>
                <Typography>Price</Typography>
            </Grid>
            <Grid size={5.5}>
                <TextField
                    label="From"
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    type="number"
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    value={filters.minPrice || ""}
                    onChange={(e) => handleChange("minPrice", e.target.value)}
                />
            </Grid>
            <Grid container size={1} alignItems={"center"} justifyContent={"center"}>
                <Typography>—</Typography>
            </Grid>
            <Grid size={5.5}>
                <TextField
                    label="To"
                    variant="outlined"
                    autoComplete="off"
                    fullWidth
                    type="number"
                    sx={{
                        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                            display: "none",
                        },
                        "& input[type=number]": {
                            MozAppearance: "textfield",
                        },
                    }}
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleChange("maxPrice", e.target.value)}
                />
            </Grid>

            {/* Action Buttons */}
            <Grid container spacing={2}>
                <Button variant="contained" color="primary" onClick={handleApplyFilters}>
                    Apply
                </Button>
                <Button variant="outlined" onClick={handleClearFilters}>
                    Clear
                </Button>
            </Grid>
        </Grid>
    );
};

export default OrderFilter;
