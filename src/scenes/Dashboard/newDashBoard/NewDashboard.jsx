// import { useMemo } from 'react';
// import { Box, CircularProgress, Typography } from '@mui/material';
// import DashBoardBar from '../DashBoardBar/DashBoardBar';
// import { CircleStatusCard } from './CircleStatusCard';
// import { ActiveAlarmsLog } from './ActiveAlarmsLog';
// import { SitesNeedAttention } from './SitesNeedAttention';
// import { AlertHotspots } from './AlertHotspots';
// import PendingInstallations from './PendingInstallations';
// import MapComponent from '../MapComponent';
// import HealthRanking from './HealthRanking';
// import { filterByHierarchy,  getLatestActiveAlarms, buildCircleStatus } from './dashboardUtils';

// const NewDashboard = ({  totalData, device, filters, onFilterChange, dashboardData, mapMarks, loading, error, }) => {
  
//   const filteredTotal = useMemo(
//     () => filterByHierarchy(totalData, filters),
//     [totalData, filters.zone, filters.circle, filters.division, filters.area]
//   );

//   const filteredDevice = useMemo(
//     () => filterByHierarchy(device, filters),
//     [device, filters.zone, filters.circle, filters.division, filters.area]
//   );
 
//   const circleStatus = useMemo(
//     () => buildCircleStatus(filteredTotal), 
//     [filteredTotal]
//   );

//   const latestAlarms = useMemo(
//     () => getLatestActiveAlarms(filteredDevice, 6),
//     [filteredDevice]
//   );

//   // Build alert hotspots data from dashboardData
//   const alertHotspotsData = useMemo(() => {
//     if (!dashboardData) return [];
//     return [
//       { id: 1, name: 'Charger Boost',    count: dashboardData.boostCount ?? 0,                     change: 0, isPositive: true  },
//       { id: 2, name: 'Charger Float',    count: dashboardData.floatCount ?? 0,                     change: 0, isPositive: false },
//       { id: 3, name: 'Float Deviation',  count: dashboardData.floatDeviationCount ?? 0,            change: 0, isPositive: true  },
//       { id: 4, name: 'Thermal Runway',   count: dashboardData.thermalRunwayDeviationCount ?? 0,    change: 0, isPositive: false },
//     ];
//   }, [dashboardData]);

//    const siteNeedAttentionList = useMemo(
//     () => dashboardData?.siteNeedAttentionDTOList ?? [],
//     [dashboardData]
//   );

// // Filtered list for only SitesNeedAttention 
//   const substationsData = useMemo(() => {
//     if (!dashboardData?.siteNeedAttentionDTOList) return [];
//     return dashboardData.siteNeedAttentionDTOList
//       .filter((site) => String(site.category || '').toUpperCase() === 'CRITICAL_SITES')
//       .map((site, index) => ({
//         id: index + 1,
//         name: site.area,
//         siteId: site.siteId,
//         soc: site.soc,
//         current: site.current,
//         subDivision: site.subDivision,
//         circle: site.circle,
//         zone: site.zone,
//         category: site.category,
//       }));
//   }, [dashboardData]);

//    // Build pending installations data from dashboardData
//   const pendingInstallationsData = useMemo(() => {
//     if (!dashboardData?.siteDocumentsDTOList) return [];
//     return dashboardData.siteDocumentsDTOList.map((doc, index) => ({
//       id: index + 1,
//       siteId: doc.siteId,
//       area: doc.area || '',
//       reason: doc.description|| 'Pending',
//       subDivision: doc.subDivision,
//       circle: doc.circle,
//       zone: doc.zone,
//       category: doc.category,
//     }));
//   }, [dashboardData]);

//   if (loading) {
//     return (
//       <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
//         <Box sx={{ textAlign: 'center' }}>
//           <CircularProgress size={48} />
//           <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading dashboard…</Typography>
//         </Box>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
//         <Box sx={{ textAlign: 'center' }}>
//           <Typography color="error" variant="h6">Failed to load dashboard</Typography>
//           <Typography color="text.secondary" variant="body2">{error.message}</Typography>
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary' }}>
//       <Box sx={{ width: '100%', height: '100%', minHeight: 0, p: { xs: 1, sm: 1, md: 1, lg: 0.5 }, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
//         <Box sx={{ flexShrink: 0, mb: { xs: 1, sm: 1, md: 1, lg: 0 } }}>
//           <DashBoardBar
//             filters={filters}
//             onFilterChange={onFilterChange}
//           />
//         </Box>
//         <Box
//           sx={{
//             flex: 1,
//             minHeight: 0,
//             width: '100%',
//             display: 'grid',
//             gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr', lg: '10fr 4fr' },
//             gridTemplateRows: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'minmax(0, 1fr)' },
//             gap: { xs: 1, sm: 1, md: 1, lg: 0.5 },
//             overflow: { xs: 'auto', sm: 'auto', md: 'auto', lg: 'hidden' },
//           }}>
//           <Box
//             sx={{
//               minWidth: 0,
//               minHeight: 0,
//               overflow: 'hidden',
//               display: 'grid',
//               gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '3fr 4fr', lg: '2fr 4fr' },
//               gridTemplateRows: {
//                 xs: 'auto',
//                 sm: 'repeat(4, minmax(250px, 1fr))',
//                 md: 'minmax(0, 1fr) minmax(0, 1fr)',
//                 lg: 'minmax(0, 1fr) minmax(0, 1fr)',
//               },
//               gap: { xs: 1, sm: 1, md: 1, lg: 0.5 },
//             }}
//           >
//             <Box
//               sx={{
//                 minWidth: 0,
//                 minHeight: 0,
//                 overflow: 'hidden',
//                 gridColumn: { xs: '1', sm: '1', md: '1', lg: '1' },
//                 gridRow: { xs: 'auto', sm: 'auto', md: '1', lg: '1' },
//                 '& > *': { width: '100%', height: '100%', minHeight: 0 },
//               }}>
//               <CircleStatusCard data={circleStatus} />
//             </Box>
//             <Box
//               sx={{
//                 minWidth: 0,
//                 minHeight: 0,
//                 overflow: 'hidden',
//                 gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
//                 gridRow: { xs: 'auto', sm: 'auto', md: '1', lg: '1' },
//                 display: 'grid',
//                 gridTemplateRows: '1fr 2fr',
//               }}>
//               <AlertHotspots 
//                 alerts={alertHotspotsData}
//                 siteNeedAttentionList={siteNeedAttentionList}
//               />
//               <Box sx={{ minWidth: 0, minHeight: 0, overflow: 'hidden', '& > *': { width: '100%', height: '100%', minHeight: 0 } }}>
//                 <SitesNeedAttention substations={substationsData} />
//               </Box>
//             </Box>
//             <Box
//               sx={{
//                 minWidth: 0,
//                 minHeight: 0,
//                 overflow: 'hidden',
//                 '& > *': { width: '100%', height: '100%', minHeight: 0 },
//               }}>
//                 <PendingInstallations installations={pendingInstallationsData} />
//             </Box>
//             <Box
//               sx={{
//                 minWidth: 0,
//                 minHeight: 0,
//                 overflow: 'hidden',
//                 gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
//                 gridRow: { xs: 'auto', sm: 'auto', md: '2', lg: '2' },
//                 display: 'grid',
//                 gap: { xs: 1, lg: 0.5 },
//               }}
//             >
//               <Box
//                 sx={{
//                   minWidth: 0,
//                   minHeight: 0,
//                   overflow: 'hidden',
//                   display: 'flex',
//                   '& > *': { width: '100%', height: '100%', minHeight: 0 },
//                 }}>
//                 <ActiveAlarmsLog alarms={latestAlarms} />
//               </Box>
//             </Box>
//           </Box>

//           <Box sx={{ minWidth: 0, minHeight: 0, height: '100%', overflow: 'hidden', display: 'flex' }}>
//             <Box sx={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex' }}>
//               {/* <HealthRanking
//                 totalData={totalData}
//                 filters={filters}
//                 /> */}
//                 <MapComponent marks={mapMarks}/>
//             </Box>
//           </Box>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default NewDashboard;










import { useMemo } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import DashBoardBar from '../DashBoardBar/DashBoardBar';
import { CircleStatusCard } from './CircleStatusCard';
import { ActiveAlarmsLog } from './ActiveAlarmsLog';
import { SitesNeedAttention } from './SitesNeedAttention';
import { AlertHotspots } from './AlertHotspots';
import PendingInstallations from './PendingInstallations';
import MapComponent from '../MapComponent';

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
      { id: 1, name: 'Charger Boost',   count: summary.boostCount ?? 0 },
      { id: 2, name: 'Charger Float',   count: summary.floatCount ?? 0 },
      { id: 3, name: 'Float Deviation', count: summary.floatDeviationCount ?? 0 },
      { id: 4, name: 'Thermal Runway',  count: summary.thermalRunwayDeviationCount ?? 0  },
    ];
  }, [summary]);

  const siteNeedAttentionList = useMemo(
    () => siteDataList.filter(
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
      vendor: m.vendorName || "",
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
          <DashBoardBar filters={filters} onFilterChange={onFilterChange} />
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
                minWidth: 0, minHeight: 0, overflow: 'hidden',
                gridColumn: { xs: '1', sm: '1', md: '1', lg: '1' },
                gridRow: { xs: 'auto', sm: 'auto', md: '1', lg: '1' },
                '& > *': { width: '100%', height: '100%', minHeight: 0 },
              }}>
             <CircleStatusCard data={circleStatus} mapMarkers={mapMarkerList} />
            </Box>
            <Box
              sx={{
                minWidth: 0, minHeight: 0, overflow: 'hidden',
                gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
                gridRow: { xs: 'auto', sm: 'auto', md: '1', lg: '1' },
                display: 'grid',
                gridTemplateRows: '1fr 2fr',
              }}>
              <AlertHotspots
                alerts={alertHotspotsData}
                siteNeedAttentionList={siteDataList}
              />
              <Box sx={{ minWidth: 0, minHeight: 0, overflow: 'hidden', '& > *': { width: '100%', height: '100%', minHeight: 0 } }}>
                <SitesNeedAttention substations={substationsData} />
              </Box>
            </Box>
            <Box
              sx={{
                minWidth: 0, minHeight: 0, overflow: 'hidden',
                '& > *': { width: '100%', height: '100%', minHeight: 0 },
              }}>
              <PendingInstallations installations={pendingInstallationsData} />
            </Box>
            <Box
              sx={{
                minWidth: 0, minHeight: 0, overflow: 'hidden',
                gridColumn: { xs: '1', sm: '2', md: '2', lg: '2' },
                gridRow: { xs: 'auto', sm: 'auto', md: '2', lg: '2' },
                display: 'grid',
                gap: { xs: 1, lg: 0.5 },
              }}
            >
              <Box
                sx={{
                  minWidth: 0, minHeight: 0, overflow: 'hidden',
                  display: 'flex',
                  '& > *': { width: '100%', height: '100%', minHeight: 0 },
                }}>
                <ActiveAlarmsLog alarms={latestAlarms} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ minWidth: 0, minHeight: 0, height: '100%', overflow: 'hidden', display: 'flex' }}>
            <Box sx={{ width: '100%', height: '100%', minHeight: 0, overflow: 'hidden', display: 'flex' }}>
              <MapComponent mapMarkers={mapMarkers} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default NewDashboard;