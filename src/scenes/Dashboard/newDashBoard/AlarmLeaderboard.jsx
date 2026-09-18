// AlarmLeaderboard.jsx
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../services/AppContext';
import {
  Card, CardContent, Typography, useTheme, Box,
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { fetchDeviceAlarms } from '../../../services/apiService';
import { normalizeAlarmData, countActiveAlarms } from './dashboardUtils';

export const AlarmLeaderboard = ({
    data = [],
    loading = false,
    title = 'Alarm Leaderboard',
    currentZone = '',
    currentCircle = '',
    device = [],
  }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setSiteId, setArea, handleSearch } = useContext(AppContext);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogRows, setDialogRows] = useState([]);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState('counts');
  const [clickedItem, setClickedItem] = useState(null);

  const isVertical = data.length > 5;

  const getDevicesForDivision = useCallback((divisionName, deviceList = []) => {
    if (!Array.isArray(deviceList) || deviceList.length === 0) return [];

    return deviceList
      .filter((d) => {
        const div = d.division || d.divison || d.siteLocationDTO?.division || d.siteLocationDTO?.divison || '';
        return String(div).toLowerCase() === String(divisionName).toLowerCase();
      })
      .map((d) => ({
        siteId: d.siteId || d.siteLocationDTO?.siteId || '--',
        serialNumber: d.serialNumber || d.generalDataDTO?.deviceDataDTO?.[0]?.serialNumber || 'N/A',
        location: d.area || d.siteLocationDTO?.area || d.name || '--',
        count: countActiveAlarms(d),
      }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count);
  }, []);

  const handleBarClick = useCallback(async (clickedName) => {
    setDialogLoading(true);
    setDialogOpen(true);
    setDialogRows([]);

    try {
      if (!currentZone && !currentCircle) {
        // Zones view → show Circless
        setDialogMode('counts');
        setDialogTitle(`Circles – ${clickedName}`);
        const raw = await fetchDeviceAlarms({ zone: clickedName });
        setDialogRows(normalizeAlarmData(raw));
        return;
      }

      if (currentZone && !currentCircle) {
        // Circles view → show Divisions
        setDialogMode('counts');
        setDialogTitle(`Divisions – ${clickedName}`);
        const raw = await fetchDeviceAlarms({
          zone: currentZone,
          circle: clickedName,
        });
        setDialogRows(normalizeAlarmData(raw));
        return;
      }

      // Divisions view → Areas of that division
      setDialogMode('devices');
      setDialogTitle(`Devices – ${clickedName}`);
      const devices = getDevicesForDivision(clickedName, device);
      setDialogRows(devices);
    } catch (err) {
      console.error('Drill-down failed', err);
      setDialogRows([]);
    } finally {
      setDialogLoading(false);
    }
  }, [currentZone, currentCircle, device, getDevicesForDivision]);

  const handleDialogRowClick = useCallback(async (row) => {
    if (dialogMode !== 'counts') return;

    const isCirclesDialog = dialogTitle.startsWith('Circles');
    const isDivisionsDialog = dialogTitle.startsWith('Divisions');

    setDialogLoading(true);
    setDialogRows([]);

    try {
      if (isCirclesDialog) {
        setDialogMode('counts');
        setDialogTitle(`Divisions – ${row.name}`);
        const zoneName = dialogTitle.replace('Circles – ', '');
        const raw = await fetchDeviceAlarms({
          zone: zoneName,
          circle: row.name,
        });
        setDialogRows(normalizeAlarmData(raw));
      } else if (isDivisionsDialog) {
        setDialogMode('devices');
        setDialogTitle(`Devices – ${row.name}`);
        const devices = getDevicesForDivision(row.name, device);
        setDialogRows(devices);
      }
    } catch (err) {
      console.error(err);
      setDialogRows([]);
    } finally {
      setDialogLoading(false);
    }
  }, [dialogMode, dialogTitle, device, getDevicesForDivision]);

  const handleDeviceRowClick = useCallback((row) => {
    setSiteId(row.siteId);
    setArea?.(row.location);
    setClickedItem(row);
  }, [setSiteId, setArea]);

  // Navigate to live monitoring when clicked
  useEffect(() => {
    let mounted = true;
    const go = async () => {
      if (!mounted || !clickedItem) return;
      const result = await handleSearch?.();
      if (result) {
        navigate('/livemonitoring', { state: { from: '/' } });
      }
      setClickedItem(null);
    };
    go();
    return () => { mounted = false; };
  }, [clickedItem, handleSearch, navigate]);

  const options = useMemo(() => ({
    chart: {
      type: isVertical ? 'column' : 'bar',
      backgroundColor: 'transparent',
      height: isVertical ? 150 : 160,
    },
    title: { text: null },
    xAxis: {
      categories: data.map(item => item.division ?? item.name),
      labels: {
        style: {
          color: theme.palette.text.secondary,
          fontSize: isVertical ? '10px' : '12px',
        },
        rotation: isVertical && data.length > 8 ? -45 : 0,
        align: isVertical && data.length > 8 ? 'right' : 'center',
      },
      lineWidth: 0,
      tickWidth: 0,
    },
    yAxis: {
      visible: isVertical,
      title: { text: null },
      labels: {
        style: { color: theme.palette.text.secondary, fontSize: '11px' },
      },
      gridLineWidth: isVertical ? 1 : 0,
    },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      series: {
        borderRadius: 4,
        borderWidth: 0,
        colorByPoint: true,
        colors: ['#ff4d4d', '#ff6b4a', '#ff8c3b', '#ffa62b', '#ffb82b', '#ffc94d', '#ffd966', '#ffe680'],
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '{y}',
          style: {
            color: theme.palette.text.primary,
            textOutline: 'none',
            fontWeight: 'bold',
            fontSize: isVertical ? '10px' : '12px',
          },
        },
        point: {
          events: {
            click: function () {
              handleBarClick(this.category);
            },
          },
        },
      },
      bar: {
        dataLabels: { format: '{y} Alarms' },
      },
      column: {
        dataLabels: { format: '{y}' },
      },
    },
    series: [{
      data: data.map(item => item.count),
    }],
  }), [data, isVertical, theme, handleBarClick]);

    const TABLE_CELL_STYLE = {
    color: 'black',
    fontWeight: 'bold',
    background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
    padding: '3px',
    minWidth: '150px',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  return (
    <>
      <Card variant="outlined" sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', borderColor: 'divider', borderRadius: 2 }}>
        <CardContent sx={{ p: { xs: 1.5, lg: 0.5 }, '&:last-child': { pb: { lg: 1, xl: 2 } } }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800 }}>
            {title}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            Ranking by Active Alarms · Click a bar to drill down
          </Typography>

          {loading ? (
            <Box sx={{ height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Loading…
            </Box>
          ) : (
            <HighchartsReact highcharts={Highcharts} options={options} />
          )}
        </CardContent>
      </Card>

      {/* Drill-down dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            background:
              'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)',
            color: 'white',
            textAlign: 'center',
          }}
        >
          {dialogTitle}
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {dialogLoading ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>Loading…</Box>
          ) : dialogRows.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
              No data
            </Box>
          ) : dialogMode === 'counts' ? (
            /* Circles / Divisions table – rows are clickable */
            <TableContainer component={Paper} sx={{ border: '0.5px solid #75767B', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={TABLE_CELL_STYLE}>Name</TableCell>
                    <TableCell sx={TABLE_CELL_STYLE}>Active Alarms</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dialogRows.map((row, idx) => (
                    <TableRow
                      key={idx}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleDialogRowClick(row)}
                    >
                      <TableCell sx={{ textAlign: 'center', color: '#1976d2' }}>{row.name}</TableCell>
                      <TableCell sx={{ color: 'error.main', textAlign: 'center', fontWeight: 600 }}>
                        {row.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            /* Devices table */
            <TableContainer component={Paper} sx={{ border: '0.5px solid #75767B', borderRadius: 2, maxHeight: 420 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow  sx={{ cursor: 'pointer' }}>
                    <TableCell sx={TABLE_CELL_STYLE}>Location</TableCell>
                    <TableCell sx={TABLE_CELL_STYLE}>Substation ID</TableCell>
                     <TableCell sx={TABLE_CELL_STYLE}>Active Alarms</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dialogRows.map((row, idx) => (
                    <TableRow key={idx} hover sx={{ cursor: 'pointer' }}>
                      <TableCell sx={{ textAlign: 'center', color: '#1976d2', textDecoration: 'underline' }}
                        onClick={() => handleDeviceRowClick(row)}
                        title="Open live monitoring" >
                        {row.location}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', color: '#1976d2', textDecoration: 'underline' }}
                        onClick={() => handleDeviceRowClick(row)}
                        title="Open live monitoring" >
                        {row.siteId}
                      </TableCell>
                      <TableCell
                        sx={{ textAlign: 'center', color: row.count > 0 ? 'error.main' : 'text.secondary', fontWeight: 600, }} >
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
};