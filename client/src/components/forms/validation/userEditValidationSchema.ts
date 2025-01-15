import * as Yup from "yup";
import { Genders } from "../../../utils/enums/genders";

const userEditValidationSchema = Yup.object({
    name: Yup.string()
        .required("Name should not be empty")
        .min(3, "Name should be from 3 to 50 symbols")
        .max(50, "Name should be from 3 to 50 symbols"),
    surname: Yup.string()
        .required("Surname should not be empty")
        .min(3, "Surname should be from 3 to 50 symbols")
        .max(50, "Surname should be from 3 to 50 symbols"),
    birthDate: Yup.date()
        .nullable()
        .typeError("Invalid date")
        .max(new Date(), "Birth date cannot be in the future")
        .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), "Birth date cannot be more than 100 years ago"),
    city: Yup.string().nullable().min(3, "City should be from 3 to 50 symbols").max(100, "City should be from 3 to 50 symbols"),
    gender: Yup.mixed()
        .oneOf([Genders.Male, Genders.Female], "Gender should be specified")
        .required("Gender should be specified"),
    phone: Yup.string()
        .required("Phone should not be empty")
        .matches(/^\+?375\([1-9]{2}\)[0-9-]{7,14}$/, "Invalid phone format"),
    description: Yup.string()
        .nullable()
        .min(3, "Description should be from 3 to 500 symbols")
        .max(500, "Description should be from 3 to 500 symbols"),
});

export default userEditValidationSchema;
