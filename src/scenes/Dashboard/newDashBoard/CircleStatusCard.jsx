import { useState, useMemo } from 'react';
import {
  Card, CardContent, Typography, Box,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TABLE_CELL_STYLE = {
  color: 'black',
  fontWeight: 'bold',
  background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
  padding: '3px',
  minWidth: '150px',
  whiteSpace: 'nowrap',
  textAlign: 'center',
};

export const CircleStatusCard = ({ data }) => {
  const {
    totalMonitoredSites = 0,
    communicating = 0,
    non_communicating = 0,
    activeAlarms = 0,
    modemCommsUptime = '0%',
  } = data || {};

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogRows, setDialogRows] = useState([]);
  const [dialogType, setDialogType] = useState(null);

  const pieData = [
    {
      name: 'Communicating',
      value: communicating,
      color: '#2ecc71',
      type: 'communicating',
    },
    {
      name: 'Non-Communicating',
      value: non_communicating,
      color: '#ff4d4d',
      type: 'non_communicating',
    },
  ];

  const deviceList = useMemo(
    () => (Array.isArray(data?.device) ? data.device : []),
    [data]
  );

  const getRowsForType = (type) => {
    if (!deviceList.length) return [];

    return deviceList
      .filter((d) => {
        const isNonComm = d.isNotCommunicating === true;
        return type === 'non_communicating' ? isNonComm : !isNonComm;
      })
      .map((d, idx) => ({
        id: d.siteId || d.serialNumber || `row-${idx}`,
        name: d.area || d.name || d.siteId || '--',
        siteId: d.siteId || '--',
        serialNumber: d.serialNumber || '--',
        vendor: d.vendorName || '--',
        _raw: d,
      }));
  };

  const handlePieClick = (entry) => {
    const type = entry?.type || entry?.payload?.type;
    if (!type) return;

    const rows = getRowsForType(type);
    const label = type === 'communicating' ? 'Communicating' : 'Non-Communicating';

    setDialogType(type);
    setDialogTitle(`${label} Sites — ${rows.length}`);
    setDialogRows(rows);
    setDialogOpen(true);
  };

  return (
    <>
      <Card variant="outlined" sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent sx={{ p: { lg: 1.5, xl: 2 }, '&:last-child': { pb: { lg: 1 } } }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700, mb: { lg: 1, xl: 1.5 } }}>
            STATUS
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { lg: 3, xl: 2 } }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Monitored Sites
              </Typography>

              <Typography variant="h3" sx={{ color: '#2ecc71', fontWeight: 700 }}>
                {totalMonitoredSites}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <Typography
                  variant="caption"
                  onClick={() => handlePieClick({ type: 'communicating' })}
                  sx={{
                    color: '#2ecc71',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {communicating}
                </Typography>
                {/* Separator */}
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '1rem', fontWeight: 500 }}>
                  /
                </Typography>
                {/* Non-Communicating - clickable */}
                <Typography
                  variant="caption"
                  onClick={() => handlePieClick({ type: 'non_communicating' })}
                  sx={{
                    color: '#ff4d4d',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {non_communicating}
                </Typography>
              </Box>
            </Box>

            {/* Pie Chart */}
            <Box sx={{ width: 80, height: 80, position: 'relative' }}>
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
                    onClick={(entry) => handlePieClick(entry)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center text */}
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  color: 'text.primary',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {modemCommsUptime}
              </Typography>
            </Box>
          </Box>

          {/* Active Alarms */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { lg: 1, xl: 2 } }}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Active Alarms
              </Typography>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                {activeAlarms}
              </Typography>
            </Box>
            <WarningAmberIcon sx={{ fontSize: 40, color: '#ff9800', mr: '20px' }} />
          </Box>
        </CardContent>
      </Card>

      {/* ---------- DRILL-DOWN DIALOG ---------- */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2.5, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.18)' },
        }}
      >
        <DialogTitle
          sx={{
            background:
              dialogType === 'non_communicating'
                ? 'linear-gradient(90deg, #ff4d4d 0%, #b71c1c 50%, #ff4d4d 100%)'
                : 'linear-gradient(90deg, #2ecc71 0%, #1b5e20 50%, #2ecc71 100%)',
            color: 'white',
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {dialogRows.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
              No sites found
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ border: '0.5px solid #75767B', borderRadius: 2, maxHeight: 420 }}
            >
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={TABLE_CELL_STYLE}>Location</TableCell>
                    <TableCell sx={TABLE_CELL_STYLE}>Substation ID</TableCell>
                    <TableCell sx={TABLE_CELL_STYLE}>Serial Number</TableCell>
                    <TableCell sx={TABLE_CELL_STYLE}>Vendor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dialogRows.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ textAlign: 'center' }}>{row.name}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{row.siteId}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{row.serialNumber}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{row.vendor}</TableCell>
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
};