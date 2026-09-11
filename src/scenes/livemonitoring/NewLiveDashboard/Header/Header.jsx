import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import NativeSelect from "@mui/material/NativeSelect";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import DevicePopover from "../DevicePopover/DevicePopover";
import { device, filters } from "../../data/dashboardData";
import "./Header.css";

// Hides the native select chrome so the compact custom look stays intact.
const selectSx = {
  "&:before, &:after": { display: "none" },
  "& .MuiNativeSelect-icon": { display: "none" },
  "& select": { p: 0 },
};

/** Header — Region/Location/Site/Substation/Voltage filters, search, live state. */
export default function Header() {
  return (
    <Paper component="header" className="top-header">
      <Box className="filter-row">
        {filters.map((filter, index) => (
          <Box component="label" className="select-wrap" key={`${filter}-${index}`}>
            <span className="sr-only">Location filter</span>
            <NativeSelect defaultValue={filter} variant="standard" disableUnderline sx={selectSx}>
              <option>{filter}</option>
            </NativeSelect>
            <ExpandMoreIcon sx={{ fontSize: 12 }} />
          </Box>
        ))}
      </Box>

      <Box className="header-status">
        <Box component="label" className="search-box">
          <SearchIcon sx={{ fontSize: 14 }} />
          <InputBase
            inputProps={{ "aria-label": "Search device" }}
            placeholder="Search device"
            sx={{ font: "inherit", fontSize: 11, width: "100%" }}
          />
        </Box>

        {device.live && (
          <span className="live-state">
            <span className="status-dot ok sm" />
            Live
          </span>
        )}

        <Box className="device-id">
          <strong>{device.id}</strong>
          <DevicePopover />
        </Box>

        <time dateTime={device.timestampISO}>{device.timestamp}</time>

        <WifiIcon className="connection-icon" sx={{ fontSize: 16 }} aria-label="Connected" />
      </Box>
    </Paper>
  );
}
