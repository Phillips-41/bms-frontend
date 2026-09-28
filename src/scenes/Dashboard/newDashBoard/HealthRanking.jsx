import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Divider, Dialog, DialogTitle, DialogContent, DialogActions, Button, Paper,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import { hasActiveAlarm, filterByHierarchy, useSiteNavigation } from './dashboardUtils';

const LEVELS = ['zone', 'circle', 'division', 'area'];

const LEVEL_LABELS = {
  zone: 'ZONE',
  circle: 'CIRCLE',
  division: 'SUB DIVISION',
  area: 'AREA',
};

const FIELD_ALIASES = {
  zone:     ['zone', 'siteLocationDTO.zone'],
  circle:   ['circle', 'siteLocationDTO.circle'],
  division: ['division', 'divison', 'siteLocationDTO.division'],
  area:     ['area', 'siteLocationDTO.area'],
};

const resolveLevel = (filters = {}) => {
  const { zone = '', circle = '', division = '' } = filters;
  if (!zone)     return { key: 'zone',     label: 'ZONE' };
  if (!circle)   return { key: 'circle',   label: 'CIRCLE' };
  if (!division) return { key: 'division', label: 'SUB DIVISION' };
  return { key: 'area', label: 'AREA' };
};

const pickField = (item, aliases) => {
  for (const alias of aliases) {
    let value = item;
    for (const part of alias.split('.')) value = value?.[part];
    if (value != null && value !== '') return value;
  }
  return null;
};

const eq = (a, b) =>
  String(a ?? '').toLowerCase() === String(b ?? '').toLowerCase();

const isCommunicating = (item) => {
  if (!item) return false;
  if (typeof item.isNotCommunicating === 'boolean') {
    return item.isNotCommunicating === false;
  }
  return true;
};

const getHealthColor = (score) => (score >= 80 ? '#00E676' : score >= 60 ? '#FFC107' : '#FF3D00');
const getAlarmColor  = (n) => (n > 0 ? '#ff9800' : '#9E9E9E');
const getCountColor  = (n) => (n > 0 ? '#FF3D00' : '#9E9E9E');
const getActiveColor = (n) => (n > 0 ? '#00E676' : '#9E9E9E');

const getChargerTripCount = (item) => {
  if (!item) return 0;
  const ct = item.chargerTrip ?? item.chargerTripCount ?? item.chargerTripStatus;
  if (ct == null) return 0;
  if (typeof ct === 'number') return ct;
  if (typeof ct === 'boolean') return ct ? 1 : 0;
  if (Array.isArray(ct)) return ct.length;
  return 0;
};

const buildRanking = (list, levelKey) => {
  if (!Array.isArray(list) || !list.length) return [];

  const aliases = FIELD_ALIASES[levelKey] || FIELD_ALIASES.zone;
  const groups = new Map();

  for (const item of list) {
    const name = pickField(item, aliases);
    if (!name) continue;

    const key = String(name);
    if (!groups.has(key)) {
      groups.set(key, { name: key, sites: 0, offline: 0, alarms: 0, chargerTrip: 0 });
    }

    const g = groups.get(key);
    g.sites += 1;

    if (isCommunicating(item)) {
      // only communicating devices contribute to alarm count
      if (hasActiveAlarm(item)) g.alarms += 1;
    } else {
      g.offline += 1;
    }

    g.chargerTrip += getChargerTripCount(item);
  }

  return Array.from(groups.values())
    .map((g) => {
      const active  = Math.max(0, g.sites - g.offline);
      const healthy = Math.max(0, active - g.alarms);
      const health  = g.sites > 0 ? Math.round((healthy / g.sites) * 100) : 0;

      return {
        id: g.name,
        name: g.name,
        sites: g.sites,
        active,
        offline: g.offline,
        alarms: g.alarms,
        chargerTrip: g.chargerTrip,
        health,
      };
    })
    .sort((a, b) => b.health - a.health);
};

const HealthProgress = ({ health, color }) => (
  <LinearProgress
    variant="determinate"
    value={health}
    sx={{
      height: 5,
      borderRadius: 4,
      backgroundColor: '#232A36',
      '& .MuiLinearProgress-bar': { backgroundColor: color, borderRadius: 4 },
    }}
  />
);

const MetricChip = ({ icon: Icon, value, label, color }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      minWidth: 0,
      backgroundColor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 1,
      px: 0.6,
      py: 0.35,
      overflow: 'hidden',
    }}
  >
    <Icon sx={{ color, fontSize: 14, flexShrink: 0 }} />
    <Typography
      variant="caption"
      sx={{
        color: 'text.primary',
        fontWeight: 700,
        fontSize: '0.72rem',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {value}{' '}
      <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '0.68rem' }}>
        {label}
      </Box>
    </Typography>
  </Box>
);

const RankingCard = ({ item, onClick }) => {
  const healthColor = getHealthColor(item.health);

  return (
    <Card
      onClick={onClick}
      sx={{
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'border-color 0.15s, transform 0.15s',
        '&:hover': { borderColor: 'primary.main', transform: 'translateY(-1px)' },
      }}
    >
      <CardContent
        sx={{
          p: 1.1,
          '&:last-child': { pb: 1.1 },
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              title={item.name}
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                fontSize: '0.9rem',
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.name}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
            <Typography sx={{ color: healthColor, fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>
              {item.health}%
            </Typography>
          </Box>
        </Box>

        <HealthProgress health={item.health} color={healthColor} />

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 0.6 }}>
          <MetricChip icon={CheckCircleIcon}  value={item.active}      label="Online"       color={getActiveColor(item.active)} />
          <MetricChip icon={PowerOffIcon}     value={item.offline}     label="Offline"      color={getCountColor(item.offline)} />
          <MetricChip icon={WarningAmberIcon} value={item.alarms}      label="Alarms"       color={getAlarmColor(item.alarms)} />
          <MetricChip icon={BoltIcon}         value={item.chargerTrip} label="Charger Trip" color={getCountColor(item.chargerTrip)} />
        </Box>
      </CardContent>
    </Card>
  );
};

const RankingTableRow = ({ item, onClick }) => {
  const healthColor = getHealthColor(item.health);

  return (
    <TableRow
      hover
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        '&:last-child td': { borderBottom: 0 },
        '& td': { py: 0.6, px: 0.75, borderColor: 'divider' },
      }}
    >
      <TableCell sx={{ maxWidth: 140, overflow: 'hidden' }}>
        <Typography
          title={item.name}
          variant="body2"
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            fontSize: '0.8rem',
            whiteSpace: 'wrap',
          }}
        >
          {item.name}
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ width: 52 }}>
        <Typography variant="body2" sx={{ color: healthColor, fontWeight: 700, fontSize: '0.8rem' }}>
          {item.health}%
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ width: 48 }}>
        <Typography variant="body2" sx={{ color: getAlarmColor(item.alarms), fontWeight: 700, fontSize: '0.8rem' }}>
          {item.alarms}
        </Typography>
      </TableCell>
      <TableCell align="center" sx={{ width: 48 }}>
        <Typography variant="body2" sx={{ color: getCountColor(item.chargerTrip), fontWeight: 700, fontSize: '0.8rem' }}>
          {item.chargerTrip}
        </Typography>
      </TableCell>
    </TableRow>
  );
};


const TABLE_CELL_STYLE = {
  color: 'black',
  fontWeight: 'bold',
  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
  padding: '6px 8px',
  minWidth: '150px',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

// MAIN
export default function HealthRanking({ totalData = [], filters = {} }) {
  const { goToLiveMonitoring } = useSiteNavigation();

  const scopedData = useMemo(
    () => filterByHierarchy(totalData, filters || {}),
    [totalData, filters.zone, filters.circle, filters.division, filters.area]
  );

  const { key: levelKey, label: levelLabel } = useMemo(
    () => resolveLevel(filters),
    [filters.zone, filters.circle, filters.division, filters.area]
  );

  const ranked = useMemo(() => buildRanking(scopedData, levelKey), [scopedData, levelKey]);
  const useGridLayout = ranked.length > 0 && ranked.length <= 4;
  const displayRows = ranked;

  const [dialogOpen, setDialogOpen]   = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogRows, setDialogRows]   = useState([]);
  const [dialogLevel, setDialogLevel] = useState(null);
  const [drillPath, setDrillPath]     = useState({});

  useEffect(() => {
    setDialogOpen(false);
    setDialogRows([]);
    setDrillPath({});
  }, [filters.zone, filters.circle, filters.division, filters.area]);

  const buildDrillRows = useCallback((path, nextLevel) => {
    let scoped = totalData;
    for (const key of LEVELS) {
      if (path[key]) {
        scoped = scoped.filter((d) => eq(pickField(d, FIELD_ALIASES[key]), path[key]));
      }
    }

    if (nextLevel === 'device') {
      return scoped
        .filter((d) => isCommunicating(d) && hasActiveAlarm(d))
        .map((d) => ({
          name:         d.area || d.siteLocationDTO?.area || d.name || '--',
          siteId:       d.siteId || d.siteLocationDTO?.siteId || '--',
          count:        1,
          zone:         pickField(d, FIELD_ALIASES.zone),
          circle:       pickField(d, FIELD_ALIASES.circle),
          division:     pickField(d, FIELD_ALIASES.division),
          area:         pickField(d, FIELD_ALIASES.area),
          serialNumber: d.serialNumber || d.siteLocationDTO?.serialNumber,
          state:        d.state || d.siteLocationDTO?.state,
        }))
        .sort((a, b) => b.count - a.count);
    }

    /* grouped level */
    const aliases = FIELD_ALIASES[nextLevel];
    const groups = new Map();

    for (const d of scoped) {
      const name = pickField(d, aliases);
      if (!name) continue;

      const key = String(name);
      if (!groups.has(key)) groups.set(key, { name: key, count: 0, sites: 0 });

      const g = groups.get(key);
      g.sites += 1;

      if (isCommunicating(d) && hasActiveAlarm(d)) {
        g.count += 1;
      }
    }

    return Array.from(groups.values()).sort((a, b) => b.count - a.count);
  }, [totalData]);

  const openDrillDown = useCallback((item, parentLevel, parentPath = {}) => {
    const idx = LEVELS.indexOf(parentLevel);
    const isLeafNext = idx === LEVELS.length - 1;
    const nodePath = { ...parentPath, [parentLevel]: item.name };

    if (isLeafNext) {
      setDialogTitle(`Devices – ${item.name}`);
      setDialogRows(buildDrillRows(nodePath, 'device'));
      setDialogLevel('device');
    } else {
      const nextLevel = LEVELS[idx + 1];
      setDialogTitle(`${LEVEL_LABELS[nextLevel]} – ${item.name}`);
      setDialogRows(buildDrillRows(nodePath, nextLevel));
      setDialogLevel(nextLevel);
    }
    setDrillPath(nodePath);
    setDialogOpen(true);
  }, [buildDrillRows]);

  const handleCardOrRowClick = useCallback((item) => {
    openDrillDown(item, levelKey, {});
  }, [levelKey, openDrillDown]);

  const handleDialogRowClick = useCallback((row) => {
    if (dialogLevel === 'area' || dialogLevel === 'device') {
      goToLiveMonitoring({
        siteId:       row.siteId,
        area:         row.area || drillPath.area || row.name,
        serialNumber: row.serialNumber,
        state:        row.state,
        zone:         row.zone || drillPath.zone,
        circle:       row.circle || drillPath.circle,
        division:     row.division || drillPath.division,
      });
      setDialogOpen(false);
      return;
    }
    openDrillDown(row, dialogLevel, drillPath);
  }, [dialogLevel, drillPath, openDrillDown, goToLiveMonitoring]);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'background.paper',
          borderColor: 'divider',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.25, lg: 1 },
            '&:last-child': { pb: { xs: 1.25, lg: 1 } },
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.5px',
              mb: 0.5,
            }}
          >
            PERFORMANCE — {levelLabel}
          </Typography>

          <Divider sx={{ mb: 0.75 }} />

          {displayRows.length === 0 ? (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No data available
              </Typography>
            </Box>
          ) : useGridLayout ? (
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                pr: 0.5,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: 3 },
              }}
            >
              <Grid container spacing={0.75}>
                {displayRows.map((item) => (
                  <Grid item xs={12} sm={6} md={6} lg={12} key={item.id}>
                    <RankingCard item={item} onClick={() => handleCardOrRowClick(item)} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <TableContainer
              sx={{
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: 3 },
              }}
            >
              <Table stickyHeader sx={{ width: '100%', tableLayout: 'fixed' }} size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      '& th': {
                        bgcolor: 'background.default',
                        color: 'text.primary',
                        fontWeight: 700,
                        fontSize: '0.66rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.4px',
                        py: 0.6,
                        px: 0.5,
                        borderColor: 'divider',
                        whiteSpace: 'nowrap',
                      },
                    }}
                  >
                    <TableCell>{levelLabel}</TableCell>
                    <TableCell align="center">Performance</TableCell>
                    <TableCell align="center">Alarms</TableCell>
                    <TableCell align="center">Charger Trip</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayRows.map((item) => (
                    <RankingTableRow
                      key={item.id}
                      item={item}
                      onClick={() => handleCardOrRowClick(item)}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* DRILL-DOWN DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)',
            color: 'white',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: '1rem',
            py: 1.5,
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 1 }}>
          {dialogRows.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No data</Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, maxHeight: 380 }}
            >
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
                      sx={{ cursor: 'pointer', '&:last-child td': { borderBottom: 0 } }}
                      onClick={() => handleDialogRowClick(row)}
                    >
                      <TableCell
                        sx={{
                          textAlign: 'center',
                          color: '#1976d2',
                          textDecoration: dialogLevel === 'device' ? 'underline' : 'none',
                          fontSize: '0.85rem',
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
                            fontSize: '0.85rem',
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
                          fontSize: '0.85rem',
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

        <DialogActions sx={{ px: 2.5, pb: 2 }}>
          <Button variant="contained" color="error" onClick={() => setDialogOpen(false)} size="small">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
