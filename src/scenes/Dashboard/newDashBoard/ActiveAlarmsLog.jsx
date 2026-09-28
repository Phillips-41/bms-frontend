import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
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

  const headerCellSx = {
    fontWeight: 700,
    color: 'text.secondary',
    fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.7rem' },
    py: { xs: 0.4, sm: 0.5 },
    px: { xs: 0.4, sm: 0.5 },
    borderBottom: '1px solid',
    borderColor: 'divider',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    bgcolor: 'background.paper',
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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <CardContent
        sx={{
          p: { xs: 0.75, sm: 0.9, md: 1, lg: 1 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          '&:last-child': { pb: { xs: 0.75, sm: 0.9, lg: 1 } },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 0.5,
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
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
                fontSize: { xs: '0.6rem', sm: '0.6rem' },
                minWidth: 'auto',
                padding: { xs: '2px 8px', sm: '2px 8px' },
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  borderColor: '#b71c1c',
                  bgcolor: 'rgba(211, 47, 47, 0.04)',
                },
              }}
            >
              View All
            </Button>
          )}
        </Box>

        {!hasData ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              py: { xs: 3, sm: 4 },
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: { xs: 28, sm: 32 }, opacity: 0.4 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}
            >
              No Data Available
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, opacity: 0.7 }}
            >
              No active alarms at the moment
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer
              sx={{
                flex: 1,
                overflow: 'auto',
                '&::-webkit-scrollbar': { width: '4px' },
                '&::-webkit-scrollbar-track': { bgcolor: 'background.paper' },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'divider',
                  borderRadius: '4px',
                },
              }}
            >
              <Table
                size="small"
                stickyHeader
                sx={{
                  minWidth: { xs: 280, sm: 320, md: 350 },
                  borderCollapse: 'collapse',
                  '& .MuiTableCell-root': {
                    padding: { xs: '4px 2px', sm: '4px 2px' },
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={headerCellSx}>Alarm</TableCell>
                    <TableCell sx={headerCellSx}>Substation</TableCell>
                    <TableCell sx={{ ...headerCellSx, borderBottom: '2px solid' }} align="right">
                      TIME
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 8).map((alarm, index) => (
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
                          py: { xs: 0.6, sm: 0.75 },
                          px: 0.5,
                          borderBottom: '1px solid',
                          borderColor: 'divider',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.7rem' },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {alarm.type || alarm.alarm || '--'}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          py: { xs: 0.6, sm: 0.75 },
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
                            fontSize: { xs: '0.6rem', sm: '0.62rem', md: '0.65rem' },
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
                          py: { xs: 0.6, sm: 0.75 },
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
                            fontSize: { xs: '0.65rem', sm: '0.68rem', md: '0.7rem' },
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {data.length > 8 && (
              <Box
                sx={{
                  textAlign: 'center',
                  mt: 0.5,
                  pt: 0.5,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontSize: { xs: '0.55rem', sm: '0.55rem' },
                    fontWeight: 500,
                  }}
                >
                  {data.length - 8} more alarms • Last updated:{' '}
                  {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
