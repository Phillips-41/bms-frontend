import React from 'react';
import { Card, CardContent, Typography, Grid, useTheme, useMediaQuery } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const AnalyticsSection = ({ matrixData, reliabilityData }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const chartHeight = isXs ? 220 : isSm ? 200 : 190;

  const matrixOptions = {
    chart: { type: 'scatter', backgroundColor: 'transparent', height: chartHeight },
    title: { text: null },
    xAxis: {
      title: {
        text: 'Ambient Temperature (°C)',
        style: { color: theme.palette.text.secondary, fontSize: isXs ? '10px' : '11px' },
      },
      labels: { style: { color: theme.palette.text.secondary, fontSize: isXs ? '9px' : '10px' } },
      gridLineWidth: 1,
      gridLineColor: theme.palette.divider,
    },
    yAxis: {
      title: {
        text: 'Cycle Count',
        style: { color: theme.palette.text.secondary, fontSize: isXs ? '10px' : '11px' },
      },
      labels: { style: { color: theme.palette.text.secondary, fontSize: isXs ? '9px' : '10px' } },
      gridLineColor: theme.palette.divider,
    },
    legend: { enabled: false },
    credits: { enabled: false },
    series: [{
      data: matrixData,
      marker: { radius: isXs ? 5 : 6 },
    }],
  };

  const reliabilityOptions = {
    chart: { type: 'column', backgroundColor: 'transparent', height: chartHeight },
    title: { text: null },
    xAxis: {
      categories: reliabilityData.categories,
      labels: { style: { color: theme.palette.text.secondary, fontSize: isXs ? '9px' : '10px' } },
    },
    yAxis: { visible: false },
    legend: {
      itemStyle: {
        color: theme.palette.text.secondary,
        fontSize: isXs ? '9px' : '10px',
      },
      layout: isXs ? 'horizontal' : 'vertical',
      align: isXs ? 'center' : 'right',
      verticalAlign: isXs ? 'bottom' : 'middle',
    },
    credits: { enabled: false },
    plotOptions: { column: { stacking: 'normal', borderRadius: 3 } },
    series: reliabilityData.series,
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderRadius: { xs: 1.5, sm: 2 },
      }}
    >
      <CardContent
        sx={{
          p: { xs: 1.25, sm: 1.5, md: 1.5, lg: 2 },
          '&:last-child': { pb: { xs: 1.25, sm: 1.5, lg: 2 } },
        }}
      >
        <Grid container spacing={{ xs: 2, sm: 2, md: 2 }}>
          <Grid item xs={12} md={7}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                mb: { xs: 0.5, sm: 1 },
              }}
            >
              Asset Stress Matrix
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={matrixOptions} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
              }}
            >
              Supplier Reliability Tracker
            </Typography>
            <Typography
              variant="caption"
              sx={
                {
                  color: 'text.secondary',
                  display: 'block',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  mb: { xs: 0.5, sm: 0 },
                }
              }
            >
              Failure Rates based on Cycle Counts and Temperature
            </Typography>
            <HighchartsReact highcharts={Highcharts} options={reliabilityOptions} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
