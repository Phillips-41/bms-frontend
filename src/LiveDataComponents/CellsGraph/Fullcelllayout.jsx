import React from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import Pictorial from './Pictorial'; // Adjust the path as per your file structure
import Legends from '../Legends'; // Import Legends component
import { tokens } from '../../theme';

const FullCellLayout = ({ cellDataList, serialNumber, siteId, chargingStatus }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        p: 2,
        backgroundColor:colors.primary[100], // Background of the entire page
        color: 'white', // Text color
      }}
    >
      {/* Heading */}
      <Box
        sx={{
          mb: 3,
          textAlign: 'center',
          fontSize: { xs: '1.5rem', sm: '2rem' }, // Responsive font size
          fontWeight: 'bold',
          color: colors.primary[200],
        }}
      >
        <Typography variant="h3" fontWeight="bold" >CELL INFO</Typography>
      </Box>

      {/* Legends Section */}
      <Paper
      elevation={8}
        sx={{
          bgcolor:colors.primary[100],
          p: 2,
          borderRadius: '8px',
          mb: 3,
          boxShadow: 3, // Adding subtle shadow for better visual separation
        }}
      >
        <Legends cellVoltageTemperatureData={cellDataList} />
      </Paper>

      {/* Pictorial Layout */}
      <Box
        sx={{
          flexGrow: 1,
         bgcolor:colors.primary[100],
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: 3, // Adding shadow for separation
        }}
      >
        <Pictorial
          serialNumber={serialNumber}
          siteId={siteId}
        />
      </Box>
    </Box>
  );
};

export default FullCellLayout;
