import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, Typography, Box, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useSiteNavigation } from './dashboardUtils';
import './ActiveAlarmsLog.css';

export const ActiveAlarmsLog = ({ alarms = [] }) => {
  const navigate = useNavigate();
  const { goToLiveMonitoring } = useSiteNavigation();

  const data = Array.isArray(alarms) ? alarms : [];
  const hasData = data.length > 0;

  const handleViewAll = () => navigate('/issuetracking');

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
    <Card variant="outlined" className="aal-card" sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
      <CardContent className="aal-content">
        <Box className="aal-header">
          <Typography className="aal-title" color="text.primary">Active Alarms</Typography>
          {hasData && (
            <Button size="small" variant="outlined" onClick={handleViewAll} className="aal-view-btn">
              View All
            </Button>
          )}
        </Box>

        {!hasData ? (
          <Box className="aal-empty" color="text.secondary">
            <InfoOutlinedIcon sx={{ fontSize: 28, opacity: 0.4 }} />
            <Typography className="aal-empty-title">No Data Available</Typography>
            <Typography className="aal-empty-sub">No active alarms at the moment</Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
              <Table size="small" stickyHeader className="aal-table" sx={{ minWidth: 280 }}>
                <TableHead>
                  <TableRow>
                    <TableCell className="aal-th">Alarm</TableCell>
                    <TableCell className="aal-th">Substation</TableCell>
                    <TableCell className="aal-th" align="right">TIME</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.slice(0, 8).map((alarm, index) => (
                    <TableRow key={alarm.id || index} hover>
                      <TableCell>
                        <Typography className="aal-td-alarm" color="text.primary">
                          {alarm.type || alarm.alarm || '--'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          className="aal-td-site"
                          onClick={() => handleSiteClick(alarm)}
                          title="Open live monitoring"
                        >
                          {alarm.site || alarm.substation || '--'}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className="aal-td-time" color="text.secondary">
                          {alarm.age || alarm.time || '--'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {data.length > 8 && (
              <Typography className="aal-more" color="text.secondary">
                {data.length - 8} more alarms • Last updated: {new Date().toLocaleTimeString()}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
