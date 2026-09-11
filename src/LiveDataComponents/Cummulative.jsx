import React, { useContext } from "react";
import { Box, Typography, useTheme,useMediaQuery } from "@mui/material";
import { tokens } from "../theme.jsx"; 
import count from "../assets/images/png/cycle count.png";
import ah from "../assets/images/png/Ah capacity.png";
import chargeenergy from "../assets/images/png/charge energy.png";
import dischargeenergy from "../assets/images/png/dis charge.png";
import runhours from "../assets/images/png/run hours.png";
import { AppContext } from "../services/AppContext.jsx";



export default function Cummulative() {

      const {
        data,
      }=useContext(AppContext)
    const device = data[0];
     const {
      chargeOrDischargeCycle, 
      cumulativeAHIn, 
      cumulativeAHOut,
      totalChargingEnergy,
      totalDischargingEnergy,
      batteryRunHours
    } = device;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px–899px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px–1199px
  const isLg = useMediaQuery(theme.breakpoints.up('lg')); // 1200px+

  // Dynamic variant based on screen size
  const getVariant = () => {
    if (isXs) return 'h8'; // 10px
    if (isSm) return 'h7'; // 12px
    if (isMd) return 'h6'; // 14px
    if (isLg) return 'h6'; // 16px
    return 'h6'; // Default fallback
  };
  const batteryRunHour = (totalSeconds = 0) => {
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

  // Mapping labels to image paths
  const iconMap = {
     "Cycle count": count,
     "Ampere Hour In": ah,
     "Ampere Hour Out": ah,
     "Charging Energy": chargeenergy,
    "Discharging Energy":dischargeenergy,
    "Battery Run Hours": runhours,
  };
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
  const getTypographyStyles1 = () => ({
    fontSize: {
      xs: '0.75rem', // Smaller for mobile
      sm: '0.875rem',
      md: '1rem',
      lg: '0.7rem',
    },
    fontWeight: 'bold',
  });

  return (
   
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      sx={{
       // ml: { xs: '4px', sm: '6px', md: '8px', lg: '2px' },
       // mr: { xs: '4px', sm: '6px', md: '8px', lg: '10px' },
        pb: { xs: '30px', sm: '12px', md: '16px', lg: '53px',xl: '51px' },
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
                      fontSize: {lg: '0.7rem', xs: '0.75rem', sm: '0.875rem', md: '0.7rem',xl: '1rem'},
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      width: '100%',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}
                  >
                    <strong>Cummulative Info</strong>
                  </Typography>
      <Box display="flex" flexDirection="column">
        {[
          { label: 'Cycle count', value: chargeOrDischargeCycle },
          { label: 'Ampere Hour In', value: cumulativeAHIn, unit: 'Ah' },
          { label: 'Ampere Hour Out', value: cumulativeAHOut, unit: 'Ah' },
          { label: 'Charging Energy', value: totalChargingEnergy, unit: 'kWh' },
          { label: 'Discharging Energy', value: totalDischargingEnergy, unit: 'kWh' },
          { label: 'Battery Run Hours', value: batteryRunHours ? batteryRunHour(batteryRunHours) : batteryRunHours },
        ].map(({ label, value, unit }, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            sx={{
              gap: { xs: '4px', sm: '6px', md: '8px', lg: '2px' },
            }}
          >
            <span>🔹</span>
            <Typography
              sx={{
                ...getTypographyStyles(),
                minWidth: { xs: '80px', sm: '100px', md: '120px', lg: '101px',xl:'130px' }
              }}
            >
              {label}
            </Typography>
            <Typography sx={{ ...getTypographyStyles() }}>:</Typography>
            <Typography sx={{ ...getTypographyStyles() }}>
              {value} {unit || ''}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>

  );
}
