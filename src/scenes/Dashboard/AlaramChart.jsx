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

const AlaramChart = ({charData,selectedStatus}) => {

  const [tableData, setTableData] = useState(null);
  const [alarmType, setAlarmType] = useState("");
 const [barChartData, setBarChartData] = useState([]);
  const statusGradients = {
    "Most Critical": "mostcriticalGradient",
    "Critical": "CriticalGradient",
    "Major": "majorGradient",
    "Minor": "minoralarmsGradient",
  };
  const theme = useTheme();
      const colors = tokens(theme.palette.mode);
  // Determine the current gradient based on selected status
  const currentGradient = statusGradients[selectedStatus] || "defaultGradient";

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

    }
  };
  const maxCount = Math.max(...barChartData.map(item => item.count), 0);
  const yAxisMax = Math.max(maxCount * 1.2, 10);
  const tickCount = yAxisMax <= 10 ? 5 : 10;
  
  // Calculate dynamic height based on number of bars and screen size
  const barCount = barChartData.length;
  const dynamicHeight = Math.min(
    Math.max(100, barCount * 40), // Minimum 400px, or more if many bars
    window.innerHeight * 0.6 // Don't exceed 70% of viewport height
  );

  useEffect(() => {
    if(charData && Array.isArray(charData)){
        handlePieClick({ name: selectedStatus });
    }
  },[])

   const handlePieClick =  (data) => {
    //setSelectedStatus(data.name);


    // const filterData = (response, conditions) => {
    //   return response.filter((item) => {
    //     const bmsAlarms = {
    //       bankCycleDc: item?.bankCycleDc || false,
    //       socLn: item?.socLn || false,
    //       cellVoltageLn: item?.cellVoltageLn ||false,
    //       stringVoltageLhn: item?.stringVoltageLhn || 1,
    //       stringVoltage: item?.stringVoltage || 0,
    //       instantaneousCurrent: item?.instantaneousCurrent || 0,
    //       socLatestValueForEveryCycle: item?.socLatestValueForEveryCycle || 0,
    //       cellVoltageNh: item?.cellVoltageNh,
    //       cellTemperatureHn: item?.cellTemperatureHn || false,
    //       ambientTemperatureHn: item?.ambientTemperatureHn || false,
    //       stringCurrentHn: item?.stringCurrentHn || false,
    //       batteryCondition: item?.batteryCondition || false,
    //       cellCommunicationFd: item?.cellCommunicationFd || false,
    //     };
    //     const chargerMonitoring = {
    //       chargerTrip: item?.chargerTrip || false,
    //       inputMains: item?.inputMains || false,
    //       inputPhase: item?.inputPhase || false,
    //       rectifierFuse: item?.rectifierFuse || false,
    //       filterFuse: item?.filterFuse || false,
    //       outputMccb: item?.outputMccb || false,
    //       inputFuse: item?.inputFuse || false,
    //       acVoltageUln: item?.acVoltageUln || 1,
    //       dcVoltageOln: item?.dcVoltageOln || 1,
    //       chargerLoad: item?.chargerLoad || false,
    //       alarmSupplyFuse: item?.alarmSupplyFuse || false,
    //       resetPushButton: item?.resetPushButton || false,
    //       outputFuse: item?.outputFuse || false,
    //       acem : item?.acem || false,
    //       buzzer: item?.buzzer || false,
    //       acVoltage: item?.acVoltage || 0,
    //     };
    //     const threshold = item?.siteLocationDTO?.manufacturerDTO || {};
    //     const location = {
        
    //       circle: item?.circle || "N/A",
    //       division: item?.division || "N/A",
    //       area: item?.area || "N/A",
    //     };
    //     const cellVoltageTemperatureData = item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || [];
    //     return conditions(bmsAlarms, chargerMonitoring, threshold, cellVoltageTemperatureData,location);
    //   });
    // };

    const filterData = (response, conditions) => {
  return response.filter((item) => {
    // Simply pass the raw item straight to the condition block
    return conditions(item);
  });
};

    const generateChartData = (filteredData, alarmType, condition) => {
      const validData = filteredData.filter(item => item && condition(item));
      const count = validData.length;
      const details = validData.map((item) => {
        const threshold = item.siteLocationDTO?.manufacturerDTO || {};
        const location = item?.siteLocationDTO || {};
        const cellData = item.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || [];

        const aboutToDieVoltage = parseFloat(threshold.batteryAboutToDie) || 0;
        const temperature =parseFloat(threshold.highTemperature||0)
        const lowVoltage = parseFloat(threshold.lowVoltage) || 0;
        const highVoltage = parseFloat(threshold.highVoltage) || 0;
        const openBattery = parseFloat(threshold.openBattery) || 0;

        const cellDetails = cellData.map((cell, index) => ({
          cellNumber: index + 1,
          cellVoltage: cell.cellVoltage,
          cellTemperature: cell.cellTemperature,
        }));

        const cellVoltageLow = cellDetails.filter(cell => cell.cellVoltage <= lowVoltage && cell.cellVoltage > aboutToDieVoltage);
        const cellNotComm = cellDetails.filter(cell => cell.cellVoltage === 65.535 && cell.cellTemperature === 65535);
        const cellVoltageHigh = cellDetails.filter(cell => cell.cellVoltage > highVoltage);
        const cellTemperatureHigh = cellDetails.filter(cell => cell.cellTemperature > temperature);
        const cellVoltageAboutToDie = cellDetails.filter(cell => cell.cellVoltage <= aboutToDieVoltage && cell.cellVoltage > openBattery && cell.cellVoltage< lowVoltage);
        const cellVoltageOpenBattery = cellDetails.filter(cell => cell.cellVoltage <= openBattery &&cell.cellVoltage < aboutToDieVoltage );

       const data={
          serverTime: item.serverTime || "N/A",
          siteId: item.siteId || "N/A",
          serialNumber: item.serialNumber || "N/A",
          stringvoltage: item.stringVoltage || "N/A",
          instantaneousCurrent: item.instantaneousCurrent || "N/A",
          ambientTemperature: item.ambientTemperature || "N/A",
          socLatestValueForEveryCycle: item.socLatestValueForEveryCycle || 0,
          dodLatestValueForEveryCycle: item.dodLatestValueForEveryCycle || "N/A",
          acVoltage: item.acVoltage || 0,
          inputMains: item.inputMains || "N/A",
          batteryCondition: item.batteryCondition || "N/A",
          chargerTrip: item.chargerTrip || "N/A",
          inputPhase: item.inputPhase || "N/A",
          rectifierFuse: item.rectifierFuse || "N/A",
          filterFuse: item.filterFuse || "N/A",
          outputFuse: item.outputFuse || "N/A",
          outputMccb: item?.outputMccb || "N/A",
          chargerLoad: item?.chargerLoad || "N/A",
          inputFuse: item?.inputFuse || "N/A",
          alarmSupplyFuse: item?.alarmSupplyFuse || "N/A",
          testPushButton: item?.testPushButton || "N/A",
          resetPushButton: item?.resetPushButton || "N/A",
          cellVoltage: cellData[0]?.cellVoltage || "N/A",
          cellTemperature: cellData[0]?.cellTemperature || "N/A",
          bankDischargeCycle: item?.bankDischargeCycle || "N/A",
          bmsSedCommunication: item?.bmsSedCommunication || "N/A",
          buzzer: item?.buzzer || "N/A",
          cellVoltageLow: cellVoltageLow.length > 0 ? cellVoltageLow : "low voltage cells detected",
          cellVoltageHigh: cellVoltageHigh.length > 0 ? cellVoltageHigh : "high voltage cells detected",
          cellTemperatureHigh: cellTemperatureHigh.length > 0 ? cellTemperatureHigh : "high temperature cells detected",
          cellVoltageAboutToDie: cellVoltageAboutToDie.length > 0 ? cellVoltageAboutToDie : "about to die cells detected",
          cellVoltageOpenBattery: cellVoltageOpenBattery.length > 0 ? cellVoltageOpenBattery : "open battery cells detected",
          cellNotComm: item.cellCommunicationFd? "communication failure cell detected":"communication failure cell detected",
          state:item?.state || "N/A",
          circle:item?.circle || "N/A",
          division: item?.division || "N/A",
          area: item?.area || "N/A",
        };
        return data;
      });

      return { name: alarmType, count, details };
    };

    try {
      // const response = await fetchCommunicationStatus(marginMinutes);

      // if (!response || !Array.isArray(response)) {
      //   console.error("Invalid API response:", response);
      //   setBarChartData([]);
      //   return;
      // }

      let filteredData;
      let chartData = [];

      switch (data.name) {
        case 'Most Critical':
          filteredData = filterData(charData, (item) => {
            const threshold = item?.siteLocationDTO?.manufacturerDTO || {};
            const cellData = item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || [];

            const batteryAboutToDieThreshold = parseFloat(threshold.batteryAboutToDie) || 0;
            const openBatteryThreshold = parseFloat(threshold.openBattery) || 0;
            const lowVoltageThreshold = parseFloat(threshold.lowVoltage) || 0;

            const isBatteryAboutToDie = cellData.some(cell =>
              cell.cellVoltage <= batteryAboutToDieThreshold &&
              cell.cellVoltage > openBatteryThreshold &&
              cell.cellVoltage < lowVoltageThreshold
            );
            const isOpenBattery = cellData.some(cell => cell.cellVoltage <= openBatteryThreshold);

            return (
              item.stringVoltageLhn === 0 ||
              item.cellVoltageLn === true ||
              item.socLn === true ||
              item.chargerTrip === true ||
              isBatteryAboutToDie ||
              isOpenBattery
            );
          });

          chartData = [
            generateChartData(filteredData, "String(V) Low", item => item?.stringVoltageLhn === 0),
            generateChartData(filteredData, "Cell(V) Low", item => item?.cellVoltageLn === true),
            generateChartData(filteredData, "SOC Low", item => item?.socLn === true), 
            generateChartData(filteredData, "Battery Open", item => {
              const openBatteryThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.openBattery) || 0;
              return (item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || []).some(cell => cell.cellVoltage <= openBatteryThreshold);
            }),
            generateChartData(filteredData, "Battery AboutToDie", item => {
              const batteryAboutToDieThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.batteryAboutToDie) || 0;
              const openBatteryThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.openBattery) || 0;
              const lowVoltageThreshold = parseFloat(item?.siteLocationDTO?.manufacturerDTO?.lowVoltage) || 0;
              return (item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || []).some(cell =>
                cell.cellVoltage <= batteryAboutToDieThreshold &&
                cell.cellVoltage > openBatteryThreshold &&
                cell.cellVoltage < lowVoltageThreshold
              );
            }),
            generateChartData(filteredData, "Charger Trip", item => item?.chargerTrip === true),
          ];
          break;

        case 'Critical':
          filteredData = filterData(totalData, (item) => (
            item.stringVoltageLhn === 2 || 
            item.cellVoltageNh === true ||
            item.stringCurrentHn === true || 
            item.inputMains === true ||
            item.inputPhase === true || 
            item.rectifierFuse === true ||
            item.filterFuse === true || 
            item.outputMccb === true ||
            item.inputFuse === true || 
            item.batteryCondition === true ||
            item.acVoltageUln === 2
          ));

          chartData = [
            generateChartData(filteredData, "String(V) High", item => item?.stringVoltageLhn === 2),
            generateChartData(filteredData, "Cell(V) High", item => item?.cellVoltageNh === true),
            generateChartData(filteredData, "String(A) High", item => item?.stringCurrentHn === true),
            generateChartData(filteredData, "Input Mains Fail", item => item?.inputMains === true),
            generateChartData(filteredData, "Input Phase Fail", item => item?.inputPhase === true),
            generateChartData(filteredData, "Rectifier Fuse Fail", item => item?.rectifierFuse === true),
            generateChartData(filteredData, "Filter Fuse Fail", item => item?.filterFuse === true),
            generateChartData(filteredData, "Output MCCB Fail", item => item?.outputMccb === true),
            generateChartData(filteredData, "Input Fuse Fail", item => item?.inputFuse === true),
            generateChartData(filteredData, "Battery Condition", item => item?.batteryCondition === true),
            generateChartData(filteredData, "AC(V) High", item => item?.acVoltageUln === 2),
          ];
          break;

        case 'Major':
          filteredData = filterData(totalData, (item) => (
            item.ambientTemperatureHn === true || 
            item.cellCommunicationFd === true ||
            item.dcVoltageOln === 2 || 
            item.dcVoltageOln === 0 ||
            item.acVoltageUln === 0 || 
            item.outputFuse === true
          ));

          chartData = [
            generateChartData(filteredData, "Ambient (°C) High", item => item?.ambientTemperatureHn === true),
            generateChartData(filteredData, "Cell Comm Fail", item => item?.cellCommunicationFd === true),
            generateChartData(filteredData, "DC Over Voltage", item => item?.dcVoltageOln === 2),
            generateChartData(filteredData, "DC Under Voltage", item => item?.dcVoltageOln === 0),
            generateChartData(filteredData, "AC Under Voltage", item => item?.acVoltageUln === 0),
            generateChartData(filteredData, "Output Fuse Fail", item => item?.outputFuse === true),
          ];
          break;

        case 'Minor':
          filteredData = filterData(totalData, (item) => (
            item.bankCycleDc === true || 
            item.bmsSedCommunication === true ||
            item.cellTemperatureHn === true || 
            item.buzzer === true ||
            item.chargerLoad === true || 
            item.alarmSupplyFuse === true ||
            item.testPushButton === true || 
            item.resetPushButton === true
          ));

          chartData = [
            generateChartData(filteredData, "Battery Bank(Discharging)", item => item?.bankCycleDc === true),
            generateChartData(filteredData, "Buzzer Alarm", item => item?.buzzer === true),
            generateChartData(filteredData, "Cell Temperature", item => item?.cellTemperatureHn === true),
            generateChartData(filteredData, "Charger Load", item => item?.chargerLoad === true),
            generateChartData(filteredData, "Alarm Supply Fuse Fail", item => item?.alarmSupplyFuse === true),
            generateChartData(filteredData, "Reset Push Button", item => item?.resetPushButton === true),
          ];
          break;

        default:
          console.warn("Unknown status selected:", data.name);
          setBarChartData([]);
          return;
      }

      setBarChartData(chartData);
    } catch (error) {
      console.error("Error fetching communication status:", error);
      setBarChartData([]);
    }
  };
 
    return(
    <div>
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
        {barChartData?(
        <div style={{ width: '50%', height: dynamicHeight }}>
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
        ):(
            <div style={{ width: '100%', height: dynamicHeight, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ color: colors.primary[200], fontSize: '16px' }}>No data available</p>
            </div>
        )}
    </div>
    )

}




export default AlaramChart;