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

const getIconForAlert = (name) => {
  switch (name) {
    case 'Charger Boost': return <BoltIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
    case 'Charger Float': return <BatteryChargingFullIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
    case 'Charger Trip': return <PowerOffIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
    case 'Float Deviation': return <WarningAmberIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
    case 'Thermal Runway': return <WhatshotIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
    default: return <WarningAmberIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />;
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
  padding: { xs: '4px 6px', sm: '3px' },
  minWidth: { xs: 90, sm: 120, md: 150 },
  whiteSpace: 'nowrap',
  textAlign: 'center',
  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
};

export const AlertHotspots = ({ alerts = [], siteNeedAttentionList = [] }) => {
  const { goToLiveMonitoring } = useSiteNavigation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogRows, setDialogRows] = useState([]);
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

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

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
      <CardContent
        sx={{
          p: { xs: 0.75, sm: 0.5, md: 0.4, lg: 0.2 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: { xs: 0.75, sm: 0.5, lg: 0.2 } },
        }}
      >
        <Grid container spacing={{ xs: 0.75, sm: 0.5, md: 0.5 }} sx={{ flex: 1 }}>
          {data.map((alert) => (
            <Grid item xs={6} sm={6} md={4} lg={3} key={alert.id}>
              <Box
                onClick={() => handleCardClick(alert)}
                sx={{
                  p: { xs: 1, sm: 1, md: 1 },
                  borderRadius: { xs: 1, sm: 1.5 },
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1, sm: 1.5, md: 2 },
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  height: '100%',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    borderColor: '#CBD5E1',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 0 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: { xs: 28, sm: 30, md: 30 },
                      height: { xs: 28, sm: 30, md: 30 },
                      borderRadius: '50%',
                      backgroundColor: alert.isPositive
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(34, 197, 94, 0.1)',
                      color: alert.isPositive ? '#EF4444' : '#22C55E',
                      flexShrink: 0,
                    }}
                  >
                    {getIconForAlert(alert.name)}
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', pl: { xs: 1, sm: 2, md: 3 } }}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: 'text.primary',
                        fontSize: { xs: '1.15rem', sm: '1.35rem', md: '1.5rem' },
                      }}
                    >
                      {alert.count}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                      display: 'block',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
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

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)', sm: 'auto' },
            maxHeight: { xs: '90vh', sm: '85vh' },
          },
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)',
            color: 'white',
            textAlign: 'center',
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
            py: { xs: 1.25, sm: 1.5 },
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}>
          {dialogRows.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary', fontSize: { xs: '0.85rem' } }}>
              No sites found for this category
            </Box>
          ) : (
            <>
              <TableContainer
                component={Paper}
                sx={{
                  border: '0.5px solid #75767B',
                  borderRadius: 2,
                  maxHeight: { xs: 300, sm: 360, md: 400 },
                }}
              >
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
                        <TableCell sx={{ textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{row.zone}</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{row.circle}</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{row.subDivision}</TableCell>
                        <TableCell sx={{ textAlign: 'center', color: '#1976d2', textDecoration: 'underline', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{row.area}</TableCell>
                        <TableCell sx={{ textAlign: 'center', color: '#1976d2', textDecoration: 'underline', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{row.siteId}</TableCell>
                        <TableCell sx={{ textAlign: 'center', fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>{row.voltage ?? '--'}</TableCell>
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
                sx={{
                  mt: 1,
                  '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                  },
                }}
              />
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 1.5, sm: 2 } }}>
          <Button variant="contained" color="error" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
