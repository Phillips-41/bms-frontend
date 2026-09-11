import React, { useContext } from 'react'
import { AppContext } from '../../services/AppContext';
import { Grid,Box, Paper, Typography, Button, Modal,useTheme, Tooltip, useMediaQuery} from "@mui/material";
import MapWithMarker from '../../LiveDataComponents/MapWithMarker';
import Charger from '../../LiveDataComponents/Charger';
import Battery from '../../LiveDataComponents/BatteryState';
import PowerIcon from "@mui/icons-material/Power"; // Voltage icon
import BoltIcon from "@mui/icons-material/Bolt"; // Current icon
import ThermostatIcon from "@mui/icons-material/Thermostat"; // Temperature icon
import ManufacturerDetails from '../../LiveDataComponents/ManufacturerDetails';
import Cummulative from '../../LiveDataComponents/Cummulative';
import CellsData from "../../LiveDataComponents/CellsData";
import Alerts from "../../LiveDataComponents/Alerts";
import DischargeCycleWise from "../../LiveDataComponents/DischargeCycleWise";
import ChargeCycleWise from "../../LiveDataComponents/ChargeCycleWise";
import VoltageVisualizations from "../../LiveDataComponents/SineWave";
import Energycard from "../../LiveDataComponents/EnergyCard";
import { tokens } from '../../theme';
const FirstRow = () => {
  const {
    data,
    charger
  }=useContext(AppContext)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isLg = useMediaQuery(theme.breakpoints.down('xl')); // lg and below
  const device = data[0];
  const{instantaneousCurrent, stringvoltage,ambientTemperature, bmsAlarmsDTO,socLatestValueForEveryCycle,dodLatestValueForEveryCycle}=device
 const {
    stringVoltageLNH = 0, 
    stringCurrentHN = 0, 
    ambientTemperatureHN = 0, 
    socLN = 0
} = bmsAlarmsDTO || {};
  const [Idata, setIdata] = React.useState({
         voltage: {
           value: stringvoltage,
           unit: "V",
           threshold: {
             normal: { min: 220, max: 240 },
             warning: { min: 210, max: 250 },
             critical: { min: 0, max: 210 },
           },
         },
         current: {
           value: instantaneousCurrent,
           unit: "A",
           threshold: {
             normal: { min: 8, max: 12 },
             warning: { min: 6, max: 14 },
             critical: { min: 0, max: 6 },
           },
         },
         temperature: {
           value: ambientTemperature,
           unit: "°C",
           threshold: {
             normal: { min: 20, max: 50 },
             warning: { min: 10, max: 60 },
             critical: { min: 0, max: 10 },
           },
         },
       });
     
       // Function to determine icon color based on thresholds
       const getIconColor = (value) => {
         if (value) {
           return   "rgb(183, 28, 28)"; // Normal range
         } else {
           return "rgb(0, 156, 10)";;
         }
       };
   
       const getColorForDCV=(value)=>{
         if(value===0){
           return "rgb(183, 28, 28)";
         }else if(value===1){
           return "rgb(0, 156, 10)";
         }else{
           return "rgb(183, 28, 28)";
         }
       }
  return (
    <div>
      <Grid container spacing={1}>
        {/* ===== Row 1 ===== */}
        <Grid container item spacing={1}>
          {/* Map */}
          <Grid item lg={3} xl={3} xs={12}>
            <Paper elevation={8}>
              <MapWithMarker />
            </Paper>
          </Grid>

          {/* Instantaneous Info + Charger + SOC */}
          <Grid item lg={4} xl={4}>
            <Grid container direction="column" spacing={1}>
              <Grid item xs={5}>
                {/* Instantaneous Info Card */}
                <Paper
                  elevation={8}
                  sx={{
                   // height: '70px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color: 'white',
                    bgcolor: colors.primary[100],
                    borderRadius: '4px',
                    p:0,
                    m:0
                  }}
                >
                  {/* Title and Values */}
                  <Box sx={{ textAlign: 'center' }}>
                      <Typography
                          sx={{
                            alignSelf: 'center',
                            backgroundImage:  colors.primary[600],
                            color: colors.primary[900],
                            padding: isLg ? '0.5px 8px' : '0px 0px',
                            borderRadius: '2px',
                            display: 'inline-block',
                           // mb: isLg ? '8px' : '13px',
                            fontSize: isLg ? '0.7rem' : '0.975rem',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            textAlign: 'center',
                            boxSizing: 'border-box'
                          }}
                        >
                          <strong>Instantaneous Info</strong>
                        </Typography>

                    {/* Voltage, Current, Temperature */}
                    <Grid 
                     container 
                     spacing={1} 
                     alignItems="center" 
                     justifyContent="center"
                     sx={{
                      height:"55px"
                     }}
                     >
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="String Voltage" arrow>
                            <PowerIcon sx={{ fontSize: '1.5rem', color: getColorForDCV(stringVoltageLNH), mr: 0.5 }} />
                          </Tooltip>
                          <Typography variant="subtitle2" sx={{color:colors.primary[200], fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>
                            {stringvoltage} {Idata.voltage.unit}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="String Current" arrow>
                            <BoltIcon sx={{ fontSize: '1.5rem', color: getIconColor(stringCurrentHN), mr: 0.5 }} />
                          </Tooltip>
                          <Typography variant="subtitle2" sx={{color:colors.primary[200], fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>
                            {instantaneousCurrent} {Idata.current.unit}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="Ambient Temperature" arrow>
                            <ThermostatIcon sx={{ fontSize: '1.5rem', color: getIconColor(ambientTemperatureHN), mr: 0.5 }} />
                          </Tooltip>
                          <Typography variant="subtitle2" sx={{color:colors.primary[200], fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' } }}>
                            {ambientTemperature} {Idata.temperature.unit}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              {/* Charger & SOC */}
              <Grid item xs={7}>
                <Grid container direction="row" spacing={0.4}>
                  <Grid item xs={7}>
                    <Paper elevation={8} sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", color: "white", bgcolor:colors.primary[100],}}>
                      <Charger charger={charger} />
                    </Paper>
                  </Grid>
                  <Grid item xs={5}>
                    <Paper elevation={8} 
                    sx={{ 
                      height: {lg:'125px',xl:'140px',xs:'100px',sm:'100px',md:'100px'}, 
                      
                      display: "flex", flexDirection: "column",
                    color: "white", bgcolor:colors.primary[100], 
                    }}>
                      <Box display="flex" 
                      justifyContent="center"
                       >
                        <Typography
                          sx={{
                            alignSelf: 'center',
                            backgroundImage: colors.primary[600],
                            color: colors.primary[900],
                            padding: isLg ? '0.5px 8px' : '2px 16px',
                            borderRadius: '2px',
                            display: 'inline-block',
                            mb: isLg ? '7px' : '13px',
                          fontSize: {lg: '0.8rem', xs: '0.75rem', sm: '0.875rem', md: '0.7rem',xl: '1rem'},
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            width: '100%',
                            textAlign: 'center',
                            boxSizing: 'border-box'
                          }}
                        >
                          <strong>State of Charge</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                        <Box sx={{ flexShrink: 0 }}>
                          <Battery socValue={socLatestValueForEveryCycle} socState={socLN} />
                        </Box>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: 1, rowGap: 0, alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "left", minWidth: '30px', color:colors.primary[200], }}>
                            SOC:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: "bold",color:colors.primary[200] }}>
                            {socLatestValueForEveryCycle}%
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "left", minWidth: '30px', color:colors.primary[200],}}>
                            DOD:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: "bold", color:colors.primary[200], }}>
                            {dodLatestValueForEveryCycle}%
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Manufacturer Details */}
          <Grid item lg={2.7} xl={2.7}>
            <Paper elevation={8} sx={{ color: "white", bgcolor:colors.primary[100] }}>
              <ManufacturerDetails />
            </Paper>
          </Grid>

          {/* Cummulative */}
          <Grid item lg={2.3} xl={2.3}>
            <Paper elevation={8} sx={{ color: "white", bgcolor:colors.primary[100] }}>
              <Cummulative />
            </Paper>
          </Grid>
        </Grid>

        {/* ===== Row 2 ===== */}
<Grid container spacing={1} sx={{ display: 'flex', alignItems: 'stretch' }}>
      {/* First Grid Item */}
      <Grid item xs={12} md={4.5} lg={4.5} sx={{ display: 'flex' }}>
        <Paper
          elevation={8}
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            width: '100vw'
          }}
        >
          <CellsData />
        </Paper>
      </Grid>

      {/* Second Grid Item */}
      <Grid item xs={12} md={1.8} xl={1.8} lg={1.8} sx={{ display: 'flex' }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%'
          }}
        >
          <Box sx={{ flex: '0 0 33.33%', display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={8}
              sx={{
                bgcolor: colors.primary[100],
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <DischargeCycleWise />
            </Paper>
          </Box>
          <Box sx={{ flex: '0 0 66.67%', display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={8}
              sx={{
                bgcolor: colors.primary[100],
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <VoltageVisualizations />
            </Paper>
          </Box>
        </Box>
      </Grid>

      {/* Third Grid Item */}
      <Grid item xs={12} md={1.8} xl={1.8} lg={1.8} sx={{ display: 'flex' }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            width: '100%'
          }}
        >
          <Box sx={{ flex: '0 0 33.33%', display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={8}
              sx={{
                bgcolor: colors.primary[100],
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <ChargeCycleWise />
            </Paper>
          </Box>
          <Box sx={{ flex: '0 0 66.67%', display: 'flex', flexDirection: 'column' }}>
            <Paper
              elevation={8}
              sx={{
                bgcolor: colors.primary[100],
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
              }}
            >
              <Energycard />
            </Paper>
          </Box>
        </Box>
      </Grid>

      {/* Fourth Grid Item */}
      <Grid item xs={12} md={3.9} xl={3.9} lg={3.9} sx={{ display: 'flex' }}>
        <Paper
          elevation={8}
          sx={{
            bgcolor: colors.primary[100],
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Alerts />
        </Paper>
      </Grid>
    </Grid>

      </Grid>

    </div>
  )
}

export default FirstRow