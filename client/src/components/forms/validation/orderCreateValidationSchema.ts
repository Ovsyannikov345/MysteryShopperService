import * as Yup from "yup";

const orderCreateValidationSchema = Yup.object({
    title: Yup.string().required("Title is required").max(100, "Title cannot exceed 100 characters"),
    description: Yup.string().required("Description is required"),
    hoursToComplete: Yup.number().positive("Must be a positive number").integer("Must be an integer").max(24, "Cannot exceed 24"),
    daysToComplete: Yup.number().positive("Must be a positive number").integer("Must be an integer").max(30, "Cannot exceed 30"),
    price: Yup.number().positive("Price must be a positive number"),
    place: Yup.string().max(255, "Place cannot exceed 250 characters"),
});

export default orderCreateValidationSchema;
