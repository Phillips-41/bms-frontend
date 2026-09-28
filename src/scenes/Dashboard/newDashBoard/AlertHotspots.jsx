import { useState, useMemo, useCallback } from 'react';
import {
  CardContent, Typography, Box, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { useSiteNavigation } from './dashboardUtils';
import './AlertHotspots.css';

const getIconForAlert = (name) => {
  switch (name) {
    case 'Charger Boost': return <BoltIcon />;
    case 'Charger Float': return <BatteryChargingFullIcon />;
    case 'Charger Trip': return <PowerOffIcon />;
    case 'Float Deviation': return <WarningAmberIcon />;
    case 'Thermal Runway': return <WhatshotIcon />;
    default: return <WarningAmberIcon />;
  }
};

const CATEGORY_MAP = {
  'Charger Boost': 'BOOST',
  'Charger Float': 'FLOAT',
  'Float Deviation': 'FLOAT_DEVIATION',
  'Thermal Runway': 'THERMAL_RUNWAY',
};

const TABLE_CELL_STYLE = {
  color: 'black',
  fontWeight: 'bold',
  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
  padding: '3px 6px',
  minWidth: 110,
  whiteSpace: 'nowrap',
  textAlign: 'center',
  fontSize: '0.75rem',
};

export const AlertHotspots = ({ alerts = [], siteNeedAttentionList = [] }) => {
  const { goToLiveMonitoring } = useSiteNavigation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogRows, setDialogRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const mockAlerts = [
    { id: 1, name: 'Charger Boost', count: '--', isPositive: true },
    { id: 2, name: 'Charger Float', count: '--', isPositive: false },
    { id: 4, name: 'Float Deviation', count: '--', isPositive: true },
    { id: 5, name: 'Thermal Runway', count: '--', isPositive: false },
  ];

  const data = alerts.length > 0 ? alerts : mockAlerts;

  const getRowsForAlert = useCallback((alertName) => {
    if (!Array.isArray(siteNeedAttentionList)) return [];
    const category = CATEGORY_MAP[alertName];
    if (!category) return [];
    return siteNeedAttentionList
      .filter((site) => String(site.category || '').toUpperCase() === category)
      .map((site, idx) => ({
        id: `${site.siteId}-${idx}`,
        area: site.area || '--',
        siteId: site.siteId || '--',
        voltage: site.voltage,
        zone: site.zone || '--',
        circle: site.circle || '--',
        subDivision: site.subDivision || '--',
        _raw: site,
      }));
  }, [siteNeedAttentionList]);

  const handleCardClick = useCallback((alert) => {
    const rows = getRowsForAlert(alert.name);
    setDialogTitle(`${alert.name} — ${rows.length} site${rows.length === 1 ? '' : 's'}`);
    setDialogRows(rows);
    setPage(0);
    setDialogOpen(true);
  }, [getRowsForAlert]);

  const handleRowClick = useCallback((row) => {
    goToLiveMonitoring({
      siteId: row.siteId || undefined,
      area: row.area,
      serialNumber: row.serialNumber || undefined,
      state: row.state,
      zone: row.zone,
      circle: row.circle,
      division: row.subDivision,
    });
    setDialogOpen(false);
  }, [goToLiveMonitoring]);

  const handleChangePage = useCallback((event, newPage) => setPage(newPage), []);
  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return dialogRows.slice(start, start + rowsPerPage);
  }, [dialogRows, page, rowsPerPage]);

  return (
    <>
      <CardContent className="ah-content">
        <Grid container spacing={0.5} sx={{ flex: 1 }}>
          {data.map((alert) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={alert.id}>
              <Box className="ah-tile" onClick={() => handleCardClick(alert)}>
                <Box className="ah-tile-top">
                  <Box className={`ah-icon-badge ${alert.isPositive ? 'pos' : 'neg'}`}>
                    {getIconForAlert(alert.name)}
                  </Box>
                  <Typography className="ah-count" color="text.primary">{alert.count}</Typography>
                </Box>
                <Typography className="ah-label" color="text.secondary">{alert.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { m: { xs: 1, sm: 2 }, maxHeight: '90vh' } }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)',
            color: 'white',
            textAlign: 'center',
            fontSize: { xs: '0.9rem', sm: '1rem' },
            py: 1.25,
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: 2, px: { xs: 1, sm: 2 } }}>
          {dialogRows.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary', fontSize: '0.85rem' }}>
              No sites found for this category
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ border: '0.5px solid #75767B', borderRadius: 2, maxHeight: 360 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={TABLE_CELL_STYLE}>Zone</TableCell>
                      <TableCell sx={TABLE_CELL_STYLE}>Circle</TableCell>
                      <TableCell sx={TABLE_CELL_STYLE}>Subdivision</TableCell>
                      <TableCell sx={TABLE_CELL_STYLE}>Area</TableCell>
                      <TableCell sx={TABLE_CELL_STYLE}>Device ID</TableCell>
                      <TableCell sx={TABLE_CELL_STYLE}>Voltage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRows.map((row) => (
                      <TableRow key={row.id} hover sx={{ cursor: 'pointer' }} onClick={() => handleRowClick(row)}>
                        <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem' }}>{row.zone}</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem' }}>{row.circle}</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontSize: '0.75rem' }}>{row.subDivision}</TableCell>
                        <TableCell sx={{ textAlign: 'center', color: '#1976d2', textDecoration: 'underline', fontSize: '0.75rem' }}>{row.area}</TableCell>
                        <TableCell sx={{ textAlign: 'center', color: '#1976d2', textDecoration: 'underline', fontSize: '0.75rem' }}>{row.siteId}</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 600, fontSize: '0.75rem' }}>{row.voltage ?? '--'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={dialogRows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                sx={{ mt: 1, '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': { fontSize: '0.75rem' } }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 2, pb: 1.5 }}>
          <Button variant="contained" color="error" onClick={() => setDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
