import { Grid, useTheme } from "@mui/material";
import { useContext } from "react";
import { tokens } from "../../theme";
import { AppContext } from "../../services/AppContext";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from "@mui/icons-material/Check";

import CellsPanel from "./NewLiveDashboard/CellsPanel/CellsPanel";
import StateOfCharge from "./NewLiveDashboard/StateOfCharge/StateOfCharge";
import Charger from "./NewLiveDashboard/Charger/Charger";
import LiveBattery from "./NewLiveDashboard/LiveBattery/LiveBattery";
import Header from "./NewLiveDashboard/Header/Header";
import HealthBar from "./NewLiveDashboard/HealthBar/HealthBar";
import Surface from "./NewLiveDashboard/common/Surface/Surface";
import SectionTitle from "./NewLiveDashboard/common/SectionTitle/SectionTitle";

const Livemonitoring = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data, charger } = useContext(AppContext);

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Dashboard />
      {data[0] && charger ? <></> : <></>}
    </Box>
  );
};

export default Livemonitoring;

/**
 * Dashboard — fills the remaining outlet height.
 * Header + HealthBar take intrinsic height; the main grid (cells + operations)
 * expands with flex:1 / minHeight:0 so nothing overflows or scrolls on desktop.
 */
function Dashboard() {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        height: "100%",
        minHeight: 0,
        overflow: "hidden",
        background: "var(--background)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          minHeight: 0,
          maxWidth: 1920,
          mx: "auto",
          gap: { xs: "4px", md: "5px", lg: "6px" },
          p: { xs: "4px", md: "5px", lg: "6px" },
          boxSizing: "border-box",
        }}
      >
        {/* Fixed-height chrome */}
        <Header />
        <HealthBar />

        {/* Main body — takes all remaining height */}
        <Box
          sx={{
            display: "grid",
            minHeight: 0,
            flex: 1,
            gridTemplateColumns: {
              xs: "1fr",
              md: "180px minmax(0, 1fr)",
              lg: "200px minmax(0, 1fr)",
              xl: "220px minmax(0, 1fr)",
            },
            gap: { xs: "4px", md: "5px", lg: "6px" },
            overflow: "hidden",
          }}
        >
          {/* Left rail — cells list fills height */}
          <Box
            sx={{
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
              display: { xs: "none", md: "block" },
            }}
          >
            <CellsPanel />
          </Box>

          {/* Right operations grid — shares remaining height via fr rows */}
          <Box
            sx={{
              display: "grid",
              minWidth: 0,
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(12, minmax(0, 1fr))",
              },
              gridTemplateRows: {
                xs: "auto",
                md: "minmax(0, 0.28fr) minmax(0, 0.14fr) minmax(0, 0.26fr) minmax(0, 0.22fr) minmax(0, 0.1fr)",
              },
              gap: { xs: "4px", md: "4px", lg: "5px" },
            }}
          >
            <Box sx={{ gridColumn: { xs: "1", md: "span 6" }, minHeight: 0, overflow: "hidden" }}>
              <LiveBattery />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "span 6" }, minHeight: 0, overflow: "hidden" }}>
              <StateOfCharge />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" }, minHeight: 0, overflow: "hidden" }}>
              <Charger />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "span 6" }, minHeight: 0, overflow: "hidden" }}>
              <Cumulative />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "span 6" }, minHeight: 0, overflow: "hidden" }}>
              <Cycles />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "span 6" }, minHeight: 0, overflow: "hidden" }}>
              <BarChart
                title="Discharge current"
                bars={[
                  { label: "Average", value: "0.084 A", height: 30 },
                  { label: "Peak", value: "2.0538 A", height: 78 },
                ]}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "span 6" }, minHeight: 0, overflow: "hidden" }}>
              <BarChart
                title="Charge / discharge ampere-hour"
                bars={[
                  { label: "Ah In", value: "10.327", height: 84 },
                  { label: "Ah Out", value: "0.445", height: 22 },
                ]}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" }, minHeight: 0, overflow: "hidden" }}>
              <Alarms />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Cumulative() {
  const data = [
    ["Cycle count", "39"],
    ["Ampere hour in", "755.526 Ah"],
    ["Ampere hour out", "233.719 Ah"],
    ["Charging energy", "25.8736 kWh"],
    ["Discharging energy", "1.1594 kWh"],
    ["Battery run hours", "03:42:50"],
  ];
  return (
    <Surface className="cumulative-card">
      <SectionTitle>Cumulative</SectionTitle>
      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2px 7px",
          m: 0,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          "& div": {
            display: "flex",
            justifyContent: "space-between",
            gap: "6px",
            pb: "2px",
            borderBottom: "1px solid color-mix(in oklab, var(--border) 65%, transparent)",
            fontSize: "6px",
          },
          "& dt": { color: "var(--muted-foreground)" },
          "& dd": { m: 0, fontWeight: 700, fontVariantNumeric: "tabular-nums" },
        }}
      >
        {data.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </Box>
    </Surface>
  );
}

function BarChart({ title, bars }) {
  return (
    <Surface className="chart-card">
      <SectionTitle>{title}</SectionTitle>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          minHeight: 0,
          flex: 1,
          alignItems: "flex-end",
          justifyContent: "space-around",
          gap: "8px",
          px: "6%",
          pt: "8px",
          borderBottom: "1px solid var(--border)",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "8px 0 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            pointerEvents: "none",
            "& i": {
              borderTop: "1px dashed color-mix(in oklab, var(--border) 65%, transparent)",
            },
          }}
        >
          <i />
          <i />
          <i />
        </Box>
        {bars.map((bar) => (
          <Box
            key={bar.label}
            sx={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              width: "30%",
              height: "100%",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "flex-end",
              "& b": {
                mt: "2px",
                color: "var(--muted-foreground)",
                fontSize: "6px",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                mb: "2px",
                color: "var(--foreground)",
                fontSize: "6px",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {bar.value}
            </Box>
            <Tooltip title={`${bar.label}: ${bar.value}`} arrow placement="top">
              <Box
                tabIndex={0}
                sx={{
                  position: "relative",
                  width: "min(40px, 75%)",
                  minHeight: "4px",
                  height: `${bar.height}%`,
                  borderRadius: "3px 3px 0 0",
                  background: "var(--primary)",
                  transition: "filter 140ms, transform 140ms",
                  transformOrigin: "bottom",
                  "&:hover, &:focus": {
                    filter: "saturate(1.25)",
                    transform: "scaleY(1.02)",
                    outline: "none",
                  },
                }}
              />
            </Tooltip>
            <b>{bar.label}</b>
          </Box>
        ))}
      </Box>
    </Surface>
  );
}

function Alarms() {
  return (
    <Surface className="alarms-card">
      <SectionTitle aside={<span className="alarm-count">0</span>}>Active alarms</SectionTitle>
      <Stack
        direction="row"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          height: "100%",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            display: "grid",
            width: 20,
            height: 20,
            placeItems: "center",
            borderRadius: "50%",
            background: "color-mix(in oklab, var(--success) 10%, transparent)",
            color: "var(--success)",
          }}
        >
          <CheckIcon sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Box
            component="strong"
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: "7px",
              textTransform: "uppercase",
            }}
          >
            System normal
          </Box>
          <Box
            component="p"
            sx={{ m: "1px 0 0", color: "var(--muted-foreground)", fontSize: "6px" }}
          >
            No active alarms detected
          </Box>
        </Box>
      </Stack>
    </Surface>
  );
}

function Cycles() {
  return (
    <Surface className="cycle-card">
      <SectionTitle>Cycle information</SectionTitle>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
          "& > div + div": {
            pl: "6px",
            borderLeft: "1px solid var(--border)",
          },
          "& h3": {
            m: "0 0 2px",
            color: "var(--primary)",
            fontSize: "6px",
            letterSpacing: ".08em",
            textTransform: "uppercase",
          },
          "& p": {
            display: "flex",
            justifyContent: "space-between",
            m: "2px 0",
            color: "var(--muted-foreground)",
            fontSize: "6px",
          },
          "& b": {
            color: "var(--foreground)",
            fontSize: "8px",
          },
        }}
      >
        <div>
          <h3>Charge</h3>
          <p>
            <span>Peak current</span>
            <b>2.5 A</b>
          </p>
          <p>
            <span>Runtime</span>
            <b>122:53</b>
          </p>
        </div>
        <div>
          <h3>Discharge</h3>
          <p>
            <span>Peak current</span>
            <b>2.2 A</b>
          </p>
          <p>
            <span>Runtime</span>
            <b>00:13</b>
          </p>
        </div>
      </Box>
    </Surface>
  );
}
