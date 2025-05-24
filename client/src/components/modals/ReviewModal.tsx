import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Rating,
    TextField,
    Box,
    IconButton,
    Typography,
    LinearProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Close } from "@mui/icons-material";

export interface ReviewFormValues {
    text: string;
    grade: number;
}

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (review: ReviewFormValues) => Promise<boolean>;
}

const validationSchema = Yup.object().shape({
    text: Yup.string().required("Текст обязателен.").max(500, "Не более 500 символов"),
    grade: Yup.number().required().min(1, "Оценка обязательна."),
});

const ReviewModal = ({ open, onClose, onSubmit }: ReviewModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik<ReviewFormValues>({
        initialValues: {
            text: "",
            grade: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);

            const result = await onSubmit(values);

            setIsLoading(false);

            if (result) {
                formik.resetForm();
                onClose();
            }
        },
    });

    return (
        <Dialog
            open={open}
            onClose={() => {
                onClose();
                formik.setErrors({});
                formik.setTouched({});
            }}
            fullWidth
        >
            <DialogTitle>
                Отправить отзыв{" "}
                <IconButton
                    aria-label="close"
                    onClick={() => {
                        onClose();
                        formik.setErrors({});
                        formik.setTouched({});
                    }}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={formik.handleSubmit} id="review-form">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Текст отзыва"
                        name="text"
                        multiline
                        minRows={3}
                        maxRows={10}
                        value={formik.values.text}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.text && Boolean(formik.errors.text)}
                        helperText={formik.touched.text && formik.errors.text}
                    />

                    <Box>
                        <Typography component="legend" variant="subtitle1" ml={0.5}>
                            Оценка
                        </Typography>
                        <Rating
                            size="large"
                            name="grade"
                            value={formik.values.grade}
                            precision={1}
                            max={5}
                            onChange={(_, value) => formik.setFieldValue("grade", value)}
                            onBlur={() => formik.setFieldTouched("grade", true)}
                        />
                        {formik.touched.grade && formik.errors.grade && (
                            <Typography component="legend" variant="caption" color="error" ml={0.5}>
                                {formik.errors.grade}
                            </Typography>
                        )}
                    </Box>
                </form>
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <LinearProgress sx={{ width: "100%" }} />
                ) : (
                    <Button type="submit" form="review-form" variant="contained" sx={{ borderRadius: "7px", mb: 0.5 }}>
                        Отправить
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ReviewModal;
