import React, { useState, useEffect, useRef, useContext } from "react";
import { tokens } from "../../theme";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Select,
  OutlinedInput,
  Chip,
  List,
  ListItem,
  ListItemText,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Collapse,
  Paper,
  InputLabel,
  Popover,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from "@mui/material/styles";
import {
  AdminPanelSettingsOutlined as AdminIcon,
  SecurityOutlined as SuperAdminIcon,
  LockOpenOutlined as UserIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { fetchLoginRoles, fetchUserDetails, UpdateUser, deleteUser, PostUser, fetchAllCircles, fetchAllCirclesWithStates, fetchZoneCircleDetails } from "../../services/apiService.jsx";
import { AppContext } from "../../services/AppContext.jsx";
import { CheckIcon, Eye } from "lucide-react";
import { set } from "lodash";
import UserForm from "./UserForm.jsx";


export const PAGES = [
  { key: "dashboard", label: "Dashboard" },
  { key: "livemonitoring", label: "Live Monitoring" },
  { key: "historical", label: "Historical" },
  { key: "alarms", label: "Alarms" },
  { key: "daywise", label: "Daywise" },
  { key: "monthly", label: "Monthly" },
  { key: "packetviewer", label: "Packet Viewer" },
  { key: "issuetracking", label: "Issue Tracking" },
  { key: "sitedetails", label: "Site Details" },
  { key: "users", label: "Users" },
];

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const tableRef = useRef(null);
  const { stateOptions, circleOptions, setCircleOptions } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [userData, setUserData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    pageAccessLevel: {},
    selectedState: "",
    circleNames: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userError, setUserError] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false
    }
  });
  const [passwordAnchorEl, setPasswordAnchorEl] = useState(null);
  const [showPasswordPopover, setShowPasswordPopover] = useState(false);

  const textFieldStyles = {
    marginBottom: "16px",
    "& .MuiInputBase-input": { color: colors.primary[200] },
    "& .MuiInputLabel-root": { color: colors.primary[200] },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: colors.primary[200] },
      "&:hover fieldset": { borderColor: "#ccc" },
      "&.Mui-focused fieldset": { borderColor: "#f09819" },
    },
  };

  const buttonGradient = {
    background: "linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))",
    color: colors.primary[200],
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const metCount = Object.values(requirements).filter(Boolean).length;
    
    let score = 0;
    let label = "";
    let color = "";

    if (metCount <= 2) {
      score = 1;
      label = "Weak";
      color = "#ff4444";
    } else if (metCount === 3) {
      score = 2;
      label = "Good";
      color = "#ffa500";
    } else if (metCount >= 4) {
      score = 3;
      label = "Strong";
      color = "#4CAF50";
    }

    setPasswordStrength({
      score,
      label,
      color,
      requirements
    });
  };

  // Real-time password validation handler
const handlePasswordChange = (e) => {
  const newPassword = e.target.value;
  setFormData({ ...formData, password: newPassword });
  if (newPassword.length > 0) {
    checkPasswordStrength(newPassword);
    // Only show popover if we have a valid anchor element
    if (passwordAnchorEl) {
      setShowPasswordPopover(true);
    }
  } else {
    setPasswordStrength({
      score: 0,
      label: "",
      color: "",
      requirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false
      }
    });
    setShowPasswordPopover(false);
  }
};

  // Handle password field focus - show popover
  const handlePasswordFocus = (event) => {
  const anchor = event.currentTarget;
  setPasswordAnchorEl(anchor);
  // Only show popover if there's text in the password field
  if (formData.password.length > 0) {
    setShowPasswordPopover(true);
  }
};

  // Handle password field blur - hide popover after delay
 const handlePasswordBlur = () => {
  // Use a longer delay to ensure click events on popover content work
  setTimeout(() => {
    setShowPasswordPopover(false);
  }, 300);
};

  const fetchUserData = async () => {
    try {
      const response = await fetchUserDetails(); 
      const sanitizedUsers = response.map((user) => ({
        loginCredentialsId: user.loginCredentialsId,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        pageAccessLevel: user.pageAccessLevel || {},
        accessRules: user.accessList || [], 
      }));
      setUserData(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setSnackbar({ open: true, message: "Failed to fetch user data", severity: "error" });
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesResponse] = await Promise.all([
          fetchLoginRoles(),
        ]);
        setRoles(rolesResponse);
        await fetchUserData();
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setSnackbar({ open: true, message: "Failed to fetch roles or users", severity: "error" });
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    const currentPosition = tableRef.current?.getBoundingClientRect().top + window.scrollY;
    setPage(newPage);
    window.scrollTo({ top: currentPosition - 50, behavior: "smooth" });
  };

  const handleChangeRowsPerPage = (event) => {
    const currentPosition = tableRef.current?.getBoundingClientRect().top + window.scrollY;
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    window.scrollTo({ top: currentPosition - 50, behavior: "smooth" });
  };

  const handleOpen = (mode, row = null) => {
  setSelectedRow(row);
  setViewMode(mode === "view");

  // Reset password strength when opening modal
  setPasswordStrength({
    score: 0,
    label: "",
    color: "",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      symbol: false
    }
  });
  
  // Reset popover state - CRITICAL FIX
  setShowPasswordPopover(false);
  setPasswordAnchorEl(null);

  if (row) {
    setFormData({
      loginCredentialsId: row.loginCredentialsId,
      username: row.username,
      email: row.email,
      mobile: row.mobile,
      role: row.role,
      password: "",
      pageAccessLevel: row.pageAccessLevel || Object.fromEntries(PAGES.map((p) => [p.key, false])),
      accessRules: row.accessRules || [],
    });
  } else {
    setFormData({
      username: "",
      email: "",
      mobile: "",
      role: "",
      password: "",
      pageAccessLevel: Object.fromEntries(PAGES.map((p) => [p.key, false])),
      accessRules: [],
    });
  }
  setOpen(true);
};

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
    setUserError("");
    setPasswordStrength({
      score: 0,
      label: "",
      color: "",
      requirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false
      }
    });
    setShowPasswordPopover(false);
    setPasswordAnchorEl(null);
    setFormData({
      username: "", email: "", mobile: "", role: "", password: "",
      pageAccessLevel: Object.fromEntries(PAGES.map((p) => [p.key, false])),
      accessRules: [],
    });
  };

  const validateForm = () => {
    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    
    if (!formData.username) return "Username is required.";
    if (!selectedRow && !formData.password) return "Password is required.";
    
    // Password validation for new users or when password is changed
    if (!selectedRow || (selectedRow && formData.password)) {
      const passwordRequirements = {
        length: formData.password.length >= 10,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /[0-9]/.test(formData.password),
        symbol: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
      };

      if (!passwordRequirements.length) return "Password must be at least 10 characters long.";
      if (!passwordRequirements.uppercase) return "Password must contain at least one uppercase letter.";
      if (!passwordRequirements.lowercase) return "Password must contain at least one lowercase letter.";
      if (!passwordRequirements.number) return "Password must contain at least one number.";
      if (!passwordRequirements.symbol) return "Password must contain at least one special character.";
    }
    
    if (!formData.email) return "Email is required.";
    if (!emailRegex.test(formData.email)) return "Email must end with @gmail.com.";
    if (!formData.mobile) return "Mobile number is required.";
    if (!mobileRegex.test(formData.mobile)) return "Mobile number must be exactly 10 digits.";
    if (!formData.role) return "Role is required.";
    if (formData.role !== "SUPERADMIN" && !Object.values(formData.pageAccessLevel).some((v) => v))
      return "At least one page permission must be selected for non-SUPERADMIN users.";
    return "";
  };

  const handleStateChange = async (newValue) => {
    setFormData({ ...formData, selectedState: newValue, circleNames: [] });
    setCircleOptions([]);
    try {
      const mapData = await fetchAllCirclesWithStates(newValue);
      setCircleOptions(mapData);
    } catch (error) {
      console.error("Error fetching map data for state:", error);
      setSnackbar({ open: true, message: "Failed to fetch circles", severity: "error" });
    }
  };

  const handleSubmit = async (event) => {
    const validationError = validateForm();
    if (validationError) {
      setUserError(validationError);
      setSnackbar({ open: true, message: validationError, severity: "error" });
      return;
    }

    const finalPageAccessLevel =
      event.role === "SUPERADMIN"
        ? Object.fromEntries(PAGES.map((p) => [p.key, true]))
        : event.pageAccessLevel;

    const data = {
      username: event.username,
      password: event.password,
      mobile: event.mobile,
      email: event.email,
      role: event.role,
      pageAccessLevel: finalPageAccessLevel,
      accessList: event.accessList || [], 
    };
    
    if (selectedRow) {
      data.id = selectedRow.loginCredentialsId; 
    }

    try {
      const response = selectedRow ? await UpdateUser(data) : await PostUser(data); 

      if (response.value === 0) {
        setUserError(response.message);
        setSnackbar({ open: true, message: response.message, severity: "error" });
      } else {
        await fetchUserData();
        handleClose();
        setSnackbar({
          open: true,
          message: selectedRow ? "User updated successfully!" : "User added successfully!",
          severity: "success",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error submitting user data";
      setUserError(errorMessage);
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  const handleDeleteClick = (id) => {
    setUserIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(userIdToDelete);
      await fetchUserData();
      setSnackbar({ open: true, message: "User deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting user", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setUserIdToDelete(null);
    }
  };

  // Password Popover Content
  const PasswordPopoverContent = () => (
    <Box sx={{ p: 2, minWidth: 250, maxWidth: 300 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
        Password Requirements
      </Typography>
      
      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ fontWeight: "bold", color: passwordStrength.color }}>
            Strength: {passwordStrength.label || "Not set"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#666" }}>
            {Object.values(passwordStrength.requirements).filter(Boolean).length}/5
          </Typography>
        </Box>
        <Box sx={{ 
          height: "4px", 
          borderRadius: "2px", 
          mt: 0.5,
          width: "100%",
          backgroundColor: "#e0e0e0",
          overflow: "hidden"
        }}>
          <Box sx={{ 
            height: "100%", 
            width: `${(passwordStrength.score / 3) * 100}%`, 
            backgroundColor: passwordStrength.color || "#e0e0e0",
            transition: "all 0.3s ease"
          }} />
        </Box>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.3 }}>
          <span style={{ color: passwordStrength.requirements.length ? "#4CAF50" : "#ff4444", fontSize: "14px" }}>
            {passwordStrength.requirements.length ? "✓" : "✗"}
          </span>
          <Typography variant="caption" sx={{ 
            color: passwordStrength.requirements.length ? "#333" : "#ff4444",
            fontSize: "11px"
          }}>
            Minimum 10 characters
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.3 }}>
          <span style={{ color: passwordStrength.requirements.uppercase ? "#4CAF50" : "#ff4444", fontSize: "14px" }}>
            {passwordStrength.requirements.uppercase ? "✓" : "✗"}
          </span>
          <Typography variant="caption" sx={{ 
            color: passwordStrength.requirements.uppercase ? "#333" : "#ff4444",
            fontSize: "11px"
          }}>
            At least one uppercase letter
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.3 }}>
          <span style={{ color: passwordStrength.requirements.lowercase ? "#4CAF50" : "#ff4444", fontSize: "14px" }}>
            {passwordStrength.requirements.lowercase ? "✓" : "✗"}
          </span>
          <Typography variant="caption" sx={{ 
            color: passwordStrength.requirements.lowercase ? "#333" : "#ff4444",
            fontSize: "11px"
          }}>
            At least one lowercase letter
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.3 }}>
          <span style={{ color: passwordStrength.requirements.number ? "#4CAF50" : "#ff4444", fontSize: "14px" }}>
            {passwordStrength.requirements.number ? "✓" : "✗"}
          </span>
          <Typography variant="caption" sx={{ 
            color: passwordStrength.requirements.number ? "#333" : "#ff4444",
            fontSize: "11px"
          }}>
            At least one number
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 0.3 }}>
          <span style={{ color: passwordStrength.requirements.symbol ? "#4CAF50" : "#ff4444", fontSize: "14px" }}>
            {passwordStrength.requirements.symbol ? "✓" : "✗"}
          </span>
          <Typography variant="caption" sx={{ 
            color: passwordStrength.requirements.symbol ? "#333" : "#ff4444",
            fontSize: "11px"
          }}>
            At least one special character
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box p="3px 5px 30px 5px">
      <Button onClick={() => handleOpen("add")} variant="contained" sx={{ ...buttonGradient, fontWeight: "bold" }}>
        Add User
      </Button>

      <div ref={tableRef}>
        <UserTable
          userData={userData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
          handleOpen={handleOpen}
          handleDelete={handleDeleteClick}
          colors={colors}
        />
      </div>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={userData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-toolbar": {
            background: "transparent",
            color: colors.primary[200],
            borderRadius: "0 0 8px 8px",
          },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
            fontWeight: "bold",
            color: colors.primary[200],
          },
          "& .MuiTablePagination-actions": { color: colors.primary[200] },
          "& .MuiTablePagination-selectIcon": { color: "white !important" },
          "& .MuiIconButton-root": {
            color: colors.primary[200],
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          },
          border: "1px solid black",
          borderTop: "none",
        }}
      />

      <UserForm
        open={open}
        handleClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        roles={roles}
        userError={userError}
        isEditing={!!selectedRow}
        colors={colors}
        textFieldStyles={textFieldStyles}
        buttonGradient={buttonGradient}
        stateOptions={stateOptions}
        zoneOptions={[]}
        divisionOptions={[]}
        circleOptions={circleOptions}
        handleStateChange={handleStateChange}
        viewMode={viewMode}
        passwordStrength={passwordStrength}
        handlePasswordChange={handlePasswordChange}
        handlePasswordFocus={handlePasswordFocus}
        handlePasswordBlur={handlePasswordBlur}
        passwordAnchorEl={passwordAnchorEl}
        showPasswordPopover={showPasswordPopover}
        PasswordPopoverContent={PasswordPopoverContent}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export const UserTable = ({ userData, handleOpen, handleDelete, colors }) => {
  const [openCirclesDialog, setOpenCirclesDialog] = useState(false);
  const [selectedCircles, setSelectedCircles] = useState([]);

  const handleCloseCirclesDialog = () => {
    setOpenCirclesDialog(false);
    setSelectedCircles([]);
  };

  return (
    <Box
      m="10px 0 0 0"
      sx={{
        border: "1px solid black",
        height: "67vh",
        overflowY: "auto",
        borderRadius: "6px",
        boxShadow: "0 4px 10px rgba(19, 17, 17, 0.5)",
      }}
    >
      <Table sx={{ backgroundColor: colors.primary[100] }}>
        <TableHead>
          <TableRow>
            {["User Name", "Phone Number", "Email", "Access Level", "Actions"].map(
              (header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    background: "linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))",
                    color: "black",
                    padding: "12px",
                  }}
                >
                  {header}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {userData.map((row) => (
            <TableRow key={row.loginCredentialsId}>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: colors.primary[200],
                  border: colors.primary[300],
                }}
              >
                {row.username}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: colors.primary[200],
                  border: colors.primary[300],
                }}
              >
                {row.mobile} 
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: colors.primary[200],
                  border: colors.primary[300],
                }}
              >
                {row.email}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: colors.primary[200],
                  border: colors.primary[300],
                }}
              >
                <Box
                  display="flex"
                  justifyContent="center"
                  backgroundColor={
                    row.role === "ADMIN"
                      ? colors.greenAccent[600]
                      : row.role === "SUPERADMIN"
                        ? colors.greenAccent[700]
                        : colors.greenAccent[700]
                  }
                  borderRadius="4px"
                >
                  {row.role === "ADMIN" && <AdminIcon />}
                  {row.role === "SUPERADMIN" && <SuperAdminIcon />}
                  {row.role === "USER" && <UserIcon />}
                  <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                    {row.role}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: colors.primary[200],
                  border: colors.primary[300],
                }}
              >
                <IconButton onClick={() => handleOpen("view", row)}>
                  <Eye sx={{ color: colors.primary[200] }} />
                </IconButton>
                <IconButton onClick={() => handleOpen("edit", row)}>
                  <EditIcon sx={{ color: colors.primary[200] }} />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(row.loginCredentialsId)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={openCirclesDialog}
        onClose={handleCloseCirclesDialog}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: colors.primary[100],
            color: colors.primary[200],
            maxWidth: "350px",
            width: "80vw",
            borderRadius: "8px",
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "0.9rem", color: colors.primary[200] }}>
          Selected Circles
        </DialogTitle>
        <DialogContent sx={{ padding: "8px" }}>
          <List dense>
            {selectedCircles.length > 0 ? (
              selectedCircles.map((circle, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={circle}
                    primaryTypographyProps={{
                      fontSize: "0.75rem",
                      color: colors.primary[200],
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary="No circles selected"
                  primaryTypographyProps={{
                    fontSize: "0.75rem",
                    color: colors.grey[500],
                  }}
                />
              </ListItem>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Team;