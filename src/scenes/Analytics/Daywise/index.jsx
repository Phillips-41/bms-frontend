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
  Tooltip
} from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import ChargingGraph from "./ChargingGraph";
import AhGraph from "./AhGraph";
import { formatToTime } from "../../../services/AppContext";
import GridOnIcon from '@mui/icons-material/GridOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { downloadDayWiseBatteryandChargerdetails } from '../../../services/apiService';
import { tokens } from "../../../theme";
import { formatDateStamp } from "../Historical/CellType";

const columnMappings = {
  dayWiseDate: "Date",
  chargeOrDischargeCycle: "Charge/Discharge Cycle",
  cumulativeAHIn: "Cumulative Ah In (Ah)",
  cumulativeAHOut: "Cumulative Ah Out (Ah)",
  totalChargingEnergy: "Total Charging Energy (kWh)",
  totalDischargingEnergy: "Total Discharging Energy (kWh)",
  batteryRunHours: "Battery Run Hours",
  totalSoc: "Avg SOC (%)",
  cumulativeTotalAvgTemp: " Avg Temperature(°C)",
};

const DayWise = () => {
  const theme = useTheme();
  const colors= tokens(theme.palette.mode);
  const { 
    dayDaywiseData = [],  
    page, 
    setPage, 
    setRowsPerPage, 
    rowsPerPage,
    siteId,
    serialNumber,
    startDate, 
    endDate, 
    totalRecords,
    loadingReport ,
    area
  } = useContext(AppContext);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(decimals);
  };

  const formatData = (data) => {
    const dataArray = Array.isArray(data) ? data : data?.data?.content || [];
    if (!dataArray.length) return [];

    return dataArray.map((row) => {
      const {
        dayWiseDate,
        batteryRunHours,
        chargeOrDischargeCycle,
        cumulativeAHIn,
        cumulativeAHOut,
        totalChargingEnergy,
        totalDischargingEnergy,
        totalSoc,
        cumulativeTotalAvgTemp
      } = row;

      // Convert to IST and format date
      let formattedDate = "No Date";
      if (dayWiseDate) {
        const date = new Date(dayWiseDate);
        const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
        const istDate = new Date(date.getTime() + istOffset);
        formattedDate = istDate.toISOString().split("T")[0]; // YYYY-MM-DD
      }

      return {
        dayWiseDate: formattedDate,
        batteryRunHours: formatToTime(batteryRunHours || 0),
        chargeOrDischargeCycle: chargeOrDischargeCycle || 0,
        cumulativeAHIn: formatNumber(cumulativeAHIn),
        cumulativeAHOut: formatNumber(cumulativeAHOut),
        totalChargingEnergy: formatNumber(totalChargingEnergy),
        totalDischargingEnergy: formatNumber(totalDischargingEnergy),
        totalSoc: formatNumber(totalSoc),
        cumulativeTotalAvgTemp: formatNumber(cumulativeTotalAvgTemp),
      };
    });
};

  const formattedData = formatData(dayDaywiseData);

  const handleDownloadExcel = async () => {
    if (!area|| !startDate || !endDate) {
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadComplete(false);

      await downloadDayWiseBatteryandChargerdetails(
        area,
        formatDate(startDate),
        formatDate(endDate)
      );

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
        <ReportsBar pageType="daywise" />
        <Tooltip title="Export to Excel">
          <Box sx={{ position: 'relative', marginRight: '20px', marginTop: '8px' }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loadingReport || isDownloading || !startDate || !endDate}
              sx={{
                backgroundColor: '#4caf50',
                color: colors.primary[200],
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

      <Box
        sx={{
          height: "calc(100vh - 200px)",
          overflowY: "auto",
          padding: "10px",
        }}
      >
        {loadingReport ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              flexDirection: "column",
              gap: 2
            }}
          >
            <CircularProgress />
            <Typography variant="body1"  sx={{color:colors.primary[200]}}>Loading day-wise data...</Typography>
          </Box>
        ) : formattedData.length > 0 ? (
          <>
            <div style={{ paddingBottom: "10px" }}>
              <Box paddingBottom={2}>
                <Paper elevation={10} sx={{bgcolor:colors.primary[100]}}>
                  <AhGraph data={dayDaywiseData || []} />
                </Paper>
              </Box>
              <Paper elevation={10} sx={{bgcolor:colors.primary[100]}}>
                <ChargingGraph data={dayDaywiseData || []} />
              </Paper>
            </div>

            <Box padding="0px 10px 0px 10px">
              <TableContainer
                component={Paper}
                sx={{
                  marginTop: 1,
                  maxHeight: {lg:"360px",md:"300px",sm:"270px",xs:"400px",xl:"480px"},
                  overflow: "auto",
                  border: colors.primary[300],
                  borderRadius: "8px",
                       backgroundColor: colors.primary[100], // Transparent background
            '& .MuiPaper-root': {
              backgroundColor: colors.primary[100], // Override Paper's default white background
            },
                }}
              >
                <Table stickyHeader aria-label="daywise table">
                  <TableHead>
                    <TableRow>
                      {Object.keys(columnMappings).map((key) => (
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
                    {formattedData.map((row, index) => (
                      <TableRow
                        key={index}
                      >
                        {Object.keys(columnMappings).map((key, idx) => (
                          <TableCell
                            key={idx}
                            sx={{
                               border:colors.primary[300], // Lighter white border
                              padding: "5px",
                              fontWeight: "bold",
                              textAlign: "center",
                              color: colors.primary[200], // White text
                              backgroundColor: 'transparent', // Transparent background
                            }}
                          >
                             {key === 'dayWiseDate'
                            ? formatDateStamp(row[key]) :row[key]}
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
                count={totalRecords || formattedData.length}
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
        border: colors.primary[300], // White border for dropdown
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
          </>
        ) : (
          <Typography variant="body1" sx={{ marginTop: 2, textAlign: "center",color:colors.primary[200] }}>
            No data available
          </Typography>
        )}
      </Box>
    </div>
  );
};

export default DayWise;