import { useContext } from "react";
import { AppContext } from "../../../../services/AppContext";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import StatusDot from "../common/StatusDot/StatusDot";
import { health } from "../../data/dashboardData";
import "./HealthBar.css";

/** HealthBar — highest item in the visual hierarchy: one-line plant status. */
export default function HealthBar() {
  const { data,charger } = useContext(AppContext);

  const device = data?.[0];
  const chargerDTO = charger[0]?.chargerDTO || {};
  if (!device) {
    return null;
  }

  const health = calculateSystemHealth(device,chargerDTO);

  return (
    <Paper className="health-bar">

      <Box className="health-lead">
        <StatusDot
          status={
            health.state === "Normal"
              ? "ok"
              : health.state === "Warning"
              ? "warn"
              : "fault"
          }
        />

        <div>
          <strong>System health</strong>
          <span>{health.state}</span>
        </div>
      </Box>

{/* 
      <Box className="health-item">
        <span>Cells</span>
        <strong>
          {health.cells.communicating}/{health.cells.total}
        </strong>
      </Box> */}


      <Box className="health-item">
        <span>Communication</span>
        <strong>
          {health.communication.communicating}/
          {health.communication.total}
        </strong>
      </Box>


      <Box className="health-item">
        <span>Active alarms</span>
        <strong>{health.activeAlarms}</strong>
      </Box>


      <Box className="health-links">

        <span>
          <StatusDot
            as="i"
            status={health.subsystems.bms}
            small
          />
          BMS
        </span>

        <span>
          <StatusDot
            as="i"
            status={health.subsystems.charger}
            small
          />
          Charger
        </span>

        <span>
          <StatusDot
            as="i"
            status={health.subsystems.thermal}
            small
          />
          Thermal
        </span>

      </Box>

    </Paper>
  );
}



const NUMERIC_ALARM_FIELDS = [
  "stringVoltageLNH",
  "dcVoltageOLN",
  "acVoltageULN",
];


function isActiveAlarm(value, key) {
  if (NUMERIC_ALARM_FIELDS.includes(key)) {
    return value === 0 || value === 2;
  }

  return value === true;
}


function calculateSystemHealth(device,chargerDTO) {
  const cellData =
    device?.cellVoltageTemperatureData ?? [];

  const bmsAlarmsDTO =
    device?.bmsAlarmsDTO ?? {};




  const combinedData = {
    ...bmsAlarmsDTO,
    ...chargerDTO,
  };


  // ----------------------------------------
  // CELL COMMUNICATION
  // ----------------------------------------

  const EXPECTED_CELL_COUNT = 15;

  const communicatingCells = cellData.filter(
    (cell) => {
      const voltage = Number(cell.cellVoltage);
      const temperature = Number(cell.cellTemperature);

      return (
        voltage !== 65.535
      );
    }
  ).length;


  // ----------------------------------------
  // ACTIVE ALARMS
  // ----------------------------------------

  const activeAlarms = Object.entries(combinedData)
    .filter(([key, value]) =>
      isActiveAlarm(value, key)
    )
    .length;


  // ----------------------------------------
  // COMMUNICATION FAILURE
  // ----------------------------------------

  const cellCommunicationFailure =
    communicatingCells < EXPECTED_CELL_COUNT;

  const bmsCommunicationFailure =
    bmsAlarmsDTO.bmsSedCommunication === true ||
    bmsAlarmsDTO.cellCommunication === true;


  // ----------------------------------------
  // SYSTEM HEALTH
  // ----------------------------------------

  let state = "Normal";

  if (
    cellCommunicationFailure ||
    bmsCommunicationFailure
  ) {
    state = "Critical";
  } else if (activeAlarms > 0) {
    state = "Warning";
  }


  return {
    state,

    cells: {
      total: EXPECTED_CELL_COUNT,
      available: cellData.length,
    },

    communication: {
      total: EXPECTED_CELL_COUNT,
      communicating: communicatingCells,
    },

    activeAlarms,

    subsystems: {
      bms:
        bmsCommunicationFailure
          ? "fault"
          : "ok",

      charger:
        Object.entries(chargerDTO).some(
          ([key, value]) =>
            isActiveAlarm(value, key)
        )
          ? "warn"
          : "ok",

      thermal:
        bmsAlarmsDTO.ambientTemperatureHN === true ||
        bmsAlarmsDTO.cellTemperatureHN === true
          ? "warn"
          : "ok",
    },
  };
}