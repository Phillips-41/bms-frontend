import React from 'react'
import { Box, Typography,useTheme,useMediaQuery } from "@mui/material";
import { tokens } from "../theme.jsx"
import Acvoltage from "../assets/images/png/battery.png"
import Accurrent from "../assets/images/png/Ah capacity.png"
import frequenc from "../assets/images/png/frequency.png"
import { GreenLight, RedLight } from '../enums/ThresholdValues.jsx';

export const Charger = ({charger}) => {

    const theme =useTheme();
    const colors=tokens(theme.palette.mode);

     if (!charger || !charger[0]) {
        return null; // or return <LoadingSpinner />;
    }

    const{acVoltage,acCurrent ,frequency ,energy}=charger[0];
    const chargerDTO = charger[0]?.chargerDTO || {};

   // const {ACEM} = chargerDTO;
    const ACEM = chargerDTO?.acem || false; // Default to false if ACEM is not present
    const isLg = useMediaQuery(theme.breakpoints.up('lg')); // 1200px+
  
    // Dynamic variant based on screen size
 
    const getTypographyStyles = () => ({
      fontSize: {
        xs: '0.75rem', // Smaller for mobile
        sm: '0.875rem',
        md: '1rem',
        lg: '0.6rem',
        xl: '0.9rem',
      },
      color:colors.primary[200],
     fontWeight: 'bold',
    });

      return (
        <Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            sx={{
       // ml: { xs: '4px', sm: '6px', md: '8px', lg: '2px' },
       // mr: { xs: '4px', sm: '6px', md: '8px', lg: '10px' },
      pb: { xs: '30px', sm: '12px', md: '16px', lg: '19px',xl: '25px' },
      }}
          >
       
              <Box
                sx={{
                  position: 'relative',
                  backgroundImage: colors.primary[600],
                  borderRadius: '3px',
                  px: isLg ? '4px' : '16px',
                  py: 0.1,
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                {/* Centered Typography */}
                <Typography
                  sx={{
                    alignSelf: 'center',
                    color: colors.primary[900],
                    padding: isLg ? '0.2  px 8px' : '2px 16px',
                    borderRadius: '2px',
                    display: 'inline-block',
                    fontSize: {lg: '0.7rem', xs: '0.75rem', sm: '0.875rem', md: '0.7rem',xl: '1rem'},
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                >
                  <strong>Charger Info</strong>
                </Typography>

                {/* Right-Aligned Light */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '60%',
                    right: isLg ? 6 : 12,
                    transform: 'translateY(-50%)',
                  }}
                >
                  {ACEM ? <RedLight /> : <GreenLight />}
                </Box>
              </Box>
            <Box
              display="flex"
              flexDirection="column"
            >
              {[
                { label: "AC Voltage", value: acVoltage.toFixed(2), unit: "V" ,icon:Acvoltage},
                { label: "AC Current", value: acCurrent.toFixed(2), unit: "A",icon:Accurrent },
                {label:"AC Energy", value:energy.toFixed(2),unit:"kWh"},
                { label: "Frequency", value: frequency.toFixed(2), unit: "Hz",icon:frequenc },
                // { label: "PF", value: powerFactor.toFixed(2), unit: "",icon:"" },
                
              ].map(({ label, value,unit,icon }, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  sx={{
              gap: { xs: '4px', sm: '6px', md: '8px', lg: '1px',xl: '6px' },
            }}
                >
                  🔹
                  <Typography
                    sx={{
                      ...getTypographyStyles(),
                      minWidth: { xs: '100px', sm: '150px', md: '200px', lg: '58px' ,xl: '68px' },
                      // color: '#ADD8E6'
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{...getTypographyStyles()}}
                    // fontWeight="bold"
                   // style={{ color: "inherit" }} // Ensures colon inherits label's color
                  >
                    :
                  </Typography>
                  <Typography
                    sx={{...getTypographyStyles()}}
                    // fontWeight="bold"
                 //   style={{color: '#fff'}}
                  >
                    {value} {unit}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      );
}
export default Charger;