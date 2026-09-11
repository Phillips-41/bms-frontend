import { useTheme } from "@mui/material";
import { useContext } from "react";
import { tokens } from "../../theme";
import { AppContext } from "../../services/AppContext";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
 * Layout (desktop):
 *  [ Cells panel ] | [ Middle operations ] | [ Alarms vertical rail ]
 *
 * Middle rows (top → bottom):
 *  1. LiveBattery + StateOfCharge  (compact)
 *  2. Charger                      (full middle width)
 *  3. Cumulative + Cycles
 *  4. Chart + Chart
 *
 * Height is shared with fr + minmax floors so nothing scrolls and text stays readable.
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
        <Header />
        <HealthBar />

        {/* 3-column body: cells | middle | alarms */}
        <Box
          sx={{
            display: "grid",
            minHeight: 0,
            flex: 1,
            gridTemplateColumns: {
              xs: "1fr",
              md: "170px minmax(0, 1fr) 150px",
              lg: "190px minmax(0, 1fr) 170px",
              xl: "210px minmax(0, 1fr) 190px",
            },
            gap: { xs: "4px", md: "5px", lg: "6px" },
            overflow: "hidden",
          }}
        >
          {/* Left — cells */}
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

          {/* Middle — operations (4 rows) */}
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
                // Live/SOC compact | Charger | Cumulative+Cycles | Charts
                md: "minmax(64px, 0.18fr) minmax(52px, 0.14fr) minmax(90px, 0.34fr) minmax(100px, 0.34fr)",
              },
              gap: { xs: "4px", md: "5px", lg: "6px" },
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
          </Box>

          {/* Right — vertical Alarms rail (full height of body) */}
          <Box
            sx={{
              minHeight: 0,
              height: "100%",
              overflow: "hidden",
              display: { xs: "none", md: "block" },
            }}
          >
            <Alarms />
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
          pt: "6px",
          borderBottom: "1px solid var(--border)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: "6px 0 12px",
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
                mt: "3px",
                color: "var(--muted-foreground)",
                fontSize: "10px",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                mb: "3px",
                color: "var(--foreground)",
                fontSize: "10px",
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
                  width: "min(44px, 75%)",
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

/** Vertical alarms rail — full height of the main body, rightmost column. */
function Alarms() {
  return (
    <Surface
      className="alarms-card"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <SectionTitle aside={<span className="alarm-count">0</span>}>Active alarms</SectionTitle>

      <Stack
        spacing={1}
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          alignItems: "stretch",
          justifyContent: "flex-start",
          py: 0.5,
        }}
      >
        {/* Empty / normal state */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            flex: 1,
            textAlign: "center",
            px: 1,
          }}
        >
          <Box
            sx={{
              display: "grid",
              width: 36,
              height: 36,
              placeItems: "center",
              borderRadius: "50%",
              background: "color-mix(in oklab, var(--success) 12%, transparent)",
              color: "var(--success)",
            }}
          >
            <CheckIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box
            component="strong"
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: "11px",
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
              fontSize: "10px",
              lineHeight: 1.35,
            }}
          >
            No active alarms detected
          </Box>
        </Box>

        {/* When alarms exist, map them here as vertical list items, e.g.:
            {alarms.map(a => (
              <Box key={a.id} sx={{ p: 1, borderRadius: 1, border: "1px solid ...", fontSize: 11 }}>
                ...
              </Box>
            ))}
        */}
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
          gap: "8px",
          minHeight: 0,
          flex: 1,
          overflow: "hidden",
          "& > div + div": {
            pl: "8px",
            borderLeft: "1px solid var(--border)",
          },
          "& h3": {
            m: "0 0 4px",
            color: "var(--primary)",
            fontSize: "10px",
            letterSpacing: ".06em",
            textTransform: "uppercase",
          },
          "& p": {
            display: "flex",
            justifyContent: "space-between",
            m: "4px 0",
            color: "var(--muted-foreground)",
            fontSize: "10px",
          },
          "& b": {
            color: "var(--foreground)",
            fontSize: "12px",
            fontVariantNumeric: "tabular-nums",
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
