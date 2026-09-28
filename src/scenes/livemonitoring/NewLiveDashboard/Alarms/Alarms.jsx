import { useContext } from "react";
import { Box } from "@mui/material";
import { AppContext } from "../../../../services/AppContext";
import CheckIcon from "@mui/icons-material/Check";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import Stack from "@mui/material/Stack";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const NUMERIC_ALARM_FIELDS = new Set([
  "dcVoltageOLN",
  "stringVoltageLNH",
  "acVoltageULN",
]);

function isActiveAlarm(key, value) {
  if (NUMERIC_ALARM_FIELDS.has(key)) {
    return value === 0 || value === 2;
  }
  return value === true;
}

function getAlarmSeverity(key) {
  const criticalAlarms = new Set([
    "dcVoltageOLN",
    "stringVoltageLNH",
    "chargerTrip",
    "cellCommunication",
    "bmsSedCommunication",
    "inputMains",
    "inputPhase",
    "outputMccb",
    "inputFuse",
    "rectifierFuse",
    "filterFuse",
    "outputFuse",
    "alarmSupplyFuse",
  ]);

  const warningAlarms = new Set([
    "batteryCondition",
    "ambientTemperatureHN",
    "socLN",
    "stringCurrentHN",
    "chargerLoad",
    "acVoltageULN",
    "bankDischargeCycle",
    "cellVoltageNH",
    "cellVoltageLN",
    "cellTemperatureHN",
  ]);

  if (criticalAlarms.has(key)) return "critical";
  if (warningAlarms.has(key)) return "warning";
  return "info";
}

function getAlarmLabel(key, value, baseLabel) {
  if (NUMERIC_ALARM_FIELDS.has(key)) {
    if (value === 0) return `${baseLabel} Low`;
    if (value === 2) return `${baseLabel} High`;
  }
  return baseLabel;
}

function getActiveAlarms(combinedData, detailsMap) {
  return Object.entries(detailsMap)
    .filter(([key]) => isActiveAlarm(key, combinedData[key]))
    .map(([key, baseLabel]) => {
      const value = combinedData[key];
      return {
        id: key,
        label: getAlarmLabel(key, value, baseLabel),
        severity: getAlarmSeverity(key),
        value,
      };
    });
}

export function Alarms() {
  const { data, charger } = useContext(AppContext);

  const device = data?.[0];
  if (!device) return null;

  const { bmsAlarmsDTO = {} } = device;
  const chargerDTO = charger?.[0]?.chargerDTO || {};

  const combinedData = {
    ...bmsAlarmsDTO,
    ...chargerDTO,
  };

  const detailsMap = {
    bankDischargeCycle: "Battery Discharging",
    dcVoltageOLN: "DC Voltage",
    cellCommunication: "Cell Communication fail",
    batteryCondition: "Battery Condition Low",
    stringVoltageLNH: "String Voltage",
    stringCurrentHN: "String Current High",
    ambientTemperatureHN: "Ambient Temperature High",
    socLN: "SOC Low",
    chargerLoad: "Charger Load Overload",
    inputMains: "Input Mains fail",
    inputPhase: "Input Phase fail",
    acVoltageULN: "AC Voltage",
    chargerTrip: "Charger Tripped",
    outputMccb: "Output Mccb fail",
    inputFuse: "Input Fuse fail",
    rectifierFuse: "Rectifier Fuse fail",
    filterFuse: "Filter Fuse fail",
    outputFuse: "Output Fuse fail",
    alarmSupplyFuse: "Alarm Supply Fuse fail",
    buzzer: "Buzzer Detected",
    cellTemperatureHN: "Cell Temperature High",
    cellVoltageNH: "Cell Voltage High",
    cellVoltageLN: "Cell Voltage Low",
    acem: "AC Energy Meter fail",
  };

  const items = getActiveAlarms(combinedData, detailsMap);
  const count = items.length;

  return (
    <Surface
      className="alarms-card"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: { xs: 180, sm: 0 },
      }}
    >
      <SectionTitle aside={<span className="alarm-count">{count}</span>}>
        Active alarms
      </SectionTitle>

      {count === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 1.25, sm: 1, md: 1 },
            flex: 1,
            minHeight: 0,
            textAlign: "center",
            px: { xs: 1.5, sm: 1, md: 1 },
            py: { xs: 2, sm: 0, md: 0 },
          }}
        >
          <Box
            sx={{
              display: "grid",
              width: { xs: 44, sm: 36, md: 36 },
              height: { xs: 44, sm: 36, md: 36 },
              placeItems: "center",
              borderRadius: "50%",
              background:
                "color-mix(in oklab, var(--success) 12%, transparent)",
              color: "var(--success)",
            }}
          >
            <CheckIcon sx={{ fontSize: { xs: 26, sm: 22, md: 22 } }} />
          </Box>

          <Box
            component="strong"
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: { xs: "13px", sm: "11px", md: "11px" },
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            System normal
          </Box>

          <Box
            component="p"
            sx={{
              m: 0,
              color: "var(--muted-foreground)",
              fontSize: { xs: "12px", sm: "10px", md: "10px" },
              lineHeight: 1.35,
            }}
          >
            No active alarms detected
          </Box>
        </Box>
      ) : (
        <Stack
          spacing={{ xs: 1, sm: 0.75, md: 0.75 }}
          sx={{
            flex: 1,
            minHeight: 0,
            overflowY: { xs: "visible", sm: "auto" },
            overflowX: "hidden",
            pr: 0.25,
          }}
        >
          {items.map((alarm) => {
            const sev = SEVERITY_STYLE[alarm.severity] ?? SEVERITY_STYLE.info;
            const Icon = sev.Icon;

            return (
              <Box
                key={alarm.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: { xs: 1, sm: 0.75, md: 0.75 },
                  px: { xs: 1, sm: 0.75, md: 0.75 },
                  py: { xs: 1, sm: 0.6, md: 0.6 },
                  borderRadius: "6px",
                  border: `1px solid ${sev.border}`,
                  background: sev.bg,
                  minWidth: 0,
                }}
              >
                <Icon
                  sx={{
                    fontSize: { xs: 16, sm: 14, md: 14 },
                    color: sev.color,
                    mt: "1px",
                    flexShrink: 0,
                  }}
                />

                <Box
                  component="span"
                  sx={{
                    fontSize: { xs: "12px", sm: "10px", md: "10px" },
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: "var(--foreground)",
                    wordBreak: "break-word",
                  }}
                >
                  {alarm.label}
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Surface>
  );
}

const SEVERITY_STYLE = {
  critical: {
    color: "var(--destructive)",
    bg: "color-mix(in oklab, var(--destructive) 12%, transparent)",
    border: "color-mix(in oklab, var(--destructive) 30%, transparent)",
    Icon: ErrorOutlineIcon,
  },
  warning: {
    color: "#b45309",
    bg: "color-mix(in oklab, #f59e0b 14%, transparent)",
    border: "color-mix(in oklab, #f59e0b 32%, transparent)",
    Icon: WarningAmberIcon,
  },
  info: {
    color: "var(--primary)",
    bg: "color-mix(in oklab, var(--primary) 10%, transparent)",
    border: "color-mix(in oklab, var(--primary) 28%, transparent)",
    Icon: InfoOutlinedIcon,
  },
};
