import  { useState, useEffect, useContext } from "react";
import { Box, Grid } from "@mui/material";
import "leaflet/dist/leaflet.css";
import DashBoardBar from "../Dashboard/DashBoardBar/DashBoardBar";
import { AppContext } from "../../services/AppContext";
import { fetchCommunicationDevices, fetchCommunicationStatus, fetchZoneCircleDetails,fetchLatestData } from "../../services/apiService";
import PieChartComponent2 from './PieChartComponent2';
import PieChartComponent from './PieChartComponent';
 
import MapComponent from './MapComponent';
import DataDialog from "./DataDialog";
import BarGraph from "./BarGraph";
import { amber } from "@mui/material/colors";
import { Grab } from "lucide-react";
import AlaramChart from "./AlaramChart";
import NewDashboard from "./newDashBoard/Dashboard";

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { data = [] } = useContext(AppContext);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [siteId, setSiteId] = useState('');
  const [barChartData, setBarChartData] = useState([]);
  const [totalData,setTotalData]=useState([])
  const [mapMarkers, setMapMarkers] = useState([]);
  const [marginMinutes, setMarginMinutes] = useState(240);  
  const [zoneCircles,setZoneCircles]=useState({});
  const [communicationDevices,setCommunicationDevices]=useState([])
  const[notCommunicationDevices,setNotCommunicationDevices]=useState([])
  const[device,setDevice]=useState(0)
  // const setmarkers=(value)=>{
  //   setMapMarkers(value);
  // }

  function setmarkers(value){
    setMapMarkers(value);
  }

  function updateMapMarkers(data){
    if(data || Array.isArray(data)){
      const markers=[]
      data.forEach((item) => {
      markers.push({
                  lat: item.latitude,
                  lng: item.longitude,
                  name: item.area || "Unnamed Site",
                  vendor: item.vendorName || "",
                  statusType: item.isNotCommunicating === false ? 1 : 0,
                  siteId : item.siteId,
                  serialNumber : item.serialNumber,
                });
              });
    setmarkers(markers);
    };
  }
  const updateCommunicationDevices=(data)=>{
   const comm= data.filter(item=>item.isNotCommunicating===false).length
   const notcomm= data.length - comm
    setCommunicationDevices(comm)
    setNotCommunicationDevices(notcomm)
        setData1([
          { name: "Communicating", value: comm },
          { name: "Non-Communicating", value: notcomm },
        ]);
    setDevice(data)
    updateMapMarkers(data)
    
  }
useEffect(() => {
  console.log("🚀 Component Mounted / Effect Executed");

  let isMounted = true;
  const fetchData = async () => {
    try {
      // const [response, zoneCircleResponse] = await Promise.all([
      //   fetchLatestData(),
      //   fetchZoneCircleDetails()
      // ]);
      
      // If Strict Mode or an unmount happened, this block stops the 2nd state update
      if (!isMounted) {
        console.log("🛑 API finished but component unmounted. Ignoring state update.");
        return; 
      }

      updateCommunicationDevices(response);
      setZoneCircles(zoneCircleResponse);
      
      if (!response || !Array.isArray(response)) {
        console.error("Invalid API response:", response);
        return;
      }

        let communicatingCount = 0;
        let nonCommunicatingCount = 0;
        let mostCriticalCount = 0;
        let criticalCount = 0;
        let majorCount = 0;
        let minorCount = 0;
        const markers = [];
        const individualCounts = {
  stringVoltageLhn: 0,
  cellVoltageNh: 0,
  stringCurrentHn: 0,
  inputMains: 0,
  inputPhase: 0,
  rectifierFuse: 0,
  filterFuse: 0,
  outputMccb: 0,
  batteryCondition: 0,
  inputFuse: 0,
  acVoltageUln: 0
};

        response.forEach((item) => {
        //   if (item.statusType === 1) communicatingCount++;
        //   else if (item.statusType === 0) nonCommunicatingCount++;

        //   const bmsAlarms = item?.generalDataDTO?.deviceDataDTO?.[0]?.bmsAlarmsDTO || {};
        //   const chargerMonitoring = item?.generalDataDTO?.chargerMonitoringDTO?.[0]?.chargerDTO || {};
        //   const threshold = item?.siteLocationDTO?.manufacturerDTO || {};
        //   const cellVoltageData = item?.generalDataDTO?.deviceDataDTO?.[0]?.cellVoltageTemperatureData || [];

        //   const batteryAboutToDieThreshold = parseFloat(threshold.batteryAboutToDie) || 0;
        //   const openBatteryThreshold = parseFloat(threshold.openBattery) || 0;
        //   const lowVoltageThreshold = parseFloat(threshold.lowVoltage) || 0;
        //   const highTemperaturethreshold= parseFloat(threshold.highTemperature) || 0;

        //   const hightemthreshold=cellVoltageData.some(cell => cell.cellTemperature >= highTemperaturethreshold);
        //   const isBatteryAboutToDie = cellVoltageData.some(cell =>
        //     cell.cellVoltage <= batteryAboutToDieThreshold &&
        //     cell.cellVoltage > openBatteryThreshold &&
        //     cell.cellVoltage < lowVoltageThreshold
        //   );
        //   const isOpenBattery = cellVoltageData.some(cell => cell.cellVoltage <= openBatteryThreshold);
        //   const isLowVoltageConditionMet = cellVoltageData.some(cell => cell.cellVoltage <= lowVoltageThreshold  &&cell.cellVoltage > batteryAboutToDieThreshold );

        //   // Most Critical Alarms
        //   if (isBatteryAboutToDie) mostCriticalCount++;
        //   if (isOpenBattery) mostCriticalCount++;
          if (item.stringVoltageLhn === 0) mostCriticalCount++;
          if (item.cellVoltageLn === true ) mostCriticalCount++;
          if (item.socLn === true) mostCriticalCount++;
          if (item.chargerTrip === true) mostCriticalCount++;

        

          // Critical Alarms
          if (item.stringVoltageLhn === 2) { criticalCount++; individualCounts.stringVoltageLhn++; }
          if (item.cellVoltageNh === true) { criticalCount++; individualCounts.cellVoltageNh++; }
          if (item.stringCurrentHn === true) { criticalCount++; individualCounts.stringCurrentHn++; }
          if (item.inputMains === true) { criticalCount++; individualCounts.inputMains++; }
          if (item.inputPhase === true) { criticalCount++; individualCounts.inputPhase++; }
          if (item.rectifierFuse === true) { criticalCount++; individualCounts.rectifierFuse++; }
          if (item.filterFuse === true) { criticalCount++; individualCounts.filterFuse++; }
          if (item.outputMccb === true) { criticalCount++; individualCounts.outputMccb++; }
          if (item.batteryCondition === true) { criticalCount++; individualCounts.batteryCondition++; }
          if (item.inputFuse === true) { criticalCount++; individualCounts.inputFuse++; }
          if (item.acVoltageUln === 2) { criticalCount++; individualCounts.acVoltageUln++; }

          // Major Alarms
          if (item.ambientTemperatureHn === true) majorCount++;
          if (item.cellCommunicationFd === true) majorCount++;
          if (item.dcVoltageOln === 2) majorCount++;
          if (item.dcVoltageOln === 0) majorCount++;
          if (item.acVoltageUln === 0) majorCount++;
          if (item.outputFuse === true) majorCount++;

          // Minor Alarms
          if (item.bankCycleDc === true) minorCount++;
          if (item.bmsSedCommunication === true) minorCount++;
          if (item.cellTemperatureHn === true ) minorCount++;
          if (item.buzzer === true) minorCount++;
          if (item.chargerLoad === true) minorCount++;
          if (item.alarmSupplyFuse === true) minorCount++;
          if (item.testPushButton === true) minorCount++;
          if (item.resetPushButton === true) minorCount++;

        //   if (item.siteLocationDTO) {
        //     const { latitude, longitude, area, vendorName, siteId } = item.siteLocationDTO;
        //     if (latitude && longitude) {
        //       const serialNumber = item.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || "N/A";
        //       // markers.push({
        //       //   lat: latitude,
        //       //   lng: longitude,
        //       //   name: area || "Unnamed Site",
        //       //   vendor: vendorName,
        //       //   statusType: item.statusType,
        //       //   siteId,
        //       //   serialNumber,
        //       // });
        //     }
          // }
        });

        // setData1([
        //   { name: "Communicating", value: communicatingCount },
        //   { name: "Non-Communicating", value: nonCommunicatingCount },
        // ]);

        setData2([
          { name: "Most Critical", value: mostCriticalCount },
          { name: "Critical", value: criticalCount },
          { name: "Major", value: majorCount },
          { name: "Minor", value: minorCount },
        ]);
        setTotalData(response)
      //  setMapMarkers(markers);

 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    return () => {
    isMounted = false;
    console.log("🗑️ Component Unmounted / Cleanup Executed");
  };
}, []);

  const handlePieClick =  (data) => {
    setSelectedStatus(data.name);
    setOpenDialog(true);

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
          filteredData = filterData(totalData, (item) => {
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

  const handlePieClickCommu = (data) => {
    setSelectedCategory(data.name);
   // setOpenDialog(true);

    setColumns([
      { field: 'siteId', headerName: 'Substation ID' },
      { field: 'statusType', headerName: 'Status' },
      { field: 'vendor', headerName: 'Vendor' },
      { field: 'location', headerName: 'Location' },
      { field: 'stringVoltage', headerName: 'String Voltage' },
      { field: 'instantaneousCurrent', headerName: 'Instantaneous Current' },
      { field: 'ambientTemperature', headerName: 'Ambient Temperature' },
      { field: 'batteryRunHours', headerName: 'Battery Run Hours' },
    ]);

    try {
     // const response = await fetchCommunicationStatus(marginMinutes);
      let filteredData = [];

      switch (data.name) {
        case 'Communicating':
          filteredData = totalData.filter(item => isNotCommunicating === false );
          break;
        case 'Non-Communicating':
          filteredData = totalData.filter(item => isNotCommunicating === true );
          break;
        default:
          filteredData = [];
      }

      const newRows = filteredData.map((item) => ({
        siteId: item?.siteId || '--',
        statusType: item?.statusType === 1 ? 'Communicating' : 'Non-Communicating',
        vendor: item?.siteLocationDTO?.vendorName || '--',
        location: item?.siteLocationDTO?.area || '--',
        stringVoltage: item?.generalDataDTO?.deviceDataDTO?.[0]?.stringVoltage || 0,
        instantaneousCurrent: item?.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || 0,
        ambientTemperature: item?.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || 0,
        batteryRunHours: item?.generalDataDTO?.deviceDataDTO?.[0]?.batteryRunHours || 0,
      }));

      setRows(newRows);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStatus(null);
    setSelectedCategory(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (newSiteId) => {
    setSiteId(newSiteId);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const COLORS = ['#28a745', '#f39c12', '#17a2b8', '#6c757d', '#007bff', '#d9534f'];
  return (<NewDashboard/>)
  // return (
  //   // <Box className="dashboard-container" 
  //   //   sx={{
  //   //     height: '100%',
  //   //     padding: {
  //   //       xs: '1px 1px 10px 5px', // Smaller padding for extra-small screens (mobile)
  //   //       sm: '1px 1px 12px 6px', // Slightly larger for small screens (tablets)
  //   //       md: '1px 1px 15px 7px', // Your current padding for medium screens (laptops at 90%)
  //   //       lg: '10px 10px 10px 10px', // Adjusted for larger screens (laptops at 100%)
  //   //       xl: '3px 3px 18px 9px', // Even larger for extra-large screens
  //   //     },
  //   //     boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  //   //     // Add this to prevent overflow
  //   //     overflowY: 'auto', // or 'auto' if you want scrollbars

  //   //     boxSizing: 'border-box', // Ensures padding doesn't add to the total width
  //   //   }}
  //   // >
  //   //   <DashBoardBar totolData={totalData}  setmarkers={setmarkers}/>
  //   //   {/* <Grid container spacing={1} >
  //   //     <Grid item xs={12} md={7} sm={6} lg={6} xl={6}>
  //   //       <MapComponent mapMarkers={mapMarkers} selectedStatus={selectedStatus} />
  //   //     </Grid>
         
  //   //     <Grid item xs={12} md={7} sm={6} lg={6} xl={6} >
  //   //       <Grid item xs={12} md={7} sm={6} lg={6} xl={6} >
  //   //         <Grid container spacing={1} direction="row" alignItems="center" justifyContent="space-between" marginBottom={1}>
  //   //             <Grid >
  //   //               <PieChartComponent2 totolData={totalData}  data1={data1} device={device} handlePieClick={handlePieClickCommu} />
  //   //             </Grid>
  //   //             <Grid item xs={12} md={7} sm={6} lg={6} xl={6}>
  //   //               <PieChartComponent  data2={data2} handlePieClick={handlePieClick} />
  //   //             </Grid> 
  //   //         </Grid>
  //   //       </Grid>

  //   //     </Grid>
  //   //      <Grid item xs={12} md={7} sm={6} lg={6} xl={6}>
  //   //        <BarGraph data={zoneCircles}/> 
  //   //       </Grid>
  //   //      <Grid container spacing={3} justifyContent="center" alignItems="center">
  //   //       {totalData && totalData.length > 0 ? (
  //   //         <>

  //   //           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
  //   //             <AlaramChart charData={totalData} selectedStatus={"Most Critical"} />
  //   //           </Grid>
              
  //   //           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
  //   //             <AlaramChart charData={totalData} selectedStatus={"Critical"} />
  //   //           </Grid>

          
  //   //           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
  //   //             <AlaramChart charData={totalData} selectedStatus={"Major"} />
  //   //           </Grid>
              
  //   //           <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
  //   //             <AlaramChart charData={totalData} selectedStatus={"Minor"} />
  //   //           </Grid>
  //   //         </>
  //   //       ) : (
  //   //         <Grid item xs={12} style={{ textAlign: "center", padding: "40px" }}>
  //   //           <div>Loading Chart Data...</div>
  //   //         </Grid>
  //   //       )}
  //   //     </Grid>


  //   //   </Grid> */}

      
  //   //   <DataDialog
  //   //     openDialog={openDialog}
  //   //     handleCloseDialog={handleCloseDialog}
  //   //     selectedStatus={selectedStatus}
  //   //     barChartData={barChartData}
  //   //     columns={columns}
  //   //     rows={rows}
  //   //     page={page}
  //   //     rowsPerPage={rowsPerPage}
  //   //     handleChangePage={handleChangePage}
  //   //     handleChangeRowsPerPage={handleChangeRowsPerPage}
  //   //   />
  //   // </Box>


  //    <Box className="dashboard-container" 
  //   sx={{
  //     height: '100%',
  //     padding: {
  //       xs: '1px 1px 10px 5px', // Smaller padding for extra-small screens (mobile)
  //       sm: '1px 1px 12px 6px', // Slightly larger for small screens (tablets)
  //       md: '1px 1px 15px 7px', // Your current padding for medium screens (laptops at 90%)
  //       lg: '10px 10px 10px 10px', // Adjusted for larger screens (laptops at 100%)
  //       xl: '3px 3px 18px 9px', // Even larger for extra-large screens
  //     },
  //     boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  //     // Add this to prevent overflow
  //     overflowY: 'auto', // or 'auto' if you want scrollbars

  //     boxSizing: 'border-box', // Ensures padding doesn't add to the total width
  //   }}
  //     >
  //     <DashBoardBar updateMapMarkers={updateMapMarkers} totalData={totalData}   setmarkers={setmarkers}/>
  //     <Grid container spacing={1} >
  //       <Grid item xs={12} md={7} sm={6} lg={6} xl={6}>
  //         <MapComponent mapMarkers={mapMarkers} selectedStatus={selectedStatus} />
  //       </Grid>
  //       <Grid item xs={12} md={7} sm={6} lg={6} xl={6} >
  //         <Grid item xs={12} md={7} sm={6} lg={6} xl={6} >
  //           <Grid container spacing={1} direction="row" alignItems="center" justifyContent="space-between" marginBottom={1}>
  //               <Grid item xs={12} md={7} sm={6} lg={6} xl={6}>
  //                 <PieChartComponent2 totolData={totalData}  data1={data1} device={device} handlePieClick={handlePieClickCommu} />
  //               </Grid>
  //             {/* <Grid item xs={12} md={7} sm={6} lg={6} xl={6}>
  //               <PieChartComponent  data2={data2} handlePieClick={handlePieClick} />
  //             </Grid> */}
  //           </Grid>
  //         </Grid>
  //         <Grid item xs={12} md={7} sm={6} lg={6} xl={6}>
  //          <BarGraph data={zoneCircles}/> 
  //         </Grid>
  //       </Grid>
  //     </Grid>
      
  //     <DataDialog
  //       openDialog={openDialog}
  //       handleCloseDialog={handleCloseDialog}
  //       selectedStatus={selectedStatus}
  //       barChartData={barChartData}
  //       columns={columns}
  //       rows={rows}
  //       page={page}
  //       rowsPerPage={rowsPerPage}
  //       handleChangePage={handleChangePage}
  //       handleChangeRowsPerPage={handleChangeRowsPerPage}
  //     />
  //   </Box>
  // );
};

export default Dashboard;