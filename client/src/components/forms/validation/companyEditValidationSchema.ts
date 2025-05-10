import * as Yup from "yup";

const companyEditFormValidationSchema = Yup.object().shape({
    companyName: Yup.string()
        .min(3, "Company name should be between 3 and 255 characters")
        .max(255, "Company name should be between 3 and 255 characters")
        .required("Company name is required"),
    contactPersonName: Yup.string()
        .min(3, "Contact person name should be between 3 and 50 characters")
        .max(50, "Contact person name should be between 3 and 50 characters")
        .required("Contact person name is required"),
    contactPersonSurname: Yup.string()
        .min(3, "Contact person surname should be between 3 and 50 characters")
        .max(50, "Contact person surname should be between 3 and 50 characters")
        .required("Contact person surname is required"),
    contactPersonPhone: Yup.string()
        .matches(/^\+?375\([1-9]{2}\)\d{3}-\d{2}-\d{2}$/, "Invalid phone format")
        .required("Phone is required"),
    contactPersonEmail: Yup.string().email("Invalid email format").required("Email is required"),
});

export default companyEditFormValidationSchema;
