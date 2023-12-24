const validateOrderData = (values) => {
    const errors = {};

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

    if (values.completionTime && (isNaN(values.completionTime) || parseInt(values.completionTime) < 0 || parseInt(values.completionTime) > 365)) {
        errors.completionTime = "Некорректное значение";
    }

    if (values.price && (isNaN(values.price) || parseInt(values.price) < 0 || parseInt(values.price) > 9999)) {
        errors.price = "Некорректное значение";
    }

    return errors;
};

export default validateOrderData;