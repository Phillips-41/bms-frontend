import  { createContext, useState, useEffect } from "react";
import { fetchStatesDetails, fetchDeviceDetails,fetchMapByState,fetchMapByCircle, fetchManufacturerDetails,  fetchHistoricalBatteryandChargerdetails,  fetchDaywiseBatteryandChargerdetails,
  fetchAlarmsBatteryandChargerdetails,fetchHistoricalCelldetails, 
  fetchCircleNames,
  fetchAreaList,
  fetchZoneNames,
fetchHistoricalCellAlarms,
fetchDivisionList,
fetchCircleWiseData,fetchDivisionWiseData} from "./apiService";
import { isEqual, set } from 'lodash';
import { getUserAccess } from "../utils/ProtectedRoutes";
export const AppContext = createContext();
//There are many states and functions in this context, which are used across the application for managing site details, device data, analytics, and user access. The context provides a centralized state management solution for the app.
export const AppProvider = ({ children }) => {
  const [siteOptions, setSiteOptions] = useState([]);
  const [siteIdOptions, setSiteIdOptions] = useState([]);
  const [serialNumberOptions, setSerialNumberOptions] = useState([]);
  const [siteId, setSiteId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [data, setData] = useState([]);
  const [Mdata, setMdata] = useState({
    ahCapacity: "",
    vendorName: "", // Default vendor name
    location: "", // Default location name
    latitude: 0, // Default latitude (could use a fallback like 0 or a center point)
    longitude: 0, // Default longitude (could use a fallback like 0 or a center point)
    siteId: "",
    serialNumber: "",
    packetDateTime: "",
    customer: "",
    batterySerialNumber: "",
    id:""
  });
  const [location, setLocation] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [charger, setCharger] = useState(null);
  const [liveTime, setLiveTime] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [page, setPage]=useState(0);
  const[rowsPerPage, setRowsPerPage]=useState(10);
  const [totalRecords, setTotalRecords] = useState(0)
  const [marginMinutes, setMarginMinutes] = useState(15);
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [loadingReport, setLoadingReport] = useState(false);
  const [errors, setErrors] = useState({
    siteId: false,
    serialNumber: false,
    startDate: false,
    endDate: false,
  });

  const[pageType,setPageType]=useState("")
  const[historicalType,setHistoricalType]=useState("")
  const[dayDaywiseData,setDayWiseData]=useState([])
  const[alarmsData,setAlarmsData]=useState([])
  const[realTimeData,setrealTimeData]=useState([])
  const [state, setState] = useState('');
  const [circle, setCircle] = useState('');
  const [circleOptions, setCircleOptions] = useState([]);
  const[zone,setZone]=useState('');
  const [zoneOptions, setZoneOptions] = useState([]);
  const[divisionOptions,setDivisionOptions]=useState([]);
  const[division,setDivision]=useState('');
  const [stateOptions, setStateOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const[status,setStatus]=useState(null);
  const[deviceId,setDeviceId]=useState('');
  const [area, setArea] = useState('');
  const [areaOptions, setAreaOptions] = useState([]);
const [configMissingOpen, setConfigMissingOpen] = useState(false);
  useEffect(() => {
    const fetchOptions = async () => {
   if (!token || token.trim() === "") return; 
   if (stateOptions && stateOptions.length > 0) return; 
      try {
       // const data = await fetchAllSiteIds();
        const statesData = await fetchStatesDetails();
        setStateOptions(statesData);
        setSiteIdOptions(data);
      } catch (error) {
        console.error("Error fetching site options:", error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };
    fetchOptions();
    const userAccess = getUserAccess();
    if(userAccess){
      handleStateChange(userAccess.state.value || "");
      handleZoneChange(userAccess.zone.value || "");
      handleCircleChange(userAccess.circle.value || "");
      handleDivisionChange(userAccess.division.value || "");
    }
  }, [token]); // Depend on token instead of isAuthenticated


  useEffect(() => {
    if (startDate && endDate ) {
      handleAnalytics(pageType);
    }
  }, [page, rowsPerPage]);
  
  const  handleSiteIdChange = (selectedSiteId) => {
    setSiteId(selectedSiteId);
    setSerialNumber("");

    const selectedSerial = siteOptions.find((site) => site.siteId === selectedSiteId);
    if (selectedSerial) {
      setSerialNumberOptions(selectedSerial?.serialNumbers|| []); // Use optional chaining to avoid errors if serialNumberList is undefined
    } else {
      setSerialNumberOptions([]);
    }
  };

const handleSearch = async (overrides = {}) => {
  const searchArea = overrides.area ?? area;
  const forceManufacturer = overrides.forceManufacturer === true;

  if (!token || !searchArea) return 0;

  try {

    const deviceResponse = await fetchDeviceDetails(area);
   
  
    const {
      chargerMonitoringDTO=[],
      deviceDataDTO=[],
      packetDateTime="",
      id="",
      status="",
      siteId: respSiteId="",
    } = deviceResponse || {};
    const isDeviceResponseEmpty = !deviceResponse || !id;
    // Header click: forceManufacturer is false → only when device changes
    // Navigation: forceManufacturer true → always load config
    if (forceManufacturer || id !== deviceId || isDeviceResponseEmpty) {
      let manufacturerDetails = null;
      try {
        manufacturerDetails = await fetchManufacturerDetails(searchArea);
      } catch (e) {
        setConfigMissingOpen?.(true);
        console.error(e);
      }

      if (
        manufacturerDetails == null ||
        (typeof manufacturerDetails === "object" &&
          Object.keys(manufacturerDetails).length === 0)
      ) {
       // setConfigMissingOpen?.(true);
        setMdata({
          ahCapacity: "",
          vendorName: "",
          location: "",
          latitude: 0,
          longitude: 0,
          siteId: "",
          serialNumber: "",
          packetDateTime: "",
          customer: "",
          batterySerialNumber: "",
          id: "",
        });
      } else {
        setMdata((prev) => {
          const next = { ...prev, ...manufacturerDetails };
          return isEqual(prev, next) ? prev : next;
        });
      }
    }

    if (deviceDataDTO?.length > 0) setData(deviceDataDTO);
    else setData([]);

    setCharger(chargerMonitoringDTO || null);

    if (packetDateTime) {
      setLiveTime(packetDateTime);
      setStatus(status);
    }
    if (id) setDeviceId(id);
    if (respSiteId) setSiteId(respSiteId);
    if (deviceDataDTO?.length > 0) {
      setSerialNumber(deviceDataDTO.map((d) => d.serialNumber));
    }

    return 1;
  } catch (error) {
    console.error("Search error:", error);
    if (error.response?.status === 401) handleLogout();
    return 0;
  }
};
  const handleAnalytics = async ({type=""}) => {
    // Check for empty fields and update errors state
    const newErrors = {
      area: !area,
      startDate: !startDate,
      endDate: !endDate,
    };
    setErrors(newErrors);

    // Stop execution if any field is empty
    if (!circle) {
      return;
    }
 

    try {
      setDayWiseData([])
      setAlarmsData([])
      setrealTimeData([])
      setLoadingReport(true);
      let result;
      switch (pageType) {
        case "historical":
          if(historicalType==="String Details"){
            if(!area || !startDate || !endDate) {
              return; // Exit if any required field is empty
            }
          result = await fetchHistoricalBatteryandChargerdetails(
            area,
            startDate,
            endDate,page,rowsPerPage
          );
          setrealTimeData(result)
          setTotalRecords(result.page.totalElements)
          setSiteId(result.siteId)
          setSerialNumber(result.serialNumber)
        }else if(historicalType==="Cell Details"){
            result = await fetchHistoricalCelldetails(
              area,
              startDate,
              endDate,page,rowsPerPage
            )
            setrealTimeData(result)
            setTotalRecords(result.page.totalElements)
            setSiteId(result.siteId)
            setSerialNumber(result.serialNumber)
          } else if(type==="Circle Wise"){
            setHistoricalType("Circle Wise")
             result= await fetchCircleWiseData(circle);
             setrealTimeData(result)
             setTotalRecords(result.length)
          }
          else if(type==="Sub Division Wise"){
            setHistoricalType("Circle Wise")
             result= await fetchDivisionWiseData(division);
             setrealTimeData(result)
             setTotalRecords(result.length)
          }
          else {
              result = await fetchHistoricalCellAlarms(
              area,
              startDate,
              endDate,page,rowsPerPage
            )
            setrealTimeData(result)
            setTotalRecords(result.page.totalElements)
            setSiteId(result.siteId)
            setSerialNumber(result.serialNumber)  
          }
          break;

        case "daywise":
          result = await fetchDaywiseBatteryandChargerdetails(
            area,
            startDate,
            endDate,page,rowsPerPage
          );
          setDayWiseData(result);
          setTotalRecords(result.data.totalElements)
          setSiteId(siteId)
          setSerialNumber(serialNumber)
          break;

        case "alarms":
          result = await fetchAlarmsBatteryandChargerdetails(
            area,
            startDate,
            endDate
            ,page,rowsPerPage
          );
          setAlarmsData(result)
          setTotalRecords(result.page.totalElements)
          setSiteId(result.siteId)
          setSerialNumber(result.serialNumber)
          break;

        default:
          throw new Error("Invalid page type");
      }

      return result;
     
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoadingReport(false);
    }
  };
  const handleLogout = (navigate) => {
    sessionStorage.removeItem("token");
    setToken("");
    setUserRole("");
    setUsername("");
    resetAppState();
    if (navigate) {
      navigate("/login"); 
    } 
  };

  const getSelectValue = (value) => {
    if (value && typeof value === 'object' && 'target' in value) {
      return value.target.value;
    }
    return value;
  };

  const handleStateChange = async (newValue) => {
    const value = getSelectValue(newValue);
    if (!value) return;
    setState(value);
    // setZone('');
    // setCircle('');
    setDeviceId('');
    // setCircleOptions([]);
    setSiteIdOptions([]);
    try {
      const mapData = await fetchZoneNames(value);
      setZoneOptions(mapData);
    } catch (error) {
      console.error('Error fetching map data for state:', error);
    }
  };
  const handleZoneChange = async (newValue) => {
    const value = getSelectValue(newValue);
    if (!value) return;
    setZone(value);
        setDeviceId('');
    // setCircleOptions([]);
    // setCircle('');
    setSiteOptions([]);
    setSiteIdOptions([]);
    try {
      const mapData = await fetchCircleNames(value);
      setCircleOptions(mapData);
      // setSiteIdOptions(mapData.map((site) => site.siteId));
    } catch (error) {
      console.error('Error fetching map data for circle:', error);
    }
  };
  const handleCircleChange = async (newValue) => {
    const value = getSelectValue(newValue);
    if (!value) return;
    setCircle(value);
    setDeviceId('');
    // setDivision('');
    // setDivisionOptions([]);
    setSiteOptions([]);
    setSiteIdOptions([]);
    // setAreaOptions([]);
    // setArea('');
    try {
      const mapData = await fetchDivisionList(value);
      setDivisionOptions(mapData);
      // setSiteIdOptions(mapData.map((site) => site.siteId));
    } catch (error) {
      console.error('Error fetching map data for circle:', error);
    }
  };

  const handleDivisionChange = async (newValue) => {
    const value = getSelectValue(newValue);
    if (!value) return;
    setDivision(value);
    setDeviceId('');
    setSiteOptions([]);
    setSiteIdOptions([]);

    try {
      const mapData = await fetchAreaList(value);
      setAreaOptions(mapData);
      setSiteIdOptions(mapData.map((site) => site.siteId));
    } catch (error) {
      console.error('Error fetching map data for circle:', error);
    }
  };

  const handleAreaChange = (newValue) => {
    if (!newValue) return;
    setSiteId('');
    setDeviceId('');
    setSerialNumber('');
    setSiteOptions([]);
    setSiteIdOptions([]);
    setHistoricalType('String Details');
    setArea(newValue);

  };

  const resetAppState = () => {
  // Live monitoring
  setData([]);
  setMdata({
    ahCapacity: "",
    vendorName: "",
    location: "",
    latitude: 0,
    longitude: 0,
    siteId: "",
    serialNumber: "",
    packetDateTime: "",
    customer: "",
    batterySerialNumber: "",
    id: "",
  });
  setCharger(null);
  setLiveTime(null);
  setLocation(null);
  setDeviceId("");
  setStatus(null);
  setIsChecked(false); // stop 5s polling

  // Filters
  setSiteId("");
  setSerialNumber("");
  setSiteOptions([]);
  setSiteIdOptions([]);
  setSerialNumberOptions([]);
  setState("");
  setZone("");
  setCircle("");
  setDivision("");
  setArea("");
  setStateOptions([]);
  setZoneOptions([]);
  setCircleOptions([]);
  setDivisionOptions([]);
  setAreaOptions([]);

  // Analytics
  setStartDate("");
  setEndDate("");
  setYear("");
  setMonth("");
  setDayWiseData([]);
  setAlarmsData([]);
  setrealTimeData([]);
  setPage(0);
  setRowsPerPage(10);
  setTotalRecords(0);
  setPageType("");
  setHistoricalType("");
  setLoadingReport(false);
  setErrors({
    siteId: false,
    serialNumber: false,
    startDate: false,
    endDate: false,
  });

  setMapMarkers([]);
};

  const clearOptions =  () => {
    setIsChecked(false);
    setDeviceId('');
    setMdata('');
    setData([]);
    setCharger([]);
    setLocation('');
    setLiveTime('');
    setDeviceId('');
    setIsChecked(false);
    setSiteId("");
    setSiteOptions([]);
    setSerialNumberOptions([]);
    setSerialNumber("");
    setState("");
    setCircle("");
    setZoneOptions([]);
    setDivisionOptions([]);
    setCircleOptions([]);
    setSiteIdOptions([]);
    setAreaOptions([]);
    setZone('');
    setDivision('');
    setArea('');
  };
  useEffect(() => {
    let intervalId;
    if (isChecked) {
      intervalId = setInterval(() => {
        handleSearch();
      }, 5000); // Call handleSearch every 1 second
    }
    return () => clearInterval(intervalId); // Cleanup on unmount or isChecked change
  }, [isChecked, handleSearch]);
  const contextValue = {
    clearOptions,
    siteOptions,
    serialNumberOptions,
    siteId,              // must be initialized as empty string
    serialNumber, 
    setSiteId: handleSiteIdChange,
    setSerialNumber,
    handleLogout, // Pass handleLogout to context
    data,
    Mdata,
    location,
   
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    username,
    setUsername,
    year,
    setYear,
    month,
    userRole,
    setUserRole,
    marginMinutes,
    setMarginMinutes,
    setMonth,
    charger,
    liveTime,
    setLiveTime,setSiteIdOptions,
    mapMarkers,setDeviceId,setLocation,setCharger,setMdata,setData,
    setMapMarkers,setSerialNumberOptions,setSiteOptions,handleSearch,
    token,pageType,setPageType,handleStateChange,handleCircleChange,state,circle,stateOptions,circleOptions,
    setToken,dayDaywiseData,alarmsData,realTimeData,setDayWiseData,setAlarmsData,setrealTimeData,
    page, setPage,rowsPerPage, setRowsPerPage,loadingReport,errors,totalRecords, setTotalRecords,siteIdOptions,
    handleAnalytics,setIsChecked,isChecked,setState,setCircle,historicalType,divisionOptions,setDivisionOptions,division,setDivision,
    setHistoricalType,setCircleOptions,status,zone,setZone,zoneOptions,setZoneOptions,handleZoneChange, 
    area, areaOptions, handleAreaChange, setArea,handleDivisionChange,setAreaOptions,configMissingOpen,
setConfigMissingOpen,
  };
 
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const formatToTime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};
export const formatDate = (dateInput) => {
  let date;

  // Handle different input types
  if (dateInput instanceof Date) {
      date = dateInput; // Use directly if it's already a Date object
  } else if (typeof dateInput === 'string') {
      // Decode URL-encoded string if necessary (e.g., "%20" -> " ")
      let dateString = decodeURIComponent(dateInput);
      date = new Date(dateString);
  } else if (typeof dateInput === 'number') {
      date = new Date(dateInput); // Handle timestamp
  } else {
      throw new Error('Invalid date input: ' + dateInput);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
      throw new Error('Unable to parse date: ' + dateInput);
  }

  // Format the date to "yyyy-MM-dd HH:mm:ss"
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};