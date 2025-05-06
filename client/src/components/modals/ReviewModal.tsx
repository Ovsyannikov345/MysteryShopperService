import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Rating, TextField, Box } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

interface ReviewModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (rating: number, reviewText: string) => void;
}

const ReviewSchema = Yup.object().shape({
    reviewText: Yup.string().required("Review text is required").max(500, "Maximum 500 characters allowed"),
    rating: Yup.number().required().min(1, "Please give a rating"),
});

const ReviewModal = ({ open, onClose, onSubmit }: ReviewModalProps) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Leave a Review</DialogTitle>
            <Formik
                initialValues={{ rating: 0, reviewText: "" }}
                validationSchema={ReviewSchema}
                onSubmit={(values, actions) => {
                    onSubmit(values.rating, values.reviewText);
                    actions.setSubmitting(false);
                    onClose();
                }}
            >
                {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                    <Form>
                        <DialogContent>
                            <Box mb={2}>
                                <Rating
                                    name="rating"
                                    value={values.rating}
                                    onChange={(_, value) => setFieldValue("rating", value)}
                                />
                                {errors.rating && touched.rating && (
                                    <div style={{ color: "red", fontSize: "0.8rem" }}>{errors.rating}</div>
                                )}
                            </Box>
                            <Field
                                as={TextField}
                                name="reviewText"
                                label="Your Review"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                error={touched.reviewText && Boolean(errors.reviewText)}
                                helperText={touched.reviewText && errors.reviewText}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={onClose} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Submit
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default ReviewModal;
