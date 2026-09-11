import { Box, Paper, useTheme} from '@mui/material'
import React,{useContext} from 'react'
import Grid from '@mui/material/Grid2';
import CellLayout from './CellLayout';
import {CellThresholdValues} from '../../enums/ThresholdValues'
import { AppContext } from '../../services/AppContext';
import { tokens } from '../../theme';
const Pictorial = ({ serialNumber, siteId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const itemHeight = 77; // Fixed height for each CellLayout container
  const itemWidth = 65; // Fixed width for each CellLayout container
  const gap = 0; // Gap between items

  const { data } = useContext(AppContext);
  const device = data[0];
  const { cellVoltageTemperatureData } = device;

  return (
     <Paper
    elevation={8}
      sx={{
        pt:1,
        height:  { lg: '50vh', xl: '50vh' }, // Take full height of the parent
        bgcolor:colors.primary[100],
        overflowY: 'auto', // Enable scrolling if content exceeds height
            //  pb:'2rem'
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 54px)', // 2 columns for xs screens (<600px)
            sm: 'repeat(3, 54px)', // 3 columns for sm screens (≥600px)
            md: 'repeat(4, 54px)', // 4 columns for md screens (≥900px)
            lg: 'repeat(6, 54px)', // 5 columns for lg screens (≥1200px)
            xl: 'repeat(8, 50px)', // 6 columns for xl screens (≥1536px)
          },
          gridTemplateRows: 'auto', // 3 rows, each 77px tall
          gap: {
            xs: '0px', // Gap for xs screens (<600px)
            sm: '0px', // Gap for sm screens (≥600px)
            md: '0px', // Gap for md screens (≥900px)
            lg: '9px', // Gap for lg screens (≥1200px)
            xl: '10px', // Gap for xl screens (≥1536px)
          },
          justifyContent: 'center', // Center the grid horizontally
          alignContent: 'center', // Align grid content at the top
          width: 'fit-content', // Ensure the grid doesn't stretch beyond its content
          margin: 'auto', // Center the grid container
        }}
      >
        {cellVoltageTemperatureData.map((cell) => ( // Limit to 15 items (5x3)
          <Box
            key={cell.id}
            sx={{
              height: `${itemHeight}px`, // Fixed height for each CellLayout container
              width: `${itemWidth}px`, // Fixed width for each CellLayout container
            }}
          >
            <CellLayout
              cellData={cell}
              thresholds={CellThresholdValues()}
              serialNumber={serialNumber}
              siteId={siteId}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
export default Pictorial