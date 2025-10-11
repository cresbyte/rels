import {
  Box,
  Card,
  Chip,
  InputAdornment,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme
} from "@mui/material";
import {
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Info,
  Search,
  User,
  Users
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Styled components matching your existing style
const StyledCard = ({ children, ...props }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 0,
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? alpha(theme.palette.background.paper, 0.3)
            : alpha(theme.palette.background.paper, 0.4),
        backdropFilter: "blur(8px)",
        boxShadow: "none",
        transition: "all 0.3s ease",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};



// Type mapping
const getTypeConfig = (type, theme) => {
  const configs = {
    self: {
      label: "Self-Sign",
      icon: <User size={16} />,
      color: "primary",
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
    private: {
      label: "Multi-Signer",
      icon: <Users size={16} />,
      color: "secondary",
      backgroundColor: alpha(theme.palette.secondary.main, 0.1),
    },
    public: {
      label: "Public Form",
      icon: <Globe size={16} />,
      color: "info",
      backgroundColor: alpha(theme.palette.info.main, 0.1),
    },
  };
  return configs[type] || configs.self;
};

// Status mapping
const getStatusConfig = (status, theme) => {
  const configs = {
    completed: {
      label: "Completed",
      icon: <CheckCircle size={16} />,
      color: "success",
      backgroundColor: alpha(theme.palette.success.main, 0.1),
    },
    in_progress: {
      label: "In Progress",
      icon: <Clock size={16} />,
      color: "warning",
      backgroundColor: alpha(theme.palette.warning.main, 0.1),
    },
    active: {
      label: "Active",
      icon: <FileText size={16} />,
      color: "primary",
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
    },
  };
  return configs[status] || configs.in_progress;
};

// Sample documents data
const SAMPLE_DOCUMENTS = [
  {
    id: "doc1",
    title: "Service Agreement – John",
    type: "private",
    signers: [
      { id: "s1", name: "John Doe", status: "signed" },
      { id: "s2", name: "Mary Smith", status: "signed" },
      { id: "s3", name: "Peter Johnson", status: "awaiting" },
    ],
    status: "in_progress",
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
  },
  {
    id: "doc2",
    title: "NDA Template",
    type: "public",
    submissions: 12,
    status: "active",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "doc3",
    title: "Consultant Agreement",
    type: "self",
    status: "completed",
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "doc4",
    title: "Partnership Agreement",
    type: "private",
    signers: [
      { id: "s1", name: "Partner A", status: "signed" },
      { id: "s2", name: "Partner B", status: "signed" },
    ],
    status: "completed",
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "doc5",
    title: "Terms of Service",
    type: "self",
    status: "completed",
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "doc6",
    title: "Medical Form",
    type: "public",
    submissions: 45,
    status: "active",
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: "doc7",
    title: "Employment Contract",
    type: "private",
    signers: [
      { id: "s1", name: "HR Manager", status: "signed" },
      { id: "s2", name: "New Hire", status: "awaiting" },
    ],
    status: "in_progress",
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: "doc8",
    title: "Personal Declaration",
    type: "self",
    status: "completed",
    updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
];

// Document table row
const DocumentTableRow = ({ document, onClick, theme }) => {
  const typeConfig = getTypeConfig(document.type, theme);
  const statusConfig = getStatusConfig(document.status, theme);

  // Calculate progress text
  let progressText = "N/A";
  if (document.type === "private" && document.signers) {
    const signedCount = document.signers.filter(
      (s) => s.status === "signed"
    ).length;
    progressText = `${signedCount}/${document.signers.length} signed`;
  } else if (document.type === "public") {
    progressText = document.submissions
      ? `${document.submissions} submissions`
      : "0 submissions";
  }

  return (
    <TableRow
      hover
      onClick={() => onClick(document)}
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
        },
        transition: "background-color 0.2s",
      }}
    >
      <TableCell>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <FileText
            size={18}
            style={{ marginRight: 12, color: theme.palette.text.secondary }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              {document.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {document.id}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        <Chip
          label={typeConfig.label}
          size="small"
          icon={typeConfig.icon}
          sx={{
            backgroundColor: typeConfig.backgroundColor,
            color: theme.palette[typeConfig.color]?.main,
            fontWeight: 600,
            height: 24,
          }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" fontWeight={500}>
          {progressText}
        </Typography>
        {document.type === "private" && document.signers && (
          <Typography variant="caption" color="text.secondary">
            {document.signers.filter((s) => s.status === "awaiting").length}{" "}
            awaiting
          </Typography>
        )}
      </TableCell>

      <TableCell>
        <Chip
          label={statusConfig.label}
          size="small"
          icon={statusConfig.icon}
          sx={{
            backgroundColor: statusConfig.backgroundColor,
            color: theme.palette[statusConfig.color]?.main,
            fontWeight: 600,
            height: 24,
          }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2">
          {new Date(document.updatedAt).toLocaleDateString()}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(document.updatedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

// Main DocumentsTable component
const DocumentsTable = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const tabs = ["All", "Self-Sign", "Multi-Signer", "Public Form"];

  // Filter and paginate documents
  const filteredDocuments = useMemo(() => {
    let filtered = [...SAMPLE_DOCUMENTS];

    // Apply tab filter
    if (activeTab === 1)
      filtered = filtered.filter((doc) => doc.type === "self");
    if (activeTab === 2)
      filtered = filtered.filter((doc) => doc.type === "private");
    if (activeTab === 3)
      filtered = filtered.filter((doc) => doc.type === "public");

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(term) ||
          doc.id.toLowerCase().includes(term)
      );
    }

    // Sort by updated date (newest first)
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  }, [activeTab, searchTerm]);

  const paginatedDocuments = useMemo(() => {
    return filteredDocuments.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredDocuments, page, rowsPerPage]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setPage(0); // Reset to first page when changing tabs
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleDocumentClick = (document) => {
    // Navigate to the document detail page using URL routing
    console.log("Opening document:", document.id);
    navigate(`/dashboard/documents/${document.id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ p: 0 }}>
      {/* Tabs and Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          mb: 3,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="document tabs"
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            minHeight: 48,
            "& .MuiTabs-flexContainer": {
              gap: 2,
            },
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 500,
              px: 2,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tabs>

        <TextField
          size="small"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
            sx: {
              width: { xs: "100%", sm: "300px" },
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

      {/* Table */}
      <StyledCard>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "none",
            overflow: "hidden",
            height: "auto",
            minHeight: 400,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "40%" }}>
                  Document
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "15%" }}>
                  Type
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "20%" }}>
                  Progress
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "15%" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, py: 2, width: "15%" }}>
                  Last Changed
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedDocuments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 4, height: "100%", border: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Info
                        size={38}
                        style={{
                          color: theme.palette.text.secondary,
                          opacity: 0.5,
                          marginBottom: 12,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        No documents found
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Try adjusting your search or filter criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDocuments.map((document) => (
                  <DocumentTableRow
                    key={document.id}
                    document={document}
                    onClick={handleDocumentClick}
                    theme={theme}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filteredDocuments.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            borderTop: "none",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
            {
              fontSize: "0.875rem",
            },
          }}
        />
      </StyledCard>


    </Box>
  );
};

export default DocumentsTable;
