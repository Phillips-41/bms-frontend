
import React, { useState, useEffect, useContext } from 'react';
import axios from "axios";
import {fetchStatesDetails, fetchCirclesDetails, fetchAreasDetails, fetchSiteDetailsBatteryandChargerdetails, updateSiteLocation, addSiteLocation, deleteSite, fetchAllSiteIds, fetchCircleNames, fetchAreaNames, fetchAllCircles, fetchAllZones, fetchAllDivisions } from '../../../services/apiService';
import {
  Grid,
  Typography,
  TextField,
  Button,
  Box,
  Autocomplete,
  FormControl,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Chip,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import SearchAndAddButtons from '../SearchAndAddButtons/index';
import { AppContext } from "../../../services/AppContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { tokens } from '../../../theme';
import { set } from 'lodash';

const BASE_URL = "https://rbms.mahadiscom.in/mseb";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request via interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
const parseDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';

  // Check if the date is in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString; // Already in YYYY-MM-DD
  }

  // Check if the date is in DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Handle DD-MM-YYYY format (from backend example "27-05-2025")
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Return empty string for invalid formats
  console.warn(`Invalid date format: ${dateString}`);
  return '';
};
const columnMappingsPart1 = {
  siteId: 'Substation ID',
  serialNumber: 'Serial Number',
  vendorName: 'Customer',
  latitude: 'Latitude',
  longitude: 'Longitude',
  state: 'State Name',
  zone: 'Zone Name',
  circle: 'Circle Name',
  division: 'Sub Division Name',
  area: 'Area Name',
};

const columnMappingsPart2 = {
  firstUsedDate: 'First Used Date',
  batterySerialNumber: 'Battery Serial Number',
  batteryBankType: 'Battery Bank Type',
  manufacturerName: 'Manufacturer Name',
  designVoltage: 'Design Voltage',
  ahCapacity: 'Ah capacity',
  individualCellVoltage: 'Individual Cell Voltage',
  kva: 'KVA',
  mobileNumber:'Mobile Number'

};

const columnMappingsPart3 = {
  
  highVoltage: 'High Voltage',
  lowVoltage: 'Low Voltage',
  batteryAboutToDie: 'Battery About To Die',
  openBattery: 'Open Battery',
  highTemperature: 'High Temperature',
};

const SiteLocation = () => {
  const [openNoDataDialog, setOpenNoDataDialog] = useState(false);
  const [siteDetails, setSiteDetails] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [stateOptions, setStateOptions] = useState([]);
  const [circleOptions, setCircleOptions] = useState([]);
  const[divisionOptions,setDivisionOptions]=useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
 const [selectedState, setSelectedState] = useState('');
  const[selectedZone,setSelectedZone]=useState('');
  const [zoneOptions, setZoneOptions] = useState([]);
const [selectedCircle, setSelectedCircle] = useState('' );
const [selectedDivision, setSelectedDivision] = useState('' );
const [selectedArea, setSelectedArea] = useState('' );
  const [searchData, setSearchData] = useState({
    siteId: '',
    serialNumber: '',
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isSearchSuccessful, setIsSearchSuccessful] = useState(false); // New state to track successful search
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,
    setSiteIdOptions
  } = useContext(AppContext);

  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isOtherSelected, setIsOtherSelected] = useState({
    state: false,
    circle: false,
    area: false,
  });

  // Document upload states
  const [documentDescription, setDocumentDescription] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedDocuments, setUploadedDocuments] = useState([]); // track docs from API responses
  const [selectedDocIds, setSelectedDocIds] = useState([]);
  const [isDocumentLoading, setIsDocumentLoading] = useState(false);

  const descriptionOptions = [
    'Not 2V Batteries',
    'Charger Not working',
    'Charger AC/DC MCB issue',
    'Charger OLD Model',
    'Charger New Model,Need MSEDCL Technician Support',
    'Rust issue',
    'Weak Battiries',
    'Network Issue',
    'Underground wiring to Charger',
    'Substation shut down',
    'Other',
  ];

  useEffect(() => {
  
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        setSiteId("");
        setSerialNumber("");
        const statesData = await fetchStatesDetails();
        setStateOptions(statesData);
        const data = await fetchAllSiteIds();
        setSiteIdOptions(data);
      } catch (error) {
        console.error('Error fetching site details:', error);
      }
   };
 


  const handleStateChange = async (event, newValue) => {
    try {
      if(newValue!=null){
      setSelectedZone('');
      setZoneOptions([]);
      setCircleOptions([]);
      setSelectedZone('');
      setSelectedCircle('');
      setDivisionOptions([]);
      setSelectedDivision('');
      setAreaOptions([]);
      setSelectedArea('');
      const mapData = await fetchAllZones(newValue);
      setZoneOptions(mapData); 
      }
        } catch (error) {
          console.error('Error fetching map data for state:', error);
        }
  };
   const handleZoneChange = async (event, newValue) => {
          if(newValue!=null){
      setCircleOptions([]);
      setSelectedCircle('');
      setDivisionOptions([]);
      setSelectedDivision('');
      setAreaOptions([]);
      setSelectedArea('');
    const mapData = await fetchAllCircles(newValue);
    setCircleOptions(mapData || []);
          }
  };

    const handleDivisionChange = async (event, newValue) => {
            if(newValue!=null){
      setAreaOptions([]);
     setSelectedArea('');
    const mapData = await fetchAreaNames(newValue);
    setAreaOptions(mapData || []);
            }
  };

  const handleCircleChange = async (event, newValue) => {
          if(newValue!=null){
     setSelectedDivision('');
     setDivisionOptions([]);
     setAreaOptions([]);
     setSelectedArea('');
    const mapData = await fetchAllDivisions(newValue);
    setDivisionOptions(mapData || []);
          }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const handleGetDetails = async () => {
  try {
    setIsAdding(false); // Exit add mode
    setIsEditing(false); // Exit edit mode
    setIsOtherSelected({
      state: false,
      circle: false,
      area: false,
    });
    setSelectedState('');
    setSelectedCircle('');
    setSelectedArea('');
    if (!siteId || !serialNumber) {
      console.error('SiteId or SerialNumber is empty!');
      return;
    }

    const response = await fetchSiteDetailsBatteryandChargerdetails(siteId, serialNumber);
  

    if (response?.status === 400) {
      setOpenNoDataDialog(true);
      setFormData({});
      setIsSearchSuccessful(false);
      setUploadedDocuments([]);
      setSelectedDocIds([]);
    } else if (response?.data || (response && !response.status)) {
      // Support both shapes: full axios-like { data } or already-unwrapped body from apiService
      const siteData = response?.data || response;
      const parsedFirstUsedDate = parseDateToYYYYMMDD(siteData.manufacturerDTO?.firstUsedDate || '');
      const combinedData = {
        state: siteData.state || '',
        zone: siteData.zone || '',
        circle: siteData.circle || '',
        division: siteData.division || '',
        area: siteData.area || '',
        latitude: siteData.latitude || '',
        longitude: siteData.longitude || '',
        vendorName: siteData.vendorName || '',
        batteryAHCapacity: siteData.batteryAHCapacity || '',
        siteId: siteData.siteId || '',
        serialNumber: siteData.manufacturerDTO?.serialNumber || 'N/A',
        firstUsedDate: parsedFirstUsedDate, // Use parsed date
        batterySerialNumber: siteData.manufacturerDTO?.batterySerialNumber || 'N/A',
        batteryBankType: siteData.manufacturerDTO?.batteryBankType || 'N/A',
        ahCapacity: siteData.manufacturerDTO?.ahCapacity || 'N/A',
        manufacturerName: siteData.manufacturerDTO?.manufacturerName || 'N/A',
        individualCellVoltage: siteData.manufacturerDTO?.individualCellVoltage || 'N/A',
        designVoltage: siteData.manufacturerDTO?.designVoltage || 'N/A',
        highVoltage: siteData.manufacturerDTO?.highVoltage || 'N/A',
        lowVoltage: siteData.manufacturerDTO?.lowVoltage || 'N/A',
        batteryAboutToDie: siteData.manufacturerDTO?.batteryAboutToDie || 'N/A',
        openBattery: siteData.manufacturerDTO?.openBattery || 'N/A',
        highTemperature: siteData.manufacturerDTO?.highTemperature || 'N/A',
        lowTemperature: siteData.manufacturerDTO?.lowTemperature || 'N/A',
        notCommnVoltage: siteData.manufacturerDTO?.notCommnVoltage || 'N/A',
        kva: siteData.manufacturerDTO?.kva || 'N/A',
        mobileNumber:siteData.manufacturerDTO?.mobileNumber || 'N/A',
        notCommnTemperature: siteData.manufacturerDTO?.notCommnTemperature || 'N/A',

      };
      setFormData(combinedData);
      setSelectedState(combinedData.state);
      setSelectedZone(combinedData.zone);
      setSelectedDivision(combinedData.division);
      setSelectedCircle(combinedData.circle);
      setSelectedArea(combinedData.area);
      setIsSearchSuccessful(true);

      // ---------- Documents from documentDto (only if not null) ----------
      // Backend: documentDto { description, documentUrlsList: List<DocumentUrls> }
      // Show nothing when null / undefined / empty.
      const docDto = siteData.documentDto ?? siteData.documentDTO ?? null;
      if (docDto != null) {
        const mapped = mapDocumentDtoToList(docDto);
        setUploadedDocuments(mapped);
      } else {
        setUploadedDocuments([]);
      }
      setSelectedDocIds([]);
    }
  } catch (error) {
    console.error('Error fetching site details:', error);
    if (error.response?.status === 400) {
      setOpenNoDataDialog(true);
      setFormData({});
      setIsSearchSuccessful(false);
      setUploadedDocuments([]);
      setSelectedDocIds([]);
    }
  }
};

  const handleCloseNoDataDialog = () => {
    setOpenNoDataDialog(false);
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleAdd = () => {
    if (isAdding) {
      setSiteId('');
      setSerialNumber('');
      setIsAdding(false);
      setFormData({});
      setIsSearchSuccessful(false); // Reset search success when canceling Add
    } else {
      setSiteId('');
      setSerialNumber('');
      setIsAdding(true);
      setFormData({});
      setIsSearchSuccessful(false); // Reset search success when entering Add mode
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.highVoltage && (formData.highVoltage < 2 || formData.highVoltage > 2.5)) {
      newErrors.highVoltage = 'High Voltage must be between 2 and 2.5';
    }
    if (formData.lowVoltage && (formData.lowVoltage < 1.9 || formData.lowVoltage > 2)) {
      newErrors.lowVoltage = 'Low Voltage must be between 1.9 and 2';
    }
    if (formData.batteryAboutToDie && (formData.batteryAboutToDie < 1.8 || formData.batteryAboutToDie > 1.9)) {
      newErrors.batteryAboutToDie = 'Battery About To Die must be between 1.8 and 1.9';
    }
    if (formData.openBattery && (formData.openBattery < 1.4 || formData.openBattery > 1.8)) {
      newErrors.openBattery = 'Open Battery must be between 1.4 and 1.8';
    }
    if (formData.highTemperature && formData.highTemperature > 100) {
      newErrors.highTemperature = 'High Temperature must not exceed 100';
    }
    if (formData.ahCapacity && formData.ahCapacity < 0) {
      newErrors.ahCapacity = 'Ah Capacity must not be negative';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Please fix the validation errors before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const combinedData = {
        state: formData?.state,
        zone: formData?.zone ,
        circle: formData?.circle ,
        division: formData?.division ,
        area: formData?.area ,
        latitude: formData?.latitude ,
        longitude: formData?.longitude ,
        vendorName: formData?.vendorName,
        batteryAHCapacity: formData?.batteryAHCapacity ,
        siteId: formData?.siteId ,
        manufacturerDTO: {
          serialNumber: formData?.serialNumber ,
          firstUsedDate: formData?.firstUsedDate ,
          batterySerialNumber: formData?.batterySerialNumber ,
          batteryBankType: formData?.batteryBankType ,
          ahCapacity: formData?.ahCapacity ,
          manufacturerName: formData?.manufacturerName,
          individualCellVoltage: formData?.individualCellVoltage,
          designVoltage: formData?.designVoltage ,
          highVoltage: formData?.highVoltage ,
          lowVoltage: formData?.lowVoltage ,
          batteryAboutToDie: formData?.batteryAboutToDie ,
          openBattery: formData?.openBattery ,
          highTemperature: formData?.highTemperature ,
          lowTemperature: formData?.lowTemperature ,
          notCommnVoltage: formData?.notCommnVoltage ,
          kva: formData?.kva ,
          mobileNumber: formData?.mobileNumber ,
          notCommnTemperature: formData?.notCommnTemperature,
        },
      };

      const response = await apiClient.put(`${BASE_URL}/api/updateSiteLocationToSiteId`, combinedData);

      setSnackbarMessage('Updated successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setIsEditing(false);
      fetchData();
    } catch (error) {
         if (error.response?.data?.validationErrors) {
        // Add bullet points and capitalize first letter
          const formattedErrors = error.response.data.validationErrors
            .map(error => `• ${error.charAt(0).toUpperCase() + error.slice(1)}`)
            .join('\n');
          setSnackbarMessage(formattedErrors);
        } else {
          setSnackbarMessage(error.response?.data?.message || error.message || 'Failed to update site details.');
        }

      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddSite = async () => {
    if (!validateForm()) {
      setSnackbarMessage('Please fix the validation errors before submitting.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      if (!formData.siteId || !formData.serialNumber) {
        alert('Substation ID and Serial Number are required.');
        return;
      }

      const combinedData = {
        state: formData?.state ,
        zone: formData?.zone ,
        circle: formData?.circle ,
        division: formData?.division ,
        area: formData?.area ,
        latitude: formData?.latitude ,
        longitude: formData?.longitude ,
        vendorName: formData?.vendorName ,
        batteryAHCapacity: formData?.batteryAHCapacity ,
        siteId: formData.siteId,
        manufacturerDTO: {
          serialNumber: formData.serialNumber,
          firstUsedDate: formData?.firstUsedDate ,
          batterySerialNumber: formData?.batterySerialNumber ,
          batteryBankType: formData?.batteryBankType,
          ahCapacity: formData?.ahCapacity ,
          manufacturerName: formData?.manufacturerName ,
          individualCellVoltage: formData?.individualCellVoltage,
          designVoltage: formData?.designVoltage ,
          highVoltage: formData?.highVoltage ,
          lowVoltage: formData?.lowVoltage ,
          batteryAboutToDie: formData?.batteryAboutToDie ,
          openBattery: formData?.openBattery ,
          highTemperature: formData?.highTemperature ,
          lowTemperature: formData?.lowTemperature ,
          notCommnVoltage: formData?.notCommnVoltage ,
          kva: formData?.kva ,
          mobileNumber: formData?.mobileNumber ,

          notCommnTemperature: formData?.notCommnTemperature ,
        }
      };

      const response = await apiClient.post(
        `${BASE_URL}/api/postAddNewLocationToSiteId`,
        combinedData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert('Site added successfully!');
      setIsAdding(false);
      setIsSearchSuccessful(false); // Reset search success after adding
      fetchData();
    } catch (error) {
         if (error.response?.data?.validationErrors) {
        // Add bullet points and capitalize first letter
          const formattedErrors = error.response.data.validationErrors
            .map(error => `• ${error.charAt(0).toUpperCase() + error.slice(1)}`)
            .join('\n');
          setSnackbarMessage(formattedErrors);
        } else {
          setSnackbarMessage(error.response?.data?.message || error.message || 'Failed to update site details.');
        }

      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleDeleteSite = async () => {
    if (!siteId || !serialNumber) {
      toast.error('Please select both Substation ID and Serial Number to delete the site.');
      return;
    }

    try {
      await deleteSite(siteId, serialNumber);
      toast.success('Site deleted successfully!');
      setFormData({});
      setIsSearchSuccessful(false); // Reset search success after deletion
      setSelectedState('')
      setSelectedZone('');
      setSelectedCircle('');
      setSelectedArea('');
      fetchData();
    } catch (error) {
      console.error('Error deleting site:', error);
      toast.error('Failed to delete site. Please try again.');
    }
  };

  useEffect(() => {
    setFormData({});
    setIsEditing(false);
    setIsAdding(false);
    setErrors({});
    setIsOtherSelected({
      state: false,
      circle: false,
      area: false,
    });
    setIsSearchSuccessful(false); // Reset search success on clear
    setSelectedState('')
    setSelectedZone('');
    setSelectedCircle('');
    setSelectedArea('');
    // Reset document states when site changes
    setDocumentDescription('');
    setCustomDescription('');
    setSelectedFiles([]);
    setUploadedDocuments([]);
    setSelectedDocIds([]);
  }, [siteId]); 

  const renderFormFields = (columns) => {
    const [otherValues, setOtherValues] = useState({
      state: '',
      circle: '',
      area: '',
    });

    const handleInputChange = (event) => {
      const { name, value } = event.target;
      let error = '';

      if (name === 'highVoltage' && (value < 2 || value > 2.5)) {
        error = 'High Voltage must be between 2 and 2.5';
      } else if (name === 'lowVoltage' && (value < 1.9 || value > 2)) {
        error = 'Low Voltage must be between 1.9 and 2';
      } else if (name === 'batteryAboutToDie' && (value < 1.8 || value > 1.9)) {
        error = 'Battery About To Die must be between 1.8 and 1.9';
      } else if (name === 'openBattery' && (value < 1.4 || value > 1.8)) {
        error = 'Open Battery must be between 1.4 and 1.8';
      } else if (name === 'highTemperature' && value > 100) {
        error = 'High Temperature must not exceed 100';
      } else if (name === 'ahCapacity' && value < 0) {
        error = 'Ah Capacity must not be negative';
      }

      setFormData({
        ...formData,
        [name]: value,
      });

      setErrors({
        ...errors,
        [name]: error,
      });
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={2}>
          {Object.keys(columns).map((key) => {
            if (key === 'siteId') {
              return (
                <Grid item xs={12} sm={8} md={4} lg={3} key="siteId">
                  <Box width="150px" textAlign="center">
                    <FormControl fullWidth margin="dense">
                     <TextField
                        label="Substation ID"
                        name="siteId"
                        value={formData.siteId || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing && !isAdding}
                  InputLabelProps={{
                          sx: {
                            fontWeight: 'bold',
                            color: colors.primary[200], // White label color
                            '&.Mui-focused': {
                              color: colors.primary[200], // White label when focused
                            },
                            fontSize: '12px',
                          },
                        }}
                        inputProps={{
                          style: { textAlign: 'center' },
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '35px',
                            fontWeight: 'bold',
                            //backgroundColor: 'transparent', // Transparent background
                            color: colors.primary[200], // White input text
                          },
                          '& .MuiInputBase-input': {
                            padding: '2px 10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: colors.primary[200], // White input text
                            WebkitTextFillColor:colors.primary[200], // Ensure white text in Webkit browsers
                            '&::placeholder': {
                              color: colors.primary[200], // White placeholder
                              opacity: 1, // Full opacity
                            },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B !important', // White border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: colors.primary[200], // White border on hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B !important', // White border when focused
                          },
                          '& .MuiFormLabel-root': {
                            fontSize: '12px',
                            color: colors.primary[200], // White label
                          },
                          '& .Mui-disabled': {
                            color: colors.primary[200], // White text in disabled state
                           WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#75767B !important', // White border in disabled state
                            },
                            '& .MuiInputBase-input': {
                              color: colors.primary[200], // White input text in disabled state
                              WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              );
            }

            if (key === 'serialNumber') {
              return (
                <Grid item xs={12} sm={8} md={4} lg={3} key="serialNumber">
                  <Box width="150px">
                    <FormControl fullWidth margin="dense">
                      <TextField
                        label="Serial Number"
                        name="serialNumber"
                        value={formData.serialNumber || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing && !isAdding}
                        InputLabelProps={{
                          sx: {
                            fontWeight: 'bold',
                            color: colors.primary[200], // White label color
                            '&.Mui-focused': {
                              color: colors.primary[200], // White label when focused
                            },
                            fontSize: '12px',
                          },
                        }}
                        inputProps={{
                          style: { textAlign: 'center' },
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '35px',
                            fontWeight: 'bold',
                            backgroundColor: 'transparent', // Transparent background
                            color: colors.primary[200], // White input text
                          },
                          '& .MuiInputBase-input': {
                            padding: '2px 10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: colors.primary[200], // White input text
                            WebkitTextFillColor: colors.primary[200], // Ensure white text in Webkit browsers
                            '&::placeholder': {
                              color: colors.primary[200], // White placeholder
                              opacity: 1, // Full opacity
                            },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B !important', // White border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B !important', // White border on hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B !important', // White border when focused
                          },
                          '& .MuiFormLabel-root': {
                            fontSize: '12px',
                            color: colors.primary[200], // White label
                          },
                          '& .Mui-disabled': {
                            color: colors.primary[200], // White text in disabled state
                           WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#75767B !important', // White border in disabled state
                            },
                            '& .MuiInputBase-input': {
                              color: colors.primary[200], // White input text in disabled state
                              WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                            },
                          },
                        }}
                      />
                    </FormControl>
                  </Box>
                </Grid>
              );
            }

            if (key === 'state' || key === 'circle' || key === 'area' || key === 'zone' || key === 'division') {
            const options = key === 'state' ? stateOptions : key === 'circle' ? circleOptions : key === 'zone' ? zoneOptions: key ==='division'?divisionOptions: areaOptions;
            const optionsList =  options.map((item) => item.name);
            const currentValue = 
              key === 'state' ? selectedState :
              key === 'circle' ? selectedCircle : key === 'zone' ? selectedZone : key ==='division' ? selectedDivision:
              selectedArea;
            // Get the current value based on the key
           
              return (
                <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
                  <Box width="150px">
                    <FormControl fullWidth margin="dense">
                      {/* Autocomplete */}
                     <Autocomplete
                        options={[...optionsList, 'Other']}
                        getOptionLabel={(option) => option || ''}
                        value={currentValue || ''}
                        onChange={(event, newValue) => {
                          if (key === 'state') setSelectedState(newValue || '');
                          if (key === 'zone') setSelectedZone(newValue || '');
                          if (key === 'circle') setSelectedCircle(newValue || '');
                          if (key === 'division') setSelectedDivision(newValue || '');
                          if (key === 'area') setSelectedArea(newValue || '');
                          if (newValue === 'Other') {
                            setIsOtherSelected((prev) => ({
                              ...prev,
                              [key]: true,
                            }));
                            setOtherValues((prev) => ({
                              ...prev,
                              [key]: '',
                            }));
                            handleInputChange({
                              target: {
                                name: key,
                                value: '',
                              },
                            });
                          } else {
                            setIsOtherSelected((prev) => ({
                              ...prev,
                              [key]: false,
                            }));
                            if (key === 'state') {
                              handleStateChange(event, newValue);
                            }
                            if (key === 'zone') {
                              handleZoneChange(event, newValue);
                            }
                            if (key === 'division') {
                              handleDivisionChange(event, newValue);
                            }
                            if (key === 'circle') {
                              handleCircleChange(event, newValue);
                            }
                            handleInputChange({
                              target: {
                                name: key,
                                value: newValue || '',
                              },
                            });
                          }
                        }}
                        disabled={!isEditing && !isAdding}
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B', // White border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B', // White border on hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B', // White border when focused
                          },
                          '& .Mui-disabled': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#75767B', // White border in disabled state
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={columns[key]}
                            InputLabelProps={{
                              sx: {
                                fontWeight: 'bold',
                                color: colors.primary[200], // White label color
                                '&.Mui-focused': {
                                  color: colors.primary[200], // White label when focused
                                },
                                '&.Mui-disabled': {
                                  color: colors.primary[200], // White label in disabled state
                                },
                                fontSize: '12px',
                              },
                            }}
                            inputProps={{
                              ...params.inputProps,
                              style: { textAlign: 'center' },
                            }}
                            sx={{
                              '& .MuiInputBase-root': {
                                height: '35px',
                                fontWeight: 'bold',
                                backgroundColor: 'transparent', // Transparent background
                                color: colors.primary[200], // White input text
                                '&.Mui-disabled': {
                                  color: colors.primary[200], // White input text in disabled state
                                  WebkitTextFillColor: colors.primary[200], // Ensure white text in Webkit browsers
                                  '&::placeholder': {
                                    color: colors.primary[200], // White placeholder in disabled state
                                    opacity: 1, // Full opacity for placeholder
                                  },
                                },
                              },
                              '& .MuiInputBase-input': {
                                padding: '2px 10px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: colors.primary[200], // White input text
                                WebkitTextFillColor: colors.primary[200], // Ensure white text in Webkit browsers
                                '&::placeholder': {
                                  color: colors.primary[200], // White placeholder
                                  opacity: 1, // Full opacity
                                },
                                '&.Mui-disabled': {
                                  color: colors.primary[200], // White input text in disabled state
                                  WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                                  '&::placeholder': {
                                    color: colors.primary[200], // White placeholder in disabled state
                                    opacity: 1, // Full opacity for placeholder
                                  },
                                },
                              },
                              '& .MuiFormLabel-root': {
                                fontSize: '12px',
                                color: colors.primary[200], // White label
                                '&.Mui-disabled': {
                                  color: colors.primary[200], // White label in disabled state
                                },
                              },
                            }}
                          />
                        )}
                      />

                      {/* Other TextField (Conditional) */}
                    {isOtherSelected[key] && (
                      <TextField
                        label={`Enter ${columns[key]}`}
                        value={otherValues[key]}
                        onChange={(event) => {
                          const value = event.target.value;
                          setOtherValues((prev) => ({
                            ...prev,
                            [key]: value,
                          }));
                          handleInputChange({
                            target: {
                              name: key,
                              value: value,
                            },
                          });
                        }}
                        fullWidth
                        margin="dense"
                        disabled={!isEditing && !isAdding}
                        inputProps={{
                          style: { textAlign: 'center' },
                        }}
                        InputLabelProps={{
                          sx: {
                            fontWeight: 'bold',
                            color: colors.primary[200], // White label color
                            '&.Mui-focused': {
                              color: colors.primary[200], // White label when focused
                            },
                            fontSize: '12px',
                          },
                        }}
                        sx={{
                          '& .MuiInputBase-root': {
                            height: '35px',
                            fontWeight: 'bold',
                            backgroundColor: 'transparent', // Transparent background
                            color: colors.primary[200], // White input text
                          },
                          '& .MuiInputBase-input': {
                            padding: '5px 10px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: colors.primary[200], // White input text
                            WebkitTextFillColor: colors.primary[200], // Ensure white text in Webkit browsers
                            '&::placeholder': {
                              color: colors.primary[200], // White placeholder
                              opacity: 1, // Full opacity
                            },
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B', // White border
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B', // White border on hover
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B', // White border when focused
                          },
                          '& .MuiFormLabel-root': {
                            fontSize: '12px',
                            color: colors.primary[200], // White label
                          },
                          // '& .Mui-disabled': {
                          //   '& .MuiOutlinedInput-notchedOutline': {
                          //     borderColor: '#75767B !important', // White border in disabled state
                          //   },
                          //   color: colors.primary[200], // White text in disabled state
                          //   WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                          // },
                          '& .Mui-disabled': {
                            color: colors.primary[200], // White text for disabled state
                            WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#75767B', // White border in disabled state
                            },
                          },
                        }}
                      />
                    )}
                    </FormControl>
                  </Box>
                </Grid>
              );
            }


        if (key === 'firstUsedDate') {
           
            return (
              <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
                <Box width="150px">
                  <FormControl fullWidth margin="dense">
                  <TextField
                      label="First Used Date"
                      name="firstUsedDate"
                      type="date"
                      value={parseDateToYYYYMMDD(formData.firstUsedDate) || ''}
                      onChange={(event) => {
                        const newValue = event.target.value;
                        handleInputChange({
                          target: {
                            name: 'firstUsedDate',
                            value: newValue, // Value will be in YYYY-MM-DD format
                          },
                        });
                      }}
                      disabled={!isEditing && !isAdding}
                      InputProps={{
                        inputProps: {
                          max: new Date().toISOString().split('T')[0],
                          style: { textAlign: 'center' },
                        },
                      }}
                      InputLabelProps={{
                        shrink: true,
                        sx: {
                          fontWeight: 'bold',
                          color: colors.primary[200], // White label color
                          '&.Mui-focused': {
                            color: colors.primary[200], // White label when focused
                          },
                          fontSize: '12px',
                        },
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '35px',
                          fontWeight: 'bold',
                          backgroundColor: 'transparent', // Transparent background
                          color: colors.primary[200], // White input text
                        },
                        '& .MuiInputBase-input': {
                          padding: '2px 10px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          color: colors.primary[200], // White input text
                          WebkitTextFillColor: colors.primary[200], // Ensure white text in Webkit browsers
                          '&::placeholder': {
                            color: colors.primary[200], // White placeholder
                            opacity: 1, // Full opacity
                          },
                          '&::-webkit-date-and-time-value': {
                            color: colors.primary[200], // White text for date value in Webkit browsers
                          },
                          '&::-webkit-calendar-picker-indicator': {
                            filter: 'invert(1)', // Make calendar icon white
                            color: colors.primary[200], // Ensure white icon
                          },
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#75767B !important', // White border
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#75767B !important', // White border on hover
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#75767B !important', // White border when focused
                        },
                        '& .MuiFormLabel-root': {
                          fontSize: '12px',
                          color: colors.primary[200], // White label
                        },
                        '& .Mui-disabled': {
                          color: colors.primary[200], // White text in disabled state
                          WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#75767B !important', // White border in disabled state
                          },
                          '& .MuiInputBase-input': {
                            color: colors.primary[200], // White input text in disabled state
                            WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                            '&::-webkit-date-and-time-value': {
                              color: colors.primary[200], // White date value in disabled state
                            },
                          },
                        },
                      }}
                    />
                  </FormControl>
                </Box>
              </Grid>
            );
          }

            return (
              <Grid item xs={12} sm={8} md={4} lg={3} key={key}>
                <Box width="150px" sx={{ marginTop: '1.5px' }}>
                  <TextField
                    label={columns[key]}
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="dense"
                    disabled={!isEditing && !isAdding}
                    type={
                      key === 'designVoltage' ||
                      key === 'individualCellVoltage' ||
                      key === 'highVoltage' ||
                      key === 'lowVoltage' ||
                      key === 'highTemperature' ||
                      key === 'lowTemperature'
                        ? 'number'
                        : 'text'
                    }
                    error={!!errors[key]}
                    helperText={errors[key]}
                    inputProps={{
                      style: { textAlign: 'center' },
                      min:
                        key === 'highVoltage' ? 2 :
                        key === 'lowVoltage' ? 1.9 :
                        key === 'batteryAboutToDie' ? 1.8 :
                        key === 'openBattery' ? 1.4 :
                        key === 'ahCapacity' ? 0 :
                        key === 'highTemperature' ? undefined : undefined,
                      max:
                        key === 'highVoltage' ? 2.5 :
                        key === 'lowVoltage' ? 2 :
                        key === 'batteryAboutToDie' ? 1.9 :
                        key === 'openBattery' ? 1.8 :
                        key === 'highTemperature' ? 100 : undefined,
                    }}
                    InputLabelProps={{
                      sx: {
                        fontWeight: 'bold',
                        color: colors.primary[200], // White label color
                        '&.Mui-focused': {
                          color: colors.primary[200], // White label when focused
                        },
                        '&.Mui-error': {
                          color: colors.primary[200], // White label in error state
                        },
                        fontSize: '12px',
                      },
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: '35px',
                        fontWeight: 'bold',
                        backgroundColor: 'transparent', // Transparent background
                        color: colors.primary[200], // White input text
                      },
                      '& .MuiInputBase-input': {
                        padding: '2px 10px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: colors.primary[200], // White input text
                        WebkitTextFillColor: colors.primary[200], // Ensure white text in Webkit browsers
                        '&::placeholder': {
                          color: colors.primary[200], // White placeholder
                          opacity: 1, // Full opacity
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#75767B !important', // White border with high specificity
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#75767B !important', // White border on hover
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#75767B !important', // White border when focused
                      },
                      '& .MuiFormLabel-root': {
                        fontSize: '12px',
                        color: colors.primary[200], // White label
                      },
                      '& .MuiFormHelperText-root': {
                        color: 'red', // White helper text (error messages)
                      },
                      '& .Mui-disabled': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#75767B !important', // White border in disabled state
                        },
                        color: colors.primary[200], // White text in disabled state
                        WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
                      },
                      '& .Mui-error': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#75767B !important', // White border in error state
                        },
                      },
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </LocalizationProvider>
    );
  };

  const handleClear = () => {
    setSiteId('');
    setSerialNumber('');
    setFormData({});
    setIsEditing(false);
    setIsAdding(false);
    setErrors({});
    setIsOtherSelected({
      state: false,
      circle: false,
      area: false,
    });
    //currentValue= '';
    setSelectedState('')
    setSelectedZone('');
    setSelectedCircle('');
    setSelectedDivision('');
    setSelectedArea('');
    setIsSearchSuccessful(false); // Reset search success on clear
    // Reset document states
    setDocumentDescription('');
    setCustomDescription('');
    setSelectedFiles([]);
    setUploadedDocuments([]);
    setSelectedDocIds([]);
  };

  // ========== Document helpers ==========
  /**
   * Maps backend documentDto (object or array) into the list format used by the UI.
   *
   * Backend shapes:
   *   documentDto = {
   *     description: string,
   *     documentUrlsList: [
   *       { id: Long, originalFilename: string, size: Long, contentType: string }
   *     ]
   *   }
   *   (or an array of such objects)
   *
   * We flatten so each file becomes one selectable row.
   * The id used for DELETE comes from DocumentUrls.id.
   * Returns [] when null/undefined so the list is hidden.
   */
  const mapDocumentDtoToList = (dto) => {
    if (dto == null) return [];
    const {description=""} = dto;
    setDocumentDescription(description);
    const items = Array.isArray(dto) ? dto : [dto];
    const result = [];

    items.filter((item) => item != null).forEach((item, groupIdx) => {
      const description = item.description || '';
      const files = item.documentUrlsList || item.documentUrls || item.files || [];

      if (!Array.isArray(files) || files.length === 0) {
        // Description exists but no files – still show one row if parent has an id
        const fallbackId = item.id ?? item.documentId ?? `group-${groupIdx}`;
        result.push({
          id: fallbackId,
          description,
          fileName: 'No files',
          size: null,
          contentType: null,
          files: [],
          raw: item,
        });
        return;
      }

      // One row per file – id is DocumentUrls.id (required for delete)
      files.forEach((f, fileIdx) => {
        if (f == null) return;
        result.push({
          id: f.id ?? f.documentId ?? `${groupIdx}-${fileIdx}`,
          description,
          fileName: f.originalFilename || f.fileName || f.name || 'file',
          size: f.size ?? null,
          contentType: f.contentType ?? null,
          files: [f],
          raw: item,
        });
      });
    });

    return result;
  };

  // ========== Document Upload / Update / Delete Handlers ==========
  const getEffectiveDescription = () => {
    if (documentDescription === 'Other') {
      return customDescription.trim();
    }
    return documentDescription;
  };

  const getSubstationParam = () => {
    // substation query param is the same as area
    return formData.area || selectedArea || '';
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    // Filter allowed types: jpeg, jpg, pdf, doc, docx
    const allowed = files.filter((f) => {
      const name = f.name.toLowerCase();
      return (
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.pdf') ||
        name.endsWith('.doc') ||
        name.endsWith('.docx')
      );
    });
    if (allowed.length !== files.length) {
      toast.warn('Some files were skipped. Only .jpg, .jpeg, .pdf, .doc, .docx are allowed.');
    }
    setSelectedFiles(allowed);
  };

  const handleUploadDocuments = async () => {
    const substation = getSubstationParam();
    const description = getEffectiveDescription();

    if (!substation) {
      toast.error('Area (substation) is required. Please select/search a site first.');
      return;
    }
    if (!description) {
      toast.error('Please select or enter a description.');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload.');
      return;
    }

    setIsDocumentLoading(true);
    try {
      const formDataPayload = new FormData();
      selectedFiles.forEach((file) => {
        formDataPayload.append('files', file);
      });

      const response = await apiClient.post(
        `/api/uploadDocuments`,
        formDataPayload,
        {
          params: { substation, description },
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Try to capture returned document info (flexible for different response shapes)
      const data = response.data;
      let newDocs = [];
      if (Array.isArray(data)) {
        newDocs = data;
      } else if (data?.documents && Array.isArray(data.documents)) {
        newDocs = data.documents;
      } else if (data?.id) {
        newDocs = [data];
      } else if (data) {
        // fallback: store whatever came back with local meta
        newDocs = [{ ...data, description, fileName: selectedFiles.map((f) => f.name).join(', ') }];
      }

      setUploadedDocuments((prev) => [...prev, ...newDocs]);
      setSelectedFiles([]);
      // clear file input
      const fileInput = document.getElementById('document-file-input');
      if (fileInput) fileInput.value = '';

      toast.success('Documents uploaded successfully!');
      setSnackbarMessage('Documents uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Upload error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to upload documents.';
      toast.error(msg);
      setSnackbarMessage(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsDocumentLoading(false);
    }
  };

  const handleUpdateDocuments = async () => {
    const substation = getSubstationParam();
    const description = getEffectiveDescription();

    if (!substation) {
      toast.error('Area (substation) is required. Please select/search a site first.');
      return;
    }
    if (!description) {
      toast.error('Please select or enter a description.');
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to add.');
      return;
    }

    setIsDocumentLoading(true);
    try {
      const formDataPayload = new FormData();
      selectedFiles.forEach((file) => {
        formDataPayload.append('files', file);
      });

      const response = await apiClient.post(
        `/api/updateDocuments`,
        formDataPayload,
        {
          params: { substation, description },
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      const data = response.data;
      let newDocs = [];
      if (Array.isArray(data)) {
        newDocs = data;
      } else if (data?.documents && Array.isArray(data.documents)) {
        newDocs = data.documents;
      } else if (data?.id) {
        newDocs = [data];
      } else if (data) {
        newDocs = [{ ...data, description, fileName: selectedFiles.map((f) => f.name).join(', ') }];
      }

      setUploadedDocuments((prev) => [...prev, ...newDocs]);
      setSelectedFiles([]);
      const fileInput = document.getElementById('document-file-input');
      if (fileInput) fileInput.value = '';

      toast.success('Documents added successfully (update)!');
      setSnackbarMessage('Documents added successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Update documents error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to update documents.';
      toast.error(msg);
      setSnackbarMessage(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsDocumentLoading(false);
    }
  };

  const handleDeleteDocuments = async () => {
    if (selectedDocIds.length === 0) {
      toast.error('Please select at least one document to delete (from the list below).');
      return;
    }

    setIsDocumentLoading(true);
    try {
      // DELETE with query param documentIds (array)
      const response = await apiClient.delete(`/api/deleteDocuments`, {
        params: { documentIds: selectedDocIds },
        paramsSerializer: (params) => {
          // ensure documentIds=1&documentIds=2 style
          const searchParams = new URLSearchParams();
          (params.documentIds || []).forEach((id) => searchParams.append('documentIds', id));
          return searchParams.toString();
        },
      });

      // Remove deleted ones from local state
      setUploadedDocuments((prev) => prev.filter((doc) => !selectedDocIds.includes(doc.id)));
      setSelectedDocIds([]);

      toast.success(response.data || 'Documents deleted successfully!');
      setSnackbarMessage('Documents deleted successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Delete documents error:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to delete documents.';
      toast.error(msg);
      setSnackbarMessage(msg);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setIsDocumentLoading(false);
    }
  };

  const toggleDocSelection = (id) => {
    setSelectedDocIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <SearchAndAddButtons
        searchData={searchData}
        handleSearchChange={handleSearchChange}
        handleGetDetails={handleGetDetails}
        handleEdit={handleEdit}
        isEditing={isEditing}
        handleAdd={handleAdd}
        isAdding={isAdding}
        handleDeleteSite={handleDeleteSite}
        handleClear={handleClear}
        formData={formData}
        isSearchSuccessful={isSearchSuccessful} // Pass new state

      />
      <Paper
        elevation={3}
        sx={{ 
          marginTop: 1, 
          overflowY: 'auto', 
          maxHeight: 'calc(100vh - 200px)',
          backgroundColor: colors.primary[100], // Light background for the form
          padding: '10px'
        }}
      >
        <Typography variant="h5" sx={{ 
          marginTop: '20px', 
          fontSize: '15px', 
          fontWeight: '800',
          background: 'linear-gradient(to bottom, #d82b27, #f09819)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Site Location
        </Typography>
        {renderFormFields(columnMappingsPart1)}

        <Typography variant="h5" sx={{ 
          marginTop: '20px', 
          fontSize: '15px', 
          fontWeight: '800',
          background: 'linear-gradient(to bottom, #d82b27, #f09819)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Manufacturer Details
        </Typography>
        {renderFormFields(columnMappingsPart2)}

        <Typography variant="h5" sx={{ 
          marginTop: '20px', 
          fontSize: '15px', 
          fontWeight: '800',
          background: 'linear-gradient(to bottom, #d82b27, #f09819)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Threshold Values
        </Typography>
        {renderFormFields(columnMappingsPart3)}

        {/* ========== Site Installation Documents / Issues ========== */}
        {(isSearchSuccessful || isAdding || formData.area || selectedArea) && (
          <>
            <Typography
              variant="h5"
              sx={{
                marginTop: '24px',
                fontSize: '15px',
                fontWeight: '800',
                background: 'linear-gradient(to bottom, #d82b27, #f09819)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Site Installation Documents / Issues
            </Typography>
            <Typography variant="body2" sx={{ color: colors.primary[200], mb: 1, fontSize: '12px' }}>
              Upload documents when the device cannot be installed. Description is required. Upload works independently of Save Changes.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                alignItems: 'flex-start',
                mt: 1,
                mb: 2,
              }}
            >
              {/* Description dropdown */}
              <FormControl size="small" sx={{ minWidth: 280 }}>
                <InputLabel
                  sx={{
                    fontWeight: 'bold',
                    color: colors.primary[200],
                    fontSize: '12px',
                    '&.Mui-focused': { color: colors.primary[200] },
                  }}
                >
                  Description
                </InputLabel>
                <Select
                  value={documentDescription}
                  label="Description"
                  onChange={(e) => {
                    setDocumentDescription(e.target.value);
                    if (e.target.value !== 'Other') setCustomDescription('');
                  }}
                  sx={{
                    height: '35px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: colors.primary[200],
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#75767B !important' },
                    '& .MuiSvgIcon-root': { color: colors.primary[200] },
                  }}
                >
                  {descriptionOptions.map((opt) => (
                    <MenuItem key={opt} value={opt} sx={{ fontSize: '12px' }}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Custom description when Other is selected */}
              {documentDescription === 'Other' && (
                <TextField
                  size="small"
                  label="Enter your description"
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  sx={{
                    minWidth: 260,
                    '& .MuiInputBase-root': {
                      height: '35px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: colors.primary[200],
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: colors.primary[200],
                    },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#75767B !important' },
                  }}
                />
              )}

              {/* File input */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  sx={{
                    height: '35px',
                    fontSize: '12px',
                    borderColor: '#75767B',
                    color: colors.primary[200],
                    textTransform: 'none',
                  }}
                >
                  Choose Files
                  <input
                    id="document-file-input"
                    type="file"
                    hidden
                    multiple
                    accept=".jpg,.jpeg,.pdf,.doc,.docx,image/jpeg,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFiles.length > 0 && (
                  <Typography variant="caption" sx={{ color: colors.primary[200], fontSize: '11px' }}>
                    {selectedFiles.length} file(s) selected
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Selected file chips */}
            {selectedFiles.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                {selectedFiles.map((f, idx) => (
                  <Chip
                    key={idx}
                    label={f.name}
                    size="small"
                    onDelete={() =>
                      setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))
                    }
                    sx={{ fontSize: '11px' }}
                  />
                ))}
              </Box>
            )}

            {/* Upload / Update / Delete buttons — same line */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1.5,
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Button
                variant="contained"
                size="small"
                disabled={isDocumentLoading}
                onClick={handleUploadDocuments}
                sx={{
                  fontSize: '12px',
                  background: '#d82b27',
                  color: '#fff',
                  textTransform: 'none',
                  minWidth: 90,
                }}
              >
                {isDocumentLoading ? <CircularProgress size={18} color="inherit" /> : 'Upload'}
              </Button>
              <Button
                variant="contained"
                size="small"
                disabled={isDocumentLoading}
                onClick={handleUpdateDocuments}
                sx={{
                  fontSize: '12px',
                  background: '#f09819',
                  color: '#fff',
                  textTransform: 'none',
                  minWidth: 90,
                }}
              >
                {isDocumentLoading ? <CircularProgress size={18} color="inherit" /> : 'Update'}
              </Button>
              <Button
                variant="contained"
                size="small"
                disabled={isDocumentLoading || selectedDocIds.length === 0}
                onClick={handleDeleteDocuments}
                sx={{
                  fontSize: '12px',
                  background: '#555',
                  color: '#fff',
                  textTransform: 'none',
                  minWidth: 90,
                }}
              >
                {isDocumentLoading ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
              </Button>
              {selectedDocIds.length > 0 && (
                <Typography variant="caption" sx={{ color: colors.primary[200], fontSize: '11px' }}>
                  {selectedDocIds.length} selected for delete
                </Typography>
              )}
            </Box>

            {/* Existing / uploaded documents list — only shown when not null / has items */}
            {uploadedDocuments.length > 0 && (
              <Box
                sx={{
                  border: '1px solid #75767B',
                  borderRadius: 1,
                  p: 1,
                  maxHeight: 220,
                  overflowY: 'auto',
                  mb: 2,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 'bold', color: colors.primary[200], fontSize: '11px' }}
                >
                  Existing documents — select to delete:
                </Typography>
                <List dense disablePadding>
                  {uploadedDocuments.map((doc, idx) => {
                    const id = doc.id ?? doc.documentId ?? idx;
                    const description = doc.description || 'No description';
                    const fileName = doc.fileName || 'No files';
                    return (
                      <ListItem
                        key={`${id}-${idx}`}
                        dense
                        disablePadding
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <Checkbox
                            edge="start"
                            size="small"
                            checked={selectedDocIds.includes(id)}
                            onChange={() => toggleDocSelection(id)}
                            sx={{ color: colors.primary[200], p: 0.5 }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={fileName}
                          secondary={description}
                          primaryTypographyProps={{
                            fontSize: '12px',
                            color: colors.primary[200],
                            fontWeight: 'bold',
                          }}
                          secondaryTypographyProps={{
                            fontSize: '11px',
                            color: colors.primary[300] || '#aaa',
                          }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}
          </>
        )}

        {(isEditing || isAdding) && (
          <Button
            variant="contained"
            color="#d82b27"
            onClick={isAdding ? handleAddSite : handleUpdate}
            sx={{ marginTop: '20px', fontSize: '13px', background: '#d82b27', color: '#ffff' }}
          >
            {isAdding ? 'Add Site' : 'Save Changes'}
          </Button>
        )}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Dialog
        open={openNoDataDialog}
        onClose={handleCloseNoDataDialog}
        aria-labelledby="no-data-dialog-title"
        aria-describedby="no-data-dialog-description"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            width: '400px',
            maxWidth: '90vw',
            backgroundColor: '#f5f5f5',
          },
        }}
      >
        <DialogTitle
          id="no-data-dialog-title"
          sx={{
            backgroundColor: '#d82b27',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            padding: '12px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          No Data Available
        </DialogTitle>
        <DialogContent
          sx={{
            padding: '20px 24px',
          }}
        >
          <DialogContentText
            id="no-data-dialog-description"
            sx={{
              color: '#333',
              fontSize: '1rem',
              lineHeight: '1.5',
            }}
          >
            No data found for the selected Substation ID and Serial Number.
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
            onClick={handleCloseNoDataDialog}
            sx={{
              color: '#757575',
              textTransform: 'none',
              fontWeight: 'bold',
              padding: '6px 16px',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SiteLocation;