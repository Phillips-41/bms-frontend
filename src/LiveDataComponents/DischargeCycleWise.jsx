import React, { useContext } from "react";
import { Box, Typography, useTheme,useMediaQuery } from "@mui/material";
import { tokens } from "../theme.jsx";
import dtIcon from "../assets/images/png/run hours.png";
import pdcIcon from "../assets/images/png/Ah capacity.png"; // Icon for Peak Discharge Current
import { AppContext } from "../services/AppContext.jsx";

export default function DischargeCycleWise() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const { data } = useContext(AppContext);
  const device = data[0];
  const { dischargeTimeCycle, systemPeakCurrentInDischargeOneCycle } = device;
  const isLg = useMediaQuery(theme.breakpoints.down('xl')); // lg and below
 const getTypographyStyles = () => ({
    fontSize: {
      xs: '0.75rem', // Smaller for mobile
      sm: '0.875rem',
      md: '1rem',
      lg: '0.7rem',
      xl: '0.9rem',
    },
    color: colors.primary[200],
   fontWeight: 'bold',
  });
  const dischargeTime = (totalSeconds = 0) => {
    try {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      const hr = hours < 10 ? "0" + hours : hours;
      const mn = minutes < 10 ? "0" + minutes : minutes;
      const sc = seconds < 10 ? "0" + seconds : seconds;

      return `${hr}:${mn}:${sc}`;
    } catch (error) {
      return "--";
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      sx={{
          pl: { xs: '4px', sm: '6px', md: '8px', lg: '0px' },
          pr: { xs: '4px', sm: '6px', md: '8px', lg: '2px' },
          pb: { xs: '4px', sm: '6px', md: '8px', lg: '10px' ,xl:"10px"},

      }}
    >
      <Typography
        sx={{
          alignSelf: 'center',
          backgroundImage: colors.primary[600],
           color: colors.primary[900],
          padding: isLg ? '0.5px 8px' : '2px 16px',
          borderRadius: '2px',
          display: 'inline-block',
          mb: isLg ? '8px' : '13px',
          fontSize: isLg ? '0.7rem' : '0.875rem',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}
      >
        <strong>Discharge Cycle Info</strong>
      </Typography>
      <Box display="flex" flexDirection="column" width="100%">
        {[
          { label: 'Peak Current', value: systemPeakCurrentInDischargeOneCycle, unit: 'A' },
          { label: 'Run Time', value: dischargeTime ? dischargeTime(dischargeTimeCycle) : dischargeTimeCycle, unit: '' },
        ].map(({ label, value, unit }, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            sx={{
               gap: { xs: '4px', sm: '6px', md: '8px', lg: '1px', xl: '6px' },
              mb: isLg ? '10px' : '9px'
            }}
          >
            <span >🔹</span>
            <Typography
              sx={{
               ...getTypographyStyles(),
                  minWidth: { xs: '80px', sm: '100px', md: '120px', lg: '70px',xl:'90px' },
              
              }}
            >
              {label}
            </Typography>
            <Typography sx={{ ...getTypographyStyles()}}>:</Typography>
            <Typography sx={{ 
               ...getTypographyStyles(),
             
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {value} {unit || ''}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
