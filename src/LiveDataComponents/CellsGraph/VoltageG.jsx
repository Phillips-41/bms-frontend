import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,LabelList } from 'recharts';
import { useTheme,Box,Typography } from '@mui/material';
import { tokens } from '../../theme';

const VoltageG = ({ data ,chartWidth}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter out invalid voltage values (65.535)
  const filteredData = data.map(cell => ({
  ...cell,                        // Spread all existing properties
  cellVoltage: cell.cellVoltage !== 65.535 ? cell.cellVoltage : 0  // Update conditionally
}));
  return (
    <Box sx={{ height: '150px',  marginBottom: '30px', width: `${chartWidth}px` }}>
         <Typography 
        variant="h6"  
        sx={{ 
          textAlign: 'center', 
          marginBottom: '10px', 
          color:colors.primary[200],
          fontWeight: 'bold'
        }}
      >
        Cell Voltage
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
            formatter={(value) => [`${value.toFixed(2)} V`, 'Voltage']}
          />
          <Bar
            dataKey="cellVoltage"
            fill={colors.greenAccent[500]}
            maxBarSize={30} // Limits maximum bar width
            minPointSize={2} // Ensures bars are visible even with many cells
          >
            {/* Add labels on top of bars */}
            {/* {filteredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors.greenAccent[500]} />
            ))} */}
            <LabelList 
              dataKey="cellVoltage" 
              position="top" 
              formatter={(value) => value.toFixed(2)}
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

export default VoltageG;