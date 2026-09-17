import { useContext } from "react";
import { Box } from "@mui/material";
import { AppContext } from "../../../../services/AppContext";
import Surface from "../common/Surface/Surface";
import SectionTitle from "../common/SectionTitle/SectionTitle"; 
export function Cumulative() {

        const {
          data,
        }=useContext(AppContext)
      const device = data[0];

        if (!device) return <div></div>;
       const {
        chargeOrDischargeCycle, 
        cumulativeAHIn, 
        cumulativeAHOut,
        totalChargingEnergy,
        totalDischargingEnergy,
        batteryRunHours
      } = device;
  const datas = [
    ["Cycle count", chargeOrDischargeCycle],
    ["Ampere hour in", `${cumulativeAHIn} Ah`],
    ["Ampere hour out", `${cumulativeAHOut} Ah`],
    ["Charging energy", `${totalChargingEnergy} kWh`],
    ["Discharging energy", `${totalDischargingEnergy} kWh`],
    ["Battery run hours", `${batteryRunHours}`],
  ];
  return (
    <Surface className="cumulative-card">
      <SectionTitle>Cumulative</SectionTitle>
      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4px 10px",
          m: 0,
          minHeight: 0,
          flex: 1,
          overflow: "hidden",
          alignContent: "start",
          "& div": {
            display: "flex",
            justifyContent: "space-between",
            gap: "8px",
            pb: "3px",
            borderBottom: "1px solid color-mix(in oklab, var(--border) 65%, transparent)",
            fontSize: "10px",
          },
          "& dt": { color: "var(--muted-foreground)" },
          "& dd": { m: 0, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
        }}
      >
        {datas.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </Box>
    </Surface>
  );
}