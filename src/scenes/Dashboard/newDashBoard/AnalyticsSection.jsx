import React from 'react';
import { Card, CardContent, Typography, Grid, useTheme } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const AnalyticsSection = ({ matrixData, reliabilityData }) => {
  const theme = useTheme();
  const matrixOptions = {
    chart: { type: 'scatter', backgroundColor: 'transparent', height: 190 },
    title: { text: null },
    xAxis: {
      title: { text: 'Ambient Temperature (°C)', style: { color: theme.palette.text.secondary } },
      labels: { style: { color: theme.palette.text.secondary } },
      gridLineWidth: 1,
      gridLineColor: theme.palette.divider
    },
    yAxis: {
      title: { text: 'Cycle Count', style: { color: theme.palette.text.secondary } },
      labels: { style: { color: theme.palette.text.secondary } },
      gridLineColor: theme.palette.divider
    },
    legend: { enabled: false },
    credits: { enabled: false },
    series: [{
      data: matrixData,
      marker: { radius: 6 }
    }]
  };

  const reliabilityOptions = {
    chart: { type: 'column', backgroundColor: 'transparent', height: 190 },
    title: { text: null },
    xAxis: { categories: reliabilityData.categories, labels: { style: { color: theme.palette.text.secondary } } },
    yAxis: { visible: false },
    legend: { itemStyle: { color: theme.palette.text.secondary, fontSize: '10px' }, layout: 'vertical', align: 'right', verticalAlign: 'middle' },
    credits: { enabled: false },
    plotOptions: { column: { stacking: 'normal', borderRadius: 3 } },
    series: reliabilityData.series
  };

  return (
    <Card variant="outlined" sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', borderColor: 'divider', borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 1.5, lg: 2 }, '&:last-child': { pb: { xs: 1.5, lg: 2 } } }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={7}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Asset Stress Matrix
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={matrixOptions} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
              Supplier Reliability Tracker
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Failure Rates based on Cycle Counts and Temperature
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={reliabilityOptions} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};