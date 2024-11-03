import { OrderToCreate } from "../api/ordersApi";

const validateOrderData = (values: OrderToCreate) => {
    console.log(values)

    const errors: any = {};

    if (!values.title) {
        errors.title = "Обязательное поле";
    } else if (values.title.length > 50) {
        errors.title = "Слишком длинное название";
    }

    if (values.description && values.description.length > 255) {
        errors.description = "Слишком длинное описание";
    }

    if (!values.place) {
        errors.place = "Обязательное поле";
    } else if (values.place.length > 255) {
        errors.place = "Слишком длинный адрес";
    }

    if (values.timeToComplete && !/^\d{2}:00:00$/.test(values.timeToComplete)) {
        errors.completionTime = "Некорректное значение";
    }

    if (values.price && (isNaN(values.price) || values.price < 0 || values.price > 99999)) {
        errors.price = "Некорректное значение";
    }

    return errors;
};

export default validateOrderData;
