import {
    Box,
    Checkbox,
    Divider,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme
} from "@mui/material";
import {
    CheckCircle,
    Download,
    Eye,
    Plus,
    Save,
    Trash2,
    X,
} from "lucide-react";
import { ActionButton } from "../styles";

const FieldSettings = ({
    selectedField,
    onClose,
    onUpdateField,
    onRemoveField,
    document,
    onPreviewMode,
    onSaveDraft,
    onCompleteDocument,
    onDownloadDocument,
    isPreviewMode,
}) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: 300,
                height: "100%",
             
               // borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: "flex",
                flexDirection: "column",
                p: 2,
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    {selectedField ? "Field Settings" : "Document Actions"}
                </Typography>
                {selectedField && (
                    <IconButton size="small" onClick={onClose}>
                        <X size={18} />
                    </IconButton>
                )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Field Settings Content */}
            {selectedField ? (
                <>

                    {/* Recipient Info */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Recipient
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedField.recipient === "current_user"
                                ? "You"
                                : selectedField.recipient}
                        </Typography>
                    </Box>

                    {/* Field Type */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Field Type
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {selectedField.type}
                        </Typography>
                    </Box>

                    {/* Rules */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Rules
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Checkbox
                                checked={selectedField.required}
                                onChange={(e) =>
                                    onUpdateField({ required: e.target.checked })
                                }
                                size="small"
                            />
                            <Typography variant="body2">Required</Typography>
                        </Box>
                    </Box>

              

                    {/* Data Label */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Data Label
                        </Typography>
                        <TextField
                            size="small"
                            value={selectedField.label}
                            onChange={(e) => onUpdateField({ label: e.target.value })}
                            fullWidth
                        />
                    </Box>

                    {/* Tooltip */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Tooltip
                        </Typography>
                        <TextField
                            size="small"
                            value={selectedField.tooltip || ""}
                            onChange={(e) => onUpdateField({ tooltip: e.target.value })}
                            fullWidth
                            multiline
                            rows={2}
                        />
                    </Box>

                    {/* Location */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Location
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                size="small"
                                label="X"
                                type="number"
                                value={selectedField.position?.x || 0}
                                onChange={(e) =>
                                    onUpdateField({
                                        position: {
                                            ...selectedField.position,
                                            x: parseInt(e.target.value),
                                        },
                                    })
                                }
                                fullWidth
                            />
                            <TextField
                                size="small"
                                label="Y"
                                type="number"
                                value={selectedField.position?.y || 0}
                                onChange={(e) =>
                                    onUpdateField({
                                        position: {
                                            ...selectedField.position,
                                            y: parseInt(e.target.value),
                                        },
                                    })
                                }
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                            <TextField
                                size="small"
                                label="Width"
                                type="number"
                                value={selectedField.width || 200}
                                onChange={(e) =>
                                    onUpdateField({ width: parseInt(e.target.value) })
                                }
                                fullWidth
                            />
                            <TextField
                                size="small"
                                label="Height"
                                type="number"
                                value={selectedField.height || 30}
                                onChange={(e) =>
                                    onUpdateField({ height: parseInt(e.target.value) })
                                }
                                fullWidth
                            />
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ mt: "auto", pt: 2 }}>
                        <Divider sx={{ mb: 2 }} />
                        <ActionButton
                            variant="outlined"
                            startIcon={<Trash2 size={16} />}
                            onClick={onRemoveField}
                            fullWidth
                            sx={{ mb: 1 }}
                        >
                            Delete Field
                        </ActionButton>
                        <ActionButton
                            variant="outlined"
                            startIcon={<Plus size={16} />}
                            onClick={() =>
                                alert("Save as custom field not implemented yet")
                            }
                            fullWidth
                        >
                            Save as Custom Field
                        </ActionButton>
                    </Box>
                </>
            ) : (
                /* Document Actions when no field is selected */
                <>
                    {/* Document Status */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Document Status
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {document.status === "completed" ? "Completed" : "In Progress"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Last updated: {new Date(document.updatedAt).toLocaleString()}
                        </Typography>
                    </Box>

                    {/* Document Actions */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Actions
                        </Typography>
                        <Stack spacing={1}>
                            <ActionButton
                                variant="outlined"
                                startIcon={<Eye size={16} />}
                                onClick={onPreviewMode}
                                fullWidth
                            >
                                {isPreviewMode ? "Edit" : "Preview"}
                            </ActionButton>
                            <ActionButton
                                variant="outlined"
                                startIcon={<Save size={16} />}
                                onClick={onSaveDraft}
                                fullWidth
                            >
                                Save Draft
                            </ActionButton>
                            {document.status !== "completed" && (
                                <ActionButton
                                    variant="contained"
                                    startIcon={<CheckCircle size={16} />}
                                    onClick={onCompleteDocument}
                                    fullWidth
                                >
                                    Complete & Sign
                                </ActionButton>
                            )}
                            <ActionButton
                                variant="contained"
                                startIcon={<Download size={16} />}
                                onClick={onDownloadDocument}
                                fullWidth
                            >
                                Download
                            </ActionButton>
                        </Stack>
                    </Box>

                    {/* Document Info */}
                    <Box sx={{ mt: "auto" }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            Document Info
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Type: Self Signing
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Fields: {document.fields.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Created: {new Date(document.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default FieldSettings;
