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

function Dashboard() {
  const { data,Mdata = {} } = useContext(AppContext);
    const device = data[0];
  if (!device) return <div>
     <Header />
  </div>;

  const { description="", documentUrlsList=[] } = Mdata?.urls || {};
  const { ahInForOneChargeCycle, ahOutForOneDischargeCycle } = device;
  
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
    {!Mdata?.urls? 
    <>
      <HealthBar />

      <Box
        sx={{
          display: "grid",
          minHeight: 0,
          flex: 1,
          gridTemplateColumns: {
            xs: "1fr",
            md: "200px minmax(0, 1fr) 168px",
            lg: "220px minmax(0, 1fr) 180px",
            xl: "240px minmax(0, 1fr) 200px",
          },
          gap: { xs: "4px", md: "5px", lg: "10px" },
          overflow: "hidden",
        }}
      >
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
              md: "minmax(64px, 0.18fr) minmax(52px, 0.14fr) minmax(90px, 0.34fr) minmax(100px, 0.34fr)",
              // Added explicit scaling for lg and xl so the 4 rows fit larger viewports cleanly
              lg: "minmax(74px, 0.18fr) minmax(62px, 0.14fr) minmax(100px, 0.34fr) minmax(110px, 0.34fr)",
              xl: "minmax(84px, 0.18fr) minmax(72px, 0.14fr) minmax(110px, 0.34fr) minmax(120px, 0.34fr)",
            },
            gap: { xs: "4px", md: "5px", lg: "15px" },
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
              title="Average current"
              bars={[
                { label: "Charging", value: "0.084 A", height: 30 },
                { label: "Discharging", value: "2.0538 A", height: 78 },
              ]}
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "1", md: "span 6" }, minHeight: 0, overflow: "hidden" }}>
            <BarChart
              title="Charge / discharge ampere-hour"
              bars={[
                { label: "Ah In", value: `${ahInForOneChargeCycle}`, height: 84 },
                { label: "Ah Out", value: `${ahOutForOneDischargeCycle}`, height: 22 },
              ]}
            />
          </Box>
        </Box>

        <Box
          sx={{
            minHeight: 0,
            height: "100%",
            overflow: "hidden",
            display: { xs: "none", md: "block" },
          }}
        >
          <Alarms items={mockAlarms} />
        </Box>
      </Box>
    </>: 
    <div style={{ padding: '20px', border: '1px solid #e5e7eb', borderRadius: '12px', background: '#fff', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)', width: '100%', boxSizing: 'border-box', }} > 
    {/* Header */} <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0', }} >
       <div> 
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937', }} > Installation Details </h3>
         <span style={{ fontSize: '13px', color: '#6b7280', }} > Installation description and attached documents </span> 
         </div> {documentUrlsList?.length > 0 && ( <span style={{ padding: '5px 10px', borderRadius: '20px', background: '#f3f4f6', color: '#4b5563', fontSize: '12px', fontWeight: 500, }} > {documentUrlsList.length}{' '} {documentUrlsList.length === 1 ? 'File' : 'Files'} </span> )} </div>
          {/* Description */} {description && ( <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #eef2f7', }} > <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.4px', }} > Description </div>
           <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#374151', }} > {description} </div> 
           </div> )} 
           {/* Documents */} 
           <div> 
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', }} >
               <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151', }} > Attached Documents </span>
            </div> {documentUrlsList && documentUrlsList.length > 0 ? 
            ( <div 
            style={{ display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', }} > 
            {documentUrlsList.map((doc) => ( <DocumentViewer key={doc.id} documentId={doc.id} filename={doc.originalFilename} />
             ))} 
             </div> ) : 
            ( <div style={{ padding: '25px',
               textAlign: 'center',
                border: '1px dashed #d1d5db',
                 borderRadius: '8px',
                  color: '#9ca3af', 
                  fontSize: '14px', }} > No files attached </div> )} 
                  </div>
                   </div>
    }
  </Box>
</Box>

  );
}







/** Vertical alarms rail — lists dynamic active alarms from API/mock. */



