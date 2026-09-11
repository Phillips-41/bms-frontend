import React, { useContext, useEffect, useState } from "react";
import {
  useTheme,
  IconButton,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Typography,
  TablePagination,
} from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { downloadCellsAlarms, downloadHistoricalBatteryandChargerdetails,downloadHistoricalCells } from '../../../services/apiService';
import { CellType } from "./CellType";
import { tokens } from "../../../theme";
import { CellAlarms } from "./CellAlarms";
import { Circle } from "lucide-react";
import { CircleWise } from "./CircleWise";

const columnMappings = {
  serverTime: "Server Date Time",
  packetDateTime: "Packet Date Time",
  cellsConnectedCount: "Connected Cells",
  problemCells: "Problem Cells",
  stringVoltage: "String Voltage (V)",
  systemPeakCurrentInChargeOneCycle: "Peak Charge Current (A)",
  systemPeakCurrentInDischargeOneCycle: "Peak Discharge Current (A)",
  averageDischargingCurrent: "Avg Discharge Current (A)",
  averageChargingCurrent: "Avg Charge Current (A)",
  ahInForOneChargeCycle: "AH In For Charge Cycle (Ah)",
  ahOutForOneDischargeCycle: "AH Out For Charge Cycle (Ah)",
  cumulativeAHIn: "Cumulative Ah In",
  cumulativeAHOut: "Cumulative Ah Out",
  chargeTimeCycle: "Charge Time",
  dischargeTimeCycle: "Discharge Time",
  totalChargingEnergy: "Charging Energy (kWh)",
  totalDischargingEnergy: "Discharging Energy (kWh)",
  everyHourAvgTemp: "Hourly Avg Temp (°C)",
  cumulativeTotalAvgTempEveryHour: "Cumulative Avg Temp (°C)",
  chargeOrDischargeCycle: "Cycle Count",
  socLatestValueForEveryCycle: "SOC (%)",
  dodLatestValueForEveryCycle: "DOD (%)",
  instantaneousCurrent: "Current (A)",
  ambientTemperature: "Ambient Temp (°C)",
  acVoltage: "AC Voltage (V)",
  acCurrent: "AC Current (A)",
  frequency: "Frequency (Hz)",
  energy: "Energy (kWh)",
  batteryRunHours: "Run Hours",
  //powerFactor: "Power Factor",
};
 export const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return "N/A";
    return Number(value).toFixed(decimals);
  };
   export const formatDuration = (seconds) => {
    if (!seconds) return "00:00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

export const formatTimeStamp = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  };
const Historical = () => {
  const theme = useTheme();
        const colors = tokens(theme.palette.mode);
  const { 
    realTimeData = {}, 
    page, 
    setPage, 
    rowsPerPage, 
    setRowsPerPage, 
    startDate, 
    endDate, 
    area,
    totalRecords,
    loadingReport,historicalType,setrealTimeData
  } = useContext(AppContext);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  
  useEffect(() => {
    setrealTimeData([])
  },[historicalType])

 
 
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDownloadExcel = async () => {
    if (area && startDate && endDate) {
      try {
        setIsDownloading(true);
        setDownloadComplete(false);
       if(historicalType === "String Details"){
        await downloadHistoricalBatteryandChargerdetails(
          area,
          formatDate(startDate),
          formatDate(endDate)
        );
       }else if(historicalType === "Cell Alarms"){
        await downloadCellsAlarms(
          area,
          formatDate(startDate),
          formatDate(endDate)
        )
        
      }else{
        await downloadHistoricalCells(
          area,
          formatDate(startDate),
          formatDate(endDate)
        );
      }
        setIsDownloading(false);
        setDownloadComplete(true);
        
        setTimeout(() => {
          setDownloadComplete(false);
        }, 2000);
      } catch (error) {
        console.error("Download failed:", error);
        setIsDownloading(false);
      }
    }
  };

  const dataArray = Array.isArray(realTimeData.content) ? realTimeData.content : [realTimeData];
  const displayedColumns = Object.keys(columnMappings);
  const cellDataArray= realTimeData.content
  const circleDataArray= realTimeData;

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        // alignItems: "center", 
        // marginBottom: "10px" 
      }}>
        <ReportsBar isHistorical={true} pageType="historical" />
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative', marginRight: '20px', marginTop:'8px' }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loadingReport || !area || !startDate || !endDate || isDownloading}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                '&:hover': { backgroundColor: '#388e3c' },
                '&.Mui-disabled': { backgroundColor: '#4caf50', opacity: 0.5 },
              }}
            >
              {downloadComplete ? (
                <CheckCircleIcon />
              ) : (
                <GridOnIcon />
              )}
            </IconButton>
            {isDownloading && (
              <CircularProgress
                size={40}
                sx={{
                  color: '#4caf50',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px',
                }}
              />
            )}
          </Box>
        </Tooltip>
      </div>

      {loadingReport ? (
        <Box 
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "379px",
            flexDirection: "column",
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{color:"#fff"}}>Loading historical data...</Typography>
        </Box>
      ) : dataArray.length > 0 && Object.keys(realTimeData).length > 0 ? (
        <>{historicalType === "String Details" ?(
         <Box>
          <TableContainer
              component={Paper}
              sx={{
                // border: '1px solid white',// White border for visibility
                ml: 1,
                mr: 2,
                backgroundColor: colors.primary[100], // Dark background
                '& .MuiPaper-root': {
                  backgroundColor: colors, // Override Paper's default white background
                },
                overflowX: 'auto',
                border: '1px solid black',
                borderRadius: '8px',
                maxHeight: { lg: '330px', md: '300px', sm: '270px', xs: '400px', xl: '440px' },
              }}
            >
              <Table stickyHeader aria-label="battery monitoring table">
                <TableHead>
                  <TableRow>
                    {displayedColumns.map((key) => (
                      <TableCell
                        key={key}
                        sx={{
                          fontWeight: 'bold',
                          background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                          color: colors.primary[200],
                          padding: '3px',
                          minWidth: '150px',
                          whiteSpace: 'nowrap',
                          textAlign: 'center',
                        }}
                      >
                        {columnMappings[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataArray.map((row, index) => (
                    <TableRow
                      key={index}
                    >
                      {displayedColumns.map((key) => (
                        <TableCell
                          key={key}
                          sx={{
                            border: colors.primary[300], // Lighter white border
                            padding: '3px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            textAlign: 'center',
                            color: colors.primary[200], // White text
                            backgroundColor:key === 'serverTime' && row.statusId === 1 ? '#ffc458': 'transparent', // Transparent background
                          }}
                        >
                          {key === 'packetDateTime' || key === 'serverTime'
                            ? formatTimeStamp(row[key])
                            : key === 'chargeTimeCycle' || key === 'dischargeTimeCycle' || key === 'batteryRunHours'
                            ? formatDuration(row[key])
                            : key === 'problemCells' || key === 'cellsConnectedCount' || key === 'chargeOrDischargeCycle'
                            ? formatNumber(row[key], 0)
                            : formatNumber(row[key])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Custom text on the left */}
                <Typography
                  sx={{
                    color: "#ffc458",
                    fontSize: '12px',
                    fontFamily: 'Source Sans Pro',
                    fontWeight: 'bold',
                    marginLeft: '16px', // Space between text and pagination
                  }}
                >
                  Orange: Stored Packet
                </Typography>

                <TablePagination
                  rowsPerPageOptions={[25, 50, 75]}
                  component="div"
                  count={totalRecords || dataArray.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  sx={{
                    color: colors.primary[200],
                    backgroundColor: 'transparent !important',
                    '& .MuiTablePagination-toolbar': {
                      height: '35px',
                      color: colors.primary[200],
                      backgroundColor: 'transparent !important',
                    },
                    '& .MuiTablePagination-selectLabel': {
                      color: colors.primary[200],
                      fontSize: '12px',
                      fontFamily: 'Source Sans Pro',
                      fontWeight: 'bold',
                    },
                    '& .MuiTablePagination-displayedRows': {
                      color: colors.primary[200],
                      fontSize: '12px',
                      fontFamily: 'Source Sans Pro',
                      fontWeight: 'bold',
                    },
                    '& .MuiTablePagination-select': {
                      color: colors.primary[200],
                      fontSize: '12px',
                      fontFamily: 'Source Sans Pro',
                      fontWeight: 'bold',
                      '& .MuiSelect-select': {
                        padding: '2px 24px 2px 8px',
                      },
                    },
                    '& .MuiTablePagination-selectIcon': {
                      color: colors.primary[200],
                    },
                    '& .MuiTablePagination-actions': {
                      '& .MuiIconButton-root': {
                        color: colors.primary[200],
                      },
                      '& .Mui-disabled': {
                        color: colors.primary[200],
                        opacity: 0.5,
                      },
                    },
                    '& .MuiTablePagination-menu': {
                      '& .MuiPaper-root': {
                        backgroundColor: 'black !important',
                        color: colors.primary[200],
                        border: '1px solid white !important',
                      },
                      '& .MuiMenuItem-root': {
                        color: colors.primary[200],
                        fontSize: '12px',
                        fontFamily: 'Source Sans Pro',
                        '&:hover': {
                          backgroundColor: '#333 !important',
                        },
                      },
                    },
                    '& .MuiInputBase-root': {
                      color: colors.primary[200],
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary[200],
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary[200],
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.primary[200],
                      },
                    },
                  }}
                />
            </Box>
          </Box>
        ): historicalType === "Cell Details" ?(
        <CellType data={cellDataArray}/>
       ): historicalType === "Circle Wise" ?(
        <CircleWise data={circleDataArray}/>
       ): (
        <CellAlarms data={cellDataArray}/>
       ) }
        </>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center",color:colors.primary[200]}}>
          No data available
        </Typography>
      )}
    </div>
  );
};

export default Historical;