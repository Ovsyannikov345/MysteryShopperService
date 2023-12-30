const validateReportData = (values) => {
    const errors = {};

    if (!values.title) {
        errors.title = "Обязательное поле";
    } else if (values.title.length > 255) {
        errors.title = "Не более 255 символов";
    }

    if (!values.description) {
        errors.description = "Обязательное поле";
    } else if (values.description.length > 255) {
        errors.description = "Не более 255 символов";
    }

    return errors;
};

export default validateReportData;
