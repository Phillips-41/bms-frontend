import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { deviceDetails } from "../../data/dashboardData";
import "./DevicePopover.css";

/**
 * DevicePopover — ⓘ trigger in the header that reveals the battery metadata
 * on hover or click. Closes on outside click.
 */
export default function DevicePopover({ details = deviceDetails }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);

  useEffect(() => {
    const close = (event) => {
      if (!wrap.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <Box
      ref={wrap}
      className="device-popover-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <IconButton
        className="icon-button"
        disableRipple
        aria-label="View battery details"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        sx={{ p: 0, width: 25, height: 25, borderRadius: "4px", color: "primary.main" }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 15 }} />
      </IconButton>

      {open && (
        <Paper className="device-popover" role="dialog" aria-label="Battery details">
          <p className="popover-title">Battery details</p>
          <dl>
            {details.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Paper>
      )}
    </Box>
  );
}
