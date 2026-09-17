import { useMemo, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import DevicePopover from "../DevicePopover/DevicePopover";

import { tokens } from "../../../../theme";
import "./Header.css";
import { AppContext } from "../../../../services/AppContext";

const selectSx = {
  height: 30,
  fontSize: 11,
  fontWeight: 600,
  bgcolor: "var(--muted)",
  borderRadius: "5px",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": {
    py: "4px",
    px: "8px",
    pr: "28px !important",
  },
  "& .MuiSvgIcon-root": {
    fontSize: 16,
    color: "var(--muted-foreground)",
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      maxHeight: 280,
      fontSize: 12,
      zIndex: 1400,
    },
  },
};

/** Compact cascading location filters + search trigger + live device status. */
export default function   Header() {



    const {
    serialNumberOptions,
    siteId,
    serialNumber,
    setSiteId,
    setSerialNumber,setLiveTime,setDeviceId,setLocation,setCharger,setMdata,status,
    handleSearch,setIsChecked,isChecked,setCircle,setState,Mdata = {},liveTime,setSerialNumberOptions,setSiteOptions,
    data,state,circle,stateOptions,circleOptions,siteOptions,handleCircleChange,handleStateChange,clearOptions,
    zone,setZone,zoneOptions,handleZoneChange, area, areaOptions, handleAreaChange,divisionOptions,division,handleDivisionChange
  } = useContext(AppContext);
  const { 
    location = "", // Default location name
    customer = "",    // Default vendor name
  } = Mdata;

const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  // const handleSearch = () => {
  //   // Hook up to API later — for now log the cascade selection
  //   console.log("Search location", { state, zone, circle, subDivision, substation });
  // };

  return (
    <Paper component="header" className="top-header" elevation={0}>
      <Box className="filter-row">
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={state}
            onChange={(e) => handleStateChange(e.target.value)}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="State"
          >
            {stateOptions.map((s) => (
              <MenuItem key={s.id} value={s.name} sx={{ fontSize: 12 }}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 90 }} disabled={!zoneOptions.length}>
          <Select
            value={zone}
            onChange={(e) => handleZoneChange(e.target.value)}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Zone"
          >
            {zoneOptions.map((z) => (
              <MenuItem key={z} value={z} sx={{ fontSize: 12 }}>
                {z}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 90 }} disabled={!circleOptions.length}>
          <Select
            value={circle}
            onChange={(e) => handleCircleChange(e.target.value)}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Circle"
          >
            {circleOptions.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: 12 }}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 110 }} disabled={!divisionOptions.length}>
          <Select
            value={division}
            onChange={(e) => handleDivisionChange(e.target.value)}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Sub-division"
          >
            {divisionOptions.map((sd) => (
              <MenuItem key={sd} value={sd} sx={{ fontSize: 12 }}>
                {sd}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }} disabled={!areaOptions.length}>
          <Select
            value={area}
            onChange={(e) => handleAreaChange(e.target.value)}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Substation"
          >
            {areaOptions.map((ss) => (
              <MenuItem key={ss} value={ss} sx={{ fontSize: 12 }}>
                {ss}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <IconButton
          className="search-icon-btn"
          size="small"
          aria-label="Search devices for selected location"
          onClick={handleSearch}
          disabled={!area}
          sx={{
            width: 30,
            height: 30,
            borderRadius: "5px",
            bgcolor: "var(--muted)",
            color: "var(--primary)",
            "&:hover": { bgcolor: "var(--accent)" },
            "&.Mui-disabled": { opacity: 0.5 },
          }}
        >
          <SearchIcon sx={{ fontSize: 16 }} />
        </IconButton>
         {serialNumber &&
     <>
      <CustomToggle isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} />
      </>}
      </Box>

     {serialNumber &&
     <>
      {/* <CustomToggle isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} /> */}
     <Box className="header-status">
          {status==1?  (
            <span className="live-state">
              <span className="status-dot ok sm" />
              Live
            </span>
          ): (
            <span className="not-live-state">
              <span className="status-dot fault sm" />
              Not Live
            </span>
          )}

          <Box className="device-id">
            <strong>{serialNumber}</strong>
            <DevicePopover />
          </Box>

          <time >{liveTime
          ? new Date(liveTime).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
              second: 'numeric',
              hour12: false 
            })
          : 'No time available'}</time>

          <WifiIcon className="connection-icon" sx={{ fontSize: 16 }} aria-label="Connected" />
        </Box>
        </>
      }
    </Paper>
  );
}

const CustomToggle = ({ isChecked, handleCheckboxChange }) => {
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
          width: { xs: 28, sm: 34, md: 40 },
          height: { xs: 16, sm: 19, md: 22 },
          flexShrink: 0,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          style={{ display: "none" }}
        />
        <Box
          sx={{
            width: "100%",
            height: "100%",
            borderRadius: "9999px",
            backgroundColor: isChecked ? "#4CAF50" : colors.grey[700],
            boxShadow: isChecked ? "inset 0 2px 4px rgba(0, 0, 0, 0.2)" : "none",
            transition: "all 0.3s ease",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 2,
            left: isChecked
              ? { xs: 14, sm: 17, md: 20 }
              : 2,
            width: { xs: 12, sm: 15, md: 18 },
            height: { xs: 12, sm: 15, md: 18 },
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          }}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          ml: { xs: 0.5, sm: 0.75, md: 1 },
          fontSize: { xs: "0.65rem", sm: "0.7rem", md: "0.75rem" },
          color: isChecked ? "#4CAF50" : colors.primary[200],
          fontWeight: isChecked ? 600 : 400,
          display: { xs: "none", sm: "inline" },
        }}
      >
        Live
      </Typography>
    </label>
  );
};
