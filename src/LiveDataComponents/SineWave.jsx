import React, { useContext } from 'react';
import { Box, useTheme,useMediaQuery } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
ResponsiveContainer,
  Cell,
  LabelList,

} from 'recharts';
import { AppContext } from '../services/AppContext';
import { tokens } from '../theme';

export const VoltageVisualizations = () => {
  const { data } = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const device = data[0];
  if (!device) return <div></div>;

  const { averageDischargingCurrent, averageChargingCurrent } = device;

  const currentComparisonData = [
    { name: 'Charging(A)', average: averageChargingCurrent },
    { name: 'Discharging(A)', average: averageDischargingCurrent },
  ];

  const getBarGradient = (entry) => {
    switch (entry.name) {
      case 'Charging(A)':
        return 'url(#dischargingGradient)';
      case 'Discharging(A)':
        return 'url(#chargingGradient)';
      default:
        return 'url(#defaultGradient)';
    }
  };

  return (
    <Box sx={{ 
      overflow: 'hidden', 
      color: "white", 
      height: '100%', 
      width: '100%',
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      p: 1
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={currentComparisonData}
          margin={{ top: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="chargingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DB3445" />
              <stop offset="100%" stopColor="#F71735" />
            </linearGradient>
            <linearGradient id="dischargingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8b409" />
              <stop offset="100%" stopColor="#f4ee2e" />
            </linearGradient>
            <linearGradient id="defaultGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4B0082" />
              <stop offset="100%" stopColor="#6A1B9A" />
            </linearGradient>
          </defs>
          <XAxis 
  dataKey="name" 
  tick={{
    fontSize: '0.5rem',
    fontWeight: 'bold',
    fill: colors.primary[200],
    angle: -45,
    textAnchor: 'end'
  }}
  interval={0}
/>

          <YAxis
            tick={{ fontSize: 10, fontWeight: 'bold', fill: colors.primary[200] }}
            label={{
              value: 'Avg Current (A)',
              angle: -90,
              position: 'insideLeft',
              fontSize: 10,
              fontWeight: 'bold',
              fill: colors.primary[200]
            }}
          />
          <Bar dataKey="average" name="Avg Current">
            {currentComparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarGradient(entry)} />
            ))}
            <LabelList dataKey="average" position="top" fontSize={10} fill={colors.primary[200]}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default VoltageVisualizations;