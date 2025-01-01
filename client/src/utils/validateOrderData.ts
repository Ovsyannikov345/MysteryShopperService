import { OrderCreationData } from "../components/forms/CreateOrderForm";

const validateOrderData = (values: OrderCreationData) => {
    const errors: any = {};

    if (!values.title) {
        errors.title = "Обязательное поле";
    } else if (values.title.length > 50) {
        errors.title = "Длина не более 50 символов";
    }

    if (values.description && values.description.length > 5000) {
        errors.description = "Длина не более 5000 символов";
    }

    if (!values.place) {
        errors.place = "Обязательное поле";
    } else if (values.place.length > 255) {
        errors.place = "Длина не более 255 символов";
    }

    if (
        values.timeToComplete &&
        (!Number.isInteger(values.timeToComplete) || values.timeToComplete < 1 || values.timeToComplete > 30)
    ) {
        errors.completionTime = "Некорректное значение";
    }

    if (values.price && (!Number.isInteger(values.timeToComplete) || values.price < 0 || values.price > 99999)) {
        errors.price = "Некорректное значение";
    }

    return errors;
};

export default validateOrderData;
