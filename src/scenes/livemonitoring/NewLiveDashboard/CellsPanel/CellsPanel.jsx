import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import StatusDot from "../common/StatusDot/StatusDot";
import { cells, cellsSummary } from "../../data/dashboardData";
import "./CellsPanel.css";

/** One compact cell row: ID + status · voltage · temp · SG on a single line. */
function CellRow({ index, voltage, temperature, gravity }) {
  const id = `C${String(index + 1).padStart(2, "0")}`;
  return (
    <Box
      className="cell-row"
      tabIndex={0}
      title={`Cell ${id}: ${voltage.toFixed(3)} V, ${temperature}°C, SG ${gravity.toFixed(3)}`}
    >
      <Box className="cell-top">
        <strong>{id}</strong>
        <StatusDot status="ok" small />
      </Box>
      <Box className="cell-values">
        <b>{voltage.toFixed(3)} V</b>
        <span>{temperature}°C</span>
        <span>SG {gravity.toFixed(3)}</span>
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
        {cells.map(([voltage, temperature, gravity], index) => (
          <CellRow
            key={index}
            index={index}
            voltage={voltage}
            temperature={temperature}
            gravity={gravity}
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
