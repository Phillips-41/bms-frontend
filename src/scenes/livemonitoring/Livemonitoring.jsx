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
        // Mobile: allow page scroll; tablet & desktop: no scroll
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
        // Mobile: content can grow and scroll; sm+ (tablet/desktop): fill viewport, no scroll
        overflow: { xs: "visible", sm: "hidden" },
        display: "flex",
        flexDirection: "column",
        background: "var(--background)",
        boxSizing: "border-box",
        p: { xs: "4px", md: "5px", lg: "6px" },
        gap: { xs: "4px", md: "5px", lg: "6px" },
      }}
    >
      {/* Header — natural height, never shrinks */}
      <Box sx={{ flex: "0 0 auto", minHeight: 0 }}>
        <Header />
      </Box>

      {/* HealthBar — natural height, never shrinks */}
      <Box sx={{ flex: "0 0 auto", minHeight: 0 }}>
        <HealthBar />
      </Box>

      {/* Main grid — takes ALL remaining height on tablet/desktop; stacks on mobile */}
      <Box
        sx={{
          flex: { xs: "0 0 auto", sm: "1 1 auto" },
          minHeight: { xs: "auto", sm: 0 },
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "200px minmax(0, 1fr) 168px",
            lg: "220px minmax(0, 1fr) 180px",
            xl: "240px minmax(0, 1fr) 200px",
          },
          gap: { xs: "4px", md: "5px", lg: "10px" },
          overflow: { xs: "visible", sm: "hidden" },
        }}
      >
        {/* left: CellsPanel — hidden on xs, visible from md up */}
        <Box
          sx={{
            minHeight: 0,
            height: { xs: "auto", sm: "100%" },
            overflow: { xs: "visible", sm: "hidden" },
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
            gridTemplateColumns: { xs: "1fr", md: "repeat(12, minmax(0, 1fr))" },
            gridTemplateRows: {
              xs: "none",
              // Tablet (sm–md): fixed-ish rows so content fits without scroll
              sm: "minmax(72px, 1.1fr) minmax(48px, 0.9fr) minmax(90px, 1.6fr) minmax(90px, 1.6fr)",
              md: "1.1fr 0.9fr 1.6fr 1.6fr",
            },
            gap: { xs: "4px", md: "5px", lg: "8px" },
          }}
        >
          {/* LiveBattery + StateOfCharge */}
          <Box
            sx={{
              gridColumn: { xs: "1", md: "span 6" },
              minHeight: { xs: 80, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <LiveBattery />
          </Box>
          <Box
            sx={{
              gridColumn: { xs: "1", md: "span 6" },
              minHeight: { xs: 80, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <StateOfCharge />
          </Box>

          {/* Charger */}
          <Box
            sx={{
              gridColumn: { xs: "1", md: "1 / -1" },
              minHeight: { xs: 64, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <Charger />
          </Box>

          {/* Cumulative + Cycles */}
          <Box
            sx={{
              gridColumn: { xs: "1", md: "span 6" },
              minHeight: { xs: 100, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <Cumulative />
          </Box>
          <Box
            sx={{
              gridColumn: { xs: "1", md: "span 6" },
              minHeight: { xs: 100, sm: 0 },
              overflow: { xs: "visible", sm: "hidden" },
            }}
          >
            <Cycles />
          </Box>

          {/* Bar charts */}
          <Box
            sx={{
              gridColumn: { xs: "1", md: "span 6" },
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
              gridColumn: { xs: "1", md: "span 6" },
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

          {/* Mobile-only: CellsPanel + Alarms stacked below charts */}
          <Box
            sx={{
              gridColumn: "1",
              display: { xs: "block", md: "none" },
              minHeight: 280,
              overflow: "visible",
            }}
          >
            <CellsPanel />
          </Box>
          <Box
            sx={{
              gridColumn: "1",
              display: { xs: "block", md: "none" },
              minHeight: 200,
              overflow: "visible",
            }}
          >
            <Alarms items={mockAlarms} />
          </Box>
        </Box>

        {/* right: Alarms — hidden on xs, visible from md up */}
        <Box
          sx={{
            minHeight: 0,
            height: { xs: "auto", sm: "100%" },
            overflow: { xs: "visible", sm: "hidden" },
            display: { xs: "none", md: "block" },
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
      {/* Header */}
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
      {/* Description */}
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
      {/* Documents */}
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
