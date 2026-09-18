import { useState, useMemo, useCallback } from 'react';
import {
  Card, CardContent, Typography, Box, Grid,
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

// Map specific icons to the alert names
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
  padding: '3px',
  minWidth: '150px',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

export const AlertHotspots = ({ alerts = [], siteNeedAttentionList = [] }) => {

  const { goToLiveMonitoring } = useSiteNavigation();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogRows, setDialogRows] = useState([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const mockAlerts = [
    { id: 1, name: 'Charger Boost', change: 0, count: '--', isPositive: true },
    { id: 2, name: 'Charger Float', change: 0, count: '--', isPositive: false },
    { id: 4, name: 'Float Deviation', change: 0, count: '--', isPositive: true },
    { id: 5, name: 'Thermal Runway', change: 0, count: '--', isPositive: false },
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
        soc: site.soc,
        temp: site.temp,
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
    goToLiveMonitoring({ siteId: row.siteId, area: row.area });
    setDialogOpen(false);
  }, [goToLiveMonitoring]);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Slice rows for the current page
  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return dialogRows.slice(start, start + rowsPerPage);
  }, [dialogRows, page, rowsPerPage]);

  return (
    <>
      <CardContent
        sx={{
          p: { lg: 0.2 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dynamic KPI Grid */}
        <Grid container spacing={0.5} sx={{ flex: 1 }}>
          {data.map((alert) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={alert.id}>
              <Box
                onClick={() => handleCardClick(alert)}
                sx={{
                  p: 1,
                  borderRadius: 1.5,
                  backgroundColor: 'background.paper',
                  border: '1px solid divider',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    borderColor: '#CBD5E1',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {/* Top Row: Icon & Count */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Icon Badge */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      backgroundColor: alert.isPositive
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(34, 197, 94, 0.1)',
                      color: alert.isPositive ? '#EF4444' : '#22C55E',
                    }}
                  >
                    {getIconForAlert(alert.name)}
                  </Box>

                  {/* Count */}
                  <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {alert.count}
                    </Typography>
                  </Box>
                </Box>

                {/* Label */}
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      display: 'block',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {alert.name}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>

      {/* DRILL-DOWN DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
      >
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
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
              No sites found for this category
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{ border: '0.5px solid #75767B', borderRadius: 2, maxHeight: 400 }}>
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
                      <TableRow
                        key={row.id}
                        hover
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleRowClick(row)}
                      >
                        <TableCell sx={{ textAlign: 'center' }}>
                          {row.zone}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          {row.circle}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>
                          {row.subDivision}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            color: '#1976d2',
                            textDecoration: 'underline',
                          }}
                        >
                          {row.area}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            color: '#1976d2',
                            textDecoration: 'underline',
                          }}
                        >
                          {row.siteId}
                        </TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 600 }}>
                          {row.voltage ?? '--'}
                        </TableCell>
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
                sx={{ mt: 1 }}
              />
            </>
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
};