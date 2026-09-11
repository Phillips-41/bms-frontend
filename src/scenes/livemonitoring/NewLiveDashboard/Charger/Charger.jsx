import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import StatusDot from "../common/StatusDot/StatusDot";
import { charger } from "../../data/dashboardData";
import "./Charger.css";

const STATE = {
  charging: { label: "Charging", dot: "ok" },
  idle: { label: "Idle", dot: "warn" },
  fault: { label: "Fault", dot: "fault" },
};

/** Charger — AC voltage/current/energy/frequency plus a compact status chip. */
export default function Charger() {
  const state = STATE[charger.status] ?? STATE.idle;

  return (
    <Surface className="charger-card">
      <SectionTitle
        aside={
          <span className={`charger-state ${charger.status}`}>
            <StatusDot as="i" status={state.dot} small /> {state.label}
          </span>
        }
      >
        Charger information
      </SectionTitle>

      <Box className="charger-grid">
        {charger.readings.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </Box>
    </Surface>
  );
}
