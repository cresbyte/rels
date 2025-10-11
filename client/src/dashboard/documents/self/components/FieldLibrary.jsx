import {
    Box,
    InputAdornment,
    TextField,
    Typography,
    alpha,
    useTheme
} from "@mui/material";
import {
    Calendar,
    CheckSquare,
    ChevronDown,
    FileText,
    Mail,
    Plus,
    Search,
    Type,
    User,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { ActionButton } from "../styles";

// Field types available for dragging
const FIELD_TYPES = [
    {
        id: "signature",
        label: "Signature",
        icon: <FileText size={16} />,
        color: "primary",
    },
    { id: "name", label: "Name", icon: <User size={16} />, color: "secondary" },
    { id: "email", label: "Email", icon: <Mail size={16} />, color: "info" },
    { id: "date", label: "Date", icon: <Calendar size={16} />, color: "warning" },
    { id: "text", label: "Text", icon: <Type size={16} />, color: "success" },
    {
        id: "checkbox",
        label: "Checkbox",
        icon: <CheckSquare size={16} />,
        color: "error",
    },
    {
        id: "dropdown",
        label: "Dropdown",
        icon: <ChevronDown size={16} />,
        color: "default",
    },   {
        id: "checkbox342",
        label: "Checkbox",
        icon: <CheckSquare size={16} />,
        color: "error",
    },
    {
        id: "dropdown1",
        label: "Dropdown",
        icon: <ChevronDown size={16} />,
        color: "default",
    },   {
        id: "checkbox2",
        label: "Checkbox",
        icon: <CheckSquare size={16} />,
        color: "error",
    },
    {
        id: "dropdown11",
        label: "Dropdown",
        icon: <ChevronDown size={16} />,
        color: "default",
    },
];

const FieldLibrary = ({ onAddField }) => {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    const [draggedFieldType, setDraggedFieldType] = useState(null);

    // Filter field types based on search
    const filteredFieldTypes = useMemo(() => {
        if (!searchTerm) return FIELD_TYPES;
        return FIELD_TYPES.filter((field) =>
            field.label.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    // Handle drag start from field library
    const handleDragStart = (e, fieldType) => {
        setDraggedFieldType(fieldType);
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', JSON.stringify(fieldType));
    };

    // Handle drag end
    const handleDragEnd = () => {
        setDraggedFieldType(null);
    };

    return (
        <Box
            sx={{
                width: 280,
                height: "100%",

                //borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Search Header */}
            <Box
                sx={{
                    p: 2,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <TextField
                    size="small"
                    placeholder="Search fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={16} />
                            </InputAdornment>
                        ),
                        sx: {
                            borderRadius: 0,
                            "& fieldset": {
                                borderColor: alpha(theme.palette.text.primary, 0.1),
                            },
                            "&:hover fieldset": {
                                borderColor: alpha(theme.palette.text.primary, 0.2),
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: theme.palette.primary.main,
                            },
                        },
                    }}
                />
            </Box>

            {/* Section Title */}
            <Box sx={{ p: 2, pb: 0 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Standard Fields
                </Typography>
            </Box>

            {/* Field Types List */}
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 1 }}>
                {filteredFieldTypes.map((fieldType) => (
                    <Box
                        key={fieldType.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, fieldType)}
                        onDragEnd={handleDragEnd}
                        sx={{
                            p: 1.5,
                            mb: 1,
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            bgcolor: draggedFieldType?.id === fieldType.id
                                ? alpha(theme.palette.primary.main, 0.1)
                                : "background.paper",
                            cursor: "grab",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            opacity: draggedFieldType?.id === fieldType.id ? 0.5 : 1,
                            transform: draggedFieldType?.id === fieldType.id ? "scale(0.95)" : "scale(1)",
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                borderColor: alpha(theme.palette.primary.main, 0.2),
                                transform: "scale(1.02)",
                            },
                            "&:active": {
                                cursor: "grabbing",
                                transform: "scale(0.98)",
                            },
                        }}
                        onClick={() => onAddField(fieldType)}
                    >
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: alpha(
                                    theme.palette[fieldType.color]?.main ||
                                    theme.palette.primary.main,
                                    0.1
                                ),
                                color:
                                    theme.palette[fieldType.color]?.main ||
                                    theme.palette.primary.main,
                            }}
                        >
                            {fieldType.icon}
                        </Box>
                        <Typography variant="body2">{fieldType.label}</Typography>
                    </Box>
                ))}
            </Box>

            {/* Custom Field Button */}
            <Box
                sx={{
                    p: 2,
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <ActionButton
                    variant="outlined"
                    startIcon={<Plus size={16} />}
                    fullWidth
                    onClick={() => alert("Custom field creation not implemented yet")}
                >
                    Create Custom Field
                </ActionButton>
            </Box>
        </Box>
    );
};

export default FieldLibrary;
