import * as Yup from "yup";

const CompanyEditFormValidationSchema = Yup.object().shape({
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
    contactPersonPatronymic: Yup.string()
        .min(3, "Contact person patronymic should be between 3 and 50 characters")
        .max(50, "Contact person patronymic should be between 3 and 50 characters")
        .nullable(),
    contactPersonPhone: Yup.string()
        .matches(/^\+?375\([1-9]{2}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/, "Invalid phone format")
        .required("Phone is required"),
    contactPersonEmail: Yup.string().email("Invalid email format").required("Email is required"),
});

export default CompanyEditFormValidationSchema;
