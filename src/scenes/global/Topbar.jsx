import { Box, IconButton, Tooltip,useTheme, Typography,Grid,TextField,Switch } from "@mui/material";
import React,{ useContext, useState,useEffect,  useCallback,useRef,memo} from "react";
import { tokens } from "../../theme";
import Autocomplete from '@mui/material/Autocomplete';
import clear from '../../assets/assets/images/png/brush.png'
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate , useLocation} from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from '@mui/icons-material/Clear';

import { Button } from '@mui/material';

import { AppContext } from "../../services/AppContext";
import { set } from "lodash";



const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const locations = useLocation();

  const {
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,setLiveTime,setDeviceId,setLocation,setCharger,setMdata,setData,
    handleSearch,setIsChecked,isChecked,setCircle,setState,Mdata = {},liveTime,setSerialNumberOptions,setSiteOptions,
    data,state,circle,stateOptions,circleOptions,siteOptions,handleCircleChange,handleStateChange,clearOptions,
    zone,setZone,zoneOptions,handleZoneChange, area, areaOptions, handleAreaChange,divisionOptions,division,handleDivisionChange
  } = useContext(AppContext);
  const { 
    location = "", // Default location name
    customer = "",    // Default vendor name
  } = Mdata;
  const [errors, setErrors] = useState({ siteId: false, serialNumber: false });


  const fromDashboard = (locations.state && locations.state.from === '/') || false;
useEffect(() => {

  if(!fromDashboard){
   setMdata('');
   setDeviceId('');
    setData([]);
    setCharger([]);
    setLocation('');
    setLiveTime('');
    setDeviceId('');
    setIsChecked(false);
    // setState("");
    // setZone("");
    // setCircle("");
    setSiteId("");
    setSerialNumber("");
    setSerialNumberOptions([])
    setSiteOptions([])
    setIsChecked(false);
  }
  setState("Maharastra");
  handleStateChange("Maharastra");
  return () => {
    setIsChecked(false); }
}, []);

  // Handle back navigation to dashboard
  const handleBackToDashboard = () => navigate('/');

  const renderHighlightedOption = (props, option, value) => {
    // Destructure key from props and create a new object without it
    const { key, ...otherProps } = props;
    
    return (
      <li
        key={key}
        {...otherProps}
        style={{
          backgroundColor: value === option ? "#d82b27" : "inherit",
          color: value === option ? "#ffffff" : "inherit",
        }}
      >
        {option}
      </li>
    );
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const textFieldStyles = {
    '& .MuiInputBase-root': {
      height: { xs: '1.625rem', sm: '1.75rem', md: '1.875rem', lg: '1.875rem', xl: '1.875rem' },
      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' },
      border: `1px solid #75767B`,
      color: colors.primary[200],
      fontWeight: "bold"
    },
    '& .MuiInputLabel-root': {
      fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' },
      top: { xs: '-0.25rem', sm: '-0.1875rem', md: '-0.1875rem', lg: '-0.1875rem', xl: '-0.1875rem' }
    },
    '& .MuiInputBase-input::placeholder': {
      color: colors.primary[200],
      opacity: 1,
    },
  };

  const autocompleteWidths = { xs: '5.6rem', sm: '6.2rem', md: '6.8rem', lg: '7.3rem', xl: '8.2rem' };
  const iconButtonMinWidth = { xs: '1.8rem', sm: '2rem', md: '2.2rem', lg: '2.4rem', xl: '2.5rem' };
  const infoBoxMinWidth = { xs: '5rem', sm: '5.6rem', md: '6.2rem', lg: '5rem', xl: '7.5rem' };
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
    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.6rem', xl: '0.8rem' },
    // textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
    fontWeight: "bold",
    color: colors.primary[200]
  };
  return (
   <Grid
  container
  spacing={{ xs: '0.2rem', sm: '0.3rem', md: '0.4rem', lg: '0.3rem', xl: '0.6rem' }}
  direction="row"
  alignItems="center"
  sx={{
    marginBottom: { xs: '0.5rem', sm: '0.75rem', md: '1rem', lg: '1rem', xl: '1rem' },
    padding: {
      xs: '0.25rem 0.0625rem 0.0625rem 0.0625rem',
      sm: '0.3125rem 0.0625rem 0.125rem 0.125rem',
      md: '0.375rem 0.125rem 0.125rem 0.125rem',
      lg: '0.5rem 0.125rem 0.1875rem 0.1875rem',
      xl: '0.5625rem 0.125rem 0.1875rem 0.1875rem'
    },
    width: '100%',
    flexWrap: { xs: 'wrap', sm: 'wrap', md: 'nowrap', lg: 'nowrap', xl: 'nowrap' },
    overflow: 'hidden',
    minHeight: { xs: '2.5rem', sm: '2.75rem', md: '3rem', lg: '3rem', xl: '3.125rem' }
  }}
>

  {/* State */}
  <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: autocompleteWidths }}>
    <Autocomplete
      options={stateOptions.map((state) => state.name)}
      value={state}
      onChange={(event, newValue) => handleStateChange(newValue)}
      size="small"
      sx={{ width: autocompleteWidths }}
      renderOption={(props, option) => renderHighlightedOption(props, option, state)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="State"
          variant="outlined"
          sx={textFieldStyles}
        />
      )}
    />
  </Grid>

  {/* Zone */}
  <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: autocompleteWidths }}>
    <Autocomplete
      options={zoneOptions}
      value={zone}
      onChange={(event, newValue) => handleZoneChange(newValue)}
      size="small"
      sx={{ width: autocompleteWidths }}
      renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Zone"
          variant="outlined"
          sx={textFieldStyles}
        />
      )}
    />
  </Grid>

  {/* Circle */}
  <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: autocompleteWidths }}>
    <Autocomplete
      options={circleOptions}
      value={circle}
      onChange={(event, newValue) => handleCircleChange(newValue)}
      size="small"
      sx={{ width: autocompleteWidths }}
      renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Circle"
          variant="outlined"
          sx={textFieldStyles}
        />
      )}
    />
  </Grid>
  
  {/* Subdivision */}
  <Grid item xs="auto" sx={{ flexShrink: 0 , minWidth: autocompleteWidths}}>
    <Autocomplete
      options={divisionOptions}
      value={division}
      onChange={(event, newValue) => handleDivisionChange(newValue)}
      size="small"
      sx={{ width: {lg: '7.8rem', xl: '9.5rem'} }}
      renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="SubDivision"
          variant="outlined"
          sx={textFieldStyles}
        />
      )}
    />
  </Grid>

  {/* Area */}
  <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: autocompleteWidths }}>
    <Autocomplete
      options={areaOptions}
      value={area}
      onChange={(event, newValue) => handleAreaChange(newValue)}
      size="small"
      sx={{ width: autocompleteWidths }}
      renderOption={(props, option) => renderHighlightedOption(props, option, area)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Area"
          variant="outlined"
          sx={textFieldStyles}
        />
      )}
    />
  </Grid>

  {/* Substation ID */}
  {/* <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: autocompleteWidths }}>
    <Autocomplete
      freeSolo
      disablePortal
      disableClearable
      options={siteOptions.map((site) => site.siteId)}
      value={siteId}
      onChange={(event, newValue) => setSiteId(newValue)}
      size="small"
      sx={{ width: autocompleteWidths }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Substation ID"
          variant="outlined"
          sx={textFieldStyles}
        />
      )}
    />
  </Grid> */}

  {/* Serial Number */}
  {/* <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: autocompleteWidths }}>
    <Autocomplete
      disablePortal
      disableClearable
      options={serialNumberOptions}
      value={serialNumber}
      onChange={(event, newValue) => setSerialNumber(newValue)}
      size="small"
      sx={{ width: { xs: '5.6rem', sm: '6.2rem', md: '6.8rem', lg: '9rem', xl: '10rem' } }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Serial Number"
          variant="outlined"
          sx={textFieldStyles}
        />
      )}
    />
  </Grid> */}

  {/* Search Button */}
  <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: iconButtonMinWidth }}>
    <IconButton
      onClick={handleSearch}
      disabled={!state || !circle || !area}
      sx={{
        padding: { xs: '0.125rem', sm: '0.1875rem', md: '0.1875rem', lg: '0.25rem', xl: '0.25rem' },
        backgroundColor: state && circle && siteId && serialNumber ? 'primary.main' : 'grey.400',
        color: state && circle && siteId && serialNumber ? 'white' : 'black',
        '&:hover': {
          backgroundColor: state && circle && siteId && serialNumber ? 'primary.dark' : 'grey.400',
        },
      }}
    >
      <SearchIcon fontSize="small" sx={{ color: colors.primary[200] }} />
    </IconButton>
  </Grid>

  {/* Clear Button */}
  <Grid item xs="auto" sx={{ flexShrink: 0, minWidth: { xs: '3.2rem', sm: '3.8rem', md: '4.4rem', lg: '2.5rem', xl: '4.8rem' } }}>
    <Button
      color="error"
      onClick={clearOptions}
      size="small"
      sx={{
        border: 'none',
        minWidth: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem', xl: '2rem' },
        height: infoBoxHeight,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': { backgroundColor: 'transparent' },
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
          '& .MuiTooltip-arrow': { color: theme.palette.error.light },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={clear} alt="Clear" height="20" width="20" />
        </Box>
      </Tooltip>
    </Button>
  </Grid>

  {/* Toggle */}
  <Grid item xs="auto" sx={{ 
    flexShrink: 0, 
    minWidth: { xs: '2.5rem', sm: '3.2rem', md: '3rem', lg: '4rem', xl: '4rem' },
    visibility: data.length > 0 ? 'visible' : 'hidden'
  }}>
    <CustomToggle isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} />
  </Grid>

  {/* Location */}
  {/* <Grid item xs="auto" sx={{
    flexShrink: 0,
    minWidth: infoBoxMinWidth,
    visibility: data.length > 0 ? 'visible' : 'hidden'
  }}>
    <Box sx={{ ...infoBoxStyles, width: infoBoxMinWidth }}>
      <Typography sx={infoTextStyles}>
        {location}
      </Typography>
    </Box>
  </Grid> */}

    {/* Site ID */}
  <Grid item xs="auto" sx={{
    flexShrink: 0,
    minWidth: infoBoxMinWidth,
    visibility: data.length > 0 ? 'visible' : 'hidden'
  }}>
    <Box sx={{ ...infoBoxStyles, width: infoBoxMinWidth }}>
      <Typography sx={infoTextStyles}>
        {area}
      </Typography>
    </Box>
  </Grid>

   {/* Serial Number */}
  <Grid item xs="auto" sx={{
    flexShrink: 0,
    minWidth: infoBoxMinWidth,
    visibility: data.length > 0 ? 'visible' : 'hidden'
  }}>
    <Box sx={{ ...infoBoxStyles, width: infoBoxMinWidth }}>
      <Typography sx={infoTextStyles}>
        {serialNumber}
      </Typography>
    </Box>
  </Grid>

  {/* DateTime */}
  <Grid item xs="auto" sx={{
    flexShrink: 0,
    minWidth: infoBoxMinWidth,
    visibility: data.length > 0 ? 'visible' : 'hidden'
  }}>
    <Box sx={{ ...infoBoxStyles, width: infoBoxMinWidth }}>
      <Typography sx={{
         fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.5rem', xl: '0.8rem' },
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        fontWeight: "bold",
        color: colors.primary[200]
      }}>
        {liveTime
          ? new Date(liveTime).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false 
            })
          : 'No time available'}
      </Typography>
    </Box>
  </Grid>

  {/* Customer Name */}
  {/* <Grid item xs="auto" sx={{
    flexShrink: 0,
    minWidth: infoBoxMinWidth,
    visibility: data.length > 0 ? 'visible' : 'hidden'
  }}>
    <Box sx={{ ...infoBoxStyles, width: infoBoxMinWidth }}>
      <Typography sx={infoTextStyles}>
        {customer}
      </Typography>
    </Box>
  </Grid> */}

  {/* Color Indicators */}
  <Grid item xs="auto" sx={{
    flexShrink: 0,
    minWidth: infoBoxMinWidth,
    visibility: data.length > 0 ? 'visible' : 'hidden'
  }}>
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      height: infoBoxHeight,
      width: infoBoxMinWidth
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        mr: { xs: '0.2rem', sm: '0.3rem', md: '0.4rem', lg: '0.4rem', xl: '0.4rem' }
      }}>
        <Box sx={{
          width: { xs: '0.375rem', sm: '0.5rem', md: '0.625rem', lg: '0.825rem', xl: '0.825rem' },
          height: { xs: '0.375rem', sm: '0.5rem', md: '0.625rem', lg: '0.825rem', xl: '0.825rem' },
          borderRadius: '50%',
          backgroundColor: 'rgb(255, 0, 0)'
        }} />
        <Typography sx={{
          fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.65rem', xl: '0.7rem' },
          color: 'rgb(255, 0, 0)',
          fontWeight: 'bold',
        }}>
          Event
        </Typography>
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{
          width: { xs: '0.375rem', sm: '0.5rem', md: '0.625rem', lg: '0.825rem', xl: '0.825rem' },
          height: { xs: '0.375rem', sm: '0.5rem', md: '0.625rem', lg: '0.825rem', xl: '0.825rem' },
          borderRadius: '50%',
          backgroundColor: 'green'
        }} />
        <Typography sx={{
          fontSize: { xs: '0.55rem', sm: '0.6rem', md: '0.65rem', lg: '0.65rem', xl: '0.7rem' },
          fontWeight: 'bold',
          color: 'green'
        }}>
          Normal
        </Typography>
      </Box>
    </Box>
  </Grid>
</Grid>
  );
};

export default Topbar;

export const CustomToggle = ({ isChecked, handleCheckboxChange }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: 40, // Slightly increased for better proportion
          height: 22, // Slightly increased to match toggle knob
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          style={{ display: "none" }} // Hidden input
        />
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "9999px", // Fully rounded
            backgroundColor: isChecked ? "#4CAF50" : colors.grey[700], // Green when checked
            transition: "all 0.3s ease", // Smoother transition for color and shadow
            boxShadow: isChecked ? "inset 0 2px 4px rgba(0, 0, 0, 0.2)" : "none", // Inner shadow when checked
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 2,
            left: isChecked ? 20 : 2, // Adjusted range for new width (20px when checked)
            width: 18,
            height: 18,
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)", // Shadow for the knob
            transition: "all 0.3s ease", // Smoother transition for movement
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          ml: 1.5, // Increased margin for better spacing
          fontSize: "0.875rem", // Slightly larger for readability
          color: isChecked ? "#4CAF50" :  colors.primary[200], // Match label color to toggle state
          fontWeight: isChecked ? 600 : 400, // Bold when checked
          display: { xs: "none", sm: "inline" },
        }}
      >
        Live
      </Typography>
    </label>
  );
};