import {
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DownloadCloud,
  FileSignature,
  FileText,
  MoreVertical,
  Share2,
  Users,
} from "lucide-react";

// Document status mapping
const getStatusConfig = (status, theme) => {
  const configs = {
    completed: {
      label: "Completed",
      color: "success",
      icon: <CheckCircle size={16} />,
      backgroundColor: alpha(theme.palette.success.main, 0.1),
    },
    in_progress: {
      label: "In Progress",
      color: "info",
      icon: <Clock size={16} />,
      backgroundColor: alpha(theme.palette.info.main, 0.1),
    },
    active: {
      label: "Active",
      color: "primary",
      icon: <FileText size={16} />,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    awaiting: {
      label: "Awaiting",
      color: "warning",
      icon: <AlertCircle size={16} />,
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
    },
  };
  return configs[status] || configs.in_progress;
};

// Document type mapping
const getTypeConfig = (type, theme) => {
  const configs = {
    private: {
      label: "Private",
      color: "secondary",
      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    },
    public: {
      label: "Public",
      color: "primary",
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    self: {
      label: "Self",
      color: "info",
      backgroundColor: alpha(theme.palette.info.main, 0.1),
    },
  };
  return configs[type] || configs.private;
};

// Sample data (you'll likely pass this as a prop in real usage)
const documents = [
  {
    id: "d1",
    title: "Service Agreement – John",
    type: "private",
    fields: [
      {
        id: "f1",
        label: "Company Name",
        type: "text",
        required: true,
        assignedTo: "s1",
        position: { x: 100, y: 150 },
      },
      {
        id: "f2",
        label: "Signature",
        type: "signature",
        required: true,
        assignedTo: "s1",
        position: { x: 100, y: 250 },
      },
    ],
    signers: [
      {
        id: "s1",
        name: "John Doe",
        email: "janedoe@gmail.com",
        status: "signed",
      },
      {
        id: "s2",
        name: "Mary Smith",
        email: "mary.smith@gmail.com",
        status: "signed",
      },
      {
        id: "s3",
        name: "Peter Johnson",
        email: "peterj@gmail.com",
        status: "awaiting",
      },
    ],
    status: "in_progress",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "d2",
    title: "NDA",
    type: "private",
    fields: [],
    signers: [
      {
        id: "s1",
        name: "Alice Brown",
        email: "alice@example.com",
        status: "awaiting",
      },
      {
        id: "s2",
        name: "Bob Wilson",
        email: "bob@example.com",
        status: "awaiting",
      },
    ],
    status: "in_progress",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "d3",
    title: "Consultant Agreement",
    type: "self",
    fields: [],
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "d4",
    title: "Partnership Agreement",
    type: "private",
    fields: [],
    signers: [
      {
        id: "s1",
        name: "Partner A",
        email: "partnera@example.com",
        status: "signed",
      },
      {
        id: "s2",
        name: "Partner B",
        email: "partnerb@example.com",
        status: "signed",
      },
    ],
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "d5",
    title: "Terms of Service",
    type: "self",
    fields: [],
    status: "completed",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "d6",
    title: "Medical Form",
    type: "public",
    fields: [
      {
        id: "f1",
        label: "Full Name",
        type: "text",
        required: true,
        position: { x: 100, y: 100 },
      },
      {
        id: "f2",
        label: "Date of Birth",
        type: "date",
        required: true,
        position: { x: 100, y: 200 },
      },
      {
        id: "f3",
        label: "Signature",
        type: "signature",
        required: true,
        position: { x: 100, y: 300 },
      },
    ],
    status: "active",
    submissions: [],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ✅ FIXED: DocumentCard now accepts `document` as a prop
const DocumentCard = ({ document }) => {
  const theme = useTheme();
  const statusConfig = getStatusConfig(document.status, theme);
  const typeConfig = getTypeConfig(document.type, theme);

  // Get signer status summary
  const signedCount =
    document.signers?.filter((s) => s.status === "signed").length || 0;
  const totalSigners = document.signers?.length || 0;
  const hasAwaiting = document.signers?.some((s) => s.status === "awaiting");

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        borderRadius: 2,
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={2}>
          {/* Header with title and actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0, mr: 1.5 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {document.title}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" color="success" sx={{ p: 0.75 }}>
                <DownloadCloud size={16} />
              </IconButton>
              <IconButton size="small" color="primary" sx={{ p: 0.75 }}>
                <Share2 size={16} />
              </IconButton>
              <IconButton
                size="small"
                sx={{ p: 0.75, color: "text.secondary" }}
              >
                <MoreVertical size={16} />
              </IconButton>
            </Stack>
          </Box>

          {/* Status chip */}
          <Box sx={{ alignSelf: "flex-start" }}>
            <Chip
              label={statusConfig.label}
              size="small"
              icon={statusConfig.icon}
              sx={{
                backgroundColor: statusConfig.backgroundColor,
                color: theme.palette[statusConfig.color]?.main,
                fontWeight: 600,
                height: 24,
                fontSize: "0.75rem",
                px: 1,
              }}
            />
          </Box>

          {/* Type and signer info */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ pt: 0.5 }}
          >
            <Chip
              label={typeConfig.label}
              size="small"
              sx={{
                backgroundColor: typeConfig.backgroundColor,
                color: theme.palette[typeConfig.color]?.main,
                fontWeight: 600,
                height: 24,
                fontSize: "0.75rem",
                px: 1,
              }}
            />

            {totalSigners > 0 && (
              <Chip
                label={`${signedCount}/${totalSigners} signed`}
                size="small"
                icon={
                  hasAwaiting ? <Clock size={14} /> : <CheckCircle size={14} />
                }
                sx={{
                  backgroundColor: hasAwaiting
                    ? alpha(theme.palette.warning.main, 0.1)
                    : alpha(theme.palette.success.main, 0.1),
                  color: hasAwaiting
                    ? theme.palette.warning.main
                    : theme.palette.success.main,
                  fontWeight: 600,
                  height: 24,
                  fontSize: "0.75rem",
                  px: 1,
                }}
              />
            )}
          </Stack>

          {/* Signer count */}
          <Box sx={{ display: "flex", alignItems: "center", pt: 0.5 }}>
            <Users
              size={16}
              style={{ marginRight: 6, color: theme.palette.text.secondary }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: "0.8125rem" }}
            >
              {document.signers?.length || 0} signers
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Main component
const RecentDocumentsList = () => {
  const theme = useTheme();

  // Sort documents by updatedAt (newest first)
  const sortedDocuments = [...documents].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
          color: theme.palette.text.primary,
        }}
      >
        Recent Documents
      </Typography>

      {sortedDocuments.length === 0 ? (
        <Typography color="text.secondary">No documents found</Typography>
      ) : (
        <Grid container spacing={3}>
          {sortedDocuments.map((doc) => (
            <Grid size={{xs:12,md:4}} key={doc.id}>
              <DocumentCard document={doc} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default RecentDocumentsList;
