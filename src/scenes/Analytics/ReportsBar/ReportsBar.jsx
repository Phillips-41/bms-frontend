  import React, { useContext, useEffect, useState ,useRef} from "react";
import { AppContext } from "../../../services/AppContext";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Autocomplete,
  useTheme,
  Tooltip,
  Grid
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import clear from '../../../assets/assets/images/png/brush.png';
import { format, addDays, isAfter, isBefore, startOfDay,parse } from "date-fns";
import { tokens } from "../../../theme";
import { pad } from "lodash";
import {
  getContainerStyles,
  autocompleteSizes,
  getTextFieldStyles,
  autocompleteBorderStyles,
  inputStyles,
} from "./ReportsBar.styles";
import { hi } from "date-fns/locale";
  const renderHighlightedOption = (props, option, { selected }) => (
    <li
      {...props}
      style={{
        backgroundColor: selected ? "#d82b27" : "inherit",
        color: selected ? "#ffffff" : "inherit",
      }}
    >
      {option}
    </li>
  );
const ReportsBar = ({ isHistorical = false, pageType }) => {
  const theme = useTheme();
      const colors = tokens(theme.palette.mode);
  const [errors, setErrors] = useState({ startDate: "", endDate: "" });
  const {
    siteOptions,
    serialNumberOptions,
    siteId,
    serialNumber,
    startDate,
    endDate,
    setSiteId,
    setSerialNumber,
    setStartDate,
    setEndDate,
    handleAnalytics,
    setRowsPerPage,
    setPageType,
    setState,
    setCircle,
    setArea,
    state,
    circle,
    area,
    stateOptions,
    circleOptions,
    areaOptions,
    handleCircleChange,
    handleAreaChange,
    handleStateChange,
    setDayWiseData,
    setSerialNumberOptions,
    setAlarmsData,
    setrealTimeData,
    historicalType,
    setHistoricalType,
    setCircleOptions,
    setAreaOptions,setPage,
    setSiteOptions, zone,zoneOptions,handleZoneChange,setZone,setZoneOptions,
    data,divisionOptions,division,handleDivisionChange,
    setDivisionOptions,setDivision
  } = useContext(AppContext);
const isResetting = useRef(false);
  // Reset search fields when pageType changes
  useEffect(() => {
    isResetting.current = true;
    setPageType(pageType);
    setSiteId("");
    setSerialNumber("");
    setStartDate("");
    setEndDate("");
    setDayWiseData([]);
    setAlarmsData([]);
    setrealTimeData([]);
    // setState("");
    // setCircle("");
    // setCircleOptions([]);
    setSiteOptions([]);
    setSerialNumberOptions([]);
    setHistoricalType("");
    // setZone('');
    // setDivision("");
    // setZoneOptions([]);
    // setDivisionOptions([]);
    // setAreaOptions([]);
    // setArea("");
    setRowsPerPage(20);
    setPage(0);
    setErrors({ startDate: "", endDate: "" });
     setState("Maharastra");
     handleStateChange("Maharastra");
    setTimeout(() => {
    isResetting.current = false;

  
  }, 0);
  }, [pageType]);


  useEffect(() => {
    // if (isResetting.current) return;
    search();
  },[circle,division,startDate,endDate,historicalType,area])

  const clearOptions = () => {
    setSiteId("");
    setSerialNumber("");
    setStartDate("");
    setEndDate("");
    setDayWiseData([]);
    setAlarmsData([]);
    setrealTimeData([]);
    setState("");
    setCircle("");
    setSiteOptions([]);
    setZoneOptions([]);
    setDivisionOptions([]);
    setAreaOptions([]);
    setCircleOptions([]);
    setSerialNumberOptions([]);
    setHistoricalType("");
    setErrors({ startDate: "", endDate: "" });
    setZone('');
    setArea("");
    setDivision("");
  };

  // const handleSerialNumberChange = (event, newValue) => {
  //   setSerialNumber(newValue);
  // };
  const search=()=>{
    if(area && startDate && endDate){
      handleAnalytics({ type: "" });
    }else if(division && isHistorical){
      handleAnalytics({ type: "Sub Division Wise" });
    }else if(isHistorical){
        handleAnalytics({ type: "Circle Wise" });
    }else{
      handleAnalytics({ type: "" });
    }
   
  }
  const today = startOfDay(new Date());
  const startDateObj = startDate ? new Date(startDate.split("%")[0]) : null;

  // Check if all required fields are filled
  const isSearchDisabled = !state || !circle || !area || !startDate || !endDate || (isHistorical && !historicalType);
{/* Common Styles - Extracted for reusability */}
  // const autocompleteSizes = {
  //   minWidth: {
  //     xl: "8.5rem",
  //     lg: "7rem",
  //     md: "7.5rem",
  //     sm: "7rem",
  //     xs: "6.5rem",
  //   },
  //   maxWidth: {
  //     xl: "16rem",
  //     lg: "14rem",
  //     md: "12rem",
  //     sm: "11rem",
  //     xs: "10rem",
  //   }
  // };

  // const textFieldStyles = {
  //   "& .MuiInputBase-root": { 
  //     height: "1.75rem",
  //     color: colors.primary[200],
  //     border: `1px solid #75767B`,
  //   },
  //   "& .MuiInputBase-input": {
  //     fontSize: {
  //       xl: "0.8125rem",
  //       lg: "0.7875rem",
  //       md: "0.7625rem",
  //       sm: "0.7375rem",
  //       xs: "0.7125rem",
  //     },
  //     overflow: "hidden",
  //     textOverflow: "ellipsis",
  //     '&::placeholder': {
  //       color: colors.primary[200],
  //       opacity: 1,
  //     },
  //   },
  //   "& .MuiInputLabel-root": {
  //     fontSize: {
  //       xl: "0.8125rem",
  //       lg: "0.7875rem",
  //       md: "0.7625rem",
  //       sm: "0.7375rem",
  //       xs: "0.7125rem",
  //     },
  //   },
  // };

  // const autocompleteBorderStyles = {
  //   '& .MuiOutlinedInput-notchedOutline': {
  //     borderColor: '#75767B',
  //   },
  //   '&:hover .MuiOutlinedInput-notchedOutline': {
  //     borderColor: '#75767B',
  //   },
  //   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
  //     borderColor: '#75767B',
  //   },
  // };

  // const inputStyles = {
  //   fontSize: {
  //     xl: "0.8125rem",
  //     lg: "0.7875rem", 
  //     md: "0.7625rem",
  //     sm: "0.7375rem",
  //     xs: "0.7125rem",
  //   },
  //   padding: "0.125rem 0.25rem !important",
  // };

  const datePickerStyles = {
    width: {
      xl: '10rem',
      lg: '8rem',
      md: '10rem',
      sm: '9rem',
      xs: '8rem',
    },
    '& .MuiInputBase-root': {
      height: "1.75rem",
      backgroundColor: 'transparent !important',
      color: colors.primary[200],
    },
    '& .MuiInputBase-input': {
      fontSize: {
        xl: '0.8125rem',
        lg: '0.7875rem',
        md: '0.7625rem',
        sm: '0.7375rem',
        xs: '0.7125rem',
      },
      color: `${colors.primary[200]} !important`,
      WebkitTextFillColor: colors.primary[200],
      '&::placeholder': {
        color: colors.primary[200],
        opacity: 1,
      },
      '&::-webkit-date-and-time-value': {
        color: colors.primary[200],
      },
      '&::-webkit-calendar-picker-indicator': {
        filter: 'invert(1)',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#75767B !important',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#75767B !important',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#75767B !important',
    },
    '& .MuiFormLabel-root': {
      fontSize: {
        xl: '0.8125rem',
        lg: '0.7875rem',
        md: '0.7625rem',
        sm: '0.7375rem',
        xs: '0.7125rem',
      },
      color: colors.primary[200],
      fontWeight: 'bold',
    },
    '& .MuiFormHelperText-root': {
      color: colors.primary[200],
    },
    '& .MuiSvgIcon-root': {
      color: colors.primary[200],
    },
  };

  const datePickerLabelProps = {
    sx: {
      fontWeight: 'bold',
      color: colors.primary[200],
      '&.Mui-focused': {
        color: colors.primary[200],
      },
      '&.Mui-error': {
        color: colors.primary[200],
      },
      fontSize: {
        xl: '0.8125rem',
        lg: '0.7875rem',
        md: '0.7625rem',
        sm: '0.7375rem',
        xs: '0.7125rem',
      },
    },
  };


    const textFieldStyles = getTextFieldStyles(colors);

  // return (
  //     <Box
  //         display="flex"
  //         gap={{ xl: "1rem", lg: "0.2rem", md: "0.75rem", sm: "0.625rem", xs: "0.5rem" }}
  //         p={{ xl: "0.75rem", lg: "0.625rem", md: "0.5rem", sm: "0.375rem", xs: "0.25rem" }}
  //         alignItems="center"
  //         sx={{
  //           width: "100%",
  //           flexWrap: "wrap",
  //           overflow: "hidden",
  //           "& > *": {
  //             flexShrink: 1,
  //             minWidth: 0,
  //           },
  //           [theme.breakpoints.down("sm")]: {
  //             flexWrap: "wrap",
  //             "& > *": {
  //               flexBasis: "calc(50% - 0.5rem)",
  //               minWidth: "unset",
  //               marginBottom: "0.5rem",
  //             },
  //             "& > :last-child, & > :nth-last-child(2)": {
  //               flexBasis: "100%",
  //               marginBottom: 0,
  //             },
  //           },
  //           [theme.breakpoints.down(400)]: {
  //             "& > *": {
  //               flexBasis: "100%",
  //             },
  //           },
  //         }}
  //       >

  //     {/* State */}
  //     <Autocomplete
  //       options={stateOptions.map((state) => state.name)}
  //       value={state}
  //       onChange={(event, newValue) => handleStateChange(newValue)}
  //       size="small"
  //       sx={{
  //         ...autocompleteSizes,
  //         ...autocompleteBorderStyles,
  //         "& .MuiAutocomplete-input": inputStyles,
  //       }}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           placeholder="State"
  //           size="small"
  //           fullWidth
  //           sx={textFieldStyles}
  //         />
  //       )}
  //       renderOption={renderHighlightedOption}
  //     />

  //     {/* Zone */}
  //     <Autocomplete
  //       options={zoneOptions}
  //       value={zone}
  //       onChange={(event, newValue) => handleZoneChange(newValue)}
  //       size="small"
  //       sx={{
  //         ...autocompleteSizes,
  //         ...autocompleteBorderStyles,
  //         "& .MuiAutocomplete-input": inputStyles,
  //       }}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           placeholder="Zone"
  //           size="small"
  //           sx={textFieldStyles}
  //         />
  //       )}
  //       renderOption={renderHighlightedOption}
  //     />

  //     {/* Circle */}
  //     <Autocomplete
  //       options={circleOptions}
  //       value={circle}
  //       onChange={(event, newValue) => handleCircleChange(newValue)}
  //       size="small"
  //       sx={{
  //         ...autocompleteSizes,
  //         ...autocompleteBorderStyles,
  //         "& .MuiAutocomplete-input": inputStyles,
  //       }}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           placeholder="Circle"
  //           size="small"
  //           sx={textFieldStyles}
  //         />
  //       )}
  //       renderOption={renderHighlightedOption}
  //     />

  //       {/*Sub Division */}
  //     <Autocomplete
  //       options={divisionOptions}
  //       value={division}
  //       onChange={(event, newValue) => handleDivisionChange(newValue)}
  //       size="small"
  //       sx={{
  //         ...autocompleteSizes,
  //         ...autocompleteBorderStyles,
  //         "& .MuiAutocomplete-input": inputStyles,
  //       }}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           placeholder="SubDivision"
  //           size="small"
  //           sx={textFieldStyles}
  //         />
  //       )}
  //       renderOption={renderHighlightedOption}
  //     />

  //     {/* Area */}
  //     <Autocomplete
  //       options={areaOptions}
  //       value={area}
  //       onChange={(event, newValue) => handleAreaChange(newValue)}
  //       size="small"
  //       sx={{
  //         ...autocompleteSizes,
  //         ...autocompleteBorderStyles,
  //         "& .MuiAutocomplete-input": inputStyles,
  //       }}
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           placeholder="Area"
  //           size="small"
  //           sx={textFieldStyles}
  //         />
  //       )}
  //       renderOption={renderHighlightedOption}
  //     />

  //     {/* Historical Type */}
  //     {isHistorical && (
  //       <Autocomplete
  //         disablePortal
  //         disableClearable
  //         options={["String Details","Circle Wise", "Cell Details", "Cell Alarms" ]}
  //         value={historicalType}
  //         onChange={(event, newValue) => setHistoricalType(newValue)}
  //         size="small"
  //         sx={{
  //           minWidth: {
  //             xl: "8rem",
  //             lg: "6.5rem",
  //             md: "6rem",
  //             sm: "5.5rem",
  //             xs: "5rem",
  //           },
  //           maxWidth: {
  //             xl: "12rem",
  //             lg: "10rem",
  //             md: "9rem",
  //             sm: "8rem",
  //             xs: "7rem",
  //           },
  //           ...autocompleteBorderStyles,
  //           "& .MuiAutocomplete-input": inputStyles,
  //         }}
  //         renderInput={(params) => (
  //           <TextField
  //             {...params}
  //             placeholder="Type"
  //             size="small"
  //             sx={textFieldStyles}
  //           />
  //         )}
  //         renderOption={renderHighlightedOption}
  //       />
  //     )}

  //     {/* Dates Section */}
  //     <LocalizationProvider dateAdapter={AdapterDateFns}>
  //       <Box
  //         display="flex"
  //         gap={{ xl: "0.75rem", lg: "0.625rem", md: "0.5rem", sm: "0.375rem", xs: "0.25rem" }}
  //         sx={{
  //           [theme.breakpoints.down("sm")]: {
  //             width: "100%",
  //             justifyContent: "space-between",
  //           },
  //         }}
  //       >
        

  //       <DatePicker
  //         label="From"
  //         value={startDate ? parse(startDate.split(" ")[0], "yyyy-MM-dd", new Date()) : null}
  //         onChange={(newDate) => {
  //           if (!newDate || isNaN(newDate)) {
  //             setStartDate("");
  //             setErrors({ ...errors, startDate: "Invalid date" });
  //             return;
  //           }

  //           const selectedDate = startOfDay(newDate);
  //           if (isAfter(selectedDate, today)) {
  //             setStartDate(format(today, "yyyy-MM-dd") + " 00:00:00");
  //             setErrors({ ...errors, startDate: "Cannot select future dates" });
  //             return;
  //           }

  //           const formattedDate = format(selectedDate, "yyyy-MM-dd") + " 00:00:00";
  //           setStartDate(formattedDate);
  //           setErrors({ ...errors, startDate: "" });

  //           if (endDate) {
  //             const endDateObj = parse(endDate.split(" ")[0], "yyyy-MM-dd", new Date());
  //             if (isAfter(selectedDate, endDateObj)) {
  //               setEndDate(formattedDate.replace(" 00:00:00", " 23:59:59"));
  //             } else if (pageType === "daywise") {
  //               const maxEndDate = addDays(selectedDate, 30);
  //               if (isAfter(endDateObj, maxEndDate)) {
  //                 setEndDate(format(maxEndDate, "yyyy-MM-dd") + " 23:59:59");
  //               }
  //             }
  //           }
  //         }}
  //         maxDate={today}
  //         PopperProps={{
  //           sx: {
  //             '& .MuiPaper-root': {
  //               backgroundColor: 'black',
  //               color: colors.primary[200],
  //               border: '1px solid white',
  //             },
  //             '& .MuiPickersDay-root': {
  //               color: colors.primary[200],
  //               '&.Mui-selected': {
  //                 backgroundColor: colors.primary[200],
  //                 color: 'black',
  //               },
  //             },
  //             '& .MuiPickersCalendarHeader-root': {
  //               color: colors.primary[200],
  //             },
  //           },
  //         }}
  //         slotProps={{
  //           textField: {
  //             size: "small",
  //             error: !!errors.startDate,
  //             helperText: errors.startDate,
  //             placeholder: "DD-MM-YYYY", // Update placeholder
  //             InputLabelProps: datePickerLabelProps,
  //             sx: datePickerStyles,
  //           },
  //         }}
  //         format="dd-MM-yyyy" // Add this prop to set display format
  //       />

  //         <DatePicker
  //           label="To"
  //           value={endDate ?parse(endDate.split(" ")[0], "yyyy-MM-dd", new Date()) : null}
  //           onChange={(newDate) => {
  //             if (!newDate || isNaN(newDate)) {
  //               setEndDate(startDate || format(today, "yyyy-MM-dd") + " 23:59:59");
  //               return;
  //             }

  //             const selectedDate = startOfDay(newDate);
  //             let finalDate = selectedDate;

  //             if (isAfter(selectedDate, today)) {
  //               finalDate = today;
  //             } else if (startDate && isBefore(selectedDate, startDateObj)) {
  //               finalDate = startDateObj;
  //             } else if (pageType === "daywise" && startDateObj) {
  //               const maxAllowedDate = addDays(startDateObj, 30);
  //               if (isAfter(selectedDate, maxAllowedDate)) {
  //                 finalDate = maxAllowedDate;
  //               }
  //             }

  //             setEndDate(format(finalDate, "yyyy-MM-dd") + " 23:59:59");
  //           }}
  //           maxDate={pageType === "daywise" && startDateObj ? addDays(startDateObj, 30) : today}
  //           minDate={startDateObj || undefined}
  //           slotProps={{
  //             textField: {
  //               size: "small",
  //               placeholder: "DD-MM-YYYY",
  //               InputLabelProps: datePickerLabelProps,
  //               sx: datePickerStyles,
  //             },
  //           }}
  //             format="dd-MM-yyyy"
  //         />
  //       </Box>
  //     </LocalizationProvider>

  //     {/* Buttons Section */}
  //     <Box
  //       display="flex"
  //       gap={{ xl: "0.75rem", lg: "0.625rem", md: "0.5rem", sm: "0.375rem", xs: "0.25rem" }}
  //       sx={{
  //         [theme.breakpoints.down("sm")]: {
  //           width: "100%",
  //           justifyContent: "flex-end",
  //           marginTop: "0.5rem",
  //         },
  //       }}
  //     >
  //       <Tooltip title={isSearchDisabled ? "Please fill all fields" : "Search"}>
  //         <span>
  //           <IconButton
  //             onClick={() => {
  //               // if (!startDate || !endDate) {
  //               //   setErrors({
  //               //     startDate: !startDate ? "Start date is required" : "",
  //               //     endDate: !endDate ? "End date is required" : "",
  //               //   });
  //               //   return;
  //               // }
  //               search();
                
  //             }}
  //             size="small"
  //           // disabled={isSearchDisabled}
  //             sx={{
  //               height: "1.75rem",
  //               width: "1.75rem",
  //               backgroundColor: state && circle && siteId && serialNumber ? 'primary.main' : 'grey.400',
  //               color: state && circle && siteId && serialNumber ? 'white' : 'black',
  //               '&:hover': {
  //                 backgroundColor: state && circle && siteId && serialNumber ? 'primary.dark' : 'grey.400',
  //               },
  //             }}
  //           >
  //             <SearchIcon fontSize="small" sx={{color: colors.primary[200]}} />
  //           </IconButton>
  //         </span>
  //       </Tooltip>

  //       <Button
  //         variant="outlined"
  //         color="error"
  //         onClick={clearOptions}
  //         size="small"
  //         sx={{
  //           border: 'none',
  //           minWidth: '2rem',
  //           height: "1.75rem",
  //           padding: 0,
  //           display: 'flex',
  //           alignItems: 'center',
  //           justifyContent: 'center',
  //           '&:hover': {
  //             backgroundColor: 'transparent',
  //           },
  //         }}
  //       >
  //         <Tooltip
  //           title="Clear"
  //           placement="bottom"
  //           arrow
  //           sx={{
  //             '& .MuiTooltip-tooltip': {
  //               fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' },
  //               backgroundColor: theme.palette.error.light,
  //               color: theme.palette.error.contrastText,
  //               padding: { xs: '0.25rem 0.5rem', sm: '0.3rem 0.6rem', md: '0.4rem 0.8rem' },
  //             },
  //             '& .MuiTooltip-arrow': {
  //               color: theme.palette.error.light,
  //             },
  //           }}
  //         >
  //           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  //             <img src={clear} alt="Clear" height="20" width="20" />
  //           </Box>
  //         </Tooltip>
  //       </Button>
  //     </Box>

  //     <Box sx={{ visibility: !siteId ? 'hidden' : 'visible' }}>
  //         <strong>SubStation ID: </strong> {siteId}
  //     </Box>
  //     <Box sx={{ visibility: !serialNumber ? 'hidden' : 'visible' }}>
  //         <strong>Serial Number: </strong> {serialNumber}
  //     </Box>

  //   </Box>
  // );

  return(
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"

    >

      <Box 
        display="flex"
        gap={{ xl: "1rem", lg: "0.2rem", md: "0.75rem", sm: "0.625rem", xs: "0.5rem" }}
        p={{ xl: "0.75rem", lg: "0.625rem", md: "0.5rem", sm: "0.375rem", xs: "0.25rem" }}
        alignItems="center"
        sx={getContainerStyles(theme)}
      >
        <Autocomplete
          options={stateOptions.map((s) => s.name)}
          value={state}
          onChange={(event, newValue) => handleStateChange(newValue)}
          size="small"
          sx={{
            ...autocompleteSizes,
            ...autocompleteBorderStyles,
            "& .MuiAutocomplete-input": inputStyles,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="State"
              size="small"
            
              sx={textFieldStyles}
            />
          )}
          renderOption={renderHighlightedOption}
        />


        <Autocomplete
          options={zoneOptions}
          value={zone}
          onChange={(event, newValue) => handleZoneChange(newValue)}
          size="small"
          sx={{
            ...autocompleteSizes,
            ...autocompleteBorderStyles,
            "& .MuiAutocomplete-input": inputStyles
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Zone"
              size="small"
              sx={textFieldStyles}
            />
          )}
          renderOption={renderHighlightedOption}
        />

        {/* Circle */}
        <Autocomplete
          options={circleOptions}
          value={circle}
          onChange={(event, newValue) => handleCircleChange(newValue)}
          size="small"
          sx={{
            ...autocompleteSizes,
            ...autocompleteBorderStyles,
            "& .MuiAutocomplete-input": inputStyles,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Circle"
              size="small"
              sx={textFieldStyles}
            />
          )}
          renderOption={renderHighlightedOption}
        />

          {/*Sub Division */}
        <Autocomplete
          options={divisionOptions}
          value={division}
          onChange={(event, newValue) => handleDivisionChange(newValue)}
          size="small"
          sx={{
            ...autocompleteSizes,
            ...autocompleteBorderStyles,
            "& .MuiAutocomplete-input": inputStyles,
            minWidth: {
              xl: "12rem",
              lg: "12rem",
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="SubDivision"
              size="small"
              sx={textFieldStyles}
            />
          )}
          renderOption={renderHighlightedOption}
        />

     

      
      </Box>
      <Box
        display="flex"
        gap={{ xl: "1rem", lg: "0.2rem", md: "0.75rem", sm: "0.625rem", xs: "0.5rem" }}
        p={{ xl: "0.75rem", lg: "0.625rem", md: "0.5rem", sm: "0.375rem", xs: "0.25rem" }}
        alignItems="center"
      >
           {/* Area */}
        <Autocomplete
          options={areaOptions}
          value={area}
          onChange={(event, newValue) => handleAreaChange(newValue)}
          size="small"
          sx={{
            ...autocompleteSizes,
            ...autocompleteBorderStyles,
            "& .MuiAutocomplete-input": inputStyles,
              minWidth: {
              xl: "15rem",
              lg: "15rem",
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Area"
              size="small"
              sx={textFieldStyles}
            />
          )}
          renderOption={renderHighlightedOption}
        />  
          {/* Historical Type */}
          {isHistorical && (
            <Autocomplete
              disablePortal
              disableClearable
              options={["String Details", "Cell Details", "Cell Alarms" ]}
              value={historicalType}
              onChange={(event, newValue) => setHistoricalType(newValue)}
              size="small"
              sx={{
                minWidth: {
                  xl: "8rem",
                  lg: "8rem",
                  md: "6rem",
                  sm: "5.5rem",
                  xs: "5rem",
                },
                maxWidth: {
                  xl: "12rem",
                  lg: "10rem",
                  md: "9rem",
                  sm: "8rem",
                  xs: "7rem",
                },
                ...autocompleteBorderStyles,
                "& .MuiAutocomplete-input": inputStyles,
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Type"
                  size="small"
                  sx={textFieldStyles}
                />
              )}
              renderOption={renderHighlightedOption}
            />
          )}
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
                    const endDateObj = parse(endDate.split(" ")[0], "yyyy-MM-dd", new Date());
                    if (isAfter(selectedDate, endDateObj)) {
                      setEndDate(formattedDate.replace(" 00:00:00", " 23:59:59"));
                    } else if (pageType === "daywise") {
                      const maxEndDate = addDays(selectedDate, 30);
                      if (isAfter(endDateObj, maxEndDate)) {
                        setEndDate(format(maxEndDate, "yyyy-MM-dd") + " 23:59:59");
                      }
                    }
                  }
                }}
                maxDate={today}
                PopperProps={{
                  sx: {
                    '& .MuiPaper-root': {
                      backgroundColor: 'black',
                      color: colors.primary[200],
                      border: '1px solid white',
                    },
                    '& .MuiPickersDay-root': {
                      color: colors.primary[200],
                      '&.Mui-selected': {
                        backgroundColor: colors.primary[200],
                        color: 'black',
                      },
                    },
                    '& .MuiPickersCalendarHeader-root': {
                      color: colors.primary[200],
                    },
                  },
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                    placeholder: "DD-MM-YYYY", // Update placeholder
                    InputLabelProps: datePickerLabelProps,
                    sx: datePickerStyles,
                  },
                }}
                format="dd-MM-yyyy" // Add this prop to set display format
              />

              <DatePicker
              label="To"
              value={endDate ?parse(endDate.split(" ")[0], "yyyy-MM-dd", new Date()) : null}
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
                } else if (pageType === "daywise" && startDateObj) {
                  const maxAllowedDate = addDays(startDateObj, 30);
                  if (isAfter(selectedDate, maxAllowedDate)) {
                    finalDate = maxAllowedDate;
                  }
                }

                setEndDate(format(finalDate, "yyyy-MM-dd") + " 23:59:59");
              }}
              maxDate={pageType === "daywise" && startDateObj ? addDays(startDateObj, 30) : today}
              minDate={startDateObj || undefined}
              slotProps={{
                textField: {
                  size: "small",
                  placeholder: "DD-MM-YYYY",
                  InputLabelProps: datePickerLabelProps,
                  sx: datePickerStyles,
                },
              }}
                format="dd-MM-yyyy"
            />
            </Box>
          </LocalizationProvider>
          <Box
              display="flex"
              gap={{ xl: "0.75rem", lg: "0.625rem", md: "0.5rem", sm: "0.375rem", xs: "0.25rem" }}
              sx={{
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                  justifyContent: "flex-end",
                  marginTop: "0.5rem",
                },
              }}
          >
              {/* <Tooltip title={isSearchDisabled ? "Please fill all fields" : "Search"}>
                <span>
                  <IconButton
                    onClick={() => {
                      // if (!startDate || !endDate) {
                      //   setErrors({
                      //     startDate: !startDate ? "Start date is required" : "",
                      //     endDate: !endDate ? "End date is required" : "",
                      //   });
                      //   return;
                      // }
                      search();
                      
                    }}
                    size="small"
                  // disabled={isSearchDisabled}
                    sx={{
                      height: "1.75rem",
                      width: "1.75rem",
                      backgroundColor: state && circle && siteId && serialNumber ? 'primary.main' : 'grey.400',
                      color: state && circle && siteId && serialNumber ? 'white' : 'black',
                      '&:hover': {
                        backgroundColor: state && circle && siteId && serialNumber ? 'primary.dark' : 'grey.400',
                      },
                    }}
                  >
                    <SearchIcon fontSize="small" sx={{color: colors.primary[200]}} />
                  </IconButton>
                </span>
              </Tooltip> */}

              <Button
                variant="outlined"
                color="error"
                onClick={clearOptions}
                size="small"
                sx={{
                  border: 'none',
                  minWidth: '2rem',
                  height: "1.75rem",
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={clear} alt="Clear" height="20" width="20" />
                  </Box>
                </Tooltip>
              </Button>
          </Box>
          <Box sx={{ visibility: !siteId ? 'hidden' : 'visible' }}>
           <strong>SubStation ID: </strong> {siteId}
          </Box>
          <Box sx={{ visibility: !serialNumber ? 'hidden' : 'visible' }}>
           <strong>Serial Number: </strong> {serialNumber}
          </Box>  
      </Box>
    </Box>
  )
};

export default ReportsBar;