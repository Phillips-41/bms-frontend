import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import { liveMetrics } from "../../data/dashboardData";
import "./LiveBattery.css";

/** LiveBattery — real-time voltage, current and temperature. */
export default function LiveBattery() {
  return (
    <Surface className="live-card">
      <SectionTitle aside={<span className="subtle-label">Real-time · 1 Hz</span>}>
        Live battery status
      </SectionTitle>
      <Box className="metric-grid">
        {liveMetrics.map(([label, value, unit]) => (
          <Box className="metric" key={label}>
            <span>{label}</span>
            <strong>
              {value}
              <small>{unit}</small>
            </strong>
          </Box>
        ))}
      </Box>
    </Surface>
  );
}
