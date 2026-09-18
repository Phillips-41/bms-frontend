import React, { useMemo, useState } from 'react';
import { Box, Card, Typography, Grid, Modal, IconButton, List, ListItem, ListItemText, Chip, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { countActiveAlarms, ALARM_DEFS } from './dashboardUtils';

const StatsCard = styled(Card)(({ theme, color }) => ({
  height: '100%',
  borderRadius: 2,
  border: `1px solid ${theme.palette.divider}`,
  background: theme.palette.background.paper,
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    transform: 'translateY(-2px)',
    cursor: 'pointer',
  },
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-evenly',
  padding: theme.spacing(0.5),
  minHeight: '70px',
}));

const StatsIcon = styled(Box)(({ theme, color }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: color ? `${color}20` : `${theme.palette.primary.main}20`,
  color: color || theme.palette.primary.main,
  fontSize: '1.5rem',
  flexShrink: 0,
  marginBottom: theme.spacing(0.5),
}));

const StatsValue = styled(Typography)(({ theme, color }) => ({
  fontWeight: 900,
  lineHeight: 1.2,
  color: color || 'text.primary',
  fontSize: '1.2rem',
  textAlign: 'center',
}));

const StatsLabel = styled(Typography)(({ theme }) => ({
  color: 'text.secondary',
  fontWeight: 900,
  fontSize: '0.60rem',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
  lineHeight: 1.2,
  textAlign: 'center',
  marginTop: theme.spacing(0.25),
}));

// Modal styles
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  maxHeight: '80vh',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[24],
  padding: theme.spacing(3),
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '6px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: '3px',
  },
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`,
  position: 'sticky',
  top: 0,
  backgroundColor: theme.palette.background.paper,
  zIndex: 1,
}));

const DeviceItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(1.5),
}));

const StatsCards = ({ device = [], statsData: externalStatsData }) => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Calculate stats from device data
  const calculatedStats = useMemo(() => {
    if (!device || !device.length) {
      return {
        chargerBoost: { count: 0, devices: [] },
        chargerFloat: { count: 0, devices: [] },
        chargerTrip: { count: 0, devices: [] },
        floatVoltageDeviation: { count: 0, devices: [] },
        thermalRunway: { count: 0, devices: [] },
      };
    }

    let boostDevices = [];
    let floatDevices = [];
    let tripDevices = [];

    device.forEach((item) => {
      // Check for charger trip alarm
      const hasChargerTrip = ALARM_DEFS.some(def => 
        def.key === 'chargerTrip' && def.check(item)
      );
      if (hasChargerTrip) {
        tripDevices.push(item);
      }

      // Get string voltage from device data
      const getStringVoltage = (deviceItem) => {
        return deviceItem.stringVoltage || 
               deviceItem.generalDataDTO?.deviceDataDTO?.[0]?.stringVoltage || 
               0;
      };

      const getCurrent = (deviceItem) => {
         return deviceItem.instantaneousCurrent || 
               deviceItem.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || 
               0;
      }

      const voltage = parseFloat(getStringVoltage(item)) || 0;
      const current = parseFloat(getCurrent(item)) || 0;

      // Classify based on voltage
      if (voltage >= 33 && voltage <= 35 && current < 10) {
        floatDevices.push(item);
      } else if (voltage > 35 && current < 10) {
        boostDevices.push(item);
      }
    });

    return {
      chargerBoost: { 
        count: boostDevices.length, 
        devices: boostDevices 
      },
      chargerFloat: { 
        count: floatDevices.length, 
        devices: floatDevices 
      },
      chargerTrip: { 
        count: tripDevices.length, 
        devices: tripDevices 
      },
      floatVoltageDeviation: { 
        count: 100, 
        devices: '' 
      },
      thermalRunway: {
        count: 62, 
        devices: '' 
      },
    };
  }, [device]);

  // Use external stats if provided, otherwise use calculated
  const statsData = externalStatsData || [
    {
      id: 'charger-boost',
      label: 'Charger Boost',
      value: calculatedStats.chargerBoost.count,
      color: '#2196f3',
      icon: '🚀',
      devices: calculatedStats.chargerBoost.devices,
    },
    {
      id: 'charger-float',
      label: 'Charger Float',
      value: calculatedStats.chargerFloat.count,
      color: '#4caf50',
      icon: '🔋',
      devices: calculatedStats.chargerFloat.devices,
    },
    {
      id: 'charger-trip',
      label: 'Charger Trip',
      value: calculatedStats.chargerTrip.count,
      color: '#f44336',
      icon: '⚡',
      devices: calculatedStats.chargerTrip.devices,
    },
    {
      id: 'float-deviation',
      label: 'Float Deviation',
      value: calculatedStats.floatVoltageDeviation.count,
      color: '#ff9800',
      icon: '📊',
      devices: calculatedStats.floatVoltageDeviation.devices,
    },
    {
      id: 'thermal-runway',
      label: 'Thermal Runway',
      value: calculatedStats.thermalRunway.count,
      color: '#9c27b0',
      icon: '🔥',
      devices: calculatedStats.thermalRunway.devices,
    },
  ];

  const handleCardClick = (stat) => {
    setSelectedStat(stat);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedStat(null);
  };

  const getDeviceInfo = (deviceItem) => {
    const name = deviceItem.area || 
                 deviceItem.siteLocationDTO?.area || 
                 deviceItem.name || 
                 'Unknown Area';
    const zone = deviceItem.zone || 
                 deviceItem.siteLocationDTO?.zone || 
                 'N/A';
    const circle = deviceItem.circle || 
                   deviceItem.siteLocationDTO?.circle || 
                   'N/A';
    const division = deviceItem.division || 
                     deviceItem.divison || 
                     deviceItem.siteLocationDTO?.division || 
                     'N/A';
    const voltage = deviceItem.stringVoltage || 
                   deviceItem.generalDataDTO?.deviceDataDTO?.[0]?.stringVoltage || 
                   0;
    const temperature = deviceItem.temperature || 
                       deviceItem.generalDataDTO?.deviceDataDTO?.[0]?.temperature || 
                       'N/A';
    
    return { name, zone, circle, division, voltage, temperature };
  };

  return (
    <>
      <Card variant="outlined" sx={{ height: '100%', width: '100%',  borderColor: 'divider', borderRadius: 2 }}>
        <Grid container spacing={0.5} sx={{ height: '100%' }}>
          {statsData.map((stat) => (
            <Grid item xs={6} sm={4} md={2.4} key={stat.id} sx={{ height: '100%' }}>
              <StatsCard 
                color={stat.color}
                onClick={() => handleCardClick(stat)}
              >
                <StatsIcon color={stat.color}>
                  {stat.icon}
                </StatsIcon>
                <StatsLabel>
                  {stat.label}
                </StatsLabel>
                <StatsValue color={stat.color}>
                  {stat.value}
                </StatsValue>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Modal for displaying devices */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="devices-modal"
      >
        <ModalContainer>
          <ModalHeader>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {selectedStat?.icon} {selectedStat?.label}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Total Devices: {selectedStat?.value}
              </Typography>
            </Box>
            <IconButton onClick={handleCloseModal} size="small">
              <CloseIcon />
            </IconButton>
          </ModalHeader>

          {selectedStat?.devices?.length > 0 ? (
            <List disablePadding>
              {selectedStat.devices.map((deviceItem, index) => {
                const info = getDeviceInfo(deviceItem);
                return (
                  <DeviceItem key={deviceItem.siteId || index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {info.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {info.temperature !== 'N/A' && (
                          <Chip 
                            label={`Temp: ${info.temperature}°C`} 
                            size="small" 
                            color={info.temperature > 45 ? 'error' : 'default'}
                          />
                        )}
                        <Chip 
                          label={`Voltage: ${info.voltage}V`} 
                          size="small" 
                          color={info.voltage > 35 ? 'primary' : 'success'}
                        />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, width: '100%' }}>
                      <Chip 
                        label={`Zone: ${info.zone}`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`Circle: ${info.circle}`} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        label={`Division: ${info.division}`} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </DeviceItem>
                );
              })}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No devices found for this category
              </Typography>
            </Box>
          )}
        </ModalContainer>
      </Modal>
    </>
  );
};

export default StatsCards;