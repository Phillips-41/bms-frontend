import { useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import DashBoardBar from '../DashBoardBar/DashBoardBar';
import { CircleStatusCard } from './CircleStatusCard';
import { ActiveAlarmsLog } from './ActiveAlarmsLog';
import { SitesNeedAttention } from './SitesNeedAttention';
import { AlertHotspots } from './AlertHotspots';
import PendingInstallations from './PendingInstallations';
import MapComponent from '../MapComponent';

/**
 * Breakpoints:
 *   xs  0–599px     mobile   → 1 col, page scrolls
 *   sm  600–899px   tablet   → 1–2 col, page scrolls
 *   md  900–1199px  small    → 2 col cards + map below, scrolls
 *   lg  1200–1535px desktop  → side-by-side with map, no scroll
 *   xl  1536px+     large    → same as lg, slightly more space
 */
const NewDashboard = ({ dashboardData, filters, onFilterChange, loading, error }) => {
  const summary = dashboardData?.summary ?? null;

  const siteDataList = useMemo(
    () => dashboardData?.siteDataDTOList ?? [],
    [dashboardData]
  );
  const pendingSiteList = useMemo(
    () => dashboardData?.pendingSiteList ?? [],
    [dashboardData]
  );
  const mapMarkerList = useMemo(
    () => dashboardData?.mapMarkerList ?? [],
    [dashboardData]
  );
  const activeAlarmLogList = useMemo(
    () => dashboardData?.activeAlarmLogList ?? [],
    [dashboardData]
  );

  const circleStatus = useMemo(() => {
    if (!summary) return {};
    return {
      totalMonitoredSites: summary.totalSitesCount ?? 0,
      communicating: summary.activeSitesCount ?? 0,
      non_communicating: summary.inactiveSitesCount ?? 0,
      activeAlarms: summary.alarmActiveSitesCount ?? 0,
      modemCommsUptime: summary.upTime != null ? `${summary.upTime}%` : '0%',
    };
  }, [summary]);

  const alertHotspotsData = useMemo(() => {
    if (!summary) return [];
    return [
      { id: 1, name: 'Charger Boost', count: summary.boostCount ?? 0 },
      { id: 2, name: 'Charger Float', count: summary.floatCount ?? 0 },
      { id: 3, name: 'Float Deviation', count: summary.floatDeviationCount ?? 0 },
      { id: 4, name: 'Thermal Runway', count: summary.thermalRunwayDeviationCount ?? 0 },
    ];
  }, [summary]);

  const siteNeedAttentionList = useMemo(
    () =>
      siteDataList.filter(
        (s) => String(s.category || '').toUpperCase() === 'CRITICAL_SITES'
      ),
    [siteDataList]
  );

  const substationsData = useMemo(() => {
    return siteNeedAttentionList.map((site, index) => ({
      id: index + 1,
      name: site.area,
      siteId: site.siteId,
      soc: site.soc,
      current: site.current,
      subDivision: site.subDivision,
      circle: site.circle,
      zone: site.zone,
      serialNumber: site.serialNumber,
      category: site.category,
    }));
  }, [siteNeedAttentionList]);

  const pendingInstallationsData = useMemo(() => {
    return pendingSiteList.map((doc, index) => ({
      id: index + 1,
      siteId: doc.siteId,
      area: doc.area || '',
      reason: doc.description || 'Pending',
      subDivision: doc.subDivision,
      circle: doc.circle,
      zone: doc.zone,
      serialNumber: doc.serialNumber,
      category: doc.category,
    }));
  }, [pendingSiteList]);

  const latestAlarms = useMemo(() => {
    return activeAlarmLogList.slice(0, 8).map((a, index) => ({
      id: index + 1,
      type: a.alarm,
      alarm: a.alarm,
      site: a.area,
      substation: a.area,
      siteId: a.siteId,
      serialNumber: a.serialNumber,
      state: a.state,
      zone: a.zone,
      circle: a.circle,
      division: a.subDivision,
      time: a.raiseTime,
      age: a.raiseTime,
    }));
  }, [activeAlarmLogList]);

  const mapMarkers = useMemo(() => {
    return mapMarkerList.map((m) => ({
      lat: m.latitude,
      lng: m.longitude,
      name: m.area,
      vendor: m.vendorName || '',
      statusType: m.statusType,
      siteId: m.siteId,
      serialNumber: m.serialNumber,
      state: m.state,
      zone: m.zone,
      circle: m.circle,
      division: m.divison,
    }));
  }, [mapMarkerList]);

  if (loading) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 2, sm: 2, md: 2 },
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={{ xs: 40, sm: 44, md: 48 }} />
          <Typography
            sx={{
              mt: 2,
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' },
            }}
          >
            Loading dashboard…
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: { xs: 2, sm: 2 },
        }}
      >
        <Box sx={{ textAlign: 'center', px: 2 }}>
          <Typography
            color="error"
            variant="h6"
            sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}
          >
            Failed to load dashboard
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {error.message}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 0,
        overflow: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'hidden' },
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: { xs: 'auto', lg: '100%' },
          minHeight: { xs: '100%', lg: 0 },
          p: { xs: 1, sm: 1.25, md: 1, lg: 0.5, xl: 0.75 },
          display: 'flex',
          flexDirection: 'column',
          overflow: { xs: 'visible', lg: 'hidden' },
          gap: { xs: 1, sm: 1.25, md: 1, lg: 0.5 },
        }}
      >
        {/* Filter bar */}
        <Box sx={{ flexShrink: 0 }}>
          <DashBoardBar filters={filters} onFilterChange={onFilterChange} />
        </Box>

        {/* Main content grid */}
        <Box
          sx={{
            flex: { xs: '0 0 auto', lg: '1 1 auto' },
            minHeight: { xs: 'auto', lg: 0 },
            width: '100%',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr',
              md: '1fr',
              lg: '10fr 4fr',
              xl: '10fr 4fr',
            },
            gridTemplateRows: {
              xs: 'auto',
              sm: 'auto',
              md: 'auto',
              lg: 'minmax(0, 1fr)',
              xl: 'minmax(0, 1fr)',
            },
            gap: { xs: 1, sm: 1.25, md: 1, lg: 0.5, xl: 0.75 },
            overflow: { xs: 'visible', lg: 'hidden' },
          }}
        >
          {/* Left / cards area */}
          <Box
            sx={{
              minWidth: 0,
              minHeight: { xs: 'auto', lg: 0 },
              overflow: { xs: 'visible', lg: 'hidden' },
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '3fr 4fr',
                lg: '2fr 4fr',
                xl: '2fr 4fr',
              },
              gridTemplateRows: {
                xs: 'auto',
                sm: 'auto auto auto',
                md: 'minmax(220px, 1fr) minmax(220px, 1fr)',
                lg: 'minmax(0, 1fr) minmax(0, 1fr)',
                xl: 'minmax(0, 1fr) minmax(0, 1fr)',
              },
              gap: { xs: 1, sm: 1.25, md: 1, lg: 0.5, xl: 0.75 },
            }}
          >
            {/* Circle status */}
            <Box
              sx={{
                minWidth: 0,
                minHeight: { xs: 200, sm: 220, md: 0 },
                overflow: { xs: 'visible', md: 'hidden' },
                gridColumn: { xs: '1', sm: '1', md: '1', lg: '1' },
                gridRow: { xs: 'auto', sm: '1', md: '1', lg: '1' },
                '& > *': { width: '100%', height: '100%', minHeight: 0 },
              }}
            >
              <CircleStatusCard data={circleStatus} mapMarkers={mapMarkerList} />
            </Box>

            {/* Alert hotspots + Sites need attention */}
            <Box
              sx={{
                minWidth: 0,
                minHeight: { xs: 280, sm: 0, md: 0 },
                overflow: { xs: 'visible', md: 'hidden' },
                gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
                gridRow: { xs: 'auto', sm: '1', md: '1', lg: '1' },
                display: 'grid',
                gridTemplateRows: {
                  xs: 'auto auto',
                  sm: 'auto 1fr',
                  md: '1fr 2fr',
                  lg: '1fr 2fr',
                },
                gap: { xs: 1, sm: 1, md: 0.5, lg: 0.5 },
              }}
            >
              <AlertHotspots
                alerts={alertHotspotsData}
                siteNeedAttentionList={siteDataList}
              />
              <Box
                sx={{
                  minWidth: 0,
                  minHeight: { xs: 140, sm: 160, md: 0 },
                  overflow: { xs: 'visible', md: 'hidden' },
                  '& > *': { width: '100%', height: '100%', minHeight: 0 },
                }}
              >
                <SitesNeedAttention substations={substationsData} />
              </Box>
            </Box>

            {/* Pending installations */}
            <Box
              sx={{
                minWidth: 0,
                minHeight: { xs: 200, sm: 220, md: 0 },
                overflow: { xs: 'visible', md: 'hidden' },
                gridColumn: { xs: '1', sm: '1', md: '1', lg: '1' },
                gridRow: { xs: 'auto', sm: '2', md: '2', lg: '2' },
                '& > *': { width: '100%', height: '100%', minHeight: 0 },
              }}
            >
              <PendingInstallations installations={pendingInstallationsData} />
            </Box>

            {/* Active alarms */}
            <Box
              sx={{
                minWidth: 0,
                minHeight: { xs: 220, sm: 240, md: 0 },
                overflow: { xs: 'visible', md: 'hidden' },
                gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
                gridRow: { xs: 'auto', sm: '2', md: '2', lg: '2' },
                display: 'flex',
                '& > *': { width: '100%', height: '100%', minHeight: 0 },
              }}
            >
              <ActiveAlarmsLog alarms={latestAlarms} />
            </Box>
          </Box>

          {/* Map — full width on xs–md, side panel on lg+ */}
          <Box
            sx={{
              minWidth: 0,
              minHeight: { xs: 280, sm: 320, md: 360, lg: 0 },
              height: { xs: 280, sm: 320, md: 360, lg: '100%' },
              overflow: 'hidden',
              display: 'flex',
              borderRadius: { xs: 1.5, sm: 2 },
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 0,
                overflow: 'hidden',
                display: 'flex',
              }}
            >
              <MapComponent mapMarkers={mapMarkers} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewDashboard;
