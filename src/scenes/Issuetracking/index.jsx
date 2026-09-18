import React, { useState, useEffect, useContext, use } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  CircularProgress,
  useTheme,
  IconButton,
  Popover,

  TablePagination,
  Stack,
} from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Autocomplete from '@mui/material/Autocomplete';
import { AppContext } from "../../services/AppContext";
import { tokens } from "../../theme";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import clear from '../../assets/assets/images/png/brush.png'
import { Button } from '@mui/material';
import { format, addDays, isAfter, isBefore, startOfDay, parse } from "date-fns";
import { formatTimeStamp } from '../Analytics/Historical';
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

const TicketTable = () => {
  // const [siteId, setSiteId] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [tickets, setTickets] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentSite, setCurrentSite] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [errors, setErrors] = useState({ startDate: false, endDate: false });
  const [isFiltered, setIsFiltered] = useState(false); // Track if filters are applied
 
  const today = startOfDay(new Date());
  const startDateObj = startDate ? new Date(startDate.split("%")[0]) : null;
  const {setState,setCircle,siteId, setSiteId, serialNumber,
    setSerialNumber,state,circle,stateOptions,
    circleOptions,handleCircleChange,handleStateChange,clearOptions: clearContextOptions ,divisionOptions,division,handleDivisionChange,
     zone,zoneOptions,handleZoneChange,setZone,setZoneOptions,setCircleOptions,setSiteOptions, area, setArea, areaOptions, handleAreaChange
  } = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
useEffect(() => {
  setArea('')
  setStartDate(null);
  setEndDate(null);
  setPage(0);
  setIsFiltered(false);
  last7daysTickets(0);
  setState('')
  setCircle('')
  setZoneOptions([])
  setCircleOptions([])
  setSiteOptions([])
},[])
  const resetAllState = () => {
    setState('');
    setCircle('');
    setSiteId('');
    setSerialNumber('');
    setStartDate(null);
    setEndDate(null);
    setPage(0);
    setIsFiltered(false);
    setArea('');
  };

  const clearOptions = () => {
    clearContextOptions();
    resetAllState();
    last7daysTickets(0);
  };
useEffect(() => {
  return () => {
    // Cleanup on unmount
    setState("");
    setCircle("");
    setZone("");
    setArea('')
    setStartDate(null);
    setEndDate(null);
  };
}, []);
const [openTooltipId, setOpenTooltipId] = useState(null);

const handleClick = (siteId, serialNumber) => {
  setOpenTooltipId(siteId); // Or any unique ID if multiple tooltips possible
  handleFetchCoordinates(siteId, serialNumber);
};

const handleClose = () => {
  setOpenTooltipId(null);
};

  const handleExportPdf = async () => {
    try {
      const formattedStartDate = startDate ? formatDate(new Date(startDate.split('%')[0])) : '';
      const formattedEndDate = endDate ? formatDate(new Date(endDate.split('%')[0])) : '';
      const url = `/tickets/download/pdf?area=${area}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59`;
  
      const response = await apiClient.get(url, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `tickets_${formattedStartDate}_to_${formattedEndDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting PDF:', error.response ? error.response.data : error.message);
    }
  };

  const handleExportExcel = async () => {
    try {

      const formattedStartDate = startDate ? formatDate(new Date(startDate.split('%')[0])) : '';
      const formattedEndDate = endDate ? formatDate(new Date(endDate.split('%')[0])) : '';
      let exportUrl;
      if(area){
      exportUrl=`/tickets/download/excel?area=${area}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59`;
      }else{
       exportUrl=`/ticketsCircleWise/download/excel?circle=${circle}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59`;
      }
  
      const response = await apiClient.get(exportUrl, {
        responseType: 'blob',
      });
  
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `tickets_${formattedStartDate}_to_${formattedEndDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error exporting Excel:', error.response ? error.response.data : error.message);
    }
  }; 

  const last7daysTickets = async (currentPage) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/latest7days?page=${currentPage}&size=${rowsPerPage}`
      );
      setTickets(response.data.content);
      setTotalRecords(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching last 7 days data:', error);
    }
  };

  const fetchCircleWiseTickets = async (currentPage) => {
try {
    const formattedStartDate = startDate ? formatDate(new Date(startDate.split('%')[0])) : '';
      const formattedEndDate = endDate ? formatDate(new Date(endDate.split('%')[0])) : '';
      const response = await apiClient.get(
        `${BASE_URL}/tickets/circle-wise?page=${currentPage}&size=${rowsPerPage}&circle=${circle}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59`
      );
      setTickets(response.data.content);
      setTotalRecords(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching circle-wise data:', error);
    }
 }

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchTickets = async (currentPage) => {
    if (!startDate || !endDate) {
      console.error('Start date or end date is missing');
      setErrors({ startDate: !startDate, endDate: !endDate });
      return;
    }
    const formattedStartDate = formatDate(new Date(startDate.split("%")[0]));
    const formattedEndDate = formatDate(new Date(endDate.split("%")[0]));
    const url = `${BASE_URL}/tickets?area=${area}&start=${formattedStartDate}T00:00:00&end=${formattedEndDate}T23:59:59&page=${currentPage}&size=${rowsPerPage}`;
    try {
      setTickets([]);
      setTotalRecords(0);
      const response = await apiClient.get(url);
      setTickets(response.data.content);
      setTotalRecords(response.data.totalElements);
    } catch (error) {
      console.error('Error fetching filtered data:', error.response ? error.response.data : error.message);
    }
  };

  const handleFetchTickets = () => {
    if (area && startDate && endDate) {
      setPage(0); // Reset to first page when fetching new filtered data
      setIsFiltered(true); // Mark as filtered
      fetchTickets(0);
    }else{
    fetchCircleWiseTickets(0)
    }
  };

  useEffect(() => {
    if (isFiltered && area && startDate && endDate) {
      fetchTickets(page); // Fetch filtered tickets when page or rowsPerPage changes
    } else if (circle) {
      fetchCircleWiseTickets(page); // Fetch last 7 days when no filters are applied
    }else{
      last7daysTickets(page); // Fetch last 7 days when no filters are applied
    }
  }, [page, rowsPerPage, isFiltered]);

  const [hoverData, setHoverData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchCoordinates = async (siteId,serialNumber ) => {
    setHoverData(null);
    setLoading(true);
    try {
      const response = await apiClient.get(`${BASE_URL}/api/getCoordinates`, {
        params: { siteId,serialNumber , marginMinutes: 15 },
      });
      setHoverData(response.data);
    } catch (error) {
      console.error('Failed to fetch coordinates:', error);
      setHoverData(null);
    } finally {
      setLoading(false);
    }
  };





  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const renderHighlightedOption = (props, option, value) => (
    <li
      {...props}
      style={{
        backgroundColor: value === option ? "#d82b27" : "inherit",
        color: value === option ?colors.primary[200] : "inherit",
      }}
    >
      {option}
    </li>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: "2px 5px 10px 5px"
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        mb={2}
        pt={2}
        sx={{
          width: '100%',
          overflowX: 'hidden',
          paddingBottom: '8px', // For scrollbar space
          '& > *': {
            flexShrink: 0 // Prevent items from shrinking
          }
        }}
      >
        {/* State */}
        <Autocomplete
          options={stateOptions.map((state) => state.name)}
          value={state}
          onChange={(event, newValue) => handleStateChange(newValue)}
          size="small"
          sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 120 ,xl:180 },
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
          renderOption={(props, option) => renderHighlightedOption(props, option, state)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={"State"}
              variant="outlined"
              size="small"
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
                    border: `1px solid #75767B`,
                    height: '30px',
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
          options={zoneOptions}
          value={zone}
          onChange={(event, newValue) => handleZoneChange(newValue)}
          size="small"
         sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 130 ,xl:150  },
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
          renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={"Zone"}
             variant="outlined"
              size="small"
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
                      border: `1px solid #75767B`,
                    height: '30px',
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

        {/* Circle */}
        <Autocomplete
          options={circleOptions}
          value={circle}
          onChange={(event, newValue) => handleCircleChange(newValue)}
          size="small"
         sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 130 ,xl:150  },
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
          renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={"Circle"}
             variant="outlined"
              size="small"
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
                      border: `1px solid #75767B`,
                    height: '30px',
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
          options={divisionOptions}
          value={area}
          onChange={(event, newValue) => handleDivisionChange(newValue)}
          size="small"
         sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 130 ,xl:150  },
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
          renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={"Sub Division"}
             variant="outlined"
              size="small"
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
                      border: `1px solid #75767B`,
                    height: '30px',
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

         {/* Area */}
        <Autocomplete
          options={areaOptions}
          value={area}
          onChange={(event, newValue) => handleAreaChange(newValue)}
          size="small"
         sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 130 ,xl:150  },
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
          renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={"Area"}
             variant="outlined"
              size="small"
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
                      border: `1px solid #75767B`,
                    height: '30px',
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

        {/* Site ID */}
        {/* <Autocomplete
          freeSolo
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={(event, newValue) => setSiteId(newValue)}
          size="small"
          sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 134 ,xl:185},
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
              placeholder={"Substation ID"}
              variant="outlined"
              size="small"
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
                  border: `1px solid #75767B`,
                    height: '30px',
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
        /> */}

        {/* Serial Number */}
        {/* <Autocomplete
          options={serialNumberOptions}
          value={serialNumber}
          onChange={(event, newValue) => setSerialNumber(newValue)}
          size="small"
          sx={{
              width: { xs: 90, sm: 100, md: 110, lg: 134 ,xl:185},
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
              placeholder={"Serial No"}
              variant="outlined"
              size="small"
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
                    height: '30px',
                    marginTop: '5px',
                    color: colors.primary[200], // White text color for input
                      border: `1px solid #75767B`,
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
                }}
            />
          )}
        /> */}

        {/* Start Date */}

   <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          display="flex"
          gap={{ xl: "0.75rem", lg: "0.625rem", md: "0.5rem", sm: "0.375rem", xs: "0.25rem" }}
          sx={{
            [theme.breakpoints.down("sm")]: {
              width: "100%",
              justifyContent: "space-between",
            },
          }}
        >
<DatePicker
  label="From"
  value={startDate ? parse(startDate.split(" ")[0], "yyyy-MM-dd", new Date()) : null}
  onChange={(newDate) => {
    if (!newDate || isNaN(newDate)) {
      setStartDate("");
      setErrors({ ...errors, startDate: "Invalid date" });
      return;
    }

    const selectedDate = startOfDay(newDate);
    if (isAfter(selectedDate, today)) {
      setStartDate(format(today, "yyyy-MM-dd") + " 00:00:00");
      setErrors({ ...errors, startDate: "Cannot select future dates" });
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd") + " 00:00:00";
    setStartDate(formattedDate);
    setErrors({ ...errors, startDate: "" });

    if (endDate) {
      const endDateObj = new Date(endDate.split(" ")[0]);
      if (isAfter(selectedDate, endDateObj)) {
        setEndDate(formattedDate.replace(" 00:00:00", " 23:59:59"));
      }
    }
  }}
  maxDate={today}
  format="dd-MM-yyyy" // Add this prop to set display format
  slotProps={{
    textField: {
      size: "small",
      error: !!errors.startDate,
      helperText: errors.startDate,
       placeholder: "DD-MM-YYYY", // Update placeholder
      InputLabelProps: {
        sx: {
          fontWeight: 'bold',
          color: colors.primary[200], // White label color
          '&.Mui-focused': {
            color: colors.primary[200], // White label when focused
          },
          fontSize: {
            xl: '0.8125rem',
            lg: '0.7875rem',
            md: '0.7625rem',
            sm: '0.7375rem',
            xs: '0.7125rem',
          },
        },
      },
      sx: {
        width: {
          xl: '10rem',
          lg: '7.5rem',
          md: '10rem',
          sm: '9rem',
          xs: '8rem',
        },
        '& .MuiInputBase-root': {
          height: '30px', // Match TextField height
          backgroundColor: 'transparent', // Transparent background
          color: colors.primary[200], // White input text
            border: `1px solid #75767B`,
        },
        '& .MuiInputBase-input': {
          fontSize: {
            xl: '0.8125rem',
            lg: '0.7875rem',
            md: '0.7625rem',
            sm: '0.7375rem',
            xs: '0.7125rem',
          },
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
          fontSize: {
            xl: '0.8125rem',
            lg: '0.7875rem',
            md: '0.7625rem',
            sm: '0.7375rem',
            xs: '0.7125rem',
          },
          color: colors.primary[200], // White label
        },
        '& .MuiFormHelperText-root': {
          color: colors.primary[200], // White helper text (error messages)
        },
        '& .MuiSvgIcon-root': {
          color: colors.primary[200], // White calendar icon
        },
        '& .Mui-disabled': {
          color: colors.primary[200], // White text for disabled state
          WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B', // White border in disabled state
          },
        },
        '& .Mui-error': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B', // Keep white border in error state
          },
        },
      },
    },
  }}
/>

<DatePicker
  label="To"
  value={endDate ? parse(endDate.split(" ")[0], "yyyy-MM-dd", new Date()) : null}
  onChange={(newDate) => {
    if (!newDate || isNaN(newDate)) {
      setEndDate(startDate || format(today, "yyyy-MM-dd") + " 23:59:59");
      return;
    }

    const selectedDate = startOfDay(newDate);
    let finalDate = selectedDate;

    if (isAfter(selectedDate, today)) {
      finalDate = today;
    } else if (startDate && isBefore(selectedDate, startDateObj)) {
      finalDate = startDateObj;
    }

    setEndDate(format(finalDate, "yyyy-MM-dd") + " 23:59:59");
  }}
  maxDate={today}
  minDate={startDateObj || undefined}
  format="dd-MM-yyyy" 
  slotProps={{
    textField: {
      size: "small",
      placeholder: "DD-MM-YYYY", // Update placeholder
      InputLabelProps: {
        sx: {
          fontWeight: 'bold',
          color: colors.primary[200], // White label color
          '&.Mui-focused': {
            color: colors.primary[200], // White label when focused
          },
          fontSize: {
            xl: '0.8125rem',
            lg: '0.7875rem',
            md: '0.7625rem',
            sm: '0.7375rem',
            xs: '0.7125rem',
          },
        },
      },
      sx: {
        width: {
          xl: '10rem',
          lg: '7.5rem',
          md: '10rem',
          sm: '9rem',
          xs: '8rem',
        },
        '& .MuiInputBase-root': {
          height: '30px', // Match TextField height
          backgroundColor: 'transparent', // Transparent background
          color: colors.primary[200], // White input text
            border: `1px solid #75767B`,
        },
        '& .MuiInputBase-input': {
          fontSize: {
            xl: '0.8125rem',
            lg: '0.7875rem',
            md: '0.7625rem',
            sm: '0.7375rem',
            xs: '0.7125rem',
          },
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
          fontSize: {
            xl: '0.8125rem',
            lg: '0.7875rem',
            md: '0.7625rem',
            sm: '0.7375rem',
            xs: '0.7125rem',
          },
          color: colors.primary[200], // White label
        },
        '& .MuiSvgIcon-root': {
          color: colors.primary[200], // White calendar icon
        },
        '& .Mui-disabled': {
          color: colors.primary[200], // White text for disabled state
          WebkitTextFillColor: colors.primary[200], // Ensure white text in disabled state
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B', // White border in disabled state
          },
        },
        '& .Mui-error': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B', // Keep white border in error state
          },
        },
      },
    },
  }}
/>

        </Box>
      </LocalizationProvider>

        {/* Search Button */}
        <Tooltip title="Search">
          <IconButton 
            onClick={handleFetchTickets} 
            disabled={!circle || !startDate || !endDate}
            size="small"
            sx={{ 
              height: 30,
              width: 30,
              backgroundColor: '#1976d2',
              color: colors.primary[200],
              '&:hover': { backgroundColor: '#1565c0' },
            }}
          >
            <SearchIcon fontSize="small" sx={{ color: colors.primary[200]}}/>
          </IconButton>
        </Tooltip>

        {/* Clear Button */}
        <Tooltip title="Clear">
        <Button
            color="error"
            onClick={clearOptions}
            disabled={!area && !startDate && !endDate}
            size="small"
            sx={{
              border: 'none', // Remove border
              minWidth: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '1.75rem', xl: '2rem' }, // Adjust size for image
              height: { xs: '1.625rem', sm: '1.75rem', md: '1.875rem', lg: '1.875rem', xl: '1.875rem' },
              padding: 0, // Remove padding to fit image tightly
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                backgroundColor: 'transparent', // Keep hover background transparent
              },
            }}
          >
            <Tooltip
              title="Clear"
              placement="bottom" // Tooltip appears below the image
              arrow // Adds an arrow to the tooltip
              sx={{
                '& .MuiTooltip-tooltip': {
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' }, // Responsive font size
                  backgroundColor: theme.palette.error.light, // Match error theme
                  color: theme.palette.error.contrastText, // Ensure readable text color
                  padding: { xs: '0.25rem 0.5rem', sm: '0.3rem 0.6rem', md: '0.4rem 0.8rem' }, // Responsive padding
                },
                '& .MuiTooltip-arrow': {
                  color: theme.palette.error.light, // Arrow matches tooltip background
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
            </Tooltip>
          </Button>
        </Tooltip>

        {/* Export Buttons */}
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Tooltip title="Export to PDF">
            <IconButton
              onClick={handleExportPdf}
              disabled={!area || !startDate || !endDate}
              size="small"
              sx={{
                height: 30,
                width: 30,
                backgroundColor: state && circle && area? 'primary.main' : 'grey.400', // Highlight when all fields are filled
                color: state && circle && area ? colors.primary[200] : 'black', // Adjust text color
                '&:hover': {
                  backgroundColor: state && circle && area ? 'primary.dark' : 'grey.400', // Hover effect only when enabled
                },
                '&.Mui-disabled': { backgroundColor: '#f44336', opacity: 0.5 },
              }}
            >
              <PictureAsPdfIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export to Excel">
            <IconButton
              onClick={handleExportExcel}
              disabled={ !startDate || !endDate}
              size="small"
              sx={{
                height: 30,
                width: 30,
                backgroundColor: '#4caf50',
                color: colors.primary[200],
                '&:hover': { backgroundColor: '#388e3c' },
                '&.Mui-disabled': { backgroundColor: '#4caf50', opacity: 0.5 },
              }}
            >
              <GridOnIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Table Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
       <TableContainer
          component={Paper}
          sx={{
            border: '1px solid #75767B', // White border for visibility
            borderRadius: '8px 8px 0 0',
            flex: 1,
            overflowY: 'auto',
            maxHeight: { xs: '100%', sm: '50vh', md: '50vh', lg: '60vh', xl: '68vh' },
            backgroundColor: colors.primary[100], // Transparent background
            '& .MuiPaper-root': {
              backgroundColor: colors.primary[100], // Override Paper's default white background
            },
          }}
        >
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {[
                  'Area',
                  'Serial Number',
                  'Alarm Name',
                  'Raise Time',
                  'Close Time',
                  'Status',
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                      color: 'black', // White text
                      padding: '3px',
                      minWidth: '150px',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      backgroundColor: 'transparent', // Ensure no white background
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Source Sans Pro',
                      padding: '3px',
                      textAlign: 'center',
                      border: colors.primary[300], // Lighter white border
                      color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                    }}
                  >
                   {ticket.area}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Source Sans Pro',
                      border: colors.primary[300], // Lighter white border
                         padding: '3px',
                      textAlign: 'center',
                      color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                    }}
                  >
                    {ticket.serialNumber}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Source Sans Pro',
                      border: colors.primary[300], // Lighter white border
                      padding: '3px',
                      textAlign: 'center',
                      color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                    }}
                  >
                    {ticket.message}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Source Sans Pro',
                      border: colors.primary[300], // Lighter white border
                         padding: '3px',
                      textAlign: 'center',
                      color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                    }}
                  >
                    {formatTimeStamp(ticket.raiseTime)}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Source Sans Pro',
                      border: colors.primary[300], // Lighter white border
                         padding: '3px',
                      textAlign: 'center',
                      color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                    }}
                  >
                    {ticket.closeTime ? formatTimeStamp(ticket.closeTime) : '-'}
                  </TableCell>
                  <TableCell
                    sx={{
                         padding: '3px',
                      textAlign: 'center',
                      border: colors.primary[300], // Lighter white border
                      '&.MuiTableCell-root': { padding: '6px 8px' },
                      backgroundColor: 'transparent', // Transparent background
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-block',
                        fontSize: 12,
                        fontFamily: 'Source Sans Pro',
                        fontWeight: 'bold',

                        color: ticket.status === 'Open' ? '#fc424a' : '#00d25b', // Red for Open, Green for Closed
                        border: `2px solid ${ticket.status === 'Open' ? '#fc424a' : '#00d25b'}`, // Red border for Open, Green for Closed
                        padding: '1px 5px',
                        borderRadius: '12px',
                        lineHeight: 1.5,
                        whiteSpace: 'nowrap',
                        backgroundColor: 'transparent', // No background
                      }}
                    >
                      {ticket.status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer Section */}
        <TablePagination
          rowsPerPageOptions={[50, 100, 200, 500]}
          count={totalRecords}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '& .MuiTablePagination-toolbar': {
              background: 'transparent', // Transparent background for the toolbar
              color: colors.primary[200],
              borderRadius: '0 0 8px 8px',
            //  padding: '8px',
            },
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 'bold',
              color: colors.primary[200],
            },
            '& .MuiTablePagination-actions': {
              color: colors.primary[200],
            },
            '& .MuiTablePagination-selectIcon': {
                color: 'white !important',
              },
            '& .MuiIconButton-root': {
              color: colors.primary[200],
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            },
            border: '1px solid black',
            borderTop: 'none',
          }}
        />
      </Box>
    </Box>
  );
};

export default TicketTable;