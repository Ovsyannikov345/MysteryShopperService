const validateUserData = (values) => {
    const errors = {};

    if (!values.surname) {
        errors.surname = "Обязательное поле";
    }

    if (!values.name) {
        errors.name = "Обязательное поле";
    }

    if (values.age && (isNaN(values.age) || parseInt(values.age) < 0 || parseInt(values.age) > 100)) {
        errors.age = "Некорректное значение";
    }

    if (!values.phone) {
        errors.phone = "Обязательное поле";
    } else if (values.phone.includes("_")) {
        errors.phone = "Некорректное значение";
    }

    return errors;
};

export default validateUserData;
