import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { hasActiveAlarm, filterByHierarchy, useSiteNavigation } from './dashboardUtils';

// LEVELS
const LEVELS = ['zone', 'circle', 'division', 'area'];

const LEVEL_LABELS = {
  zone: 'ZONE',
  circle: 'CIRCLE',
  division: 'SUB DIVISION',
  area: 'AREA',
};

const resolveLevel = (userAccess, filters = {}) => {
  const zone     = filters.zone     || userAccess?.zone?.value     || '';
  const circle   = filters.circle   || userAccess?.circle?.value   || '';
  const division = filters.division || userAccess?.division?.value || '';

  if (!zone)     return { key: 'zone',     label: 'ZONE' };
  if (!circle)   return { key: 'circle',   label: 'CIRCLE' };
  if (!division) return { key: 'division', label: 'SUB DIVISION' };
  return { key: 'area', label: 'AREA' };
};

// FIELD ALIASES
const FIELD_ALIASES = {
  zone:     ['zone', 'siteLocationDTO.zone'],
  circle:   ['circle', 'siteLocationDTO.circle'],
  division: ['division', 'divison', 'siteLocationDTO.division', 'siteLocationDTO.divison'],
  area:     ['area', 'siteLocationDTO.area'],
};

const pickField = (item, aliases) => {
  for (const k of aliases) {
    const parts = k.split('.');
    let v = item;
    for (const p of parts) v = v?.[p];
    if (v != null && v !== '') return v;
  }
  return null;
};

const eq = (a, b) =>
  String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();

// HEALTH-COLORS
const getHealthColor = (score) => {
  if (score >= 80) return '#00E676';
  if (score >= 60) return '#FFC107';
  return '#FF3D00';
};
const getAlarmColor = (alarms) => (alarms > 5 ? '#FF3D00' : '#ff9800');
const getTrendColor = (trend) => (trend > 0 ? '#FF3D00' : '#9E9E9E');

// AGGREGATION
const buildRanking = (list, levelKey) => {
  if (!Array.isArray(list) || !list.length) return [];
  const aliases = FIELD_ALIASES[levelKey] || FIELD_ALIASES.zone;
  const groups = new Map();

  for (const item of list) {
    const name = pickField(item, aliases);
    if (!name) continue;
    const key = String(name);
    if (!groups.has(key)) {
      groups.set(key, { name: key, sites: 0, alarms: 0, chargerTrip: 0 });
    }
    const g = groups.get(key);
    g.sites += 1;
    if (hasActiveAlarm(item)) g.alarms += 1;
    if (item?.chargerTrip) g.chargerTrip += 1;
  }

  return Array.from(groups.values())
    .map((g) => {
      const health = g.sites > 0 ? ((g.sites - g.alarms) / g.sites) * 100 : 0;
      return {
        id: g.name,
        name: g.name,
        sites: g.sites,
        health: Math.round(health),
        trend: g.alarms,
        alarms: g.alarms,
        chargerTrip: g.chargerTrip,
      };
    })
    .sort((a, b) => b.health - a.health);
};

// SUB-COMPONENTS 
const SitesIndicator = ({ sites }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.primary' }}>
    <Box sx={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #8B95A5', mr: 0.5 }} />
    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{sites} sites</Typography>
  </Box>
);

const HealthProgress = ({ health, color }) => (
  <LinearProgress
    variant="determinate"
    value={health}
    sx={{
      height: 6, borderRadius: 4, backgroundColor: '#232A36',
      '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 4 },
    }}
  />
);

const MetricChip = ({ icon: Icon, value, label, alarms }) => (
  <Box sx={{
    flex: 1, display: 'flex', alignItems: 'center',
    backgroundColor: 'background.paper',
    border: '1px solid', borderColor: 'divider',
    borderRadius: 1.5, p: 0.5,
  }}>
    <Icon sx={{ color: getAlarmColor(alarms), fontSize: 18, mr: 1 }} />
    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
      {value}{' '}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
        {label}
      </Typography>
    </Typography>
  </Box>
);

const RankingCard = ({ item, onClick }) => {
  const healthColor = getHealthColor(item.health);
  const trendColor = getTrendColor(item.trend);

  return (
    <Card
      onClick={onClick}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        minHeight: 108,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.15s',
        '&:hover': { borderColor: 'primary.main', transform: 'translateY(-1px)' },
      }}
    >
      <CardContent sx={{ p: 1, '&:last-child': { pb: 0.5 }, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5, gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ color: 'text.primary', fontWeight: 600, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={item.name}
            >
              {item.name}
            </Typography>
            <SitesIndicator sites={item.sites} />
          </Box>
          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Typography variant="h4" sx={{ color: healthColor, fontWeight: 600, lineHeight: 1 }}>
              {item.health}%
            </Typography>
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: trendColor, mt: 0.5 }}>
              Alarms - {item.trend}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 0.5 }}><HealthProgress health={item.health} color={healthColor} /></Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <MetricChip icon={WarningAmberIcon} value={item.alarms} label="alarms" alarms={item.alarms} />
          <MetricChip icon={PowerOffIcon} value={item.chargerTrip} label="Charger Trip" alarms={item.chargerTrip} />
        </Box>
      </CardContent>
    </Card>
  );
};

const RankingTableRow = ({ item, onClick }) => {
  const healthColor = getHealthColor(item.health);
  const trendColor = getTrendColor(item.trend);

  return (
    <TableRow
      hover
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        '&:last-child td': { borderBottom: 0 },
        '& td': { py: 0.75, borderColor: 'divider' },
      }}
    >
      <TableCell sx={{ maxWidth: 160, overflow: 'hidden' }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          title={item.name}
        >
          {item.name}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {item.sites}/
          <Box component="span" sx={{ color: trendColor, fontWeight: 600 }}>{item.trend}</Box>
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ width: 64 }}>
        <Typography variant="body2" sx={{ color: healthColor, fontWeight: 600 }}>{item.health}%</Typography>
      </TableCell>
      <TableCell align="center" sx={{ width: 64 }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>{item.alarms}</Typography>
      </TableCell>
      <TableCell align="center" sx={{ width: 90 }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>{item.chargerTrip}</Typography>
      </TableCell>
    </TableRow>
  );
};

//  DIALOG CELL STYLE
const TABLE_CELL_STYLE = {
  color: 'black',
  fontWeight: 'bold',
  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
  padding: '3px',
  minWidth: '150px',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

// MAIN 
export default function HealthRanking({ totalData = [], filters = {}, userAccess }) {

  const { goToLiveMonitoring } = useSiteNavigation();

  // scoped view
  const scopedData = useMemo(
    () => filterByHierarchy(totalData, filters || {}),
    [totalData, filters.zone, filters.circle, filters.division, filters.area]
  );

  const { key: levelKey, label: levelLabel } = useMemo(
    () => resolveLevel(userAccess, filters),
    [userAccess, filters.zone, filters.circle, filters.division, filters.area]
  );

  const ranked = useMemo(() => buildRanking(scopedData, levelKey), [scopedData, levelKey]);
  const useGridLayout = ranked.length > 0 && ranked.length <= 4;
  const displayRows = ranked.slice(0, 7);

  //  DRILL-DOWN STATE
  const [dialogOpen, setDialogOpen]     = useState(false);
  const [dialogTitle, setDialogTitle]   = useState('');
  const [dialogRows, setDialogRows]     = useState([]);
  const [dialogLevel, setDialogLevel]   = useState(null);      // 'circle' | 'division' | 'area' | 'device'
  const [drillPath, setDrillPath]       = useState({});        // { zone, circle, division, area }
  const [leafMode, setLeafMode]         = useState(false);     // true => rows navigate to live monitoring

  // Reset dialog when filters change externally
  useEffect(() => {
    setDialogOpen(false);
    setDialogRows([]);
    setDrillPath({});
    setLeafMode(false);
  }, [filters.zone, filters.circle, filters.division, filters.area]);

  
  const buildDrillRows = useCallback((path, nextLevel) => {
    // path = { zone?, circle?, division?, area? } accumulated ancestors
    // 1. filter totalData down to that path
    let scoped = totalData;
    for (const key of LEVELS) {
      if (path[key]) scoped = scoped.filter((d) => {
        const v = pickField(d, FIELD_ALIASES[key]);
        return eq(v, path[key]);
      });
    }

    if (nextLevel === 'device') {
      // leaf: one row per site
      return scoped
        .map((d) => {
          const siteId = d.siteId || d.siteLocationDTO?.siteId || '--';
          const serialNumber = d.serialNumber || d.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || 'N/A';
          const location = d.area || d.siteLocationDTO?.area || d.name || '--';
          const alarms = hasActiveAlarm(d);
          return {
            name: location,
            siteId,
            serialNumber,
            count: alarms ? 1 : 0,
            _raw: d,
          };
        })
        .filter((r) => r.count > 0)
        .sort((a, b) => b.count - a.count);
    }

    // non-leaf: group by nextLevel
    const aliases = FIELD_ALIASES[nextLevel];
    const groups = new Map();

    for (const d of scoped) {
      const name = pickField(d, aliases);
      if (!name) continue;
      const key = String(name);
      if (!groups.has(key)) groups.set(key, { name: key, count: 0, sites: 0 });
      const g = groups.get(key);
      g.sites += 1;
      if (hasActiveAlarm(d)) g.count += 1;
    }

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }, [totalData]);

  const openDrillDown = useCallback((item, parentLevel, parentPath = {}) => { 
    const idx = LEVELS.indexOf(parentLevel);
    const isLeafNext = idx === LEVELS.length - 1;

    const nodePath = { ...parentPath, [parentLevel]: item.name };

    if (isLeafNext) {
      // We're already at AREA → drill into devices
      const rows = buildDrillRows(nodePath, 'device');
      setDialogTitle(`Devices – ${item.name}`);
      setDialogRows(rows);
      setDialogLevel('device');
      setDrillPath(nodePath);
      setLeafMode(true);
    } else {
      const nextLevel = LEVELS[idx + 1];
      const rows = buildDrillRows(nodePath, nextLevel);
      setDialogTitle(`${LEVEL_LABELS[nextLevel]} – ${item.name}`);
      setDialogRows(rows);
      setDialogLevel(nextLevel);
      setDrillPath(nodePath);
      setLeafMode(false);
    }
    setDialogOpen(true);
  }, [buildDrillRows]);

  const handleCardOrRowClick = useCallback((item) => {
    openDrillDown(item, levelKey, {});
  }, [levelKey, openDrillDown]);

const handleDialogRowClick = useCallback((row) => {
  if (dialogLevel === 'area') {
    goToLiveMonitoring({ area: row.name });
    setDialogOpen(false);
    return;
  }
  if (dialogLevel === 'device') {
    goToLiveMonitoring({ siteId: row.siteId, area: row.name });
    setDialogOpen(false);
    return;
  }
  openDrillDown(row, dialogLevel, drillPath);
}, [dialogLevel, drillPath, openDrillDown, goToLiveMonitoring]);

  // RENDER
  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.5, lg: 0.5 },
            '&:last-child': { pb: { lg: 1, xl: 2 } },
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            flex: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ color: 'text.primary', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.3px', mb: 0.5 }}
          >
           PERFORMANCE — {levelLabel}
          </Typography>

          <Divider sx={{ mb: 0.5 }} />

          {displayRows.length === 0 ? (
            <Box sx={{ py: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>No data available</Typography>
            </Box>
          ) : useGridLayout ? (
            <Grid container spacing={0.5}>
              {displayRows.map((item) => (
                <Grid item xs={12} sm={6} md={6} lg={12} key={item.id}>
                  <RankingCard item={item} onClick={() => handleCardOrRowClick(item)} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TableContainer sx={{ overflow: 'auto', flex: 1, minHeight: 0 }}>
              <Table sx={{ width: '100%', tableLayout: 'auto' }} size="small" stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        py: 0.5,
                        px: 1,
                        borderColor: 'divider',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    <TableCell>{levelLabel}</TableCell>
                    <TableCell align="center">Overview</TableCell>
                    <TableCell align="center">Alarms</TableCell>
                    <TableCell align="center">Charger Trip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayRows.map((item) => (
                    <RankingTableRow key={item.id} item={item} onClick={() => handleCardOrRowClick(item)} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* ---------- DRILL-DOWN DIALOG ---------- */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {dialogRows.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No data</Box>
          ) : (
            <TableContainer component={Paper} sx={{ border: '0.5px solid #75767B', borderRadius: 2, maxHeight: 380 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={TABLE_CELL_STYLE}>
                      {dialogLevel === 'device' ? 'Location' : LEVEL_LABELS[dialogLevel] || 'Name'}
                    </TableCell>
                    {dialogLevel === 'device' && (
                      <TableCell sx={TABLE_CELL_STYLE}>Substation ID</TableCell>
                    )}
                    <TableCell sx={TABLE_CELL_STYLE}>Active Alarms</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dialogRows.map((row, idx) => (
                    <TableRow
                      key={`${row.name}-${idx}`}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleDialogRowClick(row)}
                    >
                      <TableCell
                        sx={{
                          textAlign: 'center',
                          color: '#1976d2',
                          textDecoration: dialogLevel === 'device' ? 'underline' : 'none',
                        }}
                      >
                        {row.name}
                      </TableCell>
                      {dialogLevel === 'device' && (
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            color: '#1976d2',
                            textDecoration: 'underline',
                          }}
                        >
                          {row.siteId}
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          textAlign: 'center',
                          color: row.count > 0 ? 'error.main' : 'text.secondary',
                          fontWeight: 600,
                        }}
                      >
                        {row.count ?? 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="error" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}