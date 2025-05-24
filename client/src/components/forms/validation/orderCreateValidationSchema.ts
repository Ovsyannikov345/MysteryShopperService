import * as Yup from "yup";

const orderCreateValidationSchema = Yup.object({
    title: Yup.string().required("Название обязательно").max(100, "Название не может превышать 100 символов"),
    description: Yup.string().required("Описание обязательно"),
    hoursToComplete: Yup.number().positive("Должно быть положительное число").integer("Должно быть целым числом").max(24, "Не может превышать 24"),
    daysToComplete: Yup.number().positive("Должно быть положительное число").integer("Должно быть целым числом").max(30, "Не может превышать 30"),
    price: Yup.number().positive("Цена должна быть положительным числом"),
    place: Yup.string().max(255, "Место не может превышать 250 символов"),
});

export default orderCreateValidationSchema;
