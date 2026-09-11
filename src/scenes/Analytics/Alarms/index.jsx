import React, { useContext, useState } from "react";
import { 
  useTheme, 
  IconButton, 
  Box, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TableSortLabel,
  Tooltip
} from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import * as XLSX from "xlsx";
import { downloadBatteryAlarms } from "../../../services/apiService";
import { tokens } from "../../../theme";
import { formatTimeStamp } from "../Historical";

const columnMappings = {
  packetDateTime: "Packet Date Time",
  serverTime: "Server Date Time",
  bankCycle: "Bank Status",
  ambientTemperature: "Ambient Temp",
  soc: "SOC",
  stringVoltage: "String Voltage LNH",
  stringCurrent: "String Current",
  //bmsSedCommunication: "BMS SED Comm",
  cellCommunication: "Cell Comm",
  cellVoltageLN: "Cell Voltage LN",
  cellVoltageNH: "Cell Voltage NH",
  cellTemperature: "Cell Temp",
  buzzer: "Buzzer",
  inputMains: "Input Mains",
  inputPhase: "Input Phase",
  inputFuse: "Input Fuse",
  rectifierFuse: "Rectifier Fuse",
  filterFuse: "Filter Fuse",
  dcVoltageOLN: "DC Voltage LNH",
  outputFuse: "Output Fuse",
  acVoltageULN: "AC Voltage LNO",
  chargerLoad: "Charger Load",
  alarmSupplyFuse: "Alarm Supply Fuse",
  chargerTrip: "Charger Trip",
  outputMccb: "Output MCCB",
  batteryCondition: "Battery Condition",
 // testPushButton: "Test Push Button",
  resetPushButton: "Reset Push Button",
};

const Alarms = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { 
    alarmsData = {}, 
    page, 
    setPage, 
    rowsPerPage, 
    setRowsPerPage, 
    totalRecords,
    loadingReport,
    area,
    startDate,
    endDate
  } = useContext(AppContext);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // const formatTimeStamp = (dateString) => {
  //   if (!dateString) return "N/A";
  //   return new Date(dateString).toLocaleString("en-US", {
  //     year: "numeric",
  //     month: "2-digit",
  //     day: "2-digit",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //     hour12: false
  //   });
  // };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const dataArray = Array.isArray(alarmsData.content) ? alarmsData.content : [alarmsData];
  const displayedColumns = Object.keys(columnMappings);

  
  const handleDownloadExcel = async () => {

    try {
      setIsDownloading(true);
      setDownloadComplete(false);

    await downloadBatteryAlarms(area,formatDate(startDate),formatDate(endDate));

      setIsDownloading(false);
      setDownloadComplete(true);

      setTimeout(() => {
        setDownloadComplete(false);
      }, 2000);
    } catch (error) {
      console.error("Download failed:", error);
      setIsDownloading(false);
    }
  };

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
      }}>
        <ReportsBar pageType="alarms" />
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative', marginRight: '20px', marginTop:'8px' }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loadingReport || isDownloading || !area|| !startDate || !endDate }
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
          <Typography variant="body1"  sx={{color:"#fff"}}>Loading alarms data...</Typography>
        </Box>
      ) : dataArray.length > 0 && Object.keys(alarmsData).length > 0 ? (
        <Box>
          <TableContainer
            component={Paper}
            sx={{
              overflowX: "auto",
              border: "1px solid black",
              borderRadius: "8px",
              ml:1,
                backgroundColor: colors.primary[100], // Transparent background
            '& .MuiPaper-root': {
              backgroundColor:colors.primary[100], // Override Paper's default white background
            },
              maxHeight: {lg:"330px",md:"300px",sm:"270px",xs:"400px",xl:"510px"},
            }}
          >
            <Table stickyHeader aria-label="alarms table">
              <TableHead>
                <TableRow>
                  {displayedColumns.map((key) => (
                    <TableCell
                      key={key}
                      sx={{
                        fontWeight: "bold",
                        background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                        color: colors.primary[200],
                        padding: "3px",
                        minWidth: "150px",
                        whiteSpace: "nowrap",
                        textAlign: "center"
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
                          padding: "3px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                           color: colors.primary[200], // White text
                            border: colors.primary[300], // Lighter white border
                      backgroundColor: 'transparent', // Transparent background
                        }}
                      >
                        {key === "packetDateTime" || key === "serverTime"
                          ? formatTimeStamp(row[key])
                          : key === "dcVoltageOLN"
                          ? row[key] === "Normal" ? "Normal" : 
                            row[key] === "Low" ? "Low" : 
                            row[key] === "Over" ? "Over" : row[key]
                          : key === "resetPushButton"
                          ? row[key] === "Fail" ? "detected" : "Normal"
                          : key === "batteryCondition"
                          ? row[key] === "Fail" ? "Low" : "Normal"
                          : row[key] === "Fail" ? "Fail" :
                            row[key] === "Normal" ? "Normal" :
                            row[key] || "N/A"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[25, 50, 75]}
            component="div"
            count={totalRecords || dataArray.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
            color: colors.primary[200], // White text for all elements
            backgroundColor: 'transparent !important', // Transparent background
            '& .MuiTablePagination-toolbar': {
              height: '35px', // Match TextField/DatePicker height
              color: colors.primary[200], // White toolbar text
              backgroundColor: 'transparent !important', // Transparent toolbar
            },
            '& .MuiTablePagination-selectLabel': {
              color: colors.primary[200], // White "Rows per page" label
              fontSize: '12px',
              fontFamily: 'Source Sans Pro',
              fontWeight: 'bold',
            },
            '& .MuiTablePagination-displayedRows': {
              color: colors.primary[200], // White "1-10 of 100" text
              fontSize: '12px',
              fontFamily: 'Source Sans Pro',
              fontWeight: 'bold',
            },
            '& .MuiTablePagination-select': {
              color: colors.primary[200], // White select text
              fontSize: '12px',
              fontFamily: 'Source Sans Pro',
              fontWeight: 'bold',
              '& .MuiSelect-select': {
                padding: '2px 24px 2px 8px', // Adjust padding for consistency
              },
            },
            '& .MuiTablePagination-selectIcon': {
              color: colors.primary[200], // White dropdown arrow
            },
            '& .MuiTablePagination-actions': {
              '& .MuiIconButton-root': {
                color: colors.primary[200], // White navigation icons
              },
              '& .Mui-disabled': {
                color: colors.primary[200], // White for disabled icons
                opacity: 0.5, // Slight fade for disabled state
              },
            },
            '& .MuiTablePagination-menu': {
              '& .MuiPaper-root': {
                backgroundColor: 'black !important', // Black dropdown menu
                color: colors.primary[200], // White menu items
                border: '1px solid white !important', // White border for dropdown
              },
              '& .MuiMenuItem-root': {
                color: colors.primary[200], // White menu item text
                fontSize: '12px',
                fontFamily: 'Source Sans Pro',
                '&:hover': {
                  backgroundColor: '#333 !important', // Darker gray on hover
                },
              },
            },
            '& .MuiInputBase-root': {
              color: colors.primary[200], // White select input
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[200], // White border for select
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[200], // White border on hover
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.primary[200], // White border when focused
              },
            },
          }}
          />
        </Box>
      ) : (
        <Typography variant="body1" sx={{ marginTop: 2, color:colors.primary[200],textAlign: "center" }}>
          No data available
        </Typography>
      )}
    </div>
  );
};

export default Alarms;