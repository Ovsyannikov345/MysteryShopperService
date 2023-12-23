const validateRegistration = (values) => {
    const errors = {};

    if (!values.email) {
        errors.email = "Обязательное поле";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = "Неверный адрес";
    }

    if (!values.password) {
        errors.password = "Обязательное поле";
    } else if (values.password.length < 8) {
        errors.password = "Пароль короче 8 символов";
    }

    if (errors.password === undefined && values.passwordRepeat !== values.password) {
        errors.passwordRepeat = "Пароли не совпадают";
    }

    return errors;
};

export default validateRegistration;
