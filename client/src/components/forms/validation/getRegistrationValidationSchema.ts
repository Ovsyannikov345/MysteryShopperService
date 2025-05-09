import * as Yup from "yup";

const getRegistrationValidationSchema = (userType: string | undefined) => {
    return Yup.object({
        email: Yup.string().email("Invalid email format").required("Email is required"),
        password: Yup.string()
            .min(8, "Password should be at least 8 characters")
            .max(20, "Password should be shorter than 20 characters")
            .required("Password is required"),
        passwordRepeat: Yup.string()
            .oneOf([Yup.ref("password"), ""], "Passwords must match")
            .required("Password repeat is required"),
        companyName:
            userType === "company"
                ? Yup.string()
                      .min(3, "Company name should be between 3 and 255 characters")
                      .max(255, "Company name should be between 3 and 255 characters")
                      .required("Company name is required")
                : Yup.string().nullable(),
        contactPersonName:
            userType === "company"
                ? Yup.string()
                      .min(3, "Contact person name should be between 3 and 50 characters")
                      .max(50, "Contact person name should be between 3 and 50 characters")
                      .required("Contact person name is required")
                : Yup.string().nullable(),
        contactPersonSurname:
            userType === "company"
                ? Yup.string()
                      .min(3, "Contact person surname should be between 3 and 50 characters")
                      .max(50, "Contact person surname should be between 3 and 50 characters")
                      .required("Contact person surname is required")
                : Yup.string().nullable(),
        contactPersonPatronymic:
            userType === "company"
                ? Yup.string()
                      .min(3, "Contact person patronymic should be between 3 and 50 characters")
                      .max(50, "Contact person patronymic should be between 3 and 50 characters")
                : Yup.string().nullable(),
        contactPersonPhone:
            userType === "company"
                ? Yup.string()
                      .matches(/^\+?375\([1-9]{2}\)\d{3}-\d{2}-\d{2}$/, "Invalid phone format")
                      .required("Phone is required")
                : Yup.string().nullable(),
        contactPersonEmail:
            userType === "company"
                ? Yup.string().email("Invalid email format").required("Email is required")
                : Yup.string().nullable(),
        phone:
            userType === "user"
                ? Yup.string()
                      .matches(/^\+?375\([1-9]{2}\)\d{3}-\d{2}-\d{2}$/, "Invalid phone format")
                      .required("Phone is required")
                : Yup.string().nullable(),
        name:
            userType === "user"
                ? Yup.string()
                      .min(3, "Name should be between 3 and 50 characters")
                      .max(50, "Name should be between 3 and 50 characters")
                      .required("Name is required")
                : Yup.string().nullable(),
        surname:
            userType === "user"
                ? Yup.string()
                      .min(3, "Surname should be between 3 and 50 characters")
                      .max(50, "Surname should be between 3 and 50 characters")
                      .required("Surname is required")
                : Yup.string().nullable(),
        birthDate: userType === "user" ? Yup.date().max(new Date(), "Birthdate must be in the past") : Yup.date().nullable(),
        city:
            userType === "user"
                ? Yup.string()
                      .min(3, "City should be between 3 and 50 characters")
                      .max(50, "City should be between 3 and 50 characters")
                      .nullable()
                : Yup.string().nullable(),
        description:
            userType === "user"
                ? Yup.string()
                      .min(3, "Description should be between 3 and 255 characters")
                      .max(255, "Description should be between 3 and 255 characters")
                      .nullable()
                : Yup.string().nullable(),
    });
};

export default getRegistrationValidationSchema;
