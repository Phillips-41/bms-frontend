import React from 'react';
import { Card, CardContent, Typography, Box, Chip, Stack } from '@mui/material';

export const ActiveAlarmsLog = ({ alarms }) => {
  return (
    <Card variant="outlined" sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', borderColor: 'divider', borderRadius: 2 }}>
      <CardContent sx={{ p: { xs: 1.5, lg: 2 }, '&:last-child': { pb: { xs: 1.5, lg: 2 } } }}>
        <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600, mb: { xs: 1, lg: 1.5 } }}>
          Active Alarms Log
        </Typography>

        <Stack spacing={1.5}>
          {alarms.map((alarm) => {
            const isCritical = alarm.severity === 'CRITICAL';
            return (
              <Box
                key={alarm.id}
                sx={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: 'background.default',
                  borderLeft: `4px solid ${isCritical ? '#ff4d4d' : '#ff9800'}`,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                    {alarm.type}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {alarm.site} | {alarm.time}
                  </Typography>
                </Box>
                <Chip
                  label={alarm.severity}
                  size="small"
                  sx={{
                    bgcolor: isCritical ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255, 152, 0, 0.15)',
                    color: isCritical ? '#ff4d4d' : '#ff9800',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    border: `1px solid ${isCritical ? '#ff4d4d' : '#ff9800'}`
                  }}
                />
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};