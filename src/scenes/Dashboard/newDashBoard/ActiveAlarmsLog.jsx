import React from 'react';
import { Card, CardContent, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSiteNavigation } from './dashboardUtils';

export const ActiveAlarmsLog = ({ alarms = [] }) => {

  const { goToLiveMonitoring } = useSiteNavigation();

  // Use API data only — no mock fallback
  const data = Array.isArray(alarms) ? alarms : [];
  const hasData = data.length > 0;

  // Function to determine severity icon
  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return <ErrorIcon sx={{ fontSize: 14, color: '#d32f2f' }} />;
      case 'high':
        return <WarningIcon sx={{ fontSize: 14, color: '#ed6c02' }} />;
      case 'medium':
        return <FiberManualRecordIcon sx={{ fontSize: 14, color: '#f57c00' }} />;
      case 'low':
        return <CheckCircleIcon sx={{ fontSize: 14, color: '#2e7d32' }} />;
      default:
        return <FiberManualRecordIcon sx={{ fontSize: 14, color: '#ff9800' }} />;
    }
  };

  // Function to get age display with time indicator
  const formatAge = (age) => {
    if (!age) return '--';
    if (age.includes('·')) return age;
    return age;
  };

  const handleViewAll = () => {
    navigate('/issuetracking');
  };

const handleSiteClick = (alarm) => {
  goToLiveMonitoring({
    siteId: alarm.siteId,
    area: alarm.site,
    serialNumber: alarm.serialNumber,
    state: alarm.state,
    zone: alarm.zone,
    circle: alarm.circle,
    division: alarm.division,
  });
};

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: 'background.paper',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent
        sx={{
          p: { xs: 0.75, lg: 1 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: { xs: 0.75, lg: 1 } }
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 0.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 0.5,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="subtitle1"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}>
              Active Alarms
            </Typography>
          </Box>
          {hasData && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={handleViewAll}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.6rem',
                minWidth: 'auto',
                padding: '2px 8px',
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  bgcolor: 'rgba(211, 47, 47, 0.04)',
                }
              }}
            >
              View All
            </Button>
          )}
        </Box>

        {/* Empty State */}
        {!hasData ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 32, opacity: 0.4 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
              No Data Available
            </Typography>
            <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7 }}>
              No active alarms at the moment
            </Typography>
          </Box>
        ) : (
          <>
            {/* Enhanced Table */}
            <TableContainer
              sx={{
                flex: 1,
                overflow: 'auto',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'background.paper',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'divider',
                  borderRadius: '4px',
                },
              }}>
              <Table
                size="small"
                stickyHeader
                sx={{
                  minWidth: 350,
                  borderCollapse: 'collapse',
                  '& .MuiTableCell-root': {
                    padding: '4px 2px',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        py: 0.5,
                        px: 0.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        width: '30%',
                        bgcolor: 'background.paper',
                      }}
                    >
                      Alarm
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        py: 0.5,
                        px: 0.5,
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        width: '30%',
                        bgcolor: 'background.paper',
                      }}
                    >
                      Substation
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        py: 0.5,
                        px: 0.5,
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        width: '25%',
                        bgcolor: 'background.paper',
                      }}
                    >
                      Source
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: 'text.secondary',
                        fontSize: '0.7rem',
                        py: 0.5,
                        px: 0.5,
                        borderBottom: '2px solid',
                        borderColor: 'divider',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        width: '15%',
                        bgcolor: 'background.paper',
                      }}
                      align="right"
                    >
                      Age
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 8).map((alarm, index) => {
                    const severity = alarm.severity || 'medium';

                    return (
                      <TableRow
                        key={alarm.id || index}
                        sx={{
                          '&:hover': {
                            bgcolor: 'action.hover',
                            transition: 'background-color 0.2s ease',
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            py: 0.75,
                            px: 0.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {getSeverityIcon(severity)}
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                color: severity === 'critical' ? '#d32f2f' : 'text.primary',
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                ...(severity === 'critical' && {
                                  animation: 'pulse 2s infinite',
                                  '@keyframes pulse': {
                                    '0%': { opacity: 1 },
                                    '50%': { opacity: 0.6 },
                                    '100%': { opacity: 1 },
                                  },
                                }),
                              }}
                            >
                              {alarm.type || alarm.alarm || '--'}
                            </Typography>
                            {severity === 'critical' && (
                              <Box
                                sx={{
                                  bgcolor: '#d32f2f',
                                  color: 'white',
                                  fontSize: '0.45rem',
                                  px: 0.5,
                                  py: 0.25,
                                  borderRadius: '2px',
                                  fontWeight: 700,
                                  textTransform: 'uppercase',
                                  lineHeight: 1,
                                }}
                              >
                                Critical
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 0.75,
                            px: 0.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Box
                            component="span"
                            onClick={() => handleSiteClick(alarm)}
                            sx={{
                              color: '#1976d2',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '0.65rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'block',
                              '&:hover': {
                                textDecoration: 'underline',
                                color: '#1565c0',
                              },
                              transition: 'color 0.2s ease',
                            }}
                            title="Open live monitoring"
                          >
                            {alarm.site || alarm.substation || '--'}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 0.75,
                            px: 0.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontSize: '0.6rem',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              fontFamily: 'monospace',
                            }}
                          >
                            {alarm.source || '--'}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            py: 0.75,
                            px: 0.5,
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                          }}
                          align="right"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                              fontSize: '0.6rem',
                              whiteSpace: 'nowrap',
                              fontFamily: 'monospace',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 0.5,
                            }}
                          >
                            {formatAge(alarm.age || alarm.time || '--')}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Show more indicator */}
            {data.length > 8 && (
              <Box sx={{
                textAlign: 'center',
                mt: 0.5,
                pt: 0.5,
                borderTop: '1px solid',
                borderColor: 'divider',
              }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.55rem',
                    fontWeight: 500,
                  }}
                >
                  {data.length - 8} more alarms • Last updated: {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};