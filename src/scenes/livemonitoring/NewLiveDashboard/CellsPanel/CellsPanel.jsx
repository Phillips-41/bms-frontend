import {useContext} from "react";
import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import StatusDot from "../common/StatusDot/StatusDot";
import { AppContext } from "../../../../services/AppContext";
import { cells, cellsSummary } from "../../data/dashboardData";

import "./CellsPanel.css";

/** Short chip label + full title for tooltip. */
 

const STATUS_META = {
  normal: {
    label: "OK",
    full: "Normal",
    className: "status-normal",
    dot: "ok",
  },

  high_voltage: {
    label: "High V",
    full: "High voltage",
    className: "status-high-v",
    dot: "warn",
  },

  high_temperature: {
    label: "High T",
    full: "High temperature",
    className: "status-high-temp",
    dot: "warn",
  },

  low_voltage: {
    label: "Low V",
    full: "Low voltage",
    className: "status-low-v",
    dot: "warn",
  },

  about_to_die: {
    label: "Die",
    full: "About to die",
    className: "status-die",
    dot: "fault",
  },

  open_battery: {
    label: "Open",
    full: "Open battery",
    className: "status-open",
    dot: "fault",
  },

  communication_failed: {
    label: "N/C",
    full: "Communication failed",
    className: "status-communication",
    dot: "fault",
  },
};


function getCellStatus(cell, thresholds, bmsAlarmsDTO) {
  const cellVoltage = Number(cell.cellVoltage);
  const cellTemperature = Number(cell.cellTemperature);

  const {
    HighVoltage,
    LowVoltage,
    highTemperature,
    BatteryAboutToDie,
    OpenBattery,
  } = thresholds;

  const {
    cellVoltageLN,
    cellVoltageNH,
    cellTemperatureHN,
  } = bmsAlarmsDTO ?? {};


  // 1. Communication failure
  if (
    cellVoltage === 65.535 
  ) {
    return "communication_failed";
  }


  // 2. Open battery
  if (
    cellVoltage <= parseFloat(OpenBattery)
  ) {
    return "open_battery";
  }


  // 3. Battery about to die
  if (
    cellVoltage <= parseFloat(BatteryAboutToDie) &&
    cellVoltage >= parseFloat(OpenBattery)
  ) {
    return "about_to_die";
  }


  // 4. Low voltage
  // Only check when Low Voltage alarm is enabled
  if (
    cellVoltageLN &&
    cellVoltage <= parseFloat(LowVoltage)
  ) {
    return "low_voltage";
  }


  // 5. High voltage
  // Only check when High Voltage alarm is enabled
  if (
    cellVoltageNH &&
    cellVoltage >= parseFloat(HighVoltage)
  ) {
    return "high_voltage";
  }


  // 6. High temperature
  // Only check when High Temperature alarm is enabled
  if (
    cellTemperatureHN &&
    cellTemperature >= parseFloat(highTemperature)
  ) {
    return "high_temperature";
  }


  // 7. Normal
  return "normal";
}


function CellRow({
  cellNumber,
  voltage,
  temperature,
  status,
}) {
  const id = `C${String(cellNumber).padStart(2, "0")}`;

  const meta =
    STATUS_META[status] ?? STATUS_META.normal;

   

  return (
    <Box
      className="cell-row"
      tabIndex={0}
      title={`${id}: ${voltage.toFixed(3)} V · ${temperature}°C · ${meta.full}`}
    >
      <span className="cell-id">{id}</span>

      <span className="cell-v">
        {voltage==65.535?"N/A":`${voltage.toFixed(3)} V`}
      </span>

      <span className="cell-t">
        {voltage==65.535?"N/A":`${temperature}°`}
      </span>

      <span
        className={`cell-status-chip ${meta.className}`}
      >
        {meta.label}
      </span>
    </Box>
  );
}


export default function CellsPanel() {
  const {
    data
  } = useContext(AppContext);

  const device = data?.[0];
 const { bmsAlarmsDTO} = device;
  if (!device) {
    return <div></div>;
  }

  const {
    cellVoltageTemperatureData = [],
  } = device;

  const thresholds = CellThresholdValues();


  // Convert API data into UI cell data
  const cells = cellVoltageTemperatureData.map((cell) => ({
    id: cell.id,

    cellNumber: cell.cellNumber,

    voltage: Number(cell.cellVoltage),

    temperature: Number(cell.cellTemperature),

    status: getCellStatus(
      cell,
      thresholds,
      bmsAlarmsDTO
    ),
  }));


  const normalCount = cells.filter(
    (cell) => cell.status === "normal"
  ).length;


  return (
    <Surface className="cells-panel">

      <Box className="cells-header">
        <div>
          <h2>Battery cells</h2>

          <p>
            {normalCount} / {cells.length} normal
          </p>
        </div>

        <span className="healthy-tag">
          {normalCount === cells.length
            ? "Healthy"
            : "Alert"}
        </span>
      </Box>


      <Box className="cells-list">

        {cells.map((cell, index) => (
          <CellRow
            key={cell.id ?? index}
            cellNumber={cell.cellNumber}
            voltage={cell.voltage}
            temperature={cell.temperature}
            status={cell.status}
          />
        ))}

      </Box>

    </Surface>
  );
}

  const CellThresholdValues = () => {
    const {
      Mdata = {} 
      }=useContext(AppContext)
  
    if (!Mdata) {
      return { // Default values to prevent crashes
        HighVoltage: 0,
        LowVoltage: 0,
        highTemperature: 0,
        BatteryAboutToDie: false,
        OpenBattery: false,
      };
    }
    const{
      highVoltage  ,
      lowVoltage  ,
      batteryAboutToDie  ,
      openBattery  ,
      highTemperature  ,
      lowTemperature  ,
      notCommnVoltage  ,
      notCommnTemperature  ,
      }=Mdata ||{}
  
    return {
      HighVoltage: highVoltage || 0,
      LowVoltage: lowVoltage || 0,
      highTemperature: highTemperature || 0,
      BatteryAboutToDie: batteryAboutToDie || false,
      OpenBattery: openBattery || false,
    };
  };
