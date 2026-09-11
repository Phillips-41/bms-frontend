import { Box, Paper, useTheme } from '@mui/material';
import React from 'react';
import TemperatureG from "./TemperatureG.jsx";
import VoltageG from "./VoltageG";
import SpecificGravityG from './SpecificGravityG.jsx';
import { tokens } from '../../theme.jsx';


const VoltageBarChart = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
const chartWidth = Math.max(800, data.length * 30);
  return (
  <Paper
     elevation={8}
      sx={{
        bgcolor: colors.primary[100],
        height: { lg: '47vh', xl: '39vh' },
        overflowY: 'auto', // Changed from 'scroll' to 'auto' (only shows scrollbar when needed)
        display: "flex",
        flexDirection: "column",
        // Removed justifyContent: "center" to prevent vertical centering
        // Removed alignContent: "center" as it's not needed for column direction
        position: 'relative', // Helps with positioning
        overflowX: 'auto'
      }}
    >
      <Box sx={{
        minHeight: '100%', // Ensures content fills container
        padding: '10px 0' // Adds some padding at top and bottom
      }}>
        <VoltageG data={data} chartWidth={chartWidth}/>
        <TemperatureG data={data} chartWidth={chartWidth}/>
        <SpecificGravityG data={data} chartWidth={chartWidth}/>
      </Box>
    </Paper>
  );
};

export default VoltageBarChart;



