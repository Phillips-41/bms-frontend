import React,{useContext} from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,TablePagination,
  useTheme
} from '@mui/material';
import { BatteryFull } from '@mui/icons-material';
import DeviceThermostat from '@mui/icons-material/DeviceThermostat'; // Alternative to Thermometer
import { AppContext } from '../../../services/AppContext';
import { tokens } from '../../../theme';
import { formatTimeStamp } from '.';

export const CellType =({ data }) => {
  const theme = useTheme();
  const colors= tokens(theme.palette.mode);
      const { 
        page, 
        setPage, 
        rowsPerPage, 
        setRowsPerPage, 
        totalRecords,
        loadingReport,historicalType
      } = useContext(AppContext);
    // Find the maximum number of cells across all entries
   const maxCells = Math.max(...data.map(item => item.lstCellVoltageTemperatureData?.length || 0));
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    // Generate column headers for cells (Cell1, Cell2, etc.)
    const cellColumns = Array.from({ length: maxCells }, (_, i) => `Cell ${i + 1}`);
  
    return (
        <>
      <TableContainer
        component={Paper}
        sx={{
          marginTop: 1,
          overflowX: "auto",
          border: "1px solid black",
          borderRadius: "8px",
           backgroundColor: colors.primary[100], // Transparent background
            '& .MuiPaper-root': {
              backgroundColor: colors.primary[100], // Override Paper's default white background
            },
          maxHeight: {lg:"330px",md:"300px",sm:"270px",xs:"400px",xl:"440px"},
        }}
      >
        <Table stickyHeader aria-label="cell voltage and temperature table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                  color: "black",
                  padding: "3px",
                  minWidth: "80px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  borderRight: "1px solid #ffffff50",
                }}
              >
                Substation Id
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                  color: "black",
                  padding: "3px",
                  minWidth: "100px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  borderRight: "1px solid #ffffff50",
                }}
              >
                Serial Number
              </TableCell>
              {/* <TableCell
                sx={{
                  fontWeight: "bold",
                  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                  color: "black",
                  padding: "3px",
                  minWidth: "100px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  borderRight: "1px solid #ffffff50",
                }}
              >
                Packet Date
              </TableCell> */}
              <TableCell
                sx={{
                  fontWeight: "bold",
                  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                  color: "black",
                  padding: "3px",
                  minWidth: "100px",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  borderRight: "1px solid #ffffff50",
                }}
              >
                Packet Date Time
              </TableCell>
              {cellColumns.map((cell, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: "bold",
                    background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
                    color: "black",
                    padding: "3px",
                    minWidth: "100px",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                   
                    borderRight: index === cellColumns.length - 1 ? "none" : "1px solid #ffffff50",
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              if (!row || !row.packetDateTime) {
                return null; // Skip rendering this row or handle it differently
              }
              const packetDateTime = row.packetDateTime;
              // const dateStr = packetDateTime.toLocaleDateString();
              // const timeStr = packetDateTime.toLocaleTimeString();
  
              return (
                <TableRow
                  key={index}
                  sx={{ 
                    height: "1px", // Makes row height as small as possible
                  }}
                >
                  <TableCell
                    sx={{
                      border: colors.primary[300], // Lighter white border
                      padding: "2px 4px", // Minimal padding
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                        color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                     // lineHeight: "1.2", // Tighter line height
                    }}
                  >
                    {row.siteId}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: colors.primary[300], // Lighter white border
                      padding: "2px 4px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                        color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                     // lineHeight: "1.2",
                    }}
                  >
                    {row.serialNumber}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: colors.primary[300], // Lighter white border
                      padding: "2px 4px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                        color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                     lineHeight: "1.2",
                    }}
                  >
                    {formatTimeStamp(packetDateTime)}
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      border: colors.primary[300], // Lighter white border
                      padding: "2px 4px",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      textAlign: "center",
                        color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                    //  lineHeight: "1.2",
                    }}
                  >
                    {timeStr}
                  </TableCell> */}
                  
                  {Array.from({ length: maxCells }).map((_, cellIndex) => {
                    const cellData = row.lstCellVoltageTemperatureData?.[cellIndex];
                    if (!cellData) {
                      return (
                        <TableCell
                          key={cellIndex}
                          sx={{
                            border: colors.primary[300], // Lighter white border
                            padding: "2px 4px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                              color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                         //   lineHeight: "1.2",
                          }}
                        >
                          -
                        </TableCell>
                      );
                    }

                    return (
                      <TableCell
                        key={cellIndex}
                        sx={{
                          border: colors.primary[300], // Lighter white border
                          padding: "2px", // Minimal padding
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                            color: colors.primary[200], // White text
                      backgroundColor: 'transparent', // Transparent background
                      //    lineHeight: "1", // Tightest line height
                        }}
                      >
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'space-around',
                          gap: '4px', // Reduced gap
                          width: '100%',
                          height: "100%",
                        }}>
                          {/* Voltage */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            
                          }}>
                            <BatteryFull 
                              fontSize="inherit" 
                              color={cellData.highOrLowVoltage ? "error" : "success"} 
                              sx={{ 
                                fontSize: "0.7rem", // Smaller icon
                                mr: "2px", // Reduced margin
                              }}
                            />
                            <Typography variant="caption" sx={{ 
                              fontSize: "0.65rem", // Smaller text
                              lineHeight: "1",
                              fontWeight: "bold",
                              minWidth: "30px",
                            }}>
                              {cellData.cellVoltage == "65.535" ? "N/C" : cellData.cellVoltage + "V"}
                            </Typography>
                          </Box>
                          
                          {/* Temperature */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            minWidth: 0,
                          }}>
                            <DeviceThermostat 
                              fontSize="inherit"
                              color={cellData.highTemperature ? "error" : "success"} 
                              sx={{ 
                                fontSize: "0.7rem",
                                mr: "2px",
                              }}
                            />
                            <Typography variant="caption" sx={{ 
                              fontSize: "0.65rem",
                         //     lineHeight: "1",
                              fontWeight: "bold",
                            }}>
                              {cellData.cellTemperature == "-255" ? "N/C" : cellData.cellTemperature + "°C"}
                            </Typography>
                          </Box>
                          
                          {/* Specific Gravity */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            minWidth: 0,
                          }}>
                            <Typography 
                              component="span" 
                              variant="caption" 
                              sx={{ 
                                fontSize: "0.6rem", // Smallest text
                                // color: "text.secondary",
                                mr: "2px",
                          //      lineHeight: "1",
                          color: colors.primary[200], // White text
                                fontWeight: "bold",
                              }}
                            >
                              SG:
                            </Typography>
                            <Typography variant="caption" sx={{ 
                              fontSize: "0.65rem",
                        //      lineHeight: "1",
                              fontWeight: "bold",
                            }}>
                              {cellData.cellTemperature == "-255" ? "N/C" : cellData.specificGravity.toFixed(3)}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
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
     </>
    );
  };

export const formatDateStamp = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    //  hour: "2-digit",
    //  minute: "2-digit",
      //second: "2-digit",
      hour12: false
    });
  };