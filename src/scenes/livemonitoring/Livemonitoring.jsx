import { useTheme } from "@mui/material";
import { useContext } from "react";
import { tokens } from "../../theme";
import { AppContext } from "../../services/AppContext";
import Box from "@mui/material/Box";

import CellsPanel from "./NewLiveDashboard/CellsPanel/CellsPanel";
import StateOfCharge from "./NewLiveDashboard/StateOfCharge/StateOfCharge";
import Charger from "./NewLiveDashboard/Charger/Charger";
import LiveBattery from "./NewLiveDashboard/LiveBattery/LiveBattery";
import Header from "./NewLiveDashboard/Header/Header";
import HealthBar from "./NewLiveDashboard/HealthBar/HealthBar";

import { alarms as mockAlarms } from "./data/dashboardData";
import { Cumulative } from "./NewLiveDashboard/Cumulative/Cumulative";
import { Cycles } from "./NewLiveDashboard/Cycles/Cycles";
import { BarChart } from "./NewLiveDashboard/BarChart/BarChart";
import { Alarms } from "./NewLiveDashboard/Alarms/Alarms";
import DocumentViewer from "./NewLiveDashboard/DocumentViewer/DocumentViewer";

/**
 * MUI breakpoints used throughout:
 *   xs  0–599px     mobile      → single column, page scrolls
 *   sm  600–899px   tablet      → 2-col layout, no page scroll
 *   md  900–1199px  small desk  → 3-col layout, no scroll (desktop design)
 *   lg  1200–1535px desktop     → 3-col wider sides, no scroll
 *   xl  1536px+     large       → 3-col widest sides, no scroll
 */
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
        overflow: { xs: "auto", sm: "hidden" },
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

function Dashboard() {
  const { data, Mdata = {} } = useContext(AppContext);
  const isDevice = data[0] === undefined ? true : false;

  if (isDevice)
    return (
      <div>
        <Header />
        <AlarmsRail Mdata={Mdata} />
      </div>
    );

  const { ahInForOneChargeCycle, ahOutForOneDischargeCycle } = data[0] || {};

  return (
    <Box
      component="main"
      sx={{
        height: { xs: "auto", sm: "100%" },
        minHeight: { xs: "100%", sm: 0 },
        width: "100%",
        overflow: { xs: "visible", sm: "hidden" },
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        boxSizing: "border-box",
        p: { xs: "4px", sm: "4px", md: "5px", lg: "6px" },
        gap: { xs: "4px", sm: "4px", md: "5px", lg: "6px" },
      }}
    >
      <Box sx={{ flex: "0 0 auto", minHeight: 0 }}>
        <Header />
      </Box>

      <Box sx={{ flex: "0 0 auto", minHeight: 0 }}>
        <HealthBar />
      </Box>

      <Box
        sx={{
          flex: { xs: "0 0 auto", sm: "1 1 auto" },
          minHeight: { xs: "auto", sm: 0 },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "minmax(0, 1fr) 140px",
            md: "200px minmax(0, 1fr) 168px",
            lg: "220px minmax(0, 1fr) 180px",
            xl: "240px minmax(0, 1fr) 200px",
          },
          gap: { xs: "4px", sm: "4px", md: "5px", lg: "10px" },
          overflow: { xs: "visible", sm: "hidden" },
        }}
      >
        {/* left: CellsPanel — desktop only */}
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

        {/* centre: operations grid */}
        <Box
          sx={{
            display: "grid",
            minWidth: 0,
            minHeight: { xs: "auto", sm: 0 },
            height: { xs: "auto", sm: "100%" },
            overflow: { xs: "visible", sm: "hidden" },
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(12, minmax(0, 1fr))",
            },
            /* tablet: shrink upper rows, give cells ~2.6fr so they stay readable */
            gridTemplateRows: {
              xs: "none",
              sm: "minmax(0, 0.7fr) minmax(0, 0.55fr) minmax(0, 1.05fr) minmax(0, 1.0fr) minmax(0, 2.6fr)",
              md: "1.1fr 0.9fr 1.6fr 1.6fr",
            },
            gap: { xs: "4px", sm: "4px", md: "5px", lg: "8px" },
          }}
        >
          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1", md: "span 6" },
              minHeight: { xs: 80, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <LiveBattery />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1", sm: "2", md: "span 6" },
              minHeight: { xs: 80, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <StateOfCharge />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1 / -1", md: "1 / -1" },
              minHeight: { xs: 64, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <Charger />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1", md: "span 6" },
              minHeight: { xs: 100, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <Cumulative />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1", sm: "2", md: "span 6" },
              minHeight: { xs: 100, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <Cycles />
          </Box>

          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1", md: "span 6" },
              minHeight: { xs: 140, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <BarChart
              title="Average current"
              bars={[
                { label: "Charging", value: "0.084 A", height: 30 },
                { label: "Discharging", value: "2.0538 A", height: 78 },
              ]}
            />
          </Box>
          <Box
            sx={{
              gridColumn: { xs: "1", sm: "2", md: "span 6" },
              minHeight: { xs: 140, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <BarChart
              title="Charge / discharge ampere-hour"
              bars={[
                { label: "Ah In", value: `${ahInForOneChargeCycle}`, height: 84 },
                { label: "Ah Out", value: `${ahOutForOneDischargeCycle}`, height: 22 },
              ]}
            />
          </Box>

          {/* CellsPanel — xs/sm only (bottom of centre). md+ uses left rail. */}
          <Box
            sx={{
              gridColumn: { xs: "1", sm: "1 / -1" },
              display: { xs: "block", md: "none" },
              minHeight: { xs: 280, sm: 0 },
              height: { xs: "auto", sm: "100%" },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <CellsPanel />
          </Box>
        </Box>

        {/* right: Alarms — sm+ */}
        <Box
          sx={{
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            display: { xs: "none", sm: "block" },
          }}
        >
          <Alarms items={mockAlarms} />
        </Box>

        {/* Mobile-only Alarms */}
        <Box
          sx={{
            gridColumn: "1",
            display: { xs: "block", sm: "none" },
            minHeight: 200,
            overflow: "visible",
          }}
        >
          <Alarms items={mockAlarms} />
        </Box>
      </Box>
    </Box>
  );
}

function AlarmsRail({ Mdata }) {
  if (!Mdata?.urls) return <></>;
  const { description = "", documentUrlsList = [] } = Mdata?.urls || {};
  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
          paddingBottom: "12px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "#1f2937",
            }}
          >
            Installation Details
          </h3>
          <span style={{ fontSize: "13px", color: "#6b7280" }}>
            Installation description and attached documents
          </span>
        </div>
        {documentUrlsList?.length > 0 && (
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "20px",
              background: "#f3f4f6",
              color: "#4b5563",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {documentUrlsList.length}{" "}
            {documentUrlsList.length === 1 ? "File" : "Files"}
          </span>
        )}
      </div>
      {description && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            borderRadius: "8px",
            background: "#f8fafc",
            border: "1px solid #eef2f7",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#64748b",
              marginBottom: "5px",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            Description
          </div>
          <div style={{ fontSize: "14px", lineHeight: 1.6, color: "#374151" }}>
            {description}
          </div>
        </div>
      )}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
            Attached Documents
          </span>
        </div>
        {documentUrlsList && documentUrlsList.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "14px",
            }}
          >
            {documentUrlsList.map((doc) => (
              <DocumentViewer
                key={doc.id}
                documentId={doc.id}
                filename={doc.originalFilename}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: "25px",
              textAlign: "center",
              border: "1px dashed #d1d5db",
              borderRadius: "8px",
              color: "#9ca3af",
              fontSize: "14px",
            }}
          >
            No files attached
          </div>
        )}
      </div>
    </div>
  );
}
