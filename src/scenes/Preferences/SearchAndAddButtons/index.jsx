
import React, { useContext, useState } from 'react';
import {
  Grid,
  IconButton,
  Tooltip,
  TextField,
  Autocomplete,
  useTheme,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box
} from '@mui/material';
import { AppContext } from '../../../services/AppContext';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import clear from '../../../assets/assets/images/png/brush.png';
import MasterFileUpload from './MasterFileUpload';
import { tokens } from '../../../theme';

const SearchAndAddButtons = ({
  handleGetDetails,
  handleEdit,
  isEditing,
  handleAdd,
  isAdding,
  handleDeleteSite,
  handleClear,
  formData,
  isSearchSuccessful, // New prop to track successful search
 
}) => {
  const {
    siteIdOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setSerialNumberOptions,
    setSiteOptions
  } = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleSiteIdChange = (selectedSiteId) => {
    setSiteId(selectedSiteId);
    setSerialNumber("");
    const selectedSite = siteIdOptions.find((site) => site.siteId === selectedSiteId);
    if (selectedSite) {
      setSerialNumberOptions(selectedSite?.serialNumbers);
    } else {
      setSerialNumberOptions([]);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setMessage('');
  };

  const checkSelection = (action) => {
    if (!siteId || !serialNumber) {
      setMessage(`Please select both Substation ID and Serial Number to ${action}`);
      setSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const checkEdit = (action) => {
    if (!siteId || !serialNumber || !formData) {
      if (!formData) {
        setMessage(`No Data to ${action}`);
      } else {
        setMessage(`Please select both Substation ID and Serial Number to ${action}`);
      }
      setSeverity('error');
      setOpenSnackbar(true);
      return false;
    }
    return true;
  };

  const handleSearchClick = () => {
    if (checkSelection('search')) {
      handleGetDetails();
    }
  };

  const handleEditClick = async () => {
    if (checkEdit('edit')) {
      try {
        await handleEdit();
      } catch (error) {
        setMessage('Failed to update');
        setSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  const handleDeleteClick = () => {
    if (checkSelection('delete')) {
      setOpenDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await handleDeleteSite();
      setMessage('Deleted successfully');
      setSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      setMessage('Failed to delete');
      setSeverity('error');
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2} justifyContent="flex-center">
          
        <Grid item xs={12} sm={6} md={6} display="flex" alignItems="center" gap={2}>
         <Autocomplete
            disablePortal
            freeSolo
            options={siteIdOptions.map((site) => site.siteId)}
            value={siteId}
            onChange={(event, newValue) => handleSiteIdChange(newValue)}
            sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 180 },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#75767B', // White border for the input
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#75767B', // White border on hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#75767B', // White border when focused
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="SubStation ID"
                InputLabelProps={{
                  sx: {
                    fontWeight: 'bold',
                    color: colors.primary[200], // White label color
                    '&.Mui-focused': {
                      color: colors.primary[200], // White label when focused
                    },
                  },
                }}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    // fontWeight: 'bold',
                    height: '35px',
                    marginTop: '5px',
                    color: colors.primary[200], // White text color for input
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
                }}
              />
            )}
          />

          <Autocomplete
            disablePortal
            options={serialNumberOptions}
            value={serialNumber}
            onChange={(event, newValue) => setSerialNumber(newValue)}
           sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 180 },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#75767B', // White border for the input
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#75767B', // White border on hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#75767B', // White border when focused
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Serial Number"
                InputLabelProps={{
                  sx: {
                    fontWeight: 'bold',
                    color: colors.primary[200], // White label color
                    '&.Mui-focused': {
                      color: colors.primary[200], // White label when focused
                    },
                  },
                }}
                fullWidth
                sx={{
                  '& .MuiInputBase-root': {
                    // fontWeight: 'bold',
                    height: '35px',
                    marginTop: '5px',
                    color: colors.primary[200], // White text color for input
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
                }}
              />
            )}
          />
             <Tooltip title="Search Details">
            <IconButton
              color="secondary"
              onClick={handleSearchClick}
              sx={{
                '&:hover': { backgroundColor: 'rgba(63, 81, 181, 0.1)' },
              }}
            >
              <SearchIcon sx={{ marginTop: '8px', fontSize: 20,color: colors.primary[200] }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Clear"
            placement="bottom"
            arrow
            sx={{
              '& .MuiTooltip-tooltip': {
                fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' },
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.contrastText,
                padding: { xs: '0.25rem 0.5rem', sm: '0.3rem 0.6rem', md: '0.4rem 0.8rem' },
              },
              '& .MuiTooltip-arrow': {
                color: theme.palette.error.light,
              },
            }}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={handleClear}
              size="small"
              sx={{
                border: 'none',
                minWidth: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem', xl: '2rem' },
                height: { xs: '1.625rem', sm: '1.75rem', md: '1.875rem', lg: '1.875rem', xl: '1.875rem' },
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={clear} alt="Clear" height="20" width="20" />
              </Box>
            </Button>
          </Tooltip>
       
        </Grid>

        <Grid
          item
          xs={12}
          sm={6}
          md={6}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          gap={2}
          sx={{ pr: 4 }}
        >
          {/* Show Edit button only if search was successful and not in Add mode */}
          {isSearchSuccessful && !isAdding && (
            <Tooltip title={isEditing ? 'Cancel Edit' : 'Edit'}>
              <IconButton
                color="secondary"
                onClick={handleEditClick}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
                }}
              >
                <EditIcon sx={{ marginTop: '8px', fontSize: 20,color:colors.primary[200] }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Show Add button only when not in Edit mode */}
          {!isEditing && (
            <Tooltip title={isAdding ? 'Cancel Add' : 'Add'}>
              <IconButton
                color="secondary"
                onClick={handleAdd}
                sx={{
                  '&:hover': { backgroundColor: 'rgba(255, 193, 7, 0.1)' },
                }}
              >
                <AddIcon sx={{ marginTop: '8px', fontSize: 20, color:colors.primary[200] }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Delete">
            <IconButton
              color="error"
              onClick={handleDeleteClick}
              sx={{
                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' },
              }}
            >
              <DeleteIcon sx={{ marginTop: '8px', fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <MasterFileUpload/>
        </Grid>
      </Grid>

      <Dialog
        open={openDeleteDialog}
        onClose={handleCancelDelete}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            width: '400px',
            maxWidth: '90vw',
            backgroundColor: '#fff',
          },
        }}
      >
        <DialogTitle
          id="delete-dialog-title"
          sx={{
            backgroundColor: '#f44336',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            padding: '12px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          Confirm Deletion
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '20px 24px',
          }}
        >
          <DialogContentText
            id="delete-dialog-description"
            sx={{
              color: '#333',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}
          >
            Are you sure you want to delete the site with Substation ID{' '}
            <strong>"{siteId}"</strong> and Serial Number <strong>"{serialNumber}"</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            padding: '10px 24px',
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fafafa',
          }}
        >
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: '#757575',
              textTransform: 'none',
              fontWeight: 'bold',
              padding: '6px 16px',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            No
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              backgroundColor: '#f44336',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 'bold',
              padding: '6px 16px',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SearchAndAddButtons;
