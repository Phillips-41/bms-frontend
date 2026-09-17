import {useContext} from "react"
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import { stateOfCharge } from "../../data/dashboardData";
import "./StateOfCharge.css";
import { AppContext } from "../../../../services/AppContext";
/** StateOfCharge — SOC percentage with depth-of-discharge readout. */
export default function StateOfCharge() {

  const {
    data,
          charger
        }=useContext(AppContext)
          const device = data[0];
      if (!charger) return <div></div>;
    const{socLatestValueForEveryCycle,dodLatestValueForEveryCycle}=device


  return (
    <Surface className="soc-card">
      <SectionTitle>State of charge</SectionTitle>

      <Box className="soc-value">
        {socLatestValueForEveryCycle}
        <span>%</span>
      </Box>

      <LinearProgress
        variant="determinate"
        value={socLatestValueForEveryCycle}
        className="progress-track"
        sx={{
          flexShrink: 0,
          "& .MuiLinearProgress-bar": { backgroundColor: "var(--primary)" },
        }}
      />

      <Box className="soc-footer">
        <span>
          SOC <b>{socLatestValueForEveryCycle}%</b>
        </span>
        <span>
          DOD <b>{dodLatestValueForEveryCycle}%</b>
        </span>
      </Box>
    </Surface>
  );
}
