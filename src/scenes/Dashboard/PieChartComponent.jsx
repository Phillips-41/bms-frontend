import React,{useState,useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import { Box, Typography,useTheme  } from '@mui/material';



import useMediaQuery from '@mui/material/useMediaQuery';
import { tokens } from '../../theme';


// Static gradient definitions that don't change



export const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.[0]) {
    return (
      <div style={{
          backgroundColor: '#191C24', // Transparent background
        color: '#fff', // White text for better contrast
        padding: 8,
        border: '1px solid #ccc',
        borderRadius: 4,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <strong>{payload[0].name}</strong>: {payload[0].value}
      </div>
    );
  }
  return null;
};
export const CustomLabel = ({ name, value, x, y }) => {
  return (
    <text
      x={x}
      y={y}
      fill="#000"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '1rem', fontWeight: 'bold' }}
    >
      {`${value}`}
    </text>
  );
};

// Static gradient definitions
const PieChartComponent = ({ totolData,data2 = [], handlePieClick }) => {
  // const outerRadius = 75;
  // const innerRadius = 25;
  // const chartSize = 220;

  const isDataValid = Array.isArray(data2) && data2.length > 0 && !data2.every((entry) => entry.value === 0);
   const theme = useTheme();

    const colors = tokens(theme.palette.mode);
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl')); // 1200px - 1536px
  const isXl = useMediaQuery(theme.breakpoints.up('xl')); // ≥ 1536px


  // const [chartSize, setChartSize] = useState(150);
  // const [chartSizew ,setChartSizeW]=useState(200);// Default chart size
  // const [innerRadius, setInnerRadius] = useState(60); // Default inner radius
  // const [outerRadius, setOuterRadius] = useState(70); // Default outer radius
  let chartSize = 150;
  let chartSizew = 200;
  let innerRadius = 60;
  let outerRadius = 70;

  if (isXs) {
    chartSize = 120; chartSizew = 120; innerRadius = 40; outerRadius = 50;
  } else if (isSm) {
    chartSize = 150; chartSizew = 150; innerRadius = 15; outerRadius = 40;
  } else if (isMd) {
    chartSize = 160; chartSizew = 160; innerRadius = 15; outerRadius = 45;
  } else if (isLg) {
    chartSize = 160; chartSizew = 190; innerRadius = 15; outerRadius = 55;
  } else if (isXl) {
    chartSize = 210; chartSizew = 290; innerRadius = 20; outerRadius = 80;
  }
  return (
    <Box
        border={1}
        // borderColor="#FFFF00"
        borderRadius={2}
        bgcolor={colors.primary[100]} // ✅ Background color
        color={colors.primary[200]}   // ✅ Text color (same as background)
        // padding="1px 20px 15px 18px"
        boxShadow={3}
        display="flex"
        flexDirection="column"
        alignItems="center"
      sx={{
        padding: {
          xs: '1px 10px 10px 10px',
          sm: '1px 15px 12px 15px',
          md: '1px 5px 15px 10px',
          lg: '1px 1px 10px 1px',
          xl: '1px 1px 18px 5px',
        },
        ml:{
          lg: "8rem",
          xl: "10rem"
        },
        height: {
          xs: '180px',
          sm: '165px',
          md: '165px',
          lg: '230px',
          xl: '280px',
        },
        width: {
          xs: '280px',
          sm: '300px',
          md: '190px',
          lg: '260px',
          xl: '330px',
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: {
            xs: 600, // Slightly lighter for mobile
            sm: 700, // Standard bold for tablets
            md: 700,
            lg: 700,
          },
          fontSize: {
            xs: '1rem', // Mobile (smaller than h5 default)
            sm: '1rem', // Small tablets
            md: '1rem', // Medium screens (closer to h5 default)
            lg: '1.0rem', // Large screens (slightly larger)
            xl: '1.3rem'
          },
        
        // lineHeight: 1.2, // Consistent line height for readability
        }}
      >
      System Alarms Overview
      </Typography>
      <Box  
        // mt={{ xs: -1, sm: -2, md: -3, lg: 0 }}
      >
          {isDataValid ? (
            <PieChart width={chartSizew} height={chartSize}>
              <defs>
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.7)" />
                </filter>
                <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d82b27" />
                  <stop offset="100%" stopColor="#f09819" />
                </linearGradient>
                <linearGradient id="nonCriticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#007FFF" />
                  <stop offset="100%" stopColor="#2a52be" />
                </linearGradient>
                <linearGradient id="aboutToDieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9d50bb" />
                  <stop offset="100%" stopColor="#6e48aa" />
                </linearGradient>
                <linearGradient id="alarmsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8b409" />
                  <stop offset="100%" stopColor="#f4ee2e" />
                </linearGradient>
                <linearGradient id="defaultGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4CAF50" />
                  <stop offset="100%" stopColor="#81C784" />
                </linearGradient>
              </defs>
              <Pie
                data={data2}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                paddingAngle="5"
                cornerRadius="5"
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                label={({ name, value, cx, cy, midAngle, outerRadius }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 20; // Adjust label position
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  // Calculate font size based on chartSize
                  const fontSize = chartSize * 0.06; // Adjust multiplier (e.g., 0.04) for desired scaling
                  return (
                    <text
                      x={x}
                      y={y}
                    fill={colors.primary[200]}
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      style={{ fontSize: `${fontSize}px`,fontWeight:"bold" }} // Dynamic font size
                    >
                      {value}
                    </text>
                  );
                }}
                labelLine={true}
                onClick={(e) => handlePieClick(e)}
                style={{ filter: 'url(#shadow)' }}
              >
                {data2.map((entry, index) => {
                  const gradientIds = [
                    "url(#criticalGradient)",
                    "url(#nonCriticalGradient)",
                    "url(#aboutToDieGradient)",
                    "url(#alarmsGradient)",
                  ];
                  return <Cell key={`cell-${index}`} fill={gradientIds[index % gradientIds.length]} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            
            </PieChart>
          ) : data2.length === 0 || data2.every((entry) => entry.value === 0) ? (
            <PieChart width={chartSizew} height={chartSize}>
              <defs>
                <linearGradient id="defaultGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4CAF50" />
                  <stop offset="100%" stopColor="#81C784" />
                </linearGradient>
              </defs>
              <Pie data={[{ name: "Default", value: 1 }]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={outerRadius - 10}>
                <Cell fill="url(#defaultGreenGradient)" />
              </Pie>
            </PieChart>
          ) : (
            <Typography variant="body1">No data available for BMS alarms.</Typography>
          )}
      </Box>
      <Box 
        ml={2}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        pb={1}
        sx={{
          // width: '100%',
          maxWidth: { xs: '100%', sm: '300px', md: '250px', lg: '400px' }, // Responsive width
        }}
      >
        {Array.isArray(data2) && data2.map((entry, index) => (
          <Box 
          key={index}
          display="flex"
          flexDirection="row"
          alignItems="center"
          ml={0}
          pr={1}
          // mb={{ xs: 0.5, sm: 0.75, md: 0.5, lg: 1 }} // Responsive margin-bottom
          >
            <Box
              width={13}
              height={13}
              borderRadius="50%"
              mr={0.7}
              style={{
                background: `linear-gradient(to right, ${
                  [
                    "#d82b27, #f09819", // Critical
                    "#007FFF, #2a52be", // Non-Critical
                    "#9d50bb, #6e48aa", // About to Die
                    "#FFD54F, #FFEB3B", // Alarms
                  ][index % 4]
                })`,
              }}
            />
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                fontSize: {
                  xs: '0.75rem', // Mobile
                  sm: '0.65rem', // Small tablets
                  md: '0.55rem', // Medium screens
                  lg: '0.7rem', // Large screens
                  xl: '0.9rem'
                },
              }}
            >{entry.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
export default PieChartComponent;