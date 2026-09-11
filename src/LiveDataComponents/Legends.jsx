import React,{useContext} from 'react'
import {Box,  useTheme,Typography} from '@mui/material'
import { tokens } from '../theme';
import HighTemperature, { CellLegends,CellThresholdValues,BatteryLowVoltage,Charging,Discharging, CommunicationFailed, OpenBattery, HighVoltage} from '../enums/ThresholdValues';
import { AppContext } from '../services/AppContext';
  
const Legends = () => {

  const {
        data, 
      }=useContext(AppContext)
    
      const device = data[0];
  const{cellVoltageTemperatureData}=device
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  
const {
    LowVoltage,
    HighVoltage,
    highTemperature,
  } = CellThresholdValues();

  if(!LowVoltage && !HighVoltage && !HighTemperature && !device && !cellVoltageTemperatureData){
    return
  }

  const highTempThreshold = parseFloat(highTemperature);
  const highVoltThreshold = parseFloat(HighVoltage);
  const lowVoltThreshold = parseFloat(LowVoltage);
  
  // Helper function to check if a cell is communicating
  const isCommunicating = (cell) => 
    cell.cellVoltage !== 65.535 && cell.cellTemperature !== "-255";
  
  // Count cells with high temperature
  const highTemperatureCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellVoltage !== 65.535 && cell.cellTemperature >= highTempThreshold
  ).length;
  
  // Count communicating cells
  const communicatingCount = cellVoltageTemperatureData.filter(isCommunicating).length;
  
  // Count non-communicating cells
  const nonCommunicatingCount = cellVoltageTemperatureData.length - communicatingCount;
  
  // Count cells with high voltage
  const highVoltageCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellVoltage !== 65.535 && cell.cellVoltage >= highVoltThreshold
  ).length;
  
  // Count cells with low voltage
  const lowVoltageCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellVoltage <= lowVoltThreshold
  ).length;
    return (
      <Box display="flex" flexDirection="column" gap="0px">
        {/* Header Section */}
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between" // Distribute space between the two titles
          width="100%"
          color={colors.primary[200]}
          padding="0px 0px"
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              flex: 1, // Equal width for both titles
            }}
          >
            Cell Info
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              flex: 1, // Equal width for both titles
            }}
          >
          Cell Representations
          </Typography>
        </Box>

        {/* Content Section */}
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding="0px 5px 0px 5px"
          border="0px solid #ccc"
          borderRadius="8px"
          sx={{ overflowX: "auto" }} // Allow horizontal scrolling if needed
        > 
          {[
            { label: "High Temp", value: highTemperatureCount, color: "#db4f4a" },
            { label: "Commun", value: communicatingCount, color: "#4cceac" },
            { label: "Not Commun", value: nonCommunicatingCount, color: "#666666" },
            { label: "High Voltage", value: highVoltageCount, color: "#db4f4a" },
            { label: "Low Voltage", value: lowVoltageCount, color: "#6870fa" },
            { label: "Charging", icon: CellLegends.LegendCharging, color: "white" },
            { label: "DisCharging", icon: CellLegends.LegendDisCharging, color: "white" },
            { label: "Low Volt", icon: CellLegends.BatteryLowVoltage, color: "white" },
            { label: "About to Die", icon: CellLegends.BatteryAboutToDie, color: "white" },
            { label: "Open Battery", icon:<OpenBattery mode={colors.primary[700]} />, color: "white" },
            { label: "High Voltage", icon: CellLegends.BatteryHighVoltage, color: "white" },
            { label: "High Temp", icon:<HighTemperature mode={colors.primary[700]} />, color: "white" },
            { label: "CommnFail", icon: <CommunicationFailed mode={colors.primary[700]}/>, color: "white" },
          ].map((item, index) => (
            <Box
              key={index}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              borderRadius="8px"
              sx={{ flexShrink: 0, minWidth: "80px" }} // Fixed min-width to prevent squashing
            >
              {item.icon ? (
                <>
                  <Box display="flex" alignItems="center" justifyContent="center" marginBottom="2px">
                    {item.icon}
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ color:colors.primary[200], fontWeight: "bold" }}
                  >
                    {item.label}
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={{ color: colors.primary[200], fontWeight: "bold" }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: colors.primary[200] }}>
                    {item.value}
                  </Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
};

export default Legends;


export const CellInfo = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data } = useContext(AppContext);
  
  const device = data[0];
const{cellVoltageTemperatureData,bmsAlarmsDTO}=device
const{cellTemperatureHN,cellVoltageNH,cellVoltageLN}=bmsAlarmsDTO||{}

  const { LowVoltage, HighVoltage, highTemperature } = CellThresholdValues();
  
  if ( !device || !cellVoltageTemperatureData) {
    return null;
  }

  const highTempThreshold = parseFloat(highTemperature);
  const highVoltThreshold = parseFloat(HighVoltage);
  const lowVoltThreshold = parseFloat(LowVoltage);
  
  // Helper function to check if a cell is communicating
  const isCommunicating = (cell) => 
    cell.cellVoltage !== 65.535 && cell.cellTemperature !== 65535;
  
  // Count cells with high temperature
  const highTemperatureCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellTemperature !== 65535 && cellTemperatureHN && cell.cellTemperature >= highTempThreshold
  ).length;
  
  // Count communicating cells
  const communicatingCount = cellVoltageTemperatureData.filter(isCommunicating).length;
  
  // Count non-communicating cells
  const nonCommunicatingCount = cellVoltageTemperatureData.length - communicatingCount;
  
  // Count cells with high voltage
  const highVoltageCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellVoltage !== 65.535 && cellVoltageNH  && cell.cellVoltage >= highVoltThreshold
  ).length;
  
  // Count cells with low voltage
  const lowVoltageCount = cellVoltageTemperatureData.filter(
    (cell) => cell.cellVoltage <= lowVoltThreshold && cell.cellVoltage !== 65.535 && cellVoltageLN 
  ).length;

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      gap="5px"
      height="62px"
      padding={{ xs: "4px 6px", sm: "6px 8px", md: "8px 10px", lg: "0px 1px 1px 0px", xl: "1px 10px 0px 0px" }}
      borderRadius="8px"
      sx={{ overflowX: "hidden", width: '100%'}}
    >
      {/* CELL Column */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '20px',
          overflow: 'hidden',
          borderRadius: "5px",
          height: {lg:'60px',xl:'59px'},
          backgroundImage: colors.primary[600],
          flexShrink: 0
        }}
      >
        {['C', 'E', 'L', 'L'].map((letter, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              color: colors.primary[900],
              fontSize: '7px'
            }}
          >
            {letter}
          </Typography>
        ))}
      </Box>

      {/* Status Items */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
        gap="0px"
      >
        {[
          { label: "High Temp", value: highTemperatureCount, color: colors.primary[200] },
          { label: "Commun", value: communicatingCount, color: colors.primary[200] },
          { label: "Not Commun", value: nonCommunicatingCount, color: colors.primary[200] },
          { label: "High Voltage", value: highVoltageCount, color: colors.primary[200] },
          { label: "Low Voltage", value: lowVoltageCount, color: colors.primary[200] }
        ].map((item, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minWidth: "75px", flexShrink: 0 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: item.color, fontWeight: "bold", textAlign: 'center' }}
            >
              {item.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: item.color, textAlign: 'center' }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export const CellRepresentations = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
   return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-start"
      gap="5px"
      height="62px"
      padding={{ xs: "4px 6px", sm: "6px 8px", md: "8px 10px", lg: "0px 1px 1px 0px", xl: "0px 10px 0px 0px" }}
      borderRadius="8px"
      sx={{ overflowX: "hidden", width: '100%' }}
    >
      {/* LEGEND Column */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          width: '20px',
          backgroundImage: colors.primary[600],
          flexShrink: 0
        }}
      >
        {['L', 'E', 'G', 'E', 'N', 'D'].map((letter, index) => (
          <Typography
            key={index}
            variant="caption"
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              color: colors.primary[900],
              fontSize: '7px',
              borderRadius: "5px",
              height: {lg:'10px',xl:'9.5px'},
            }}
          >
            {letter}
          </Typography>
        ))}
      </Box>

      {/* Legend Items */}
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        flexGrow={1}
        gap="0px"
      > 
        {[
          { label: "Charging", icon: CellLegends.LegendCharging, color:colors.primary[200] },
          { label: "DisCharging", icon: CellLegends.LegendDisCharging, color: colors.primary[200] },
          { label: "Low Volt", icon: CellLegends.BatteryLowVoltage, color: colors.primary[200] },
          { label: "About to Die", icon: CellLegends.BatteryAboutToDie, color: colors.primary[200] },
          { label: "Open Battery", icon: <OpenBattery mode={colors.primary[700]} />, color: colors.primary[200] },
          { label: "High Voltage", icon: <HighVoltage mode={colors.primary[700]} />, color: colors.primary[200] },
          { label: "High Temp", icon: <HighTemperature mode={colors.primary[700]}/>, color: colors.primary[200] },
          { label: "CommnFail", icon: <CommunicationFailed mode={colors.primary[700]}/>, color: colors.primary[200] }
        ].map((item, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minWidth: "80px", flexShrink: 0 }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" marginBottom="2px">
              {item.icon}
            </Box>
            <Typography
              variant="body2"
              sx={{ color: item.color, textAlign: 'center', fontWeight: 'bold' }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};