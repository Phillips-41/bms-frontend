import React, { useContext } from "react";
import { Box, Typography, useTheme ,useMediaQuery} from "@mui/material";
import { tokens } from "../theme.jsx";
import Calendar from "../assets/images/png/calendar.png";
import BatterySerialNumber from "../assets/images/png/battery.png";
import typeOfBatteryBank from "../assets/images/png/type of BB.png";
import ah from "../assets/images/png/Ah capacity.png";
import mfname from "../assets/images/png/mfname.png";
import { AppContext } from "../services/AppContext.jsx";



function ManufacturerDetails() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
    const {
      Mdata,
    }=useContext(AppContext)
  const {
    firstUsedDate= "",
    batterySerialNumber= "",
    batteryBankType= "",
    ahCapacity= "",
    manufacturerName= "",
    designVoltage= "",
    individualCellVoltage= "",
    kva=""
  } = Mdata;
  // Media queries for breakpoints
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
      lg: '0.8rem',
    },
   fontWeight: 'bold',
  });
  return (

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
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
                fontSize: {lg: '0.7rem', xs: '0.75rem', sm: '0.875rem', md: '0.7rem',xl: '1rem'},
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                width: '100%',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <strong>Manufacturer Info</strong>
            </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              label: 'First Used Date',
              value: firstUsedDate
              
            },
            { label: 'Battery Serial Number', value: batterySerialNumber },
            { label: 'Type of Battery Bank', value: batteryBankType },
            { label: 'Ah Capacity', value: ahCapacity, unit: 'Ah' },
            { label: 'Manufacturer Name', value: manufacturerName },
            { label: 'Design Voltage', value: designVoltage, unit: 'V' },
            { label: 'Individual Cell Voltage', value: individualCellVoltage, unit: 'V' },
            { label: 'KVA Rating', value: kva, unit: 'KV' },
          ].map(({ label, value, unit }, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: { xs: '4px', sm: '6px', md: '8px', lg: '8px' },
              }}
            >
              <span>🔹</span>
              <Typography
                sx={{
                  ...getTypographyStyles(),
                  minWidth: { xs: '80px', sm: '100px', md: '120px', lg: '111px',xl:'143px' },
                  // color: '#ADD8E6'
                }}
              >
                {label}
              </Typography>
              <Typography sx={{ ...getTypographyStyles() }}>:</Typography>
              {value && (
                <Typography sx={{ ...getTypographyStyles(),  }}>
                  {value} {unit || ''}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
  
  );
}
export default ManufacturerDetails;
