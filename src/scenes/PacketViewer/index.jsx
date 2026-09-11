import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  Box,Tooltip
} from "@mui/material";
import { tokens } from "../../theme";
import { TextField,useTheme } from "@mui/material";
import { CustomToggle } from "../global/Topbar";
import clear from "../../assets/images/png/brush.png"
import { Button } from '@mui/material';
import { setDate } from "date-fns";
import { set } from "lodash";
function PacketViwer() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const [rawData, setRawData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [highlightedCellId, setHighlightedCellId] = useState(null);
  const cellRefs = useRef({});
  const BASE_URL = "https://rbms.mahadiscom.in/mseb";
  const [copiedId, setCopiedId] = useState(null);
  const [siteId, setSiteId] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const[lastId,setLastId]=useState(null);
  const[firstId,setFirstId]=useState(null);

  const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  apiClient.interceptors.request.use(
    (config) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  const loadNextPage = async () => {
  if (!lastId) return;

  if(siteId && startDate){
    setFirstId(null);
    return fetchDataByDate(startDate);
  }

  const res =  await apiClient.get(
        `${BASE_URL}/packetViewer/nextPage?lastId=${lastId ?? ""}&size=18`);
  const data = res.data;

  if (data.length === 0) return; // No more pages

  setRawData(data);

  setFirstId(data[0].rawDataId);
  setLastId(data[data.length - 1].rawDataId);
};
const loadPrevPage = async () => {
  if (!firstId) return;

  if(siteId && startDate){
    setLastId(null);
    if(!lastId){
      setLastId(null);
    }
    return fetchPreviousDataByDate(startDate);
  }

  const res =  await apiClient.get(
        `${BASE_URL}/packetViewer/prevPage?firstId=${firstId ?? ""}&size=18`);
  const data =  res.data;


  if (data.length === 0) return;

  setRawData(data);

  setFirstId(data[0].rawDataId);
  setLastId(data[data.length - 1].rawDataId);
};


  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${BASE_URL}/packetViewer/nextPage?lastId=${lastId ?? ""}&size=18`
      );
      setRawData(response.data);
     setFirstId(response.data[0].rawDataId);
     setLastId(response.data[response.data.length - 1].rawDataId);
   
      //setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${BASE_URL}/packetViewer/latest?size=18`
      );
      setRawData(response.data);
     setFirstId(response.data[0].rawDataId);
     setLastId(response.data[response.data.length - 1].rawDataId);
   
      //setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };


  const fetchDataByDate = async (date) => {
    setLoading(true);
    try {
      var dt =date.toLocaleDateString('en-CA');
      const response = await apiClient.get(
    `${BASE_URL}/packetViewer/siteData?siteId=${siteId}&date=${dt}&firstId=${firstId ? firstId : ""}&lastId=${lastId ? lastId : ""}&size=18`


      );
      const data =  response.data;


  if (data.length === 0) return setRawData(data);

  setRawData(data);

  setFirstId(data[0].rawDataId);
  setLastId(data[data.length - 1].rawDataId);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
   const fetchLatestSiteDataByDate = async (date) => {
    setLoading(true);
    try {
      var dt =date.toLocaleDateString('en-CA');
      const response = await apiClient.get(
    `${BASE_URL}/packetViewer/latestSiteData?siteId=${siteId}&date=${dt}&size=18`


      );
      const data =  response.data;


  if (data.length === 0) return setRawData(data);

  setRawData(data);

  setFirstId(data[0].rawDataId);
  setLastId(data[data.length - 1].rawDataId);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
   const fetchPreviousDataByDate = async (date) => {
    setLoading(true);
    try {
      var dt =date.toLocaleDateString('en-CA');
      const response = await apiClient.get(
    `${BASE_URL}/packetViewer/previousData?siteId=${siteId}&date=${dt}&firstId=${firstId ? firstId : ""}&lastId=${lastId ? lastId : ""}&size=18`


      );
      const data =  response.data;


  if (data.length === 0) return setRawData(data);

  setRawData(data);

  setFirstId(data[0].rawDataId);
  setLastId(data[data.length - 1].rawDataId);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedData = async (id) => {
    setLoading(true);
    try {
      const response = await apiClient.get(
        `${BASE_URL}/packetViewer/parsedData?id=${id}`
      );
      setSelectedData(response.data);
    } catch (error) {
      console.error("Error fetching detailed data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleDateChange = (newDate) => {
    setFirstId(null);
    setLastId(null);
    setStartDate(newDate);
    setPage(0);
    if (newDate && !isChecked) {
       setFirstId(null);
    setLastId(null);
      fetchDataByDate(newDate);
    } else if (!newDate && !isChecked) {
      fetchData(0);
    }
  };


  // Initial data fetch (runs once on mount)
useEffect(() => {
  if (!isChecked) {
    if (startDate) {
      fetchDataByDate( startDate,siteId);
    } else {
      fetchData(page);
    }
  }
}, [page,startDate]); // Empty dependency array = runs only once on mount

// Auto-refresh effect (only when isChecked is true)
useEffect(() => {
  let intervalId;
  
  if (isChecked) {
    const fetchFn = startDate 
      ? () => fetchLatestSiteDataByDate(startDate)
      : () => fetchAllData();
    
    // Immediate first fetch
    fetchFn();
    
    // Then set up interval
    intervalId = setInterval(fetchFn, 5000);
  }
  
  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}, [isChecked, page, startDate]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const handleRowClick = (id) => {
    setSelectedRowId(id);
    fetchDetailedData(id);
  };

  const renderKeyValuePairs = (obj, title) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
        {title}
      </Typography>
      {Object.entries(obj).map(([key, value]) => (
        <Paper 
        elevation={3}
          key={key}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            p: 1,
            bgcolor:  colors.primary[100],
            borderRadius: 1,
            mb: 0.5,
            color:  colors.primary[200],
          }}
        >
          <Typography sx={{ fontWeight: "medium" }}>
            {key.replace(/([A-Z])/g, " $1").trim()}:
          </Typography>
          <Typography>
            {typeof value === "boolean"
              ? value
                ? "Failure"
                : "Normal"
              : (
                  typeof value === "string" && 
                  (value.includes("-") || value.includes(":")) && // Ensure it looks like a date/time string
                  !isNaN(Date.parse(value)) && 
                  !/^\d{8}$/.test(value)
                )
              ? new Date(value).toLocaleString('en-GB', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: false,
                })
              : typeof value === "object" || (typeof value === "string" && value !== null)
              ? JSON.stringify(value)
              : String(value)}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
const clearOptions=()=>{
setSiteId("");
setStartDate("")
setFirstId(null);
setLastId(null);
fetchData();
}
  const renderDetailedData = () => {
    if (!selectedData) return null;

    const { bmsalarms, chargerStatusData, cellVoltageTemperatureData, ...otherData } = {
      ...selectedData,
      ...selectedData.deviceData[0],
      ...selectedData.chargerMonitoringData[0],
    };

    const alarmsData = { "BMS Alarms": bmsalarms, "Charger Status": chargerStatusData };
    const cellsData = cellVoltageTemperatureData || [];
    const filteredOtherData = { ...otherData };
    delete filteredOtherData.deviceData;
    delete filteredOtherData.chargerMonitoringData;

    return (
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          maxHeight: "72vh",
          overflowY: "auto",
          p: 2,
          bgcolor:  colors.primary[100],
          borderRadius: 2,
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color:  colors.primary[200] }}>
            Alarms
          </Typography>
          {Object.entries(alarmsData).map(([title, data]) =>
            renderKeyValuePairs(data, title)
          )}
        </Box>
         <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color:  colors.primary[200]}}>
        
          </Typography>
          {renderKeyValuePairs(filteredOtherData, "General Info")}
        </Box>
        <Box sx={{ flex: 1, minWidth: "300px" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color:  colors.primary[200] }}>
            Cells Data
          </Typography>
          {cellsData.length > 0 ? (
            cellsData.map((cell, index) => renderKeyValuePairs(cell, `Cell ${index + 1}`))
          ) : (
            <Typography sx={{ color: colors.primary[200]}}>No cell data available</Typography>
          )}
        </Box>
      </Box>
    );
  };
 

const handleCopy = async (text, index) => {
  try {
    await navigator.clipboard.writeText(text);
    setCopiedId(index); // Track the index of the copied row
    setTimeout(() => setCopiedId(null), 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(index); // Track the index of the copied row
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
    document.body.removeChild(textArea);
  }
};
  return (
    <Grid container spacing={0} sx={{ overflow: "hidden" }}>
      <Grid item xs={12} md={5}>
        <Box
          sx={{
           display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: 2,
            maxWidth: "1000px",
            margin: "0 auto",
            gap: 1,
            height: "100%", // Add this to contain everything properly
              }}
            >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, bgcolor: colors.primary[100], color:  colors.primary[200] }}>
             <TextField
              type="text"
              label="Select SiteId"
              value={siteId}
              onChange={(e) => {setSiteId(e.target.value); setFirstId(null); setLastId(null);} }
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: 140,
                fontSize: "12px",
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "30px",
                  fontSize: "12px",
                //    bgcolor: "#000",
                  border: "1px solid rgb(117, 118, 123)",
                  color:  colors.primary[200],
                },
                "& .MuiInputLabel-root": {
                  fontWeight: "bold",
                  fontSize: "12px",
                  color:  colors.primary[200],
                },
              }}
            />
            <TextField
              type="date"
              label="Select Date"
              value={startDate ? startDate.toISOString().split("T")[0] : ""}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                width: 140,
                fontSize: "12px",
                "& .MuiInputBase-root": {
                  fontWeight: "bold",
                  height: "30px",
                  fontSize: "12px",
                 // bgcolor: "#000",
                  border: "1px solid rgb(117, 118, 123)",
                  color:  colors.primary[200],
                },
                "& .MuiInputLabel-root": {
                  fontWeight: "bold",
                  fontSize: "12px",
                  color:  colors.primary[200],
                },
              }}
            />
            <CustomToggle isChecked={isChecked} handleCheckboxChange={handleCheckboxChange} />
              <Button
              // variant="outlined"
              color="error"
              onClick={clearOptions}
              // disabled={!siteId && !circle && !state}
              size="small"
              sx={{
                border: 'none', // Remove border
                minWidth: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem', xl: '2rem' }, // Adjust size for image
                height: { xs: '1.625rem', sm: '1.75rem', md: '1.875rem', lg: '1.875rem', xl: '1.875rem' },
                padding: 0, // Remove padding to fit image tightly
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: 'transparent', // Keep hover background transparent
                },
              }}
            >
              <Tooltip
                title="Clear"
                placement="bottom" // Tooltip appears below the image
                arrow // Adds an arrow to the tooltip
                sx={{
                  '& .MuiTooltip-tooltip': {
                    fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' }, // Responsive font size
                    backgroundColor: theme.palette.error.light, // Match error theme
                    color: theme.palette.error.contrastText, // Ensure readable text color
                    padding: { xs: '0.25rem 0.5rem', sm: '0.3rem 0.6rem', md: '0.4rem 0.8rem' }, // Responsive padding
                  },
                  '& .MuiTooltip-arrow': {
                    color: theme.palette.error.light, // Arrow matches tooltip background
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img src={clear} alt="Clear" height="20" width="20" />
                </Box>
              </Tooltip>
            </Button>
          </Box>
          <>
              <TableContainer
              component={Paper}
              sx={{
                borderRadius: '8px 8px 0 0',
                overflowY: 'auto',
                background: colors.primary[100], // Black background for container
                color: '#fff',
                maxHeight: {
                  xs: '300px',
                  sm: '400px',
                  md: '500px',
                  lg: '350px',
                  xl: '70vh',
                },
                m: 0,
                p: 0,
                width: '100%'
              }}
            >
            <Table sx={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
              <TableHead sx={{ 
                background: 'linear-gradient(rgb(73, 196, 53), rgb(50, 128, 63))' // Green gradient for header
              }}>
                <TableRow>
                  <TableCell
                    sx={{
                      color:  colors.primary[200],
                      p: 1,
                      width: '20%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '10px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                      lineHeight: 1,
                    }}
                  >
                    General ID
                  </TableCell>
                  <TableCell
                    sx={{
                      color:  colors.primary[200],
                      p: 1,
                      width: '40%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '10px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                      lineHeight: 1,
                    }}
                  >
                    Raw Data
                  </TableCell>
                  <TableCell
                    sx={{
                      color:  colors.primary[200],
                      p: 1,
                      width: '20%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '10px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                      lineHeight: 1,
                    }}
                  >
                    Substation ID
                  </TableCell>
                  <TableCell
                    sx={{
                      color:  colors.primary[200],
                      p: 1,
                      width: '20%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '10px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                      lineHeight: 1,
                    }}
                  >
                    Date Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ background: '#000' }}>
                {rawData.map((data, index) => (
                  <TableRow
                    key={index}
                    onClick={() => {
                      setSelectedDateTime(data.serverDateTime); // Set selected datetime
                      handleRowClick(data.generalDataId);
                    }}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      cursor: 'pointer',
                      borderBottom: colors.primary[300],
                      '&.Mui-selected, &.Mui-selected:hover': {
                        backgroundColor: '#616161 !important',
                      },
                    }}
                    selected={data.serverDateTime === selectedDateTime}
                    aria-selected={data.serverDateTime === selectedDateTime}
                    role="row"
                  >
                    <TableCell
                      sx={{
                        p: 1,
                        fontSize: '10px',
                        color:  colors.primary[200],
                        bgcolor: data.serverDateTime === selectedDateTime ? '#616161' :  colors.primary[ 100],
                        borderBottom: 'none',
                        textAlign: 'center',
                        lineHeight: 1,
                      }}
                    >
                      {data.generalDataId}
                    </TableCell>

                    <TableCell
                      ref={(el) => (cellRefs.current[index] = el)}
                      sx={{
                        p: 1,
                        fontSize: '10px',
                        color:  colors.primary[200],
                        bgcolor:
                          data.serverDateTime === selectedDateTime
                            ? '#616161'
                            : copiedId === index
                            ? '#424242'
                            :  colors.primary[100],
                        borderBottom: 'none',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1,
                        transition: 'background-color 0.3s ease',
                      }}
                    >
                      <Tooltip
                        title={copiedId === index ? 'Copied!' : 'Click to copy'}
                        placement="top"
                        arrow
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(data.rawData, index);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontSize: '10px',
                            color:  colors.primary[200],
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'inline-block',
                            maxWidth: '100%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          aria-label={`Copy raw data for row ${index}`}
                        >
                          {data.rawData}
                        </button>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      sx={{
                        p: 1,
                        fontSize: '10px',
                        color:  colors.primary[200],
                        bgcolor: data.serverDateTime === selectedDateTime ? '#616161' :  colors.primary[100],
                        borderBottom: 'none',
                        textAlign: 'center',
                        lineHeight: 1,
                      }}
                    >
                      {data.siteId}
                    </TableCell>

                    <TableCell
                      sx={{
                        p: 1,
                        fontSize: '10px',
                        color:  colors.primary[200],
                        bgcolor: data.serverDateTime === selectedDateTime ? '#616161' :  colors.primary[100],
                        borderBottom: 'none',
                        textAlign: 'center',
                        lineHeight: 1,
                      }}
                    >
                      {new Date(data.serverDateTime).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
              <div style={{ display: "flex", justifyContent: "center", marginTop: "10px", gap: "10px" }}>
                
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={loadPrevPage} 
                  disabled={!firstId}
                >
                  Previous
                </Button>

                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={loadNextPage} 
                  disabled={!lastId}
                >
                  Next
                </Button>
                
              </div>

            </>
        </Box>
      </Grid>
      <Grid item xs={12} md={7}>
        <Box
          sx={{
            background: "linear-gradient(to bottom, rgb(73, 196, 53), rgb(50, 128, 63))",
            color:  colors.primary[100],
            padding: 1,
            textAlign: "center",
            width: "100%",
          }}
        >
          <Typography variant="h4">Packet Viewer</Typography>
        </Box>
        <Box
          sx={{
            bgcolor: colors.primary[100],
            color:  colors.primary[200],
            borderLeft: "1px solid rgba(255, 255, 255, 0.25)",
            minHeight: "74vh",
          }}
        >
          {selectedData ? (
            renderDetailedData()
          ) : (
            <Typography sx={{ color:  colors.primary[200] }}>Select a row to view detailed data</Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default PacketViwer;