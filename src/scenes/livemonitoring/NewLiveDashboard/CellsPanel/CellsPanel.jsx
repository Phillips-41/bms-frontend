import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import StatusDot from "../common/StatusDot/StatusDot";
import { cells, cellsSummary } from "../../data/dashboardData";
import "./CellsPanel.css";

/** Display labels + CSS modifier for each cell status. */
const STATUS_META = {
  normal: { label: "Normal", className: "status-normal" },
  high_voltage: { label: "High V", className: "status-high-v" },
  high_temperature: { label: "High Temp", className: "status-high-temp" },
  low_voltage: { label: "Low V", className: "status-low-v" },
  about_to_die: { label: "About to die", className: "status-die" },
  open_battery: { label: "Open battery", className: "status-open" },
};

/** One compact cell row: ID · voltage · temp · colored status chip. */
function CellRow({ index, voltage, temperature, status }) {
  const id = `C${String(index + 1).padStart(2, "0")}`;
  const meta = STATUS_META[status] ?? STATUS_META.normal;

  return (
    <Box
      className="cell-row"
      tabIndex={0}
      title={`Cell ${id}: ${voltage.toFixed(3)} V, ${temperature}°C, ${meta.label}`}
    >
      <Box className="cell-top">
        <strong>{id}</strong>
        <StatusDot status={status === "normal" ? "ok" : status === "about_to_die" || status === "open_battery" ? "fault" : "warn"} small />
      </Box>
      <Box className="cell-values">
        <b>{voltage.toFixed(3)} V</b>
        <span>{temperature}°C</span>
        <span className={`cell-status-chip ${meta.className}`}>{meta.label}</span>
      </Box>
    </Box>
  );
}

/** CellsPanel — fixed-width left rail listing all 15 battery cells. */
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
        <span className="healthy-tag">
          <StatusDot as="i" status="ok" small /> Healthy
        </span>
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
        <span>Average {cellsSummary.average}</span>
        <span>{cellsSummary.delta}</span>
      </Box>
    </Surface>
  );
}
