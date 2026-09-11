
import { Grid, Paper, useTheme } from "@mui/material";
import { useContext, useRef, useEffect, useState } from "react";
import { tokens } from "../../theme";

import Topbar from "../global/Topbar";
import { AppContext } from "../../services/AppContext";

import { CellInfo, CellRepresentations } from "../../LiveDataComponents/Legends";

import FirstRow from "./FirstRow";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import NativeSelect from "@mui/material/NativeSelect";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import { ThemeProvider } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import WifiIcon from "@mui/icons-material/Wifi";
import CellsPanel from "./NewLiveDashboard/CellsPanel/CellsPanel";
import StateOfCharge from "./NewLiveDashboard/StateOfCharge/StateOfCharge";
import Charger from "./NewLiveDashboard/Charger/Charger";

import LiveBattery from "./NewLiveDashboard/LiveBattery/LiveBattery";
import Header from "./NewLiveDashboard/Header/Header";
import HealthBar from "./NewLiveDashboard/HealthBar/HealthBar";
const filters = ["Maharashtra", "Jalgaon", "Jalgaon", "AMALNER-II", "33/11 KV"];
const selectSx = {
  "&:before, &:after": { display: "none" },
  "& .MuiNativeSelect-icon": { display: "none" },
  "& select": { p: 0 },
};


const Livemonitoring = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { data, charger } = useContext(AppContext);

  const device = data[0];

  return (
    <Grid
      container
      direction="column"
      sx={{
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Topbar */}
      {/* <Grid item lg={12} xl={12}>
        <Paper elevation={8} sx={{   bgcolor: colors.primary[100],}}>
          <Topbar />
        </Paper>
      </Grid> */}
      <Grid item xs={12} lg={12} xl={12}>
        <Dashboard/>
      </Grid>

      {/* Scrollable Content */}
      
          {/* Sticky Legends */}
          {data[0] && charger ? (
            // <>
            //   <Grid
            //   container
            //   spacing={1}
            //   sx={{
            //     padding: "5px 10px 13px 10px", // Match padding from original livemonitoring context
            //   // bgcolor: "#191C24", // Consistent background color
            //   }}
            // >
            //   <Grid
            //     item
            //     xs={4.6}
            //     sx={{ position: "sticky", top: 0, zIndex: 10, paddingTop: "0px !important" }}
            //   >
            //     <Paper elevation={8} sx={{
            //       bgcolor: colors.primary[100],
            //       border:"1px solid #75767B" }}>
            //       <CellInfo />
            //     </Paper>
            //   </Grid>
            //   <Grid
            //     item
            //     xs={7.4}
            //     sx={{ position: "sticky", top: 0, zIndex: 10, paddingTop: "0px !important" }}
            //   >
            //     <Paper elevation={8} sx={{ bgcolor: colors.primary[100],border:"1px solid #75767B"}}>
            //       <CellRepresentations />
            //     </Paper>
            //   </Grid>
            //   </Grid>
            //   <Grid
            //     item
            //     xs // Takes remaining space
            //     container
            //     spacing={1}
            //     sx={{
            //       overflowY: "auto", // Enable scrolling
            //       padding: "0px 10px 120px 10px", // Padding: top, right, bottom, left
            //       boxSizing: "border-box", // Ensure padding is included in width/height
            //       height: "calc(100vh - 64px)", // Adjust based on Topbar height (assuming 64px)
            //     }}
            //   >
            //     <Grid item xs={12} sx={{ paddingTop: "5px !important" }}>
            //       <FirstRow />
            //     </Grid>
            //   </Grid>
            // </>

         <></>
          ):(<></>)}
              </Grid>
  );
};

export default Livemonitoring;



function Dashboard() {
  return (
    <Box component="main" className="dashboard-shell">
      <Box className="dashboard-content">
        <Header />
        <HealthBar />
        <Box className="main-grid">
          <CellsPanel />
          <Box className="operations-grid">
         
             <LiveBattery />
            <StateOfCharge />
            <Charger />
            <Cumulative />
            <Cycles />
            <BarChart title="Discharge current" bars={[{ label: "Average", value: "0.084 A", height: 30 }, { label: "Peak", value: "2.0538 A", height: 78 }]} />
            <BarChart title="Charge / discharge ampere-hour" bars={[{ label: "Ah In", value: "10.327", height: 84 }, { label: "Ah Out", value: "0.445", height: 22 }]} />
            <Alarms />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// function Header() {
//   return (
//     <Paper component="header" className="top-header">
//       <Box className="filter-row">
//         {filters.map((filter, index) => (
//           <Box component="label" className="select-wrap" key={`${filter}-${index}`}>
//             <span className="sr-only">Location filter</span>
//             <NativeSelect defaultValue={filter} variant="standard" disableUnderline sx={selectSx}>
//               <option>{filter}</option>
//             </NativeSelect>
//             <ExpandMoreIcon sx={{ fontSize: 12 }} />
//           </Box>
//         ))}
//       </Box>
//       <Box className="header-status">
//         <Box component="label" className="search-box">
//           <SearchIcon sx={{ fontSize: 14 }} />
//           <InputBase inputProps={{ "aria-label": "Search device" }} placeholder="Search device" sx={{ font: "inherit", fontSize: 11, width: "100%" }} />
//         </Box>
//         <span className="live-state"><span />Live</span>
//         <Box className="device-id"><strong>VJMDBMC250942</strong><DevicePopover /></Box>
//         <time dateTime="2026-09-07T10:55:27">07/09/2026&nbsp; 10:55:27</time>
//         <WifiIcon className="connection-icon" sx={{ fontSize: 16 }} aria-label="Connected" />
//       </Box>
//     </Paper>
//   );
// } 

// function DevicePopover() {
//   const [open, setOpen] = useState(false);
//   const wrap = useRef(null);
//   useEffect(() => {
//     const close = (event) => {
//       if (!wrap.current?.contains(event.target)) setOpen(false);
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);
//   const details = [
//     ["Serial Number", "AAJCO0942"], ["Manufacturer", "AAJCO"], ["Battery Type", "TUBULAR"],
//     ["Capacity", "100 Ah"], ["Design Voltage", "30 V"], ["Individual Cell", "2.0 V"],
//     ["First Used Date", "2026-04-21"], ["KVA Rating", "33/11 KV"],
//   ];
//   return (
//     <Box ref={wrap} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
//       <IconButton
//         className="icon-button"
//         disableRipple
//         aria-label="View battery details"
//         aria-expanded={open}
//         onClick={() => setOpen((value) => !value)}
//         sx={{ p: 0, width: 25, height: 25, borderRadius: "4px", color: "primary.main" }}
//       >
//         <InfoOutlinedIcon sx={{ fontSize: 15 }} />
//       </IconButton>
//       {open && (
//         <Paper className="device-popover" role="dialog" aria-label="Battery details">
//           <p className="popover-title">Battery details</p>
//           <dl>
//             {details.map(([label, value]) => (
//               <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
//             ))}
//           </dl>
//         </Paper>
//       )}
//     </Box>
//   );
// }

// function HealthBar() {
//   return (
//     <Paper className="health-bar">
//       <Box className="health-lead"><span className="status-dot ok" /><div><strong>System health</strong><span>Normal</span></div></Box>
//       <Box className="health-item"><span>Cells</span><strong>15/15</strong></Box>
//       <Box className="health-item"><span>Communication</span><strong>15/15</strong></Box>
//       <Box className="health-item"><span>Active alarms</span><strong>0</strong></Box>
//       <Box className="health-links">
//         <span><i className="status-dot ok" /> BMS</span>
//         <span><i className="status-dot ok" /> Charger</span>
//         <span><i className="status-dot ok" /> Thermal</span>
//       </Box>
//     </Paper>
//   );
// }

// function LiveBattery() {
//   const metrics = [["Voltage", "32.81", "V"], ["Current", "0", "A"], ["Temperature", "30.11", "°C"]];
//   return (
//     <Surface className="live-card">
//       <SectionTitle aside={<span className="subtle-label">Real-time · 1 Hz</span>}>Live battery status</SectionTitle>
//       <Box className="metric-grid">
//         {metrics.map(([label, value, unit]) => (
//           <Box className="metric" key={label}><span>{label}</span><strong>{value}<small>{unit}</small></strong></Box>
//         ))}
//       </Box>
//     </Surface>
//   );
// }
function Surface({ children, className = "" }) {
  return (
    <Paper component="section" className={`surface ${className}`} square={false}>
      {children}
    </Paper>
  );
}
function SectionTitle({ children, aside }) {
  return (
    <Box className="section-heading">
      <Box className="flex min-w-0 items-center gap-2">
        <span className="accent-line" />
        <h2>{children}</h2>
      </Box>
      {aside}
    </Box>
  );
}


function Cumulative() {
  const data = [["Cycle count", "39"], ["Ampere hour in", "755.526 Ah"], ["Ampere hour out", "233.719 Ah"], ["Charging energy", "25.8736 kWh"], ["Discharging energy", "1.1594 kWh"], ["Battery run hours", "03:42:50"]];
  return (
    <Surface className="cumulative-card">
      <SectionTitle>Cumulative</SectionTitle>
      <Box component="dl" className="detail-list">
        {data.map(([label, value]) => (<div key={label}><dt>{label}</dt><dd>{value}</dd></div>))}
      </Box>
    </Surface>
  );
}
function BarChart({ title, bars }) {
  return (
    <Surface className="chart-card">
      <SectionTitle>{title}</SectionTitle>
      <Box className="chart-area">
        <Box className="grid-lines"><i /><i /><i /></Box>
        {bars.map((bar) => (
          <Box className="bar-column" key={bar.label}>
            <span className="bar-value">{bar.value}</span>
            <Tooltip title={`${bar.label}: ${bar.value}`} arrow placement="top">
              <Box className="chart-bar" style={{ height: `${bar.height}%` }} tabIndex={0} />
            </Tooltip>
            <b>{bar.label}</b>
          </Box>
        ))}
      </Box>
    </Surface>
  );
}
function Alarms() {
  return (
    <Surface className="alarms-card">
      <SectionTitle aside={<span className="alarm-count">0</span>}>Active alarms</SectionTitle>
      <Stack className="normal-state" direction="row">
        <span className="check-mark"><CheckIcon sx={{ fontSize: 18 }} /></span>
        <div><strong>System normal</strong><p>No active alarms detected</p></div>
      </Stack>
    </Surface>
  );
}
function Cycles() {
  return (
    <Surface className="cycle-card">
      <SectionTitle>Cycle information</SectionTitle>
      <Box className="cycle-columns">
        <div><h3>Charge</h3><p><span>Peak current</span><b>2.5 A</b></p><p><span>Runtime</span><b>122:53</b></p></div>
        <div><h3>Discharge</h3><p><span>Peak current</span><b>2.2 A</b></p><p><span>Runtime</span><b>00:13</b></p></div>
      </Box>
    </Surface>
  );
}