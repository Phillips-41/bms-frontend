import React from 'react';
import { Card, CardContent, Typography, useTheme } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

export const AlarmLeaderboard = ({ data }) => {
  const theme = useTheme();
  const options = {
    chart: { type: 'bar', backgroundColor: 'transparent', height: 190 },
    title: { text: null },
    xAxis: {
      categories: data.map(item => item.division),
      labels: { style: { color: theme.palette.text.secondary, fontSize: '12px' } },
      lineWidth: 0,
      tickWidth: 0
    },
    yAxis: { visible: false },
    legend: { enabled: false },
    credits: { enabled: false },
    plotOptions: {
      bar: {
        borderRadius: 4,
        borderWidth: 0,
        colorByPoint: true,
        colors: ['#ff4d4d', '#ff6b4a', '#ff8c3b', '#ffa62b', '#ffb82b'],
          dataLabels: {
          enabled: true,
          format: '{y} Alarms',
          style: { color: theme.palette.text.primary, textOutline: 'none', fontWeight: 'bold' }
        }
      }
    },
    series: [{ data: data.map(item => item.count) }]
  };

  return (
    <Card variant="outlined" sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', borderColor: 'divider', borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 1.5, lg: 2 }, '&:last-child': { pb: { lg: 1, xl: 2 } } }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
             Alarm Leaderboard
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          Ranking by Active Alarms
        </Typography>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};