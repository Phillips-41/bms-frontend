import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import StatusDot from "../common/StatusDot/StatusDot";
import { cells, cellsSummary } from "../../data/dashboardData";
import "./CellsPanel.css";

/** Short chip label + full title for tooltip. */
const STATUS_META = {
  normal: { label: "OK", full: "Normal", className: "status-normal", dot: "ok" },
  high_voltage: { label: "High V", full: "High voltage", className: "status-high-v", dot: "warn" },
  high_temperature: { label: "High T", full: "High temperature", className: "status-high-temp", dot: "warn" },
  low_voltage: { label: "Low V", full: "Low voltage", className: "status-low-v", dot: "warn" },
  about_to_die: { label: "Die", full: "About to die", className: "status-die", dot: "fault" },
  open_battery: { label: "Open", full: "Open battery", className: "status-open", dot: "fault" },
};

function CellRow({ index, voltage, temperature, status }) {
  const id = `C${String(index + 1).padStart(2, "0")}`;
  const meta = STATUS_META[status] ?? STATUS_META.normal;

  return (
    <Box
      className="cell-row"
      tabIndex={0}
      title={`${id}: ${voltage.toFixed(3)} V · ${temperature}°C · ${meta.full}`}
    >
      <span className="cell-id">{id}</span>
      <span className="cell-v">{voltage.toFixed(3)} V</span>
      <span className="cell-t">{temperature}°</span>
      <span className={`cell-status-chip ${meta.className}`}>{meta.label}</span>
    </Box>
  );
}

export default function CellsPanel() {
  return (
    <Surface className="cells-panel">
      <Box className="cells-header">
        <div>
          <h2>Battery cells</h2>
          <p>
            {cellsSummary.normal} / {cellsSummary.total} normal
          </p>
        </div>
        <span className="healthy-tag">Healthy</span>
      </Box>

      <Box className="cells-list">
        {cells.map(([voltage, temperature, status], index) => (
          <CellRow
            key={index}
            index={index}
            voltage={voltage}
            temperature={temperature}
            status={status}
          />
        ))}
      </Box>

      <Box className="cells-footer">
        <span>Avg {cellsSummary.average}</span>
        <span>{cellsSummary.delta}</span>
      </Box>
    </Surface>
  );
}
