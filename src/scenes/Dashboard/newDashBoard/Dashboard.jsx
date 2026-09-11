import React from 'react';
import { Box, Grid, Typography, Card, useTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/Mail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { dashboardData } from './dashboardData';
import { CircleStatusCard } from './CircleStatusCard';
import { AlarmLeaderboard } from './AlarmLeaderboard';
import { AnalyticsSection } from './AnalyticsSection';
import { ActiveAlarmsLog } from './ActiveAlarmsLog';
import DashBoardBar from '../DashBoardBar/DashBoardBar';

export const NewDashboard = () => {
  const theme = useTheme();

  return (
    <Box sx={{ height: '100%', minHeight: 0, color: 'text.primary', bgcolor: 'background.default', overflow: 'hidden' }}>
      <Box sx={{ height: '100%', minHeight: 0, p: { xs: 1.5, lg: 2 }, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navigation Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 1, lg: 1.5 }, flexShrink: 0 }}>
           <Card variant="outlined" sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', borderColor: 'divider', borderRadius: 2 }}>
             <DashBoardBar/>
          </Card>
        </Box>

        {/* Dashboard Grid Layout */}
        <Grid container spacing={{ xs: 1.5, lg: 2 }} sx={{ flex: 1, minHeight: 0, alignContent: 'stretch', '& > .MuiGrid-item': { minHeight: 0, display: 'flex' } }}>
          
          {/* Top Row */}
          <Grid item xs={12} md={4} sx={{ height: { md: 'calc(50% - 6px)', lg: 'calc(50% - 8px)' } }}>
            <CircleStatusCard data={dashboardData.circleStatus} />
          </Grid>
          
          <Grid item xs={12} md={8} sx={{ height: { md: 'calc(50% - 6px)', lg: 'calc(50% - 8px)' } }}>
            <AlarmLeaderboard data={dashboardData.divisionAlarms} />
          </Grid>

          {/* Bottom Row */}
          <Grid item xs={12} md={8} sx={{ height: { md: 'calc(50% - 6px)', lg: 'calc(50% - 8px)' } }}>
            <AnalyticsSection 
              matrixData={dashboardData.assetStressMatrix} 
              reliabilityData={dashboardData.supplierReliability} 
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ height: { md: 'calc(50% - 6px)', lg: 'calc(50% - 8px)' } }}>
            <ActiveAlarmsLog alarms={dashboardData.activeAlarmsLog} />
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
};

export default NewDashboard;