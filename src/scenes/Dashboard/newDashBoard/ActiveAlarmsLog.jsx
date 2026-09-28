import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSiteNavigation } from './dashboardUtils';

export const ActiveAlarmsLog = ({ alarms = [] }) => {

  const navigate = useNavigate();
  const { goToLiveMonitoring } = useSiteNavigation();

  const data = Array.isArray(alarms) ? alarms : [];
  const hasData = data.length > 0;

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
              color="primary"
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
              justifyContent: 'space-between',
              alignItems: 'center',
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
                        bgcolor: 'background.paper',
                      }}
                      align="right"
                    >
                      TIME
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 8).map((alarm, index) => {
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
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                color:'text.primary',
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {alarm.type || alarm.alarm || '--'}
                            </Typography>
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
                          align="right"
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                              fontSize: '0.7rem',
                              whiteSpace: 'nowrap',
                              fontFamily: 'monospace',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 0.5,
                            }}
                          >
                            {alarm.age || alarm.time || '--'}
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