import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import DevicePopover from "../DevicePopover/DevicePopover";
import { device, locationHierarchy } from "../../data/dashboardData";
import "./Header.css";

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
export default function Header() {
  const [state, setState] = useState("Maharashtra");
  const [zone, setZone] = useState("Jalgaon");
  const [circle, setCircle] = useState("Jalgaon");
  const [subDivision, setSubDivision] = useState("AMALNER-II");
  const [substation, setSubstation] = useState("33/11 KV Amalner");

  const states = useMemo(() => Object.keys(locationHierarchy), []);

  const zones = useMemo(() => {
    if (!state || !locationHierarchy[state]) return [];
    return Object.keys(locationHierarchy[state]);
  }, [state]);

  const circles = useMemo(() => {
    if (!state || !zone || !locationHierarchy[state]?.[zone]) return [];
    return Object.keys(locationHierarchy[state][zone]);
  }, [state, zone]);

  const subDivisions = useMemo(() => {
    if (!state || !zone || !circle || !locationHierarchy[state]?.[zone]?.[circle]) return [];
    return Object.keys(locationHierarchy[state][zone][circle]);
  }, [state, zone, circle]);

  const substations = useMemo(() => {
    if (!state || !zone || !circle || !subDivision) return [];
    return locationHierarchy[state]?.[zone]?.[circle]?.[subDivision] ?? [];
  }, [state, zone, circle, subDivision]);

  const handleState = (e) => {
    const next = e.target.value;
    setState(next);
    const zList = Object.keys(locationHierarchy[next] ?? {});
    const z = zList[0] ?? "";
    setZone(z);
    const cList = Object.keys(locationHierarchy[next]?.[z] ?? {});
    const c = cList[0] ?? "";
    setCircle(c);
    const sdList = Object.keys(locationHierarchy[next]?.[z]?.[c] ?? {});
    const sd = sdList[0] ?? "";
    setSubDivision(sd);
    const ssList = locationHierarchy[next]?.[z]?.[c]?.[sd] ?? [];
    setSubstation(ssList[0] ?? "");
  };

  const handleZone = (e) => {
    const next = e.target.value;
    setZone(next);
    const cList = Object.keys(locationHierarchy[state]?.[next] ?? {});
    const c = cList[0] ?? "";
    setCircle(c);
    const sdList = Object.keys(locationHierarchy[state]?.[next]?.[c] ?? {});
    const sd = sdList[0] ?? "";
    setSubDivision(sd);
    const ssList = locationHierarchy[state]?.[next]?.[c]?.[sd] ?? [];
    setSubstation(ssList[0] ?? "");
  };

  const handleCircle = (e) => {
    const next = e.target.value;
    setCircle(next);
    const sdList = Object.keys(locationHierarchy[state]?.[zone]?.[next] ?? {});
    const sd = sdList[0] ?? "";
    setSubDivision(sd);
    const ssList = locationHierarchy[state]?.[zone]?.[next]?.[sd] ?? [];
    setSubstation(ssList[0] ?? "");
  };

  const handleSubDivision = (e) => {
    const next = e.target.value;
    setSubDivision(next);
    const ssList = locationHierarchy[state]?.[zone]?.[circle]?.[next] ?? [];
    setSubstation(ssList[0] ?? "");
  };

  const handleSearch = () => {
    // Hook up to API later — for now log the cascade selection
    console.log("Search location", { state, zone, circle, subDivision, substation });
  };

  return (
    <Paper component="header" className="top-header" elevation={0}>
      <Box className="filter-row">
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={state}
            onChange={handleState}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="State"
          >
            {states.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 12 }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 90 }} disabled={!zones.length}>
          <Select
            value={zone}
            onChange={handleZone}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Zone"
          >
            {zones.map((z) => (
              <MenuItem key={z} value={z} sx={{ fontSize: 12 }}>
                {z}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 90 }} disabled={!circles.length}>
          <Select
            value={circle}
            onChange={handleCircle}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Circle"
          >
            {circles.map((c) => (
              <MenuItem key={c} value={c} sx={{ fontSize: 12 }}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 110 }} disabled={!subDivisions.length}>
          <Select
            value={subDivision}
            onChange={handleSubDivision}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Sub-division"
          >
            {subDivisions.map((sd) => (
              <MenuItem key={sd} value={sd} sx={{ fontSize: 12 }}>
                {sd}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }} disabled={!substations.length}>
          <Select
            value={substation}
            onChange={(e) => setSubstation(e.target.value)}
            displayEmpty
            sx={selectSx}
            MenuProps={menuProps}
            aria-label="Substation"
          >
            {substations.map((ss) => (
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
          disabled={!substation}
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
      </Box>

      <Box className="header-status">
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
