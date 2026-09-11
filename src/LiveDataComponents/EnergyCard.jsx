import { useContext } from "react";
import { Box, useTheme,useMediaQuery } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { AppContext } from "../services/AppContext";
import { tokens } from "../theme";


export const Energycard = () => {
  const { data } = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const device = data[0];
  if (!device) return <div></div>;
  
  const { ahInForOneChargeCycle, ahOutForOneDischargeCycle } = device;
  
  const ampereHourIn = ahInForOneChargeCycle;
  const ampereHourOut = ahOutForOneDischargeCycle;

  const ampereHourComparisonData = [
    { name: 'Ah In', value: ampereHourIn },
    { name: 'Ah Out', value: ampereHourOut },
  ];

  const getBarGradient = (entry) => {
    switch (entry.name) {
      case 'Ah In':
        return '#6A4C93';
      case 'Ah Out':
        return '#F8961E';
      default:
        return 'url(#blueGradient)';
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
          data={ampereHourComparisonData}
          margin={{ top: 20, left: 0, right: 10, bottom: 20 }}
        >
          <defs>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2E7D32" stopOpacity={1} />
              <stop offset="100%" stopColor="#66BB6A" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C62828" stopOpacity={1} />
              <stop offset="100%" stopColor="#EF5350" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#003366" stopOpacity={1} />
              <stop offset="100%" stopColor="#0f52ba" stopOpacity={1} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 10, fontWeight: 'bold', fill: colors.primary[200] }}
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 10, fontWeight: 'bold', fill: colors.primary[200] }}
            label={{
              value: 'Ampere-Hour (Ah)',
              angle: -90,
              position: 'insideLeft',
              fontSize: '0.5rem',
              fontWeight: 'bold',
              fill: colors.primary[200]
            }}
          />
          <Bar dataKey="value" >
            {ampereHourComparisonData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarGradient(entry)} />
            ))}
            <LabelList dataKey="value" position="top" fontSize={10} fill={colors.primary[200]}/>
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};


export default Energycard;

