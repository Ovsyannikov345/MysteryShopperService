import { Dialog, DialogTitle, DialogContent, Typography, Box, IconButton, Grid2 as Grid, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import Rating from "@mui/material/Rating";
import useReportApi, { Report } from "../../hooks/useReportApi";
import { useEffect, useState } from "react";
import { Download, Visibility } from "@mui/icons-material";

interface ReportFile {
    name: string;
    type: string;
    blob: Blob;
}

interface ReportDisplayModalProps {
    open: boolean;
    onClose: () => void;
    report: Report | null;
}

const ReportDisplayModal = ({ open, onClose, report }: ReportDisplayModalProps) => {
    const [files, setFiles] = useState<ReportFile[]>([]);

    const { getAttachmentNames, getAttachment } = useReportApi();

    useEffect(() => {
        const loadFiles = async () => {
            if (!report) {
                return;
            }

            let fileNames = await getAttachmentNames(report.id);

            if ("error" in fileNames) {
                console.error("Error fetching file names:", fileNames.error);
                fileNames = [];
            }

            const loadedFiles = await Promise.all(
                fileNames.map(async (fileName) => {
                    const response = await getAttachment(fileName);

                    if ("error" in response) {
                        console.error("Error fetching file:", response.error);

                        return Promise.resolve(null);
                    }

                    return {
                        name: fileName.replace(`${report.id}/`, ""),
                        type: response.contentType,
                        blob: response.blob,
                    };
                })
            );

            setFiles(loadedFiles.filter((file) => file !== null) as ReportFile[]);
        };

        loadFiles();
    }, [getAttachment, getAttachmentNames, report]);

    if (!report) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Report Details
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Box>
                        <Typography variant="subtitle2">Title</Typography>
                        <Typography variant="body1">{report.title}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2">Description</Typography>
                        <Typography variant="body1">{report.description}</Typography>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2">Grade</Typography>
                        <Rating value={report.grade} readOnly />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Uploaded Files
                        </Typography>
                        {files.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No files uploaded.
                            </Typography>
                        ) : (
                            <Grid container spacing={2}>
                                {files.map((file, index) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                p: 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Grid
                                                container
                                                wrap="nowrap"
                                                alignItems={"center"}
                                                gap={1}
                                                sx={{ overflow: "hidden" }}
                                            >
                                                {file.type.startsWith("image/") ? (
                                                    <ImageIcon color="action" />
                                                ) : (
                                                    <InsertDriveFileIcon color="action" />
                                                )}
                                                <Typography variant="body2" noWrap>
                                                    {file.name}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                container
                                                overflow={"hidden"}
                                                wrap="nowrap"
                                                alignItems={"center"}
                                                gap={1}
                                                flexShrink={0}
                                            >
                                                <IconButton
                                                    aria-label="preview"
                                                    onClick={() => {
                                                        const fileURL = URL.createObjectURL(file.blob);
                                                        window.open(fileURL, "_blank");
                                                    }}
                                                >
                                                    <Visibility sx={{ color: "primary.dark" }} />
                                                </IconButton>
                                                <IconButton
                                                    aria-label="download"
                                                    onClick={() => {
                                                        const url = URL.createObjectURL(file.blob);
                                                        const a = document.createElement("a");
                                                        a.href = url;
                                                        a.download = file.name;
                                                        a.click();
                                                        URL.revokeObjectURL(url);
                                                    }}
                                                >
                                                    <Download sx={{ color: "primary.dark" }} />
                                                </IconButton>
                                            </Grid>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ReportDisplayModal;
