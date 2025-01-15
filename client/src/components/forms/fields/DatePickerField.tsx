import { DatePicker } from "@mui/x-date-pickers";
import { Moment } from "moment";

interface DatePickerFieldProps {
    label: string;
    name: string;
    value: Moment;
    onChange: Function;
}

const DatePickerField = ({ label, name, value, onChange }: DatePickerFieldProps) => {
    return (
        <DatePicker
            label={label}
            onChange={(val) => {
                onChange(name, val);
            }}
            value={value}
        />
    );
};

export default DatePickerField;
