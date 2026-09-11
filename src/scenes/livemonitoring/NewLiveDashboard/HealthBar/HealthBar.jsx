import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import StatusDot from "../common/StatusDot/StatusDot";
import { health } from "../../data/dashboardData";
import "./HealthBar.css";

/** HealthBar — highest item in the visual hierarchy: one-line plant status. */
export default function HealthBar() {
  return (
    <Paper className="health-bar">
      <Box className="health-lead">
        <StatusDot status="ok" />
        <div>
          <strong>System health</strong>
          <span>{health.state}</span>
        </div>
      </Box>

      {health.items.map(([label, value]) => (
        <Box className="health-item" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </Box>
      ))}

      <Box className="health-links">
        {health.subsystems.map((name) => (
          <span key={name}>
            <StatusDot as="i" status="ok" small /> {name}
          </span>
        ))}
      </Box>
    </Paper>
  );
}
