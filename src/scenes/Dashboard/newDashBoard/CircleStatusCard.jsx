import { useState, useMemo, useCallback } from 'react';
import {
  Card, CardContent, Typography, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useSiteNavigation } from './dashboardUtils';
import './CircleStatusCard.css';

const TABLE_CELL_STYLE = {
  color: 'black',
  fontWeight: 'bold',
  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
  padding: '3px 6px',
  minWidth: 120,
  whiteSpace: 'nowrap',
  textAlign: 'center',
  fontSize: '0.75rem',
};

const STATUS_TYPE = {
  NON_COMMUNICATING: 1,
  COMMUNICATING: 0,
};

export const CircleStatusCard = ({ data, mapMarkers = [] }) => {
  const {
    totalMonitoredSites = 0,
    communicating = 0,
    non_communicating = 0,
    activeAlarms = 0,
    modemCommsUptime = '0%',
  } = data || {};

  const { goToLiveMonitoring } = useSiteNavigation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogRows, setDialogRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const markers = useMemo(
    () => (Array.isArray(mapMarkers) ? mapMarkers : []),
    [mapMarkers]
  );

  const getRowsForStatus = useCallback(
    (statusType) => {
      return markers
        .filter((m) => Number(m.statusType) === statusType)
        .map((m, idx) => ({
          id: `${m.siteId || 'site'}-${idx}`,
          area: m.area || '--',
          siteId: m.siteId || '--',
          serialNumber: m.serialNumber,
          zone: m.zone || '--',
          circle: m.circle || '--',
          subDivision: m.divison || m.division || '--',
          state: m.state,
          statusType: m.statusType,
          _raw: m,
        }));
    },
    [markers]
  );

  const handleSliceClick = useCallback(
    (entry) => {
      const isCommunicating = entry?.name === 'Communicating';
      const statusType = isCommunicating
        ? STATUS_TYPE.COMMUNICATING
        : STATUS_TYPE.NON_COMMUNICATING;

      const rows = getRowsForStatus(statusType);
      setDialogTitle(
        `${entry?.name || 'Sites'} — ${rows.length} site${rows.length === 1 ? '' : 's'}`
      );
      setDialogRows(rows);
      setPage(0);
      setDialogOpen(true);
    },
    [getRowsForStatus]
  );

  const handleRowClick = useCallback(
    (row) => {
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
    },
    [goToLiveMonitoring]
  );

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

  const pieData = [
    { name: 'Communicating', value: communicating, color: '#2ecc71' },
    { name: 'Non-Communicating', value: non_communicating, color: '#ff4d4d' },
  ];

  return (
    <>
      <Card variant="outlined" className="csc-card" sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
        <CardContent className="csc-content">
          <Typography className="csc-title" color="text.primary">STATUS</Typography>

          <Box className="csc-row">
            <Box sx={{ minWidth: 0 }}>
              <Typography className="csc-label" color="text.secondary">
                Total Monitored Sites
              </Typography>
              <Typography className="csc-total">{totalMonitoredSites}</Typography>

              <Box className="csc-ratio">
                <Typography
                  className="csc-ratio-num ok"
                  onClick={() => handleSliceClick({ name: 'Communicating' })}
                >
                  {communicating}
                </Typography>
                <Typography className="csc-ratio-sep" color="text.secondary">/</Typography>
                <Typography
                  className="csc-ratio-num bad"
                  onClick={() => handleSliceClick({ name: 'Non-Communicating' })}
                >
                  {non_communicating}
                </Typography>
              </Box>
            </Box>

            <Box className="csc-pie">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={22}
                    outerRadius={32}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    onClick={(entry) => handleSliceClick(entry)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} style={{ cursor: 'pointer' }} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Typography className="csc-pie-center" color="text.primary">
                {modemCommsUptime}
              </Typography>
            </Box>
          </Box>

          <Box className="csc-alarms-row">
            <Box>
              <Typography className="csc-label" color="text.secondary">Active Alarms</Typography>
              <Typography className="csc-alarms-value">{activeAlarms}</Typography>
            </Box>
            <WarningAmberIcon className="csc-alarms-icon" />
          </Box>
        </CardContent>
      </Card>

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
              No sites found for this status
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
