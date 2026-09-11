import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material";
import { ColorModeContext, tokens } from "../../../theme";
import {
  Box,
  IconButton,
  TextField,
  Autocomplete,
  Paper,
  CircularProgress,
  Tooltip
} from "@mui/material";
import { AppContext } from "../../../services/AppContext";
import { fetchMonthlyBatteryandChargerdetails,downloadMonthWiseBatteryandChargerdetails } from "../../../services/apiService";
import SearchIcon from "@mui/icons-material/Search";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MonthlyAHChart from "./MonthlyAHChart";
import MonthlyEnergyChart from "./MonthlyEnergyChart";
import "react-datetime/css/react-datetime.css";
import clear from '../../../assets/assets/images/png/brush.png'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';

import { Button } from '@mui/material';
const columnMappings = {
  substationId: "Substation ID",
  serialNumber: "Serial Number",
  month: "Month",
  chargeOrDischargeCycle: "Charge/Discharge Cycle",
  cumulativeAHIn: "Cumulative AH In (Ah)",
  cumulativeAHOut: "Cumulative AH Out (Ah)",
  totalChargingEnergy: "Total Charging Energy (kWh)",
  totalDischargingEnergy: "Total Discharging Energy (kWh)",
  batteryRunHours: "Battery Run Hours",
  sumTotalSoc: "Avg SOC (%)",
  sumCumulativeTotalAvgTemp: "Avg Temperature(°C)",
};

const Monthly = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const data = Array.isArray(contextData) ? contextData : [];
  const [loading, setLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const[data,setData] = useState([])

  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    area,
    year,
    month,
    setSiteId,
    setSerialNumber,
    setYear,
    setMonth,errors ,setState,setCircle,setArea,setAreaOptions,areaOptions,
    state,circle,stateOptions,circleOptions,handleCircleChange,handleStateChange,handleAreaChange,setCircleOptions,
    setSiteOptions,divisionOptions,division,handleDivisionChange,
    setSerialNumberOptions, zone,zoneOptions,handleZoneChange,setZone
  } = useContext(AppContext);

  useEffect(() => {
    if (location.pathname === "/monthly") {
      // setSiteId("");
      // setSerialNumber("");
      setYear("");
      setMonth("");
      setMonthDate(null);
      // setCircleOptions([]);
      setSiteOptions([]);
      setSerialNumberOptions([]);
      setData([]);
      // setState("");
      // setCircle("");
    }
  }, [location.pathname]);
  const [monthDate, setMonthDate] = useState(null); 
  const handleSearch = async () => {
    if (area && year && month) {
      setLoading(true);
      try {
        const result = await fetchMonthlyBatteryandChargerdetails(
          area,
          year,
          month
        );
        //setData(Array.isArray(result) ? result : []);
        setData(result.monthWiseDataDTOList)
        setSiteId(result.siteId)
        setSerialNumber(result.serialNumber)
      } catch (error) {
        console.error("Error during search:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    } else {
      console.error("Please select all fields.");
      setData([]);
    }
  };

  const clearOptions = () => {
    setSiteId("");
    setSerialNumber("");
    setYear("");
    setMonth("");
     setCircleOptions([]);
      setSiteOptions([]);
      setSerialNumberOptions([]);
    setMonthDate(null);
    setData([]);
    setState("");
    setCircle("");
    setArea("");
    setAreaOptions([]);
  };

  const formatData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    const formatToTime = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const formatToTwoDecimals = (value) =>
      value !== null && value !== undefined
        ? parseFloat(value).toFixed(2)
        : "-";

    return data.map((row) => {
      const {
        substationId,
        serialNumber,
        month,
        batteryRunHours,
        chargeOrDischargeCycle,
        cumulativeAHIn,
        cumulativeAHOut,
        totalChargingEnergy,
        totalDischargingEnergy,
        sumTotalSoc,
        sumCumulativeTotalAvgTemp,
      } = row;

      return {
        substationId,
        serialNumber,
        month,
        batteryRunHours: formatToTime(batteryRunHours || 0),
        chargeOrDischargeCycle,
        cumulativeAHIn: formatToTwoDecimals(cumulativeAHIn),
        cumulativeAHOut: formatToTwoDecimals(cumulativeAHOut),
        totalChargingEnergy: formatToTwoDecimals(totalChargingEnergy),
        totalDischargingEnergy: formatToTwoDecimals(totalDischargingEnergy),
        sumTotalSoc: formatToTwoDecimals(sumTotalSoc),
        sumCumulativeTotalAvgTemp: formatToTwoDecimals(sumCumulativeTotalAvgTemp),
      };
    });
  };

  const formattedData = formatData(data);

  const handleDownloadExcel = async () => {
        if (!area || !year || !month) {
          return;
        }
    
        try {
          setIsDownloading(true);
          setDownloadComplete(false);
    
          await downloadMonthWiseBatteryandChargerdetails(
           area,
            year,
            month
          );
    
          setIsDownloading(false);
          setDownloadComplete(true);
    
          setTimeout(() => {
            setDownloadComplete(false);
          }, 2000);
        } catch (error) {
          console.error("Download failed:", error);
          setIsDownloading(false);
        }
  };
  const renderHighlightedOption = (props, option, value) => (
    <li
      {...props}
      style={{
        backgroundColor: value === option ? "#d82b27" : "inherit",
        color: value === option ? colors.primary[200] : "inherit",
      }}
    >
      {option}
    </li>
  );

  const infoBoxMinWidth = { xs: '5rem', sm: '5.6rem', md: '6.2rem', lg: '6rem', xl: '7rem' };
  const infoBoxHeight = { xs: '1.625rem', sm: '1.75rem', md: '1.875rem', lg: '1.875rem', xl: '1.875rem' };

  {/* Common Info Box Styles */}
  const infoBoxStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    border: `1px solid ${colors.grey[500]}`,
    borderRadius: '0.25rem',
    height: infoBoxHeight,
    overflow: 'hidden'
  };

  const infoTextStyles = {
    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.75rem', xl: '0.8rem' },
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    fontWeight: "bold",
    color: colors.primary[200]
  };

  return (
    <Box display="grid" gridTemplateColumns="repeat(2, 1fr)"  >
      {/* Search Inputs */}
      <Box
      display="flex"
      alignItems="center"
      gap={{ xs: 0.5, sm: 1, md: 1.5, lg: 0.5, xl: 0.5 }}
      sx={{
        flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap', lg: 'nowrap', xl: 'nowrap' },
        width: '100%',
        justifyContent: 'space-between',
        padding: { xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '0.1rem', xl: '0.1rem' }
      }}
    >
      {/* State Autocomplete */}
      <Autocomplete
        options={stateOptions.map((state) => state.name)}
        value={state}
        onChange={(event, newValue) => handleStateChange(newValue)}
        size="small"
        sx={{
          width: { xs: '100%', sm: '8rem', md: '9rem', lg: '7.8rem', xl: '10.5rem' },
          minWidth: { xs: '7rem', sm: '7.5rem', md: '8rem' },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B',
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="State"
            variant="outlined"
            size="small"
            InputLabelProps={{ sx: { fontWeight: 'bold' } }}
            sx={{
              '& .MuiInputBase-root': {
                fontWeight: 'bold',
                height: '1.875rem',
                marginTop: '0.3125rem',
                color: colors.primary[200],
              },
              '& .MuiInputBase-input::placeholder': {
                color: colors.primary[200],
                opacity: 1,
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
      renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
      sx={{
        width: { xs: '100%', sm: '7.5rem', md: '8.5rem', lg: '7.8rem', xl: '10.5rem' },
        minWidth: { xs: '7rem', sm: '7rem', md: '7.5rem' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="zone"
          variant="outlined"
          size="small"
          InputLabelProps={{ sx: { fontWeight: 'bold' } }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 'bold',
              height: '1.875rem',
              marginTop: '0.3125rem',
              color: colors.primary[200],
            },
            '& .MuiInputBase-input::placeholder': {
              color:colors.primary[200],
              opacity: 1,
            },
          }}
        />
      )}
    />

      {/* Circle Autocomplete */}
      <Autocomplete
      options={circleOptions}
      value={circle}
      onChange={(event, newValue) => handleCircleChange(newValue)}
      size="small"
      renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
      sx={{
        width: { xs: '100%', sm: '7.5rem', md: '8.5rem', lg: '7.8rem', xl: '10.5rem' },
        minWidth: { xs: '7rem', sm: '7rem', md: '7.5rem' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Circle"
          variant="outlined"
          size="small"
          InputLabelProps={{ sx: { fontWeight: 'bold' } }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 'bold',
              height: '1.875rem',
              marginTop: '0.3125rem',
              color: colors.primary[200],
            },
            '& .MuiInputBase-input::placeholder': {
              color:colors.primary[200],
              opacity: 1,
            },
          }}
        />
      )}
    />

    <Autocomplete
      options={divisionOptions}
      value={division}
      onChange={(event, newValue) => handleDivisionChange(newValue)}
      size="small"
      renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
      sx={{
        width: { xs: '100%', sm: '7.5rem', md: '8.5rem', lg: '7.8rem', xl: '10.5rem' },
        minWidth: { xs: '7rem', sm: '7rem', md: '7.5rem' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Sub Division"
          variant="outlined"
          size="small"
          InputLabelProps={{ sx: { fontWeight: 'bold' } }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 'bold',
              height: '1.875rem',
              marginTop: '0.3125rem',
              color: colors.primary[200],
            },
            '& .MuiInputBase-input::placeholder': {
              color:colors.primary[200],
              opacity: 1,
            },
          }}
        />
      )}
    />

 {/* Area Autocomplete */}
      <Autocomplete
      options={areaOptions}
      value={area}
      onChange={(event, newValue) => handleAreaChange(newValue)}
      size="small"
      renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
      sx={{
        width: { xs: '100%', sm: '7.5rem', md: '8.5rem', lg: '7.8rem', xl: '10.5rem' },
        minWidth: { xs: '7rem', sm: '7rem', md: '7.5rem' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Area"
          variant="outlined"
          size="small"
          InputLabelProps={{ sx: { fontWeight: 'bold' } }}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 'bold',
              height: '1.875rem',
              marginTop: '0.3125rem',
              color: colors.primary[200],
            },
            '& .MuiInputBase-input::placeholder': {
              color:colors.primary[200],
              opacity: 1,
            },
          }}
        />
      )}
    />


      {/* Site ID Autocomplete */}
      {/* <Autocomplete
        freeSolo
        options={siteOptions.map((site) => site.siteId)}
        value={siteId}
        onChange={(event, newValue) => setSiteId(newValue)}
        sx={{
          width: { xs: '100%', sm: '7.5rem', md: '8.5rem', lg: '12rem', xl: '10.5rem' },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#75767B',
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Substation ID"
            InputLabelProps={{ sx: { fontWeight: 'bold' } }}
            error={errors.siteId}
            helperText={errors.siteId ? 'Please enter Substation ID' : ''}
            sx={{
              '& .MuiInputBase-root': {
                fontWeight: 'bold',
                height: '1.875rem',
                marginTop: '0.3125rem',
                color: colors.primary[200],
              },
              '& .MuiInputBase-input::placeholder': {
                color: colors.primary[200],
                opacity: 1,
              },
            }}
          />
        )}
      /> */}


      {/* Serial Number Autocomplete */}
      {/* <Autocomplete
      options={serialNumberOptions}
      value={serialNumber}
      onChange={(event, newValue) => setSerialNumber(newValue)}
      sx={{
        width: { xs: '100%', sm: '7.5rem', md: '8.5rem', lg: '12rem', xl: '10.5rem' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#75767B',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Serial Number"
          InputLabelProps={{ sx: { fontWeight: 'bold' } }}
          error={errors.serialNumber}
          helperText={errors.serialNumber ? 'Please enter Serial Number' : ''}
          sx={{
            '& .MuiInputBase-root': {
              fontWeight: 'bold',
              height: '1.875rem',
              marginTop: '0.3125rem',
              color: colors.primary[200],
            },
            '& .MuiInputBase-input::placeholder': {
              color: colors.primary[200],
              opacity: 1,
            },
          }}
        />
      )}
    /> */}


      {/* Month Picker */}
   <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
      views={['year', 'month']}
      label="Month"
      maxDate={new Date()}
      value={monthDate}
      onChange={(newValue) => {
        if (!newValue) return;
        const selectedMonth = String(newValue.getMonth() + 1).padStart(2, '0');
        const selectedYear = newValue.getFullYear();
        setMonth(selectedMonth);
        setYear(selectedYear);
        setMonthDate(newValue);
      }}
      slotProps={{
        // Customize the calendar icon
        openPickerButton: {
          sx: {
            color: colors.primary[200], // Set calendar icon color to white
          },
        },
        textField: {
          size: 'small',
          placeholder: 'YYYY-MM',
          sx: {
            width: {
              xl: '10.5rem',
              lg: '7.8rem',
              md: '10rem',
              sm: '9rem',
              xs: '8rem',
            },
            '& .MuiInputBase-root': {
              height: '2rem',
              fontWeight: 'bold',
              color: colors.primary[200],
             border: colors.primary[300],
              borderRadius: '4px', // Optional: Improve input field appearance
            },
            '& .MuiInputLabel-root': {
              fontSize: {
                xl: '0.8125rem',
                lg: '0.7875rem',
                md: '0.7625rem',
                sm: '0.7375rem',
                xs: '0.7125rem',
              },
              color: colors.primary[200],
              fontWeight: 'bold',
              // Adjust label position when not focused (shrunk state)
              '&.Mui-focused, &.MuiFormLabel-filled': {
                transform: 'translate(14px, -6px) scale(0.75)', // Slightly adjust Y position
              },
              // Ensure label doesn't overlap when not shrunk
              transform: 'translate(14px, 6px) scale(1)', // Adjust initial position
            },
            '& .MuiInputBase-input': {
              fontSize: {
                xl: '0.8125rem',
                lg: '0.7875rem',
                md: '0.7625rem',
                sm: '0.7375rem',
                xs: '0.7125rem',
              },
              '&::placeholder': {
                color: colors.primary[200],
                opacity: 1,
              },
            },
          },
          // Pass error and helperText to TextField
          error: errors.monthDate,
          helperText: errors.monthDate ? 'Please select a Month' : '',
        },
      }}
    />
  </LocalizationProvider>

      {/* Search Button */}
      <IconButton
        onClick={handleSearch}
        disabled={!area || !year || !month || loading}
        sx={{
          height: '2.1875rem',
          width: '2.1875rem',
          mt: '0.2125rem',
          backgroundColor: state && circle && siteId && serialNumber ? 'primary.main' : 'grey.400', // Highlight when all fields are filled
          color: state && circle && siteId && serialNumber ? 'white' : 'black', // Adjust text color
          '&:hover': {
            backgroundColor: state && circle && siteId && serialNumber ? 'primary.dark' : 'grey.400', // Hover effect only when enabled
          },
        }}
      >
        <SearchIcon  sx={{color:colors.primary[200]}}/>
      </IconButton>

      {/* Clear Button */}
      <Button
        
        color="error"
        onClick={clearOptions}
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
         {/* Site ID */}
            <Box sx={{ ...infoBoxStyles, width: infoBoxMinWidth, visibility: siteId ? 'visible' : 'hidden' }}>
              <Typography sx={infoTextStyles}>
                {siteId}
              </Typography>
            </Box>
        
           {/* Serial Number */}
            <Box sx={{ ...infoBoxStyles, width: infoBoxMinWidth, visibility: serialNumber ? 'visible' : 'hidden' }}>
              <Typography sx={infoTextStyles}>
                {serialNumber}
              </Typography>
            </Box>
    </Box>
    {/* Excel Download Button */}
      <Box
        sx={{
          marginLeft: {xl:'1rem', xs: '0.5rem', sm: '1rem', md: 'auto', lg:'0.5rem' },
          display: 'flex',
          alignItems: 'center',
          mt: '0.3125rem'
        }}
      >
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative' , marginRight: '1rem'}}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={ !area|| !year || !month}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                '&:hover': { backgroundColor: '#388e3c' },
                '&.Mui-disabled': { backgroundColor: '#4caf50', opacity: 0.5 },
                height: '2.1875rem',
                width: '2.1875rem'
              }}
            >
              {downloadComplete ? <CheckCircleIcon /> : <GridOnIcon />}
            </IconButton>
            {isDownloading && (
              <CircularProgress
                size={40}
                sx={{
                  color: '#4caf50',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-1.25rem',
                  marginLeft: '-1.25rem'
                }}
              />
            )}
          </Box>
        </Tooltip>
      </Box>
      {/* Loading Indicator or Content */}
      {loading ? (
        <Box gridColumn="span 2" display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Charts */}
          <Box gridColumn="span 2" display="flex" flexDirection="row" gap={2}>
            <Box flex={1} >
              <Paper elevation={8} sx={{bgcolor:colors.primary[100]}}>
                <MonthlyAHChart data={data} />
              </Paper>
            </Box>
            <Box flex={1}>
              <Paper elevation={8} sx={{bgcolor:colors.primary[100]}}>
                <MonthlyEnergyChart data={data} />
              </Paper>
            </Box>
          </Box>

          {/* Table */}
          {formattedData.length > 0 ? (
            <Box padding="0px 10px" gridColumn="span 2"  >
              <TableContainer
                component={Paper}
                sx={{
                  marginTop: 1,
                  overflowX: "auto",
                  borderRadius: "8px",
                  width: "100%",
                  border: colors.primary[300],
                  bgcolor:colors.primary[100]
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {Object.keys(formattedData[0]).map((key) => (
                        <TableCell
                          key={key}
                          sx={{
                            fontWeight: "bold",
                            background: "linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))",
                            color: colors.primary[200],
                            padding: "3px",
                            minWidth: "150px",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                          }}
                        >
                          {columnMappings[key] || key}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formattedData.map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((value, idx) => (
                          <TableCell
                            key={idx}
                            sx={{
                              border: colors.primary[300],
                              padding: "5px",
                              fontWeight: "bold",
                              textAlign: "center",
                               color: colors.primary[200],
                            }}
                          >
                            {value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : (
            <Typography variant="body1" sx={{ marginTop: 2, gridColumn: "span 2",color: colors.primary[200] , textAlign: "center" }}>
            No Data Available
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default Monthly;