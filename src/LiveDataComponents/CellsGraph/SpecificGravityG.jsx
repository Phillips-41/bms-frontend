import React from 'react';

import { BarChart, Bar, XAxis, YAxis, LabelList, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme,Box, Typography } from '@mui/material';
import { tokens } from '../../theme';

const SpecificGravityG = ({ data,chartWidth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter out invalid temperature values (65535)
  const filteredData = data.map(cell => ({
  ...cell,                        // Spread all existing properties
  cellSpecificgravity: cell.cellTemperature === "-255" ? 0: cell.cellSpecificgravity   // Update conditionally
}));

  return (
      <Box sx={{ height: '150px', marginBottom: '30px', width: `${chartWidth}px`, }}>
    <Typography 
        variant="h6" 
        sx={{ 
          textAlign: 'center', 
          marginBottom: '10px', 
          color: colors.primary[200], // Adjust color to match your theme
          fontWeight: 'bold'
        }}
      >
        Cell Specific Gravity
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={filteredData}
          margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
        >
          <XAxis 
            dataKey="cellNumber" 
            tick={{ fill: colors.primary[200], fontSize: 12 }}
            interval={0}
          />
          <YAxis
            hide={true} // Hides Y-axis values
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: colors.primary[400], 
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value) => [`${value.toFixed(1)} `, 'Sg']}
          />
          <Bar
            dataKey="cellSpecificgravity"
            fill="orange"
            maxBarSize={30} // Limits maximum bar width
            minPointSize={2} // Ensures bars are visible even with many cells
          >
            {/* Add labels on top of bars */}
            {/* {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.blueAccent[500]} />
            ))} */}
            <LabelList 
              dataKey="cellSpecificgravity" 
              position="top" 
              formatter={(value) => value.toFixed(1)}
              style={{ 
                fill: colors.primary[200], 
                fontSize: '12px',
                fontWeight: '500'
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default SpecificGravityG;