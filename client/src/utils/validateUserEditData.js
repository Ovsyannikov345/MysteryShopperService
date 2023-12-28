const validateUserEditData = (values) => {
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

    if (values.description && values.description.length > 255) {
        errors.description = "Превышена длина в 255 символов";
    }

    return errors;
};

export default validateUserEditData;
