import React from 'react';
import { Card, CardContent, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import './AnalyticsSection.css';

export const AnalyticsSection = ({ matrixData, reliabilityData }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const chartHeight = isXs ? 200 : 180;

  const matrixOptions = {
    chart: { type: 'scatter', backgroundColor: 'transparent', height: chartHeight },
    title: { text: null },
    xAxis: {
      title: { text: 'Ambient Temperature (°C)', style: { color: theme.palette.text.secondary, fontSize: '10px' } },
      labels: { style: { color: theme.palette.text.secondary, fontSize: '9px' } },
      gridLineWidth: 1,
      gridLineColor: theme.palette.divider,
    },
    yAxis: {
      title: { text: 'Cycle Count', style: { color: theme.palette.text.secondary, fontSize: '10px' } },
      labels: { style: { color: theme.palette.text.secondary, fontSize: '9px' } },
      gridLineColor: theme.palette.divider,
    },
    legend: { enabled: false },
    credits: { enabled: false },
    series: [{ data: matrixData, marker: { radius: 5 } }],
  };

  const reliabilityOptions = {
    chart: { type: 'column', backgroundColor: 'transparent', height: chartHeight },
    title: { text: null },
    xAxis: {
      categories: reliabilityData.categories,
      labels: { style: { color: theme.palette.text.secondary, fontSize: '9px' } },
    },
    yAxis: { visible: false },
    legend: {
      itemStyle: { color: theme.palette.text.secondary, fontSize: '9px' },
      layout: isXs ? 'horizontal' : 'vertical',
      align: isXs ? 'center' : 'right',
      verticalAlign: isXs ? 'bottom' : 'middle',
    },
    credits: { enabled: false },
    plotOptions: { column: { stacking: 'normal', borderRadius: 3 } },
    series: reliabilityData.series,
  };

  return (
    <Card variant="outlined" className="as-card" sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
      <CardContent className="as-content">
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Typography className="as-title" color="text.primary">Asset Stress Matrix</Typography>
            <HighchartsReact highcharts={Highcharts} options={matrixOptions} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography className="as-title" color="text.primary">Supplier Reliability Tracker</Typography>
            <Typography className="as-caption" color="text.secondary">
              Failure Rates based on Cycle Counts and Temperature
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={reliabilityOptions} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
