import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";
import { stateOfCharge } from "../../data/dashboardData";
import "./StateOfCharge.css";

/** StateOfCharge — SOC percentage with depth-of-discharge readout. */
export default function StateOfCharge() {
  const { soc, dod } = stateOfCharge;

  return (
    <Surface className="soc-card">
      <SectionTitle>State of charge</SectionTitle>

      <Box className="soc-value">
        {soc}
        <span>%</span>
      </Box>

      <LinearProgress
        variant="determinate"
        value={soc}
        className="progress-track"
        sx={{
          flexShrink: 0,
          "& .MuiLinearProgress-bar": { backgroundColor: "var(--primary)" },
        }}
      />

      <Box className="soc-footer">
        <span>
          SOC <b>{soc}%</b>
        </span>
        <span>
          DOD <b>{dod}%</b>
        </span>
      </Box>
    </Surface>
  );
}
