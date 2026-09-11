import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

export const CircleStatusCard = ({ data }) => {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', borderColor: 'divider', borderRadius: 2 }}>
      <CardContent sx={{ p: { lg: 1.5, xl: 2 }, '&:last-child': { pb: { lg: 1.5, xl: 2 } } }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: { lg: 1, xl: 1.5 } }}>
            Status
        </Typography>

        {/* Total Monitored Sites */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: {lg:1, xl:2}}}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Total Monitored Sites</Typography>
            <Typography variant="h3" sx={{ color: '#2ecc71', fontWeight: 700 }}>{data.totalMonitoredSites}</Typography>
          </Box>
          <CheckCircleIcon sx={{ fontSize: 40, color: '#2ecc71' }} />
        </Box>

        {/* Active Alarms */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: {lg:1, xl:2} }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>Active Alarms</Typography>
            <Typography variant="h3" sx={{ color: '#ff4d4d', fontWeight: 700 }}>{data.activeAlarms}</Typography>
          </Box>
          <WarningAmberIcon sx={{ fontSize: 40, color: '#ff4d4d' }} />
        </Box>

        {/* Modem Comms Uptime */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>Modem Comms Uptime</Typography>
            <Typography variant="h3" sx={{ color: '#2ecc71', fontWeight: 700 }}>{data.modemCommsUptime}</Typography>
          </Box>
          <SignalCellularAltIcon sx={{ fontSize: 40, color: '#2ecc71' }} />
        </Box>
      </CardContent>
    </Card>
  );
};