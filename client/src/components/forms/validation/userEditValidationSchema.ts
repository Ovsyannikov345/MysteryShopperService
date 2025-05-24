import * as Yup from "yup";
import { Genders } from "../../../utils/enums/genders";

const userEditValidationSchema = Yup.object({
    name: Yup.string()
        .required("Имя не должно быть пустым")
        .min(3, "Имя должно содержать от 3 до 50 символов")
        .max(50, "Имя должно содержать от 3 до 50 символов"),
    surname: Yup.string()
        .required("Фамилия не должна быть пустой")
        .min(3, "Фамилия должна содержать от 3 до 50 символов")
        .max(50, "Фамилия должна содержать от 3 до 50 символов"),
    birthDate: Yup.date()
        .nullable()
        .typeError("Неверный формат даты")
        .max(new Date(), "Дата рождения не может быть в будущем")
        .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), "Дата рождения не может быть более 100 лет назад"),
    city: Yup.string().nullable().min(3, "Город должен содержать от 3 до 50 символов").max(100, "Город должен содержать от 3 до 50 символов"),
    gender: Yup.mixed()
        .oneOf([Genders.Male, Genders.Female], "Пол должен быть указан")
        .required("Пол должен быть указан"),
    phone: Yup.string()
        .required("Телефон не должен быть пустым")
        .matches(/^\+?375\([1-9]{2}\)[0-9-]{7,14}$/, "Неверный формат телефона"),
    description: Yup.string()
        .nullable()
        .min(3, "Описание должно содержать от 3 до 500 символов")
        .max(500, "Описание должно содержать от 3 до 500 символов"),
});

export default userEditValidationSchema;
