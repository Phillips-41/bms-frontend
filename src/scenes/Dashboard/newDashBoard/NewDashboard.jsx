import { useState, useEffect, useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import DashBoardBar from '../DashBoardBar/DashBoardBar';
import { CircleStatusCard } from './CircleStatusCard';
import { ActiveAlarmsLog } from './ActiveAlarmsLog';
import { SitesNeedAttention } from './SitesNeedAttention';
import { AlertHotspots } from './AlertHotspots';
import PendingInstallations from './PendingInstallations';
import HealthRanking from './HealthRanking';
import {
  filterByHierarchy,
  getLatestActiveAlarms,
  buildCircleStatus,
  applyFilterChange,
} from './dashboardUtils';

const NewDashboard = ({ totalData, device, userAccess, defaultFilters, dashboardData, loading, error }) => {
  
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

   const filteredTotal = useMemo(
    () => filterByHierarchy(totalData, filters),
    [totalData, filters.zone, filters.circle, filters.division, filters.area]
  );

    const filteredDevice = useMemo(
    () => filterByHierarchy(device, filters),
    [device, filters.zone, filters.circle, filters.division, filters.area]
  );
 
  const circleStatus = useMemo(
    () => buildCircleStatus(filteredTotal), [filteredTotal]
  );

  const latestAlarms = useMemo(
    () => getLatestActiveAlarms(filteredDevice, 6),
    [filteredDevice]
  );

  // Build alert hotspots data from dashboardData
  const alertHotspotsData = useMemo(() => {
    if (!dashboardData) return [];
    
    return [
      {
        id: 1,
        name: 'Charger Boost',
        count: dashboardData.boostCount ?? 0,
        change: 0,
        isPositive: true,
      },
      {
        id: 2,
        name: 'Charger Float',
        count: dashboardData.floatCount ?? 0,
        change: 0,
        isPositive: false,
      },
      {
        id: 3,
        name: 'Float Deviation',
        count: dashboardData.floatDeviationCount ?? 0,
        change: 0,
        isPositive: true,
      },
      {
        id: 4,
        name: 'Thermal Runway',
        count: dashboardData.thermalRunwayDeviationCount ?? 0,
        change: 0,
        isPositive: false,
      },
    ];
  }, [dashboardData]);

   const siteNeedAttentionList = useMemo(
    () => dashboardData?.siteNeedAttentionDTOList ?? [],
    [dashboardData]
  );

// Filtered list for only SitesNeedAttention 
  const substationsData = useMemo(() => {
    if (!dashboardData?.siteNeedAttentionDTOList) return [];
    return dashboardData.siteNeedAttentionDTOList
      .filter((site) => String(site.category || '').toUpperCase() === 'CRITICAL_SITES')
      .map((site, index) => ({
        id: index + 1,
        name: site.area,
        siteId: site.siteId,
        soc: site.soc,
        voltage: site.voltage,
        batteryTemp: site.temp,
        subDivision: site.subDivision,
        circle: site.circle,
        zone: site.zone,
        category: site.category,
      }));
  }, [dashboardData]);

   // Build pending installations data from dashboardData
  const pendingInstallationsData = useMemo(() => {
    if (!dashboardData?.siteDocumentsDTOList) return [];
    
    return dashboardData.siteDocumentsDTOList.map((doc, index) => ({
      id: index + 1,
      siteId: doc.siteId,
      area: doc.area || '',
      reason: doc.description|| 'Pending',
      subDivision: doc.subDivision,
      circle: doc.circle,
      zone: doc.zone,
      category: doc.category,
    }));
  }, [dashboardData]);

  const handleFilterChange = useMemo(
    () => (key, value) =>
      setFilters((prev) => applyFilterChange(prev, key, value, defaultFilters)),
    [defaultFilters]
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading dashboard…</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography color="error" variant="h6">Failed to load dashboard</Typography>
          <Typography color="text.secondary" variant="body2">{error.message}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box sx={{ width: '100%', height: '100%', minHeight: 0, p: { xs: 1, sm: 1, md: 1, lg: 0.5 }, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Box sx={{ flexShrink: 0, mb: { xs: 1, sm: 1, md: 1, lg: 0 } }}>
          <DashBoardBar
            filters={filters}
            onFilterChange={handleFilterChange}
            userAccess={userAccess}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr', lg: '10fr 4fr' },
            gridTemplateRows: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'minmax(0, 1fr)' },
            gap: { xs: 1, sm: 1, md: 1, lg: 0.5 },
            overflow: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'hidden' },
          }}>
          <Box
            sx={{
              minWidth: 0,
              minHeight: 0,
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '3fr 4fr', lg: '2fr 4fr' },
              gridTemplateRows: {
                xs: 'auto',
                sm: 'repeat(4, minmax(250px, 1fr))',
                md: 'minmax(0, 1fr) minmax(0, 1fr)',
                lg: 'minmax(0, 1fr) minmax(0, 1fr)',
              },
              gap: { xs: 1, sm: 1, md: 1, lg: 0.5 },
            }}
          >
            <Box
              sx={{
                minWidth: 0,
                minHeight: 0,
                overflow: 'hidden',
                gridColumn: { xs: '1', sm: '1', md: '1', lg: '1' },
                gridRow: { xs: 'auto', sm: 'auto', md: '1', lg: '1' },
                '& > *': { width: '100%', height: '100%', minHeight: 0 },
              }}>
              <CircleStatusCard data={circleStatus} />
            </Box>
            {/* Alert Hotspots + Sites Needing Attention */}
            <Box
              sx={{
                minWidth: 0,
                minHeight: 0,
                overflow: 'hidden',
                gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
                gridRow: { xs: 'auto', sm: 'auto', md: '1', lg: '1' },
                display: 'grid',
                gridTemplateRows: '1fr 2fr',
              }}>
              <AlertHotspots 
                alerts={alertHotspotsData}
                siteNeedAttentionList={siteNeedAttentionList}
              />
              <Box sx={{ minWidth: 0, minHeight: 0, overflow: 'hidden', '& > *': { width: '100%', height: '100%', minHeight: 0 } }}>
                <SitesNeedAttention substations={substationsData} />
              </Box>
            </Box>
            <Box
              sx={{
                minWidth: 0,
                minHeight: 0,
                overflow: 'hidden',
                '& > *': { width: '100%', height: '100%', minHeight: 0 },
              }}>
                <PendingInstallations installations={pendingInstallationsData} />
            </Box>
            <Box
              sx={{
                minWidth: 0,
                minHeight: 0,
                overflow: 'hidden',
                gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
                gridRow: { xs: 'auto', sm: 'auto', md: '2', lg: '2' },
                display: 'grid',
                gap: { xs: 1, lg: 0.5 },
              }}
            >
              <Box
                sx={{
                  minWidth: 0,
                  minHeight: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  '& > *': { width: '100%', height: '100%', minHeight: 0 },
                }}>
                <ActiveAlarmsLog alarms={latestAlarms} />
              </Box>
            </Box>
          </Box>

          {/* Right column – Ranking */}
          <Box sx={{ minWidth: 0, minHeight: 0, height: '100%', overflow: 'hidden', display: 'flex' }}>
            <Box sx={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex' }}>
              <HealthRanking
                totalData={totalData}
                filters={filters}
                userAccess={userAccess}/>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewDashboard;