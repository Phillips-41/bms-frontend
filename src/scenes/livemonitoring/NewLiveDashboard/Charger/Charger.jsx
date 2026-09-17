import {useContext} from "react"
import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import StatusDot from "../common/StatusDot/StatusDot";
import { AppContext } from "../../../../services/AppContext";
import "./Charger.css";

const STATE = {
  charging: { label: "Charging", dot: "ok" },
  idle: { label: "Idle", dot: "warn" },
  fault: { label: "Fault", dot: "fault" },
};


/** Charger — AC voltage/current/energy/frequency plus a compact status chip. */
export default function Charger() {
const {
  data,
      charger

    }=useContext(AppContext)
 


  if (!charger) return <div></div>;
  const device = data?.[0];

  if (!device) {
    return null;
  }

  const { bmsAlarmsDTO = {} } = device;
  const {bankDischargeCycle} = bmsAlarmsDTO;

    const{acVoltage,acCurrent ,frequency ,energy}=charger[0];
    const chargerDTO = charger[0]?.chargerDTO || {};

 const chargers = {
  status: !bankDischargeCycle?"charging":"discharging",
  readings: [
    ["AC voltage", `${acVoltage} V`],
    ["AC current",` ${acCurrent} A`],
    ["AC energy", `${energy} kWh`],
    ["Frequency", `${frequency} Hz`],
  ],
};
  const state = STATE[chargers.status] ?? STATE.idle;

  return (
    <Surface className="charger-card">
      <SectionTitle
        aside={
          <span className={`charger-state ${chargers.status}`}>
            <StatusDot as="i" status={state.dot} small /> {state.label}
          </span>
        }
      >
        Charger information
      </SectionTitle>

      <Box className="charger-grid">
        {chargers.readings.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </Box>
    </Surface>
  );
}
