import React,{ useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, Grid, Card } from '@mui/material';
import DashBoardBar from '../DashBoardBar/DashBoardBar';
import { CircleStatusCard } from './CircleStatusCard';
import { AlarmLeaderboard } from './AlarmLeaderboard';
import { ActiveAlarmsLog } from './ActiveAlarmsLog';
import MapComponent from '../MapComponent';
import PieChartComponent2 from '../PieChartComponent2';
import StatsCards from './StatsCards';
import { fetchDeviceAlarms, getUserAccess } from '../../../services/apiService';
import {
  DEFAULT_STATE,
  filterByHierarchy,
  normalizeAlarmData,
  toMapMarker,
  buildAreaAlarmBars,
  getLatestActiveAlarms,
  buildCircleStatus,
  getLeaderboardTitle,
  applyFilterChange,
} from './dashboardUtils';
import { SitesNeedAttention } from './SitesNeedAttention';
import { AlertHotspots } from './AlertHotspots';
import PendingInstallations from './PendingInstallations';

const NewDashboard = ({ totalData, data1, data2, device, mapMarkers = [], zoneCircles = {} }) => {
  const userAccess =useMemo(() => getUserAccess(), []);

    const defaultFilters = useMemo(() => ({
      state: DEFAULT_STATE,
      zone: userAccess.defaultZone || '',
      circle: userAccess.defaultCircle || '',
      division: userAccess.defaultDivision || '',
      area: userAccess.defaultArea || '',
    }), [userAccess]);

  const [filters, setFilters] = useState(defaultFilters);
  const [alarmData, setAlarmData] = useState([]);
  const [alarmLoading, setAlarmLoading] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const lastAlarmRequestRef = useRef(null);

  const filterKey = useMemo(
    () => `${filters.zone}|${filters.circle}|${filters.division}|${filters.area}`,
    [filters.zone, filters.circle, filters.division, filters.area]
  );

  const filteredTotal = useMemo(
    () => filterByHierarchy(totalData, filters),
    [totalData, filterKey]
  );

  const filteredDevice = useMemo(
    () => filterByHierarchy(device, filters),
    [device, filterKey]
  );

  const filteredMarkers = useMemo(() => {
    const source = filteredDevice.length ? filteredDevice : filteredTotal;
    return source.map(toMapMarker).filter(Boolean);
  }, [filteredDevice, filteredTotal]);

  const circleStatus = useMemo(
    () => buildCircleStatus(filteredTotal),
    [filteredTotal]
  );

  const latestAlarms = useMemo(
    () => getLatestActiveAlarms(
      filteredTotal.length ? filteredTotal : filteredDevice,
      6 ),
    [filteredTotal, filteredDevice]
  );

  // Load stats data - can be from API or generated from device data
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const stats = generateStatsData(filteredDevice);
      setStatsData(stats);
    } catch (err) {
      console.error('Failed to load stats data', err);
      setStatsData([]);
    } finally {
      setStatsLoading(false);
    }
  }, [filteredDevice]);

  const loadAlarms = useCallback(async () => {
    const requestKey = `${filters.zone}|${filters.circle}|${filters.division}`;
    
    if (lastAlarmRequestRef.current === requestKey) return;
    lastAlarmRequestRef.current = requestKey;

    setAlarmLoading(true);
    try {
      if (filters.division) {
        setAlarmData(buildAreaAlarmBars(filteredDevice, filters.division));
        return;
      }

      const params = {};
      if (filters.zone) params.zone = filters.zone;
      if (filters.circle) params.circle = filters.circle;

      const raw = await fetchDeviceAlarms(params);
      setAlarmData(normalizeAlarmData(raw));
    } catch (err) {
      console.error('Failed to load device-alarms', err);
      setAlarmData([]);
    } finally {
      setAlarmLoading(false);
    }
  }, [filters.zone, filters.circle, filters.division, filteredDevice]);

  useEffect(() => {
    loadAlarms();
    loadStats(); // Load stats when filters change
  }, [loadAlarms, loadStats]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => applyFilterChange(prev, key, value, defaultFilters));
  }, [defaultFilters]);

  return (
    <Box sx={{ height: '100%',  minHeight: 0,  color: 'text.primary', bgcolor: 'background.default',  overflow: 'hidden' }}>
      <Box sx={{ height: '100%', minHeight: 0, p: { xs: 1.5, lg: 0.5 }, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexShrink: 0 }}>
            <DashBoardBar 
              filters={filters} 
              onFilterChange={handleFilterChange}
              mapMarkers={filteredMarkers} />
        </Box>

        <Grid container spacing={{ xs: 1, lg: 0.5}} sx={{ flex: 1, minHeight: 0, '& > .MuiGrid-item': { minHeight: 0,  display: 'flex' } }}>
          <Grid item xs={12} md={3} sx={{ height: { md: 'calc(50% - 0px)', lg: 'calc(50% - 2px)' } }}>
            <CircleStatusCard data={circleStatus} />
          </Grid>

          {/* <Grid item xs={12} md={4} sx={{  height: { md: 'calc(50% - 0px)', lg: 'calc(50% - 2px)' }, display: 'flex'  }}> 
            <StatsCards device={filteredDevice} />
           </Grid> */}

            <Grid item xs={12} md={5} sx={{  height: { md: 'calc(50% - 6px)', lg: 'calc(50% - 2px)' } }}>
            <AlarmLeaderboard
              data={alarmData}
              loading={alarmLoading}
              title={getLeaderboardTitle(filters)}
              currentZone={filters.zone}
              currentCircle={filters.circle}
              device={filteredDevice}
            />
          </Grid>

          <Grid item xs={12} md={4} sx={{ height: { md: 'calc(50% - 0px)', lg: 'calc(50% - 0px)'} }}>
            <SitesNeedAttention/>
          </Grid>

          {/* <Grid item xs={12} md={3} sx={{ height: { md: 'calc(50% - 0px)', lg: 'calc(52% - 4px)' }, display: 'flex' }}>
            <Box sx={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
              <MapComponent mapMarkers={filteredMarkers} />
            </Box>
          </Grid> */}

          {/* <Grid item xs={12} md={4} sx={{  height: { md: 'calc(50% - 0px)', lg: 'calc(52% - 0px)' }, display: 'flex' }}>
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              borderRadius: 2, 
              overflow: 'hidden', 
              border: 1, 
              borderColor: 'divider' 
            }}>
              <PieChartComponent2 device={filteredDevice} />
            </Box>
          </Grid> */}

          <Grid item xs={12} md={5} sx={{ height: { md: 'calc(50% - 0px)', lg: 'calc(52% - 4px)'} }}>
            <ActiveAlarmsLog alarms={latestAlarms} />
          </Grid>

           <Grid item xs={12} md={3.5} sx={{  height: { md: 'calc(50% - 0px)', lg: 'calc(52% - 4px)' }, display: 'flex'  }}> 
            <AlertHotspots />
           </Grid>

            <Grid item xs={12} md={3.5} sx={{ height: { md: 'calc(50% - 0px)', lg: 'calc(52% - 4px)' }, display: 'flex' }}>
            <Box sx={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
              <PendingInstallations />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default NewDashboard;