import { useContext } from "react";
import { Box } from "@mui/material";
import { AppContext } from "../../../../services/AppContext";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle";

const dischargeTime = (totalSeconds = 0) => {
  try {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hr = hours < 10 ? "0" + hours : hours;
    const mn = minutes < 10 ? "0" + minutes : minutes;
    const sc = seconds < 10 ? "0" + seconds : seconds;

    return `${hr}:${mn}:${sc}`;
  } catch (error) {
    return "--";
  }
};

export function Cycles() {
  const { data } = useContext(AppContext);
  const device = data[0];

  if (!device) return <div></div>;
  const {
    chargeTimeCycle,
    systemPeakCurrentInChargeOneCycle,
    dischargeTimeCycle,
    systemPeakCurrentInDischargeOneCycle,
  } = device;

  const Charge = [
    ["Peak current", `${systemPeakCurrentInChargeOneCycle} A`],
    ["Runtime", `${dischargeTime(chargeTimeCycle)}`],
  ];
  const Discharge = [
    ["Peak current", `${systemPeakCurrentInDischargeOneCycle} A`],
    ["Runtime", `${dischargeTime(dischargeTimeCycle)}`],
  ];

  return (
    <Surface className="cycle-card">
      <SectionTitle>Cycle information</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr" },
          gap: { xs: "12px", sm: "6px", md: "8px" },
          minHeight: 0,
          flex: 1,
          overflow: { xs: "visible", sm: "hidden" },
          "& > div + div": {
            pl: { xs: 0, sm: "6px", md: "8px" },
            pt: { xs: "8px", sm: 0, md: 0 },
            borderLeft: {
              xs: "none",
              sm: "1px solid var(--border)",
              md: "1px solid var(--border)",
            },
            borderTop: {
              xs: "1px solid var(--border)",
              sm: "none",
              md: "none",
            },
          },
          "& h3": {
            m: { xs: "0 0 6px", sm: "0 0 2px", md: "0 0 4px" },
            color: "var(--primary)",
            fontSize: { xs: "12px", sm: "9px", md: "10px" },
            letterSpacing: ".06em",
            textTransform: "uppercase",
          },
          "& p": {
            display: "flex",
            justifyContent: "space-between",
            m: { xs: "6px 0", sm: "2px 0", md: "4px 0" },
            color: "var(--muted-foreground)",
            fontSize: { xs: "12px", sm: "10px", md: "10px" },
          },
          "& b": {
            color: "var(--foreground)",
            fontSize: { xs: "14px", sm: "11px", md: "12px" },
            fontVariantNumeric: "tabular-nums",
          },
        }}
      >
        <div>
          <h3>Charge</h3>
          <p>
            <span>Peak current</span>
            <b>{Charge[0][1]}</b>
          </p>
          <p>
            <span>Runtime</span>
            <b>{Charge[1][1]}</b>
          </p>
        </div>
        <div>
          <h3>Discharge</h3>
          <p>
            <span>Peak current</span>
            <b>{Discharge[0][1]}</b>
          </p>
          <p>
            <span>Runtime</span>
            <b>{Discharge[1][1]}</b>
          </p>
        </div>
      </Box>
    </Surface>
  );
}
