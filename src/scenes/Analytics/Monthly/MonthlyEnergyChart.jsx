import { useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { tokens } from '../../../theme';

// Define the MonthlyEnergyChart component
const MonthlyEnergyChart = ({ data = [] }) => {
  const theme = useTheme();
  const colors =tokens(theme.palette.mode);

  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* <Typography variant="h6" color="textSecondary">
          No data available
        </Typography> */}
      </Box>
    );
  }

  // Calculate max value for YAxis domain
  const maxEnergy = Math.max(
    ...data.map((d) =>
      Math.max(
        parseFloat(d.totalChargingEnergy),
        parseFloat(d.totalDischargingEnergy)
      )
    )
  );
  const yAxisMax = Math.max(maxEnergy * 1.3, 10);
  const formatTick = (value) => parseFloat(value).toFixed(1);

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            p: '10px 15px',
            borderRadius: '8px',
            border: colors.primary[300],
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ mb: '5px', fontWeight: 'bold', color: colors.primary[200] }}
          >
            {label}
          </Typography>
          {payload.map((entry, index) => {
            // Map dataKey to specific colors to match bar and line chart
            const colorMap = {
              totalChargingEnergy: '#4a90e2', // Matches blueGradient start color
              totalDischargingEnergy: '#ff7f50', // Matches orangeGradient start color
              sumCumulativeTotalAvgTemp: '#9b59b6', // Matches Temperature line
              sumTotalSoc: '#2ecc71', // Matches SOC line
            };
            const displayColor = colorMap[entry.dataKey] || entry.color;
            return (
              <Typography
                key={index}
                variant="body2"
                sx={{ my: '2px', color: displayColor }}
              >
                {entry.name}: {parseFloat(entry.value).toFixed(1)}
                {entry.name === 'Temperature'
                  ? '°C'
                  : entry.name === 'SOC'
                  ? '%'
                  : ' kWh'}
              </Typography>
            );
          })}
        </Paper>
      );
    }
    return null;
  };

  const isXs = useMediaQuery((theme) => theme.breakpoints.down('sm')); // <600px
  const isSm = useMediaQuery((theme) => theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isMd = useMediaQuery((theme) => theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isLg = useMediaQuery((theme) => theme.breakpoints.between('lg', 'xl')); // 1200px - 1536px
  const isXl = useMediaQuery((theme) => theme.breakpoints.up('xl')); // ≥1536px

  // Determine height based on breakpoint
  const chartHeight = isXl
     ? 320 // xl: 320px
    : isLg
    ? 240 // lg: 240px
    : isMd
    ? 280 // md: 280px
    : isSm
    ? 240 // sm: 240px
    : 200; // xs: 200px

  // Chart styles
  const chartStyle = {
   // background: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    bgcolor: colors.primary[100],
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
   // color: "white" ,bgcolor: "#191C24",border:"0.1px solid rgba(218, 218, 143, 0.66)"
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: {
          xs: 200, // 200px for extra-small screens
          sm: 240, // 240px for small screens
          md: 280, // 280px for medium screens
          lg: 280, // 280px for large screens
          xl: 360, // 360px for extra-large screens
        },
      }}
    >
      <Paper sx={chartStyle}>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 10, bottom: 10, left: 10 }}
          >
            <XAxis
              dataKey="month"
              tick={{  fontSize: 12,fill: colors.primary[200] }}
              tickLine={{ stroke:colors.primary[200] }}
              axisLine={{ stroke: colors.primary[200] }}
            />
            <YAxis
              yAxisId="left"
              domain={[0, yAxisMax]}
              tick={{  fontSize: 12 ,fill: colors.primary[200]}}
              tickLine={{ stroke: colors.primary[200] }}
              axisLine={{ stroke: colors.primary[200]}}
              tickFormatter={formatTick}
              label={{
                value: 'Energy (kWh)',
                angle: -90,
                position: 'outsideLeft',
                offset: 10,
                // fill: '#666',
                fontSize: 14,
                dx: -30,
                fill: colors.primary[200]
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{  fontSize: 12,fill: colors.primary[200]}}
              tickLine={{ stroke: colors.primary[200]}}
              axisLine={{ stroke: colors.primary[200] }}
              tickFormatter={formatTick}
              label={{
                value: 'Temp (°C) / SOC (%)',
                angle: 90,
                position: 'outsideRight',
                offset: 10,
                // fill: '#666',
                fontSize: 14,
                dx: 30,
                fill: colors.primary[200]
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: 14,
                color: colors.primary[200]
              }}
            />
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4a90e2" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2b6cb0" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff7f50" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#e64a19" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <Bar
              yAxisId="left"
              dataKey="totalChargingEnergy"
              name="Charging Energy"
              fill="url(#blueGradient)"
              barSize={30}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="totalChargingEnergy"
                position="top"
                offset={10}
                fill={colors.primary[200]}
                fontSize={12}
                fontWeight="bold"
                formatter={(value) => parseFloat(value).toFixed(2)}
              />
            </Bar>
            <Bar
              yAxisId="left"
              dataKey="totalDischargingEnergy"
              name="Discharging Energy"
              fill="url(#orangeGradient)"
              barSize={30}
              radius={[4, 4, 0, 0]}
            >
              <LabelList
                dataKey="totalDischargingEnergy"
                position="top"
                offset={10}
                fill={colors.primary[200]}
                fontSize={12}
                fontWeight="bold"
                formatter={(value) => parseFloat(value).toFixed(2)}
              />
            </Bar>
            <Line
              yAxisId="right"
              dataKey="sumCumulativeTotalAvgTemp"
              name="Temperature"
              stroke="#9b59b6"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              dataKey="sumTotalSoc"
              name="SOC"
              stroke="#2ecc71"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default MonthlyEnergyChart;