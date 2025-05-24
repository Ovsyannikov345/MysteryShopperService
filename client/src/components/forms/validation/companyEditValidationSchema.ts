import * as Yup from "yup";

const companyEditFormValidationSchema = Yup.object().shape({
    companyName: Yup.string()
        .min(3, "Название компании должно быть от 3 до 255 символов")
        .max(255, "Название компании должно быть от 3 до 255 символов")
        .required("Название компании обязательно"),
    contactPersonName: Yup.string()
        .min(3, "Имя контактного лица должно быть от 3 до 50 символов")
        .max(50, "Имя контактного лица должно быть от 3 до 50 символов")
        .required("Имя контактного лица обязательно"),
    contactPersonSurname: Yup.string()
        .min(3, "Фамилия контактного лица должна быть от 3 до 50 символов")
        .max(50, "Фамилия контактного лица должна быть от 3 до 50 символов")
        .required("Фамилия контактного лица обязательна"),
    contactPersonPhone: Yup.string()
        .matches(/^\+?375\([1-9]{2}\)\d{3}-\d{2}-\d{2}$/, "Неверный формат телефона")
        .required("Телефон обязателен"),
    contactPersonEmail: Yup.string().email("Неверный формат электронной почты").required("Электронная почта обязательна"),
});

export default companyEditFormValidationSchema;
