import { MenuItem, Select } from "@mui/material";
import React from "react";

const SortSelector = ({ options, value, changeHandler }) => {
    return (
        <Select variant="outlined" fullWidth value={value} onChange={(e) => changeHandler(e.target.value)}>
            {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                    {option.name}
                </MenuItem>
            ))}
        </Select>
    );
};

export default SortSelector;