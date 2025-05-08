import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton, LinearProgress } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Close } from "@mui/icons-material";

interface CorrectionModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: CorrectionFormValues) => Promise<boolean>;
}

export interface CorrectionFormValues {
    description: string;
}

const validationSchema = Yup.object({
    description: Yup.string().required("Description is required."),
});

const CorrectionModal = ({ open, onClose, onSubmit }: CorrectionModalProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik<CorrectionFormValues>({
        initialValues: {
            description: "",
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
                formik.setErrors({});
                formik.setTouched({});
                onClose();
            }}
            fullWidth
            maxWidth="sm"
            sx={{ "& .MuiDialog-paper": { borderRadius: "16px" } }}
        >
            <DialogTitle>
                Create Report Correction{" "}
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
                <form onSubmit={formik.handleSubmit} id="correction-form">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        multiline
                        minRows={3}
                        maxRows={10}
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <LinearProgress sx={{ width: "100%" }} />
                ) : (
                    <Button type="submit" form="correction-form" variant="contained" sx={{ borderRadius: "7px", mb: 0.5 }}>
                        Submit
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CorrectionModal;
