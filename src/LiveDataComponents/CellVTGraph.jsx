
import { useState, useEffect, useRef } from 'react';
import { parseISO } from 'date-fns';
import { Dialog, DialogContent } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Box, Paper, Typography, Stack, IconButton, TextField } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import { downloadCellVTDetails, fetchCellVT } from '../services/apiService';
import Plot from 'react-plotly.js';

const CellVTGraph = ({ site, serial, cellNumber, open, onClose }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [cellData, setCellData] = useState([]);
  const [voltagePlotData, setVoltagePlotData] = useState([]);
  const [temperaturePlotData, setTemperaturePlotData] = useState([]);
  const [sgPlotData, setSgPlotData] = useState([]);
  const [layout, setLayout] = useState({
    height: 300,
    width: 900,
    xaxis: {
      type: 'date',
      tickformat: '%H:%M:%S',
      tickangle: -45,
      tickfont: { size: 12 },
    },
    yaxis: { title: '' },
    margin: { t: 50, b: 100, l: 60, r: 20 },
    showlegend: true,
  });

  const [cellInfo, setCellInfo] = useState({
    siteId: site,
    serialNumber: serial,
    cellNumber: cellNumber,
  });



    useEffect(() => {
    if (open) {
      const formattedDate = startDate.toISOString().slice(0, 10);
      fetchCellData(formattedDate);
    }
  }, [startDate, open]);

  const fetchCellData = async (date) => {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    if (!(date instanceof Date) || isNaN(date)) {
      console.error('Invalid date:', date);
      return;
    }

    const formattedDate = date.toISOString().slice(0, 10);
    const startDateTime = `${formattedDate} 00:00:00`;
    const endDateTime = `${formattedDate} 23:59:59`;

    const data = await fetchCellVT(
      cellInfo.siteId,
      cellInfo.serialNumber,
      cellInfo.cellNumber,
      startDateTime,
      endDateTime
    );
    const filteredData = data.filter(
      (cell) => cell.cellVoltage !== 65.535 && cell.cellTemperature !== 65535
    );
    setCellData(filteredData);
    generateCharts(filteredData);
  };

  const manipulateDateTime = (dateString) => {
    if (!dateString) {
      console.error('Invalid or empty date string:', dateString);
      return null;
    }
    try {
      const utcDate = parseISO(dateString);
      if (isNaN(utcDate)) {
        console.error('Invalid date string:', dateString);
        return null;
      }
      return utcDate;
    } catch (error) {
      console.error('Error parsing date:', dateString, error);
      return null;
    }
  };

  const voltagePlotRef = useRef(null);
  const tempPlotRef = useRef(null);
  const sgPlotRef = useRef(null);

  const generateCharts = (data) => {
    if (!data || data.length === 0) {
      setVoltagePlotData([{
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Voltage',
        marker: { size: 8 },
        line: { color: '#007bff' },
    }]);
      setTemperaturePlotData([{
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Temperature',
        marker: { size: 8 },
        line: { color: '#ff6f61' },
    }]);
      setSgPlotData([{
        x: [],
        y: [],
        type: 'scatter',
        mode: 'lines+markers',

        name: 'Specific Gravity',
        marker: { size: 8 },
        line: { color: '#28a745' },
    }]);
      console.log('No data available for chart generation');
      return;
    }

    const sortedData = [...data].sort(
      (a, b) => new Date(a.packetDateTime) - new Date(b.packetDateTime)
    );

    const latestDataPoints = sortedData.slice(-5);
    latestDataPoints.forEach((point, index) => {
      console.log(`#${index + 1}:`, {
        packetDateTime: point.packetDateTime,
        voltage: point.cellVoltage,
        temperature: point.cellTemperature,
        specificGravity: point.cellSpecificgravity,
        timestamp: manipulateDateTime(point.packetDateTime),
      });
    });

    const timestamps = sortedData.map((item) => manipulateDateTime(item.packetDateTime));
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    const padding = (maxTime - minTime) * 0.1;

    const voltageData = sortedData.map((item) => ({
      x: manipulateDateTime(item.packetDateTime),
      y: item.cellVoltage,
    }));

    const temperatureData = sortedData.map((item) => ({
      x: manipulateDateTime(item.packetDateTime),
      y: item.cellTemperature,
    }));

    const sgData = sortedData.map((item) => ({
      x: manipulateDateTime(item.packetDateTime),
      y: item.cellSpecificgravity,
    }));

    setVoltagePlotData([{
      x: voltageData.map((d) => d.x),
      y: voltageData.map((d) => d.y),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Voltage',
      marker: { size: 8 },
      line: { color: '#007bff' },
    }]);

    setTemperaturePlotData([{
      x: temperatureData.map((d) => d.x),
      y: temperatureData.map((d) => d.y),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Temperature',
      marker: { size: 8 },
      line: { color: '#ff6f61' },
    }]);

    setSgPlotData([{
      x: sgData.map((d) => d.x),
      y: sgData.map((d) => d.y),
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Specific Gravity',
      marker: { size: 8 },
      line: { color: '#28a745' },
    }]);

    setLayout((prev) => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        range: [minTime, maxTime + padding],
      },
      yaxis: { title: 'Voltage (V)' },
    }));

    setTimeout(() => {
      if (voltagePlotRef.current && voltagePlotRef.current.layout && voltagePlotRef.current.data) {
        const { layout, data } = voltagePlotRef.current;
        console.log('Voltage chart actual display range:', {
          minDisplayed: layout.xaxis?.range[0] ? new Date(layout.xaxis.range[0]).toISOString() : null,
          maxDisplayed: layout.xaxis?.range[1] ? new Date(layout.xaxis.range[1]).toISOString() : null,
          lastVisiblePoint: data[0]?.x[data[0].x.length - 1]
            ? new Date(data[0].x[data[0].x.length - 1]).toISOString()
            : null,
        });
      } else {
        console.warn('Voltage chart ref or its properties are not available yet');
      }
    }, 200);
  };
const formatDate = (date) => {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60 * 1000));
  return localDate.toISOString().slice(0, 10);
};
  const downloadExcel = () => {
    if (!startDate || !cellInfo) {
    console.error("Missing required parameters");
    return;
  }
   const startDateTime = `${formatDate(startDate)} 00:00:00`;
  const endDateTime = `${formatDate(startDate)} 23:59:59`; // Assumed endDate exists
    downloadCellVTDetails(
      cellInfo.siteId,
      cellInfo.serialNumber[0],
      cellInfo.cellNumber,
      startDateTime,
      endDateTime
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: { xs: '80%', sm: '80%', md: '80%', lg: '80%',xl:'65%' },
          height: '90%',
          maxHeight: '90vh',
          backgroundColor: 'white',
          borderRadius: '10px',
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box
          sx={{
            p: '13px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              mb: 2,
              width: '100%',
              justifyContent: 'space-between',
              px: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  maxDate={new Date()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        width: 200,
                        '& .MuiInputBase-root': { height: '40px' },
                        input: { color: 'black' },
                        label: { color: 'black' },
                        svg: { color: 'black' },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: 'black' }}>
                {`Cell Number: ${cellInfo.cellNumber}`}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, textAlign: 'right' }}>
              <IconButton
                onClick={downloadExcel}
                aria-label="Download Excel"
                sx={{ padding: 1, color: 'black' }}
              >
                <FileDownloadIcon fontSize="large" />
              </IconButton>
              <IconButton
                onClick={onClose}
                aria-label="Close"
                sx={{ padding: 1, color: 'red' }}
              >
                <CloseIcon fontSize="large" />
              </IconButton>
            </Box>
          </Stack>
          <Paper
            sx={{
              width: '100%',
              height: 'calc(100% - 80px)',
              borderRadius: '10px',
              border: '1px solid #444',
              overflowY: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                padding: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Plot
                  data={voltagePlotData}
                  layout={{ ...layout, title: 'Voltage-Time Graph', yaxis: { title: 'Voltage (V)' } }}
                   config={{ responsive: true, displayModeBar: false }}
                  style={{ width: '100%' }}
                  ref={voltagePlotRef}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Plot
                  data={temperaturePlotData}
                  layout={{ ...layout, title: 'Temperature-Time Graph', yaxis: { title: 'Temperature (°C)' } }}
                   config={{ responsive: true, displayModeBar: false }}
                  style={{ width: '100%' }}
                  ref={tempPlotRef}
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Plot
                  data={sgPlotData}
                  layout={{ ...layout, title: 'Specific Gravity-Time Graph', yaxis: { title: 'Specific Gravity' } }}
                  config={{ responsive: true, displayModeBar: false }}
                  style={{ width: '100%' }}
                  ref={sgPlotRef}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CellVTGraph;