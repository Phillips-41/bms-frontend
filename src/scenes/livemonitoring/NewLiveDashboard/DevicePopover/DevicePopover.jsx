import { useState,useContext } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { deviceDetails } from "../../data/dashboardData";
import { AppContext } from "../../../../services/AppContext";
import "./DevicePopover.css";

/**
 * DevicePopover — ⓘ trigger that opens battery metadata above the grid.
 * Uses MUI Popover (portal) so it always renders on top of dashboard cards.
 */
export default function DevicePopover() {

const{Mdata} = useContext(AppContext);
const{  firstUsedDate= "",
    batterySerialNumber= "",
    batteryBankType= "",
    ahCapacity= "",
    manufacturerName= "",
    designVoltage= "",
    individualCellVoltage= "",
    kva=""}=Mdata
 const details = [
  ["Battery Serial Number", batterySerialNumber],
  ["Manufacturer", manufacturerName],
  ["Battery Type", batteryBankType],
  ["Capacity", ahCapacity],
  ["Design Voltage", designVoltage],
  ["Individual Cell", individualCellVoltage],
  ["First Used Date", firstUsedDate],
  ["KV Rating", kva],
];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="device-popover-wrap">
      <IconButton
        className="icon-button"
        disableRipple
        aria-label="View battery details"
        aria-expanded={open}
        onClick={handleOpen}
        onMouseEnter={handleOpen}
        sx={{
          p: 0,
          width: 25,
          height: 25,
          borderRadius: "4px",
          color: "primary.main",
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 15 }} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        disableRestoreFocus
        slotProps={{
          paper: {
            className: "device-popover",
            onMouseLeave: handleClose,
            role: "dialog",
            "aria-label": "Battery details",
            sx: {
              mt: 0.5,
              width: 280,
              p: "13px",
              border: "1px solid var(--border)",
              borderRadius: "7px",
              background: "var(--card)",
              boxShadow: "0 18px 44px -16px color-mix(in oklab, var(--foreground) 40%, transparent)",
              backdropFilter: "blur(18px)",
              zIndex: 1500,
            },
          },
        }}
        sx={{ zIndex: 1500 }}
      >
        <p className="popover-title">Battery details</p>
        <dl>
          {details.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </Popover>
    </Box>
  );
}
