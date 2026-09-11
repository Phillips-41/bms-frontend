import React, { useState,useContext,useEffect,useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  Typography,
  TablePagination,
  useTheme
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../services/AppContext";
import { circle } from "leaflet";
import { id } from "date-fns/locale";
import { tokens } from "../../theme";
 
const CustomTick = (props) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y}) rotate(-40)`}>
      <text 
        dy={10} 
        dx={5} 
        textAnchor="end" 
        fontSize={9} 
        
        fontWeight="bold" 
        fontFamily="Arial, sans-serif"
        style={{ whiteSpace: "nowrap", minWidth: "100px", display: "block" }}
      >
        {payload.value}
      </text>
    </g>
  );
};

// Table Dialog to display data in table format
const TableDialog = ({ open, handleClose, data, alarmType }) => {
   const theme = useTheme();
      const colors = tokens(theme.palette.mode);
  const { setSiteId, setSerialNumber, handleSearch, siteId, serialNumber ,setState,setCircle,setZone,setArea,area} = useContext(AppContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [clickedItem, setClickedItem] = useState(null);
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort the data by serverTime in descending order before pagination
  const sortedData = useMemo(() => {
    if (!data.details) return [];
    return [...data.details].sort((a, b) => {
      return new Date(b.serverTime) - new Date(a.serverTime);
    });
  }, [data.details]);

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    let mounted = true;

    const performSearchAndNavigate = async () => {
      if (mounted && area) {
        const result = await handleSearch();
        if (result) {
          navigate("/livemonitoring", { state: { from: "/" } });
        }
      }
    };

    if (clickedItem && siteId === clickedItem.siteId && serialNumber === clickedItem.serialNumber) {
      performSearchAndNavigate();
      setClickedItem(null);
    }

    return () => {
      mounted = false;
    };
  }, [siteId, serialNumber, handleSearch, navigate, clickedItem]);

  const handleRowClick = (item) => {
    setSiteId(item.siteId);
    setSerialNumber(item.serialNumber);
    setState(item.state);
    setCircle(item.circle);
    setZone(item.division);
    setArea(item.area)
    setClickedItem(item);
  };

  const getTableColumns = () => {
    // Create a mapping of dialog titles to column labels
    const columnLabelMap = {
      "String(V) High": "String(V)",
      "String(V) Low": "String(V)",
      "DC Under Voltage": "DC(V)",
      "DC Over Voltage": "DC(V)",
      "Cell(V) Low": "Cell Voltage",
      "Cell(V) High": "Cell Voltage",
      "Cell Temperature": "Temperature",
      "SOC Low": "SOC",
      "Battery Condition": "Condition",
      "Charger Trip": "Status",
      "String(A) High": "String(A)",
      "Battery Bank(Discharging)": "Status",
      "String Commu": "Status",
      "Input Mains Fail": "Status",
      "Input Phase Fail": "Status",
      "Rectifier Fuse Fail": "Status",
      "Filter Fuse Fail": "Status",
      "Output Fuse Fail": "Status",
      "Output MCCB Fail": "Status",
      "Input Fuse Fail": "Status",
      "AC Under Voltage": "AC(V)",
      "AC(V) High": "AC(V)",
      "Ambient (°C) High": "Temperature",
      "Battery Open": "Cell Voltage",
      "Battery AboutToDie": "Cell Voltage",
      "Cell Comm Fail": "Cells",
      "Buzzer Alarm": "Status",
      "Charger Load": "Status",
      "Alarm Supply Fuse Fail": "Status",
      "Test Push Button": "Status",
      "Reset Push Button": "Status"
    };
  
    const baseColumns = [
      { id: "siteId", label: "Substation ID" },
      { id: "area", label: "Substation" },
      { id: "serverTime", label: "Server Date Time" },
      // {id: "state", label: "State"},
      // {id: "circle", label: "Circle"},
      {
        id: "value",
        label: columnLabelMap[data.name] || "Value", // Use mapped label or fallback to "Value"
        render: (item) =>
          data.name === "Charger Load"
            ? "Over"
            : data.name === "Buzzer Alarm" || 
              data.name === "Reset Push Button" || 
              data.name === "Test Push Button"
            ? "detected"
            : data.name === "Charger Trip"
            ? "Tripped"
            : data.name === "Battery Condition"
            ? "Low"
            : data.name === "Battery Bank(Discharging)"
            ? "discharging"
            : typeof item.value === "boolean"
              ? !item.value // Reverse the boolean
                ? "Normal"
                : "Fail"
              : `${item.value}${ " " + item.units }`,
      },
    ];
  
    return baseColumns;
  };

  const columns = getTableColumns();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth 
    sx={{
    '& .MuiPaper-root': {
       bgcolor: colors.primary[100], 
    },
  }} > 
      <DialogTitle
        sx={{
          backgroundImage:
            "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        {data.name} - {alarmType}
      </DialogTitle>
      <DialogContent>
        <TableContainer
          component={Paper}
          sx={{
            marginTop: 1,
            overflowX: "auto",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            borderRadius: "8px",
            paddingBottom: 0,
            height: "300px",
            backgroundColor:colors.primary[100],
            color:"white"
          }}
        >
          <Table aria-label="simple table">
            <TableHead sx={{ background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))', color: "black" ,
              position: "sticky", // Fix header at the top
              top: 0,
              zIndex: 1,
            }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    sx={{
                      border:  colors.primary[300],
                      padding: "3px",
                      fontWeight: "bold",
                      color: "black",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody sx={{  height: "20px"}}>
              {paginatedData?.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": { backgroundColor: colors.primary[100] ,color:colors.primary[200]},
                    "&:hover": { backgroundColor: colors.primary[100], color:colors.primary[200] ,cursor: "pointer" },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell
                    key={column.id}
                    style={
                      column.id === "siteId"
                        ? {
                            color: "#1976d2",
                            textDecoration: "underline",
                            cursor: "pointer",
                            border: colors.primary[300],
                            padding: "3px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                          }
                        : {
                            border:  colors.primary[300],
                            padding: "3px",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            color:colors.primary[200]
                          }
                    }
                    title={column.id === "siteId" ? "tap here" : undefined}
                    onClick={column.id === "siteId" ? () => handleRowClick(item) : undefined}
                  >
                    {column.id === "serverTime" && item[column.id]
                      ? new Date(item[column.id]).toLocaleString("en-GB", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          hour12: true,
                        })
                      : column.render
                      ? column.render(item) // Use render for value column
                      : typeof item[column.id] === "boolean"
                      ? !item[column.id] 
                        ? "True" 
                        : "False"
                      : item[column.id] !== undefined && item[column.id] !== null
                      ? item[column.id]
                      : "No Data"}
                  </TableCell>
                  
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={sortedData.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: "1px solid rgba(255, 255, 255, 0.25)",
              backgroundColor:colors.primary[100],
              color:colors.primary[200],
              position: "sticky", // Fix pagination at the bottom
              bottom: 0,
              zIndex: 1, // Ensure it stays above the body
              paddingBottom: 3,
            }}
          />
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              backgroundColor: "#b30000",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
const DataDialog = ({
  openDialog,
  handleCloseDialog,
  selectedStatus,
  barChartData,
}) => {
  const theme = useTheme();
      const colors = tokens(theme.palette.mode);
  const [openTableDialog, setOpenTableDialog] = useState(false);
  const [tableData, setTableData] = useState(null);
  const [alarmType, setAlarmType] = useState("");

  // Mapping of status to gradient IDs
  const statusGradients = {
    "Most Critical": "mostcriticalGradient",
    "Critical": "CriticalGradient",
    "Major": "majorGradient",
    "Minor": "minoralarmsGradient",
  };

  // Determine the current gradient based on selected status
  const currentGradient = statusGradients[selectedStatus] || "defaultGradient";

  // Calculate the maximum count
  const maxCount = Math.max(...barChartData.map(item => item.count), 0);
  const yAxisMax = Math.max(maxCount * 1.2, 10);
  const tickCount = yAxisMax <= 10 ? 5 : 10;
  
  // Calculate dynamic height based on number of bars and screen size
  const barCount = barChartData.length;
  const dynamicHeight = Math.min(
    Math.max(400, barCount * 40), // Minimum 400px, or more if many bars
    window.innerHeight * 0.6 // Don't exceed 70% of viewport height
  );

  // Handle bar click (assuming handleBarClick is defined elsewhere or passed as a prop)
   const handleBarClick = (data) => {
    const filteredData = barChartData.find((item) => item.name === data.name);
    if (filteredData) {
      const filteredDetails = filteredData.details
        .map((detail) => {
          switch (data.name) {
            case "String(V) High":
            case "String(V) Low":
              if (detail.stringvoltage !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.stringvoltage,
                  units: "V",
                };
              }
              break;
            case "DC Under Voltage":
              if (detail.stringvoltage !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.stringvoltage,
                  units: "V",
                };
              }
              break;
            case "Cell(V) Low":
              if (detail.cellVoltageLow !== undefined && Array.isArray(detail.cellVoltageLow)) {
                // Format the cellVoltageLow array into a readable string
                const formattedValue = detail.cellVoltageLow
                  .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}`)
                  .join(", ");

                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: formattedValue || "No low voltage cells",
                  units: "V",
                };
              } else if (typeof detail.cellVoltageLow === "string") {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.cellVoltageLow,
                  units: "V",
                };
              } else {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: "No data available",
                  units: "V",
                };
              }
              break;
            case "Cell(V) High":
              if (detail.cellVoltageHigh !== undefined && Array.isArray(detail.cellVoltageHigh)) {
                // Format the cellVoltageHigh array into a readable string
                const formattedValue = detail.cellVoltageHigh
                  .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}`)
                  .join(", ");

                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: formattedValue || "No high voltage cells",
                  units: "V",
                };
              } else if (typeof detail.cellVoltageHigh === "string") {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.cellVoltageHigh,
                  units: "V",
                };
              } else {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: "No data available",
                  units: "V",
                };
              }
              break;
            case "Cell Temperature":
              if (detail.cellTemperatureHigh !== undefined ) {
                // const formattedValue = detail.cellTemperatureHigh
                //   .map(cell => `Cell ${cell.cellNumber}: ${cell.cellTemperature}°C`)
                //   .join(", ");

                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.cellTemperatureHigh,
                  units: "",
                };
              }
              break;
            case "DC Over Voltage":
              if (detail.stringvoltage !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.stringvoltage,
                  units: "V",
                };
              }
              break;
            case "SOC Low":
              if (detail.socLatestValueForEveryCycle !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.socLatestValueForEveryCycle,
                  units: "%",
                };
              }
              break;
            case "Battery Condition":
              if (detail.batteryCondition !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.batteryCondition,
                  units: "",
                };
              }
              break;
            case "Charger Trip":
              if (detail.chargerTrip !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.chargerTrip,
                  units: "",
                };
              }
              break;
            case "String(A) High":
              if (detail.instantaneousCurrent !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.instantaneousCurrent,
                  units: "A",
                };
              }
              break;
            case "Battery Bank(Discharging)":
              if (detail.bankDischargeCycle !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.bankDischargeCycle,
                  units: "",
                };
              }
              break;
            case "String Commu":
              if (detail.bmsSedCommunication !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.bmsSedCommunication,
                  units: "",
                };
              }
              break;
            case "Input Mains Fail":
              if (detail.inputMains !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.inputMains,
                  units: "",
                };
              }
              break;
            case "Input Phase Fail":
              if (detail.inputPhase !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.inputPhase,
                  units: "",
                };
              }
              break;
            case "Rectifier Fuse Fail":
              if (detail.rectifierFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.rectifierFuse,
                  units: "",
                };
              }
              break;
            case "Filter Fuse Fail":
              if (detail.filterFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.filterFuse,
                  units: "",
                };
              }
              break;
            case "Output Fuse Fail":
              if (detail.outputFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.outputFuse,
                  units: "",
                };
              }
              break;
            case "Output MCCB Fail":
              if (detail.outputMccb !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.outputMccb,
                  units: "",
                };
              }
              break;
            case "Input Fuse Fail":
              if (detail.inputFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.inputFuse,
                  units: "",
                };
              }
              break;
            case "AC Under Voltage":
            case "AC(V) High":
              if (detail.acVoltage !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.acVoltage,
                  units: "V",
                };
              }
              break;
            case "Ambient (°C) High":
              if (detail.ambientTemperature !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                  division: detail.division,
                  area: detail.area,
                  value: detail.ambientTemperature,
                  units: "°C",
                };
              }
              break;
            // case "Battery Open":
            //   if (detail.cellVoltageOpenBattery !== undefined && Array.isArray(detail.cellVoltageOpenBattery)) {
            //     // Format the cellVoltageOpenBattery array into a readable string
            //     const formattedValue = detail.cellVoltageOpenBattery
            //       .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}`)
            //       .join(", ");

            //     return {
            //       siteId: detail.siteId,
            //       serialNumber: detail.serialNumber,
            //       serverTime: detail.serverTime,
            //       state: detail.state,
            //       circle: detail.circle,
            //       division: detail.division,
            //       area: detail.area,
            //       value: formattedValue || "No open battery cells",
            //       units: "V",
            //     };
            //   } else if (typeof detail.cellVoltageOpenBattery === "string") {
            //     return {
            //       siteId: detail.siteId,
            //       serialNumber: detail.serialNumber,
            //       serverTime: detail.serverTime,
            //       state: detail.state,
            //       circle: detail.circle,
            //       division: detail.division,
            //       area: detail.area,
            //       value: detail.cellVoltageOpenBattery,
            //       units: "V",
            //     };
            //   } else {
            //     return {
            //       siteId: detail.siteId,
            //       serialNumber: detail.serialNumber,
            //       serverTime: detail.serverTime,
            //       state: detail.state,
            //       circle: detail.circle,
            //       division: detail.division,
            //       area: detail.area,
            //       value: "No data available",
            //       units: "V",
            //     };
            //   }
            //   break;
            // case "Battery AboutToDie":
            //   if (detail.cellVoltageAboutToDie !== undefined && Array.isArray(detail.cellVoltageAboutToDie)) {
            //     // Format the cellVoltageAboutToDie array into a readable string
            //     const formattedValue = detail.cellVoltageAboutToDie
            //       .map(cell => `Cell ${cell.cellNumber}: ${cell.cellVoltage}`)
            //       .join(", ");

            //     return {
            //       siteId: detail.siteId,
            //       serialNumber: detail.serialNumber,
            //       serverTime: detail.serverTime,
            //       state: detail.state,
            //       circle: detail.circle,
            //        division: detail.division,
            //       area: detail.area,
            //       value: formattedValue || "No about to die cells",
            //       units: "V",
            //     };
            //   } else if (typeof detail.cellVoltageAboutToDie === "string") {
            //     return {
            //       siteId: detail.siteId,
            //       serialNumber: detail.serialNumber,
            //       serverTime: detail.serverTime,
            //       state: detail.state,
            //       circle: detail.circle,
            //        division: detail.division,
            //       area: detail.area,
            //       value: detail.cellVoltageAboutToDie,
            //       units: "V",
            //     };
            //   } else {
            //     return {
            //       siteId: detail.siteId,
            //       serialNumber: detail.serialNumber,
            //       serverTime: detail.serverTime,
            //       state: detail.state,
            //       circle: detail.circle,
            //        division: detail.division,
            //       area: detail.area,
            //       value: "No data available",
            //       units: "V",
            //     };
            //   }
            //   break;
            case "Cell Comm Fail":
              if (detail.cellNotComm !== undefined ) {
                // const formattedValue = detail.cellNotComm
                //   .map(cell => {
                //     const voltage = (typeof cell.cellVoltage === 'number' && !isNaN(cell.cellVoltage))
                //       ? 'N/A'
                //       : 'N/A';
                //     return `Cell${cell.cellNumber}`;
                //   })
                //   .join(", ");

                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                   division: detail.division,
                  area: detail.area,
                  value: detail.cellNotComm || "",
                  units: "",
                };
              } else if (typeof detail.cellNotComm === "string") {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                   division: detail.division,
                  area: detail.area,
                  value: detail.cellNotComm,
                  units: "",
                };
              } else {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                   division: detail.division,
                  area: detail.area,
                  value: "No data available",
                  units: "",
                };
              }
              break;
            case "Buzzer Alarm":
              if (detail.buzzer !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                   division: detail.division,
                  area: detail.area,
                  value: detail.buzzer,
                  units: "",
                };
              }
              break;
            case "Charger Load":
              if (detail.chargerLoad !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                   division: detail.division,
                  area: detail.area,
                  value: detail.chargerLoad,
                  units: "",
                };
              }
              break;
            case "Alarm Supply Fuse Fail":
              if (detail.alarmSupplyFuse !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                   division: detail.division,
                  area: detail.area,
                  value: detail.alarmSupplyFuse,
                  units: "",
                };
              }
              break;
            // case "Test Push Button":
            //   if (detail.testPushButton !== undefined) {
            //     return {
            //       siteId: detail.siteId,
            //       serialNumber: detail.serialNumber,
            //       serverTime: detail.serverTime,
            //       state: detail.state,
            //       circle: detail.circle,
            //        division: detail.division,
            //       area: detail.area,
            //       value: detail.testPushButton,
            //       units: "",
            //     };
            //   }
            //   break;
            case "Reset Push Button":
              if (detail.resetPushButton !== undefined) {
                return {
                  siteId: detail.siteId,
                  serialNumber: detail.serialNumber,
                  serverTime: detail.serverTime,
                  state: detail.state,
                  circle: detail.circle,
                   division: detail.division,
                  area: detail.area,
                  value: detail.resetPushButton,
                  units: "",
                };
              }
              break;
            default:
              return {
                siteId: detail.siteId,
                serialNumber: detail.serialNumber,
                serverTime: detail.serverTime,
                state: detail.state,
                circle: detail.circle,
                 division: detail.division,
                 area: detail.area,
                value: detail,
                units: "",
              };
          }
          return null; // Filter out non-matching cases
        })
        .filter((item) => item !== null);
  
      setTableData({
        name: data.name,
        details: filteredDetails
      });
      setAlarmType(selectedStatus);
      setOpenTableDialog(true);
    }
  };

  return (
    <>
    <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        sx={{ 
          
          "& .MuiDialog-paper": { 
            maxWidth: "95vw",
            // maxHeight: "85vh",
            width: "95vw",
            padding: "8px",
            margin: "8px",
           bgcolor: colors.primary[100],
            color:"white",
            maxHeight: "100vh",
            overflow: "hidden",
          } 

        }}
      >
        <DialogTitle sx={{
          backgroundImage: "linear-gradient(90deg, #00d4ff 0%, #090979 35%, #00d4ff 100%)",
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          marginBottom: "0px",
        }}>
          {selectedStatus}
        </DialogTitle>
        <DialogContent style={{ padding: 0, margin: 0 ,overflowY:"hidden"}}>
          {/* Define gradients - Moved inside DialogContent and made visible */}
          <svg width="100%" height="100%" style={{ position: "absolute", zIndex: -1 }}>
            <defs>
              <linearGradient id="mostcriticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d82b27" />
                <stop offset="100%" stopColor="#f09819" />
              </linearGradient>
              <linearGradient id="CriticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                 <stop offset="0%" stopColor="#007FFF" />
                <stop offset="100%" stopColor="#2a52be" />
              </linearGradient>
              <linearGradient id="majorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9d50bb" />
                <stop offset="100%" stopColor="#6e48aa" />
              </linearGradient>
              <linearGradient id="minoralarmsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e8b409" />
                <stop offset="100%" stopColor="#f4ee2e" />
              </linearGradient>
              <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8884d8" />
                <stop offset="100%" stopColor="#8884d8" />
              </linearGradient>
            </defs>
          </svg>

          <div style={{ width: '100%', height: dynamicHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                barSize={30}
                margin={{ 
                  top: 40, 
                  right: 20, 
                  bottom: barCount > 10 ? 80 : 60,
                  left: 20 
                }}
                barGap={1}
              >
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={barCount > 5 ? -45 : 0}
                  textAnchor={barCount > 5 ? "end" : "middle"}
                  height={barCount > 5 ? 80 : 60}
                  tick={{ fontSize: barCount > 5 ? 10 : 12  ,fill: colors.primary[200],}}
                  
                />
                <YAxis
                  hide={true}
                  tickCount={tickCount}
                  domain={[0, yAxisMax]}
                />
                <Tooltip 
                  cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={{
                          backgroundColor:colors.primary[100],
                          padding: '10px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                          <p style={{color: colors.primary[200], margin: 0, fontWeight: 'bold' }}>{payload[0].payload.name}: {payload[0].value}</p>
                          <p style={{ margin: '5px 0 0 0', fontFamily:'Source Sans Pro', color: colors.primary[200], }}>
                            Click bar to view details
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={`url(#${currentGradient})`}
                  onClick={handleBarClick}
                  radius={[4, 4, 0, 0]} // Optional: adds rounded corners to bars
                >
                  <LabelList
                    dataKey="count"
                    position="top"
                    style={{ 
                      fontSize: "12px", 
                      fontWeight: "bold", 
                      fill: colors.primary[200],
                    }}
                    offset={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "#b30000" },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <TableDialog
        open={openTableDialog}
        handleClose={() => setOpenTableDialog(false)}
        data={tableData || {}}
        alarmType={alarmType}
      />
    </>
  );
};

export default DataDialog;