import React from 'react';

import { BarChart, Bar, XAxis, YAxis, LabelList, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme,Box,Typography } from '@mui/material';
import { tokens } from '../../theme';

const TemperatureG = ({ data,chartWidth }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter out invalid temperature values (65535)
  const filteredData = data.map(cell => ({
  ...cell,                        // Spread all existing properties
  cellTemperature: cell.cellTemperature !== "-255" ? cell.cellTemperature : 0  // Update conditionally
}));
  

  return (
    <Box sx={{ height: '150px', marginBottom: '30px', width: `${chartWidth}px` }}>
      <Typography
        variant="h6"
        sx={{
          textAlign: 'center',
          marginBottom: '10px',
          color: colors.primary[200], // Adjust color to match your theme
          fontWeight: 'bold'
        }}
      >
        Cell Temperature
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
          <YAxis hide={true} />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.primary[400],
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value) => [`${Number(value).toFixed(1)} °C`, 'Temperature']}
          />
          <Bar
            dataKey="cellTemperature"
            fill={colors.blueAccent[500]}
            maxBarSize={30}
            minPointSize={2}
          ><LabelList
            dataKey="cellTemperature"
            position="top"
            formatter={(value) => {
              const num = parseFloat(value);
              return !isNaN(num) ? num.toFixed(1) : '0.0';
            }}
            style={{
              fill:  colors.primary[200],
              fontSize: '12px',
              fontWeight: '500',
            }}
          />

          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
export default TemperatureG;