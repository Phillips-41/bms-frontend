import {useContext} from "react"
import Box from "@mui/material/Box";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import { liveMetrics } from "../../data/dashboardData";
import { AppContext } from "../../../../services/AppContext";
import "./LiveBattery.css";

/** LiveBattery — real-time voltage, current and temperature. */
export default function LiveBattery() {
   const {
  
        data
  
      }=useContext(AppContext)
    const device = data[0];
    if (!device ) return <div></div>;
  const{instantaneousCurrent, stringvoltage,ambientTemperature}=device
 const liveMetrics = [
  ["Voltage", stringvoltage, "V"],
  ["Current", instantaneousCurrent, "A"],
  ["Temperature", ambientTemperature, "°C"],
];
  return (
    <Surface className="live-card">
      <SectionTitle >
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
