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
  Tooltip,
} from "@mui/material";
import { AppContext, formatDate } from "../../../services/AppContext";
import ReportsBar from "../ReportsBar/ReportsBar";
import ChargingGraph from "./ChargingGraph";
import AhGraph from "./AhGraph";
import { formatToTime } from "../../../services/AppContext";
import GridOnIcon from "@mui/icons-material/GridOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { downloadDayWiseBatteryandChargerdetails } from "../../../services/apiService";
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
  const colors = tokens(theme.palette.mode);
  const {
    dayDaywiseData = [],
    page,
    setPage,
    setRowsPerPage,
    rowsPerPage,
    startDate,
    endDate,
    totalRecords,
    loadingReport,
    area,
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
        cumulativeTotalAvgTemp,
      } = row;

      let formattedDate = "No Date";
      if (dayWiseDate) {
        const date = new Date(dayWiseDate);
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(date.getTime() + istOffset);
        formattedDate = istDate.toISOString().split("T")[0];
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
    if (!area || !startDate || !endDate) {
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      {/* Top bar — fixed */}
      <Box
        sx={{
          flexShrink: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <ReportsBar pageType="daywise" />
        <Tooltip title="Export to Excel">
          <Box sx={{ position: "relative", marginRight: "20px", marginTop: "8px" }}>
            <IconButton
              onClick={handleDownloadExcel}
              disabled={loadingReport || isDownloading || !startDate || !endDate}
              sx={{
                backgroundColor: "#4caf50",
                color: colors.primary[200],
                "&:hover": { backgroundColor: "#388e3c" },
                "&.Mui-disabled": { backgroundColor: "#4caf50", opacity: 0.5 },
              }}
            >
              {downloadComplete ? <CheckCircleIcon /> : <GridOnIcon />}
            </IconButton>
            {isDownloading && (
              <CircularProgress
                size={40}
                sx={{
                  color: "#4caf50",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-20px",
                  marginLeft: "-20px",
                }}
              />
            )}
          </Box>
        </Tooltip>
      </Box>

      {/* Scrollable body: graphs → gap → table → pagination */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          px: 1.5,
          py: 1,
        }}
      >
        {loadingReport ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "379px",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ color: colors.primary[200] }}>
              Loading day-wise data...
            </Typography>
          </Box>
        ) : formattedData.length > 0 ? (
          <>
            {/* Graphs on top — natural height */}
            <Box sx={{ mb: 2 }}>
              <Paper elevation={10} sx={{ bgcolor: colors.primary[100], mb: 2 }}>
                <AhGraph data={dayDaywiseData || []} />
              </Paper>
              <Paper elevation={10} sx={{ bgcolor: colors.primary[100] }}>
                <ChargingGraph data={dayDaywiseData || []} />
              </Paper>
            </Box>

            {/* Gap between graphs and table */}
            <Box sx={{ height: 16 }} />

            {/* Table */}
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: { lg: "360px", md: "300px", sm: "270px", xs: "400px", xl: "480px" },
                overflow: "auto",
                borderRadius: "8px",
                backgroundColor: colors.primary[100],
                border: colors.primary[300],
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
                          background:
                            "linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))",
                          color: colors.primary[200],
                          padding: "3px",
                          minWidth: "150px",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {columnMappings[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formattedData.map((row, index) => (
                    <TableRow key={index}>
                      {Object.keys(columnMappings).map((key, idx) => (
                        <TableCell
                          key={idx}
                          sx={{
                            border: colors.primary[300],
                            padding: "5px",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: colors.primary[200],
                            backgroundColor: "transparent",
                          }}
                        >
                          {key === "dayWiseDate"
                            ? formatDateStamp(row[key])
                            : row[key]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Gap + Pagination — scroll down to see */}
            <Box sx={{ height: 8 }} />
            <TablePagination
              component="div"
              rowsPerPageOptions={[25, 50, 75]}
              count={totalRecords || formattedData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: colors.primary[200],
                backgroundColor: colors.primary[100],
                borderRadius: "0 0 8px 8px",
                mb: 2,
                "& .MuiTablePagination-toolbar": {
                  minHeight: 40,
                  height: "auto",
                },
                "& .MuiTablePagination-selectLabel": {
                  color: colors.primary[200],
                  fontSize: "12px",
                  fontFamily: "Source Sans Pro",
                  fontWeight: "bold",
                },
                "& .MuiTablePagination-displayedRows": {
                  color: colors.primary[200],
                  fontSize: "12px",
                  fontFamily: "Source Sans Pro",
                  fontWeight: "bold",
                },
                "& .MuiTablePagination-select": {
                  color: colors.primary[200],
                  fontSize: "12px",
                  fontFamily: "Source Sans Pro",
                  fontWeight: "bold",
                },
                "& .MuiTablePagination-selectIcon": {
                  color: colors.primary[200],
                },
                "& .MuiTablePagination-actions .MuiIconButton-root": {
                  color: colors.primary[200],
                },
              }}
            />
          </>
        ) : (
          <Typography
            variant="body1"
            sx={{ marginTop: 2, textAlign: "center", color: colors.primary[200] }}
          >
            No data available
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DayWise;
