import { useContext, useMemo, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Card,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close";
import { AlertTriangle, BatteryLow, CirclePower } from 'lucide-react';
import { Buzzer, AnimatedFuseIcon, ACVoltageIcon, DCVoltageIcon, ACVoltagered } from '../enums/ThresholdValues';
import chargerloadO from '../assets/images/ChargerLoadO.png';
import chargerload from '../assets/images/ChargerLoadN.png';
import InputPhase from '../assets/images/InputPhase.png';
import InputPhaseF from '../assets/images/inputphaseF.png';
import mccb from '../assets/images/png/circuit-breaker.png';
import acNV from '../assets/images/png/ac-voltage.png';
import commun from '../assets/images/png/cellCommun.png';
import batteryLow from '../assets/images/png/Low-charge.png';
import batteryN from '../assets/images/png/batteryN.png';
import currentH from '../assets/images/png/bolt.png';
import currentN from '../assets/images/png/lightning.png';
import socL from '../assets/images/png/Low-battery.png';
import socN from '../assets/images/png/socN.png';
import tempN from '../assets/images/png/weather.png';
import tempH from '../assets/images/png/High-temperature.png';
import conditionH from '../assets/assets/images/png/conditionH.png';
import {
  Warning as AlertTriangleIcon,
  Power as Power,
  TripOrigin as ChargerTrip,
  Bolt as ACVoltage,
  BatteryChargingFull as DCVoltage,
  NotificationsActive as BuzzerIcon,
} from '@mui/icons-material';
import { ChargingV, DischargingV } from '../enums/ThresholdValues';
import { AppContext } from "../services/AppContext";
import { tokens } from "../theme";
import FullAlertLayout from "../LiveDataComponents/FullAlertLayout"; // Hypothetical fullscreen layout component

const Alerts = () => {
  const { data, charger, serialNumber, siteId } = useContext(AppContext);
  const device = data[0];
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isLg = useMediaQuery(theme.breakpoints.down('xl'));
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { bmsAlarmsDTO } = device;
  const chargerDTO = charger[0]?.chargerDTO || {};
  const combinedData = { ...bmsAlarmsDTO, ...chargerDTO };

  const detailsMap = {
    bankDischargeCycle: "Battery",
    dcVoltageOLN: "DC Voltage",
    cellCommunication: "Cell Commun",
    batteryCondition: "Battery",
    stringVoltageLNH: "String voltage",
    stringCurrentHN: "String current",
    ambientTemperatureHN: "Ambient Temp",
    socLN: "SOC",
    chargerLoad: "Charger Load",
    inputMains: "Input Mains",
    inputPhase: "Input phase",
    acVoltageULN: "AC Voltage",
    chargerTrip: "Charger",
    outputMccb: "Output Mccb",
    inputFuse: "Input Fuse",
    rectifierFuse: "Rectifier fuse",
    filterFuse: "Filter Fuse",
    outputFuse: "Output Fuse",
    alarmSupplyFuse: "Alarm Supply Fuse",
    buzzer: "Buzzer",
  };

  // const handleBatteryCondition =()

  const getSeverityFromBit = (bit, key) => {
    if (key === "acVoltageULN") {
      switch (bit) {
        case 0:
          return { status: "Low", severity: "Low", IconComponent: () => <ACVoltagered size={20} /> };
        case 1:
          return { status: "Normal", severity: "medium", IconComponent: () => <ACVoltageIcon size={20} /> };
        case 2:
          return { status: "over", severity: "High", IconComponent: () => <ACVoltagered size={20} /> };
        default:
          return { status: "Unknown", severity: "medium", IconComponent: () => <img src={acNV} style={{ width: 23 }} /> };
      }
    }

    if (key === "stringVoltageLNH") {
      switch (bit) {
        case 0:
          return { status: "Low", severity: "Low", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="over" /> };
        case 1:
          return { status: "Normal", severity: "medium", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="Normal" /> };
        case 2:
          return { status: "High", severity: "High", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="over" /> };
        default:
          return { status: "Unknown", severity: "medium", IconComponent: () => <img src={acNV} style={{ width: 23 }} /> };
      }
    }

    switch (bit) {
      case 0:
        return { status: "Low", severity: "Low", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="over" /> };
      case 1:
        return { status: "Normal", severity: "medium", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="Normal" /> };
      case 2:
        return { status: "High", severity: "High", IconComponent: () => <DCVoltageIcon size={30} isActive={true} state="over" /> };
      default:
        return { status: "Unknown", severity: "medium", IconComponent: () => <BatteryLow size={20} /> };
    }
  };

  const alerts = useMemo(() => {
    return Object.keys(detailsMap).map((key, index) => {
      let status = "Unknown";
      let severity = "medium";
      let IconComponent = null;
      if (key === "chargerTrip") {
        status = combinedData[key] ? "" : "";
        severity = combinedData[key] ? "High" : "medium";
      } else {
        status = combinedData[key] ? "Fail" : "Normal";
        severity = combinedData[key] ? "High" : "medium";
      }

      if (key === "inputMains" || key === "inputPhase") {
        IconComponent = () => <ACVoltageIcon size={20} />;
      } else if (key === "outputMccb") {
        IconComponent = () => <img src={mccb} alt="" style={{ width: 30 }} />;
      }

      if (severity === "High") {
        IconComponent = () => <AlertTriangleIcon size={20} style={{ color: "#B71C1C" }} />;
      }
      if (key === "cellVoltageLNH" || key === "dcVoltageOLN" || key === "acVoltageULN" || key === "stringVoltageLNH") {
        const bitValue = combinedData[key];
        ({ status, severity, IconComponent } = getSeverityFromBit(bitValue, key));
      }
      if (key === "stringCurrentHN") {
        IconComponent = () => combinedData[key] ? <img src={currentH} style={{ width: 30 }} /> : <img src={currentN} style={{ width: 30 }} />;
        severity = combinedData[key] ? "High" : "medium";
        status = combinedData[key] ? "High" : "Normal";
      }
      if (key === "ambientTemperatureHN") {
        IconComponent = () => combinedData[key] ? <img src={tempH} style={{ width: 30 }} /> : <img src={tempN} style={{ width: 30 }} />;
        severity = combinedData[key] ? "High" : "medium";
        status = combinedData[key] ? "High" : "Normal";
      }
      if (key === "socLN") {
        IconComponent = () => combinedData[key] ? <img src={socL} style={{ width: 25 }} /> : <img src={socN} style={{ width: 30 }} />;
        severity = combinedData[key] ? "High" : "medium";
        status = combinedData[key] ? "Low" : "Normal";
      }
      if (key === "bankDischargeCycle") {
        IconComponent = combinedData[key] ? DischargingV : ChargingV;
        severity = combinedData[key] ? "High" : "medium";
        status = combinedData[key] ? "discharging" : "charging";
      }
      if (key === "batteryCondition") {
        if(combinedData["stringVoltageLNH"]===2){
          IconComponent = () => <img src={conditionH} style={{ width: 25 }} />;
          severity = "High";
          status = "High";
        }else{
        IconComponent = () => combinedData[key] ? <img src={batteryLow} style={{ width: 30 }} /> : <img src={batteryN} style={{ width: 30 }} />;
        severity = combinedData[key] ? "Low" : "medium";
        status = combinedData[key] ? "Low" : "Normal";
        }
      }
      if (
        key === "inputFuse" ||
        key === "rectifierFuse" ||
        key === "filterFuse" ||
        key === "outputFuse" ||
        key === "alarmSupplyFuse"
      ) {
        IconComponent = () =>
          combinedData[key] ? (
            <AnimatedFuseIcon size={14} color="rgb(183, 28, 28)" strokeWidth={1.5} isBroken={true} />
          ) : (
            <AnimatedFuseIcon size={14} color="rgb(50, 149, 56)" strokeWidth={1.5} isBroken={false} />
          );
      }
      if (key === "cellCommunication") {
        IconComponent = () => combinedData[key] ? <AlertTriangleIcon size={20} style={{ color: "#B71C1C" }} /> : <img src={commun} style={{ width: 30 }} />;
      } else if (key === "buzzer") {
        IconComponent = BuzzerIcon;
        status = combinedData[key] ? "On" : "off";
      } else if (key === "resetPushButton") {
        IconComponent = CirclePower;
        status = combinedData[key] ? "On" : "";
      }

      if (key === "chargerLoad") {
        IconComponent = () => combinedData[key] ? <img src={chargerloadO} style={{ width: 35 }} /> : <img src={chargerload} style={{ width: 35 }} />;
        status = combinedData[key] ? "Over" : "";
      }
      if (key === "chargerTrip") {
        IconComponent = () => combinedData[key] ? <img src={InputPhase} style={{ width: 28 }} /> : <img src={InputPhaseF} style={{ width: 28 }} />;
        status = combinedData[key] ? "Tripped" : "Trip";
      }

      return {
        id: index + 1,
        status,
        details: detailsMap[key],
        severity,
        IconComponent,
      };
    });
  }, [combinedData]);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "High":
        return { backgroundColor: "rgb(255, 0, 0)", color: "#ffff" };
      case "medium":
        return { backgroundColor: "rgb(29 163 29)", color: "#ffff" };
      case "Low":
        return { backgroundColor: "rgb(255, 0, 0)", color: "#ffff" };
      default:
        return { backgroundColor: "#ECEFF1", color: "#455A64" };
    }
  };

  const getSeverityStyles1 = (severity) => {
    switch (severity) {
      case "High":
        return { backgroundColor: "#ffff", color: "rgb(183, 28, 28)" };
      case "medium":
        return { backgroundColor: "#ffff", color: "rgb(27, 94, 32)" };
      case "Low":
        return { backgroundColor: "#ffff", color: "rgb(183, 28, 28)" };
      default:
        return { backgroundColor: "#ECEFF1", color: "#455A64" };
    }
  };

  const toggleFullscreen = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
      <Box
      display="flex"
      borderRadius={2}
      backgroundColor={colors.primary[100]}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
     // height="100%"
      pl="2px"
      pb="9px"
    >{!device || !charger?.[0] ? (
        <div>Loading...</div>
      ) : (
        <>
      <Box
        display="flex"
        alignItems="center"
        borderRadius="4px"
        border="1px solid black"
        position="sticky"
        top={0}
        zIndex={10}
        sx={{
         // height: "24px",
          p: 0,
          backgroundImage: colors.primary[600],
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease-in-out',
          width: "100%",
        }}
      >
        <Typography
          sx={{
            flex: 1,
            color: colors.primary[900],
            padding: isLg ? '0.5px 8px' : '2px 16px',
            fontSize: isLg ? '0.7rem' : '0.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <strong>Alarms Info</strong>
        </Typography>
        {/* <IconButton
          color="secondary"
onClick={toggleFullscreen}
          sx={{
            mx: 1.5,
            '&:hover': {
              backgroundColor: colors.primary[600],
              color: colors.greenAccent[500],
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease-in-out',
            },
          }}
        >
          <FullscreenIcon />
        </IconButton> */}
      </Box>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        gap={1.5}
        sx={{ padding: "5px 0px 0px 0px", width: "100%" }}
      >
        {alerts.map((alert) => (
          <Grid item xs={12} sm={6} md={4} lg={2.2} xl={2.3} key={alert.id}>
            <Card
              style={{
                borderRadius: 8,
                transition: "transform 0.1s ease",
                boxShadow: "0 1px 2px rgba(218, 218, 143, 0.66)",
                cursor: "pointer",
                minWidth: isLg ? 74 : 80,
                minHeight: isLg ? 43 : 43,
                display: "flex",
                flexDirection: "row",
                overfLow: "hidden",
                border: colors.primary[800],
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0.5,
                  ...getSeverityStyles1(alert.severity),
                  backgroundColor: "#ffff",
                }}
              >
                {alert.IconComponent ? (
                  <alert.IconComponent />
                ) : (
                  <>
                    {alert.severity === "High" && (
                      <AlertTriangleIcon size={20} style={{ color: "#B71C1C" }} />
                    )}
                    {alert.severity === "medium" && (
                      <AlertTriangleIcon size={20} style={{ color: "#F57F17" }} />
                    )}
                    {alert.severity === "Low" && (
                      <AlertTriangleIcon size={20} style={{ color: "#0D47A1" }} />
                    )}
                  </>
                )}
              </Box>
              <Box
                sx={{
                  width: "70%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  ...getSeverityStyles(alert.severity),
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 8,
                    fontWeight: "bold",
                    textAlign: "center",
                    wordBreak: "break-word",
                    
                  }}
                >
                  {alert.details} {alert.status}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="lg" fullWidth>
        <IconButton
          onClick={closeDialog}
          color="secondary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: colors.redAccent[500],
            borderRadius: '50%',
            padding: '4px',
            '&:hover': {
              backgroundColor: colors.redAccent[700]
            },
            transition: 'background-color 0.3s ease'
          }}
        >
          <CloseIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
        </IconButton>
        <DialogContent sx={{
          padding: '0px !important',
        }}>
          <FullAlertLayout serialNumber={serialNumber} siteId={siteId} alerts={alerts} />
        </DialogContent>
      </Dialog>
      </>)}
    </Box>
  );
};

export default Alerts;