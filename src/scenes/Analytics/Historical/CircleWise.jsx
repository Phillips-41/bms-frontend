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
import { formatNumber, formatTimeStamp,formatDuration } from '.';

export const CircleWise =({ data={} }) => {
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
      const columnMappings = { 
        division: "Sub Division",
        area: "Sub Station",
        server_time: "Server Date Time", 
        packet_date_time: "Packet Date Time", 
        cells_connected_count: "Connected Cells", 
       // problem_cells: "Problem Cells", 
        string_voltage: "String Voltage (V)", 
        system_peack_current_in_charge_one_cycle: "Peak Charge Current (A)", 
        system_peak_current_in_discharge_one_cycle: "Peak Discharge Current (A)", 
        average_discharging_current: "Avg Discharge Current (A)", 
        average_charging_current: "Avg Charge Current (A)", 
        ah_in_for_one_charge_cycle: "AH In For Charge Cycle (Ah)", 
        ah_out_for_one_discharge_cycle: "AH Out For Charge Cycle (Ah)", 
        cumulative_ah_in: "Cumulative Ah In", 
        cumulative_ah_out: "Cumulative Ah Out", 
        charge_time_cycle: "Charge Time", 
        discharge_time_cycle: "Discharge Time", 
        total_charging_energy: "Charging Energy (kWh)", 
        total_discharging_energy: "Discharging Energy (kWh)", 
        every_hour_avg_temp: "Hourly Avg Temp (°C)", 
        cumulative_total_avg_temp_every_hour: "Cumulative Avg Temp (°C)", 
        charge_or_discharge_cycle: "Cycle Count", 
        soc_latest_value_for_every_cycle: "SOC (%)", 
        dod_latest_value_for_every_cycle: "DOD (%)", 
        instantaneous_current: "Current (A)", 
        ambient_temperature: "Ambient Temp (°C)", 
        ac_voltage: "AC Voltage (V)", 
        ac_current: "AC Current (A)", 
        frequency: "Frequency (Hz)", 
        energy: "Energy (kWh)", 
        battery_run_hours: "Run Hours", 
        power_factor: "Power Factor", 
        bank_cycle_dc: "Bank Status", 
        string_voltage_lhn: "String Voltage LNH", 
        //bms_sed_communication: "BMS SED Comm", 
        cell_communication_fd: "Cell Comm", 
        cell_voltage_ln: "Cell Voltage LN", 
        cell_voltage_hn: "Cell Voltage NH", 
        cell_temperature_hn: "Cell Temp", 
        buzzer: "Buzzer", 
        input_mains: "Input Mains", 
        input_phase: "Input Phase", 
        input_fuse: "Input Fuse", 
        rectifier_fuse: "Rectifier Fuse", 
        filter_fuse: "Filter Fuse", 
        dc_voltage_oln: "DC Voltage LNH", 
        output_fuse: "Output Fuse", 
        ac_voltage_uln: "AC Voltage LNO", 
        charger_load: "Charger Load", 
        alarm_supply_fuse: "Alarm Supply Fuse", 
        charger_trip: "Charger Trip", 
        output_mccb: "Output MCCB", 
        battery_condition: "Battery Condition", 
        reset_push_button: "Reset Push Button", 
        };
  function formatIstDateTime(isoString) {
   const baseDateTime = isoString.split('.')[0]; 
    
    // 2. Replace the 'T' with a comma
    return baseDateTime.replace('T', ',');
  }

 const dataArray = Array.isArray(data) ? data : [];
  const displayedColumns = Object.keys(columnMappings);
    // Find the maximum number of cells across all entries
   const maxCells = Math.max(...dataArray.map(item => item.cells?.length || 0));
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
    // Generate column headers for cells (Cell1, Cell2, etc.)
    const cellColumns = Array.from({ length: maxCells }, (_, i) => `Cell ${i + 1}`);
  const formatCellValue = (key, value) => {
    // Handle special keys with custom mapping
    if (key === 'dc_voltage_oln' || key === 'ac_voltage_uln' || key === 'string_voltage_lhn') {
        if (value === 0) return "Low";
        if (value === 2) return "Over";
        return "Normal";
    }

    // Handle boolean values
    if (typeof value === 'boolean') {
        return value ? "Fail" : "Normal";
    }

    // Handle null/undefined
    if (value == null) return "-";

    // For all other values, return as-is (numbers, strings, etc.)
    return value;
    };
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
            {dataArray.map((row, index) => {
                if (!row) return null;
                return (
                <TableRow key={index} sx={{ height: "1px" }}>
                    {/* Static columns */}
                    {displayedColumns.map((key) => (
                    <TableCell
                        key={key}
                        sx={{
                        border: colors.primary[300],
                        padding: '3px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        color: colors.primary[200],
                        backgroundColor:
                            key === 'server_time' && row.statusId === 1
                            ? '#ffc458'
                            : 'transparent',
                        }}
                    >
                        {key === 'packet_date_time' || key === 'server_time'
                        ? formatIstDateTime(row[key])
                        : key === 'charge_time_cycle' || key === 'discharge_time_cycle' || key === 'battery_run_hours'
                        ? formatDuration(row[key])
                        : key === 'problem_cells' || key === 'cells_connected_count' || key === 'charge_or_discharge_cycle'
                        ? formatNumber(row[key], 0)
                        :  formatCellValue(key, row[key])
                        }
                    </TableCell>
                    ))}

                    {/* Dynamic cell columns (voltage, temperature, SG) */}
                    {Array.from({ length: maxCells }).map((_, cellIndex) => {
                    const cellData = row.cells?.[cellIndex];
                    if (!cellData) {
                        return (
                        <TableCell
                            key={cellIndex}
                            sx={{
                            border: colors.primary[300],
                            padding: "2px 4px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            color: colors.primary[200],
                            backgroundColor: 'transparent',
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
                            border: colors.primary[300],
                            padding: "2px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            textAlign: "center",
                            color: colors.primary[200],
                            backgroundColor: 'transparent',
                        }}
                        >
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            gap: '4px',
                            width: '100%',
                            height: "100%",
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ 
                                fontSize: "0.65rem",
                                lineHeight: "1",
                                fontWeight: "bold",
                                minWidth: "30px",
                            }}>
                                {cellData.cell_voltage == "65.535" ? "N/C" : cellData.cell_voltage + "V"}
                            </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                            <Typography variant="caption" sx={{ 
                                fontSize: "0.65rem",
                                fontWeight: "bold",
                            }}>
                                {cellData.cell_temperature == "-255" ? "N/C" : cellData.cell_temperature + "°C"}
                            </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                            <Typography component="span" variant="caption" sx={{ 
                                fontSize: "0.6rem",
                                mr: "2px",
                                color: colors.primary[200],
                                fontWeight: "bold",
                            }}>
                                SG:
                            </Typography>
                            <Typography variant="caption" sx={{ 
                                fontSize: "0.65rem",
                                fontWeight: "bold",
                            }}>
                                {cellData.cell_temperature == "-255" ? "N/C" : cellData.cell_specific_gravity.toFixed(3)}
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