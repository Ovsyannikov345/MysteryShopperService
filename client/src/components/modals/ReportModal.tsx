import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Rating,
    IconButton,
    Grid2 as Grid,
    Paper,
    LinearProgress,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Close, Image, InsertDriveFile } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useNotifications } from "@toolpad/core";

interface ReportModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: ReportFormValues, files: File[]) => Promise<boolean>;
}

export interface ReportFormValues {
    title: string;
    description: string;
    grade: number;
}

const validationSchema = Yup.object({
    title: Yup.string().required("Заголовок обязателен.").max(100, "Заголовок не может быть длиннее 100 символов."),
    description: Yup.string().required("Описание обязательно."),
    grade: Yup.number().min(1, "Оценка обязательна.").max(5, "Оценка обязательна.").required("Оценка обязательна."),
});

const ReportModal = ({ open, onClose, onSubmit }: ReportModalProps) => {
    const notifications = useNotifications();

    const [files, setFiles] = useState<File[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik<ReportFormValues>({
        initialValues: {
            title: "",
            description: "",
            grade: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            setIsLoading(true);

            const uniqueFileNames = files.map((f) => f.name).filter((name, index, self) => index === self.indexOf(name));

            if (files.length !== uniqueFileNames.length) {
                notifications.show("Названия файлов должны быть уникальны.", { severity: "error", autoHideDuration: 3000 });
                setIsLoading(false);
                return;
            }

            const result = await onSubmit(values, files);

            setIsLoading(false);

            if (result) {
                formik.resetForm();
                onClose();
            }
        },
    });

    const onDrop = (acceptedFiles: File[]) => {
        setFiles((prev) => [...prev, ...acceptedFiles]);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true,
        maxFiles: 10,
        maxSize: 10 * 1024 * 1024, // 10 MB
        accept: {
            "image/*": [],
            "application/pdf": [],
            "application/msword": [],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
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
                Отправить отчет{" "}
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
                <form onSubmit={formik.handleSubmit} id="report-form">
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Заголовок"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Описание"
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

                    <Box mt={1}>
                        <Typography variant="subtitle1">Прикрепить файлы</Typography>

                        <Box
                            {...getRootProps()}
                            sx={{
                                border: "2px dashed #ccc",
                                borderRadius: 2,
                                p: 2,
                                textAlign: "center",
                                cursor: "pointer",
                                backgroundColor: isDragActive ? "#f0f0f0" : "inherit",
                            }}
                        >
                            <input {...getInputProps()} />
                            <Typography color="textSecondary">
                                {isDragActive ? "Перетащите файлы сюда ..." : "Перетащите файлы сюда или нажмите для выбора"}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                (Допустимые файлы: изображения, PDF, DOC/DOCX)
                            </Typography>
                        </Box>

                        <Grid container spacing={2} mt={1}>
                            {files.map((file, index) => (
                                <Grid size={{ xs: 12, sm: 4 }} key={index}>
                                    <Paper
                                        elevation={2}
                                        sx={{
                                            p: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Grid container overflow={"hidden"} wrap="nowrap" alignItems={"center"} gap={1}>
                                            {file.type.startsWith("image/") ? (
                                                <Image color="primary" />
                                            ) : (
                                                <InsertDriveFile color="action" />
                                            )}
                                            <Typography variant="body2" noWrap>
                                                {file.name}
                                            </Typography>
                                        </Grid>
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setFiles((prev) => prev.filter((_, i) => i !== index));
                                            }}
                                        >
                                            <Close />
                                        </IconButton>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </form>
            </DialogContent>
            <DialogActions>
                {isLoading ? (
                    <LinearProgress sx={{ width: "100%" }} />
                ) : (
                    <Button type="submit" form="report-form" variant="contained" sx={{ borderRadius: "7px", mb: 0.5 }}>
                        Отправить
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ReportModal;
