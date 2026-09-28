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

const TABLE_CELL_STYLE = {
  color: 'black',
  fontWeight: 'bold',
  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
  padding: { xs: '4px 6px', sm: '3px 4px', md: '3px' },
  minWidth: { xs: 100, sm: 120, md: 150 },
  whiteSpace: 'nowrap',
  textAlign: 'center',
  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
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
    {
      name: 'Communicating',
      value: communicating,
      color: '#2ecc71',
      statusType: STATUS_TYPE.COMMUNICATING,
    },
    {
      name: 'Non-Communicating',
      value: non_communicating,
      color: '#ff4d4d',
      statusType: STATUS_TYPE.NON_COMMUNICATING,
    },
  ];

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          width: '100%',
          bgcolor: 'background.paper',
          borderColor: 'divider',
          borderRadius: { xs: 1.5, sm: 2, md: 2 },
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1.25, sm: 1.5, md: 1.5, lg: 1.5, xl: 2 },
            '&:last-child': { pb: { xs: 1.25, sm: 1.5, lg: 1 } },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              mb: { xs: 1, sm: 1.25, md: 1, lg: 1, xl: 1.5 },
              fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem', lg: '1.1rem' },
            }}
          >
            STATUS
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 1.5, sm: 2, md: 2, lg: 3, xl: 2 },
              gap: { xs: 1, sm: 1.5 },
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                }}
              >
                Total Monitored Sites
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  color: '#2ecc71',
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
                }}
              >
                {totalMonitoredSites}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Typography
                  variant="caption"
                  onClick={() => handleSliceClick({ name: 'Communicating' })}
                  sx={{
                    color: '#2ecc71',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {communicating}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                    fontWeight: 500,
                  }}
                >
                  /
                </Typography>

                <Typography
                  variant="caption"
                  onClick={() => handleSliceClick({ name: 'Non-Communicating' })}
                  sx={{
                    color: '#ff4d4d',
                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {non_communicating}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                width: { xs: 70, sm: 75, md: 80 },
                height: { xs: 70, sm: 75, md: 80 },
                position: 'relative',
                flexShrink: 0,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    onClick={(entry) => handleSliceClick(entry)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {modemCommsUptime}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 0.5, sm: 1, md: 1, lg: 1, xl: 2 },
            }}
          >
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                }}
              >
                Active Alarms
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#ff9800',
                  fontWeight: 700,
                  fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' },
                }}
              >
                {activeAlarms}
              </Typography>
            </Box>
            <WarningAmberIcon
              sx={{
                fontSize: { xs: 32, sm: 36, md: 40 },
                color: '#ff9800',
                mr: { xs: 1, sm: '12px', md: '20px' },
              }}
            />
          </Box>
        </CardContent>
      </Card>

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
            background:
              'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)',
            color: 'white',
            textAlign: 'center',
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
            py: { xs: 1.25, sm: 1.5 },
            px: { xs: 1.5, sm: 2 },
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: { xs: 1.5, sm: 2 }, px: { xs: 1, sm: 2 } }}>
          {dialogRows.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary', fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
              No sites found for this status
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
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            color: '#1976d2',
                            textDecoration: 'underline',
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          }}
                        >
                          {row.area}
                        </TableCell>
                        <TableCell
                          sx={{
                            textAlign: 'center',
                            color: '#1976d2',
                            textDecoration: 'underline',
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          }}
                        >
                          {row.siteId}
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
