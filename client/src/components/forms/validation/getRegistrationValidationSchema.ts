import * as Yup from "yup";

const getRegistrationValidationSchema = (userType: string | undefined) => {
    return Yup.object({
        email: Yup.string().email("Неверный формат электронной почты").required("Электронная почта обязательна"),
        password: Yup.string()
            .min(8, "Пароль должен содержать не менее 8 символов")
            .max(20, "Пароль должен содержать не более 20 символов")
            .required("Пароль обязателен"),
        passwordRepeat: Yup.string()
            .oneOf([Yup.ref("password"), ""], "Пароли должны совпадать")
            .required("Повтор пароля обязателен"),
        companyName:
            userType === "company"
                ? Yup.string()
                      .min(3, "Название компании должно быть от 3 до 255 символов")
                      .max(255, "Название компании должно быть от 3 до 255 символов")
                      .required("Название компании обязательно")
                : Yup.string().nullable(),
        contactPersonName:
            userType === "company"
                ? Yup.string()
                      .min(3, "Имя контактного лица должно быть от 3 до 50 символов")
                      .max(50, "Имя контактного лица должно быть от 3 до 50 символов")
                      .required("Имя контактного лица обязательно")
                : Yup.string().nullable(),
        contactPersonSurname:
            userType === "company"
                ? Yup.string()
                      .min(3, "Фамилия контактного лица должна быть от 3 до 50 символов")
                      .max(50, "Фамилия контактного лица должна быть от 3 до 50 символов")
                      .required("Фамилия контактного лица обязательна")
                : Yup.string().nullable(),
        contactPersonPhone:
            userType === "company"
                ? Yup.string()
                      .matches(/^\+?375\([1-9]{2}\)\d{3}-\d{2}-\d{2}$/, "Неверный формат телефона")
                      .required("Телефон обязателен")
                : Yup.string().nullable(),
        contactPersonEmail:
            userType === "company"
                ? Yup.string().email("Неверный формат электронной почты").required("Электронная почта обязательна")
                : Yup.string().nullable(),
        phone:
            userType === "user"
                ? Yup.string()
                      .matches(/^\+?375\([1-9]{2}\)\d{3}-\d{2}-\d{2}$/, "Неверный формат телефона")
                      .required("Телефон обязателен")
                : Yup.string().nullable(),
        name:
            userType === "user"
                ? Yup.string()
                      .min(3, "Имя должно быть от 3 до 50 символов")
                      .max(50, "Имя должно быть от 3 до 50 символов")
                      .required("Имя обязательно")
                : Yup.string().nullable(),
        surname:
            userType === "user"
                ? Yup.string()
                      .min(3, "Фамилия должна быть от 3 до 50 символов")
                      .max(50, "Фамилия должна быть от 3 до 50 символов")
                      .required("Фамилия обязательна")
                : Yup.string().nullable(),
        birthDate: userType === "user" ? Yup.date().max(new Date(), "Дата рождения должна быть в прошлом") : Yup.date().nullable(),
        city:
            userType === "user"
                ? Yup.string()
                      .min(3, "Город должен быть от 3 до 50 символов")
                      .max(50, "Город должен быть от 3 до 50 символов")
                      .nullable()
                : Yup.string().nullable(),
        description:
            userType === "user"
                ? Yup.string()
                      .min(3, "Описание должно быть от 3 до 255 символов")
                      .max(255, "Описание должно быть от 3 до 255 символов")
                      .nullable()
                : Yup.string().nullable(),
    });
};

export default getRegistrationValidationSchema;
