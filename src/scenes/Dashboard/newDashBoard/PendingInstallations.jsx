import { useState } from 'react';
import {
  Card, CardContent, Typography, Box,
  Dialog, DialogTitle, DialogContent, IconButton, Divider,
} from '@mui/material';
import { Schedule, LocationOn, Close as CloseIcon, Inbox as InboxIcon } from '@mui/icons-material';
import { useSiteNavigation } from './dashboardUtils';
import './PendingInstallations.css';

export const PendingInstallations = ({ installations = [] }) => {
  const { goToLiveMonitoring } = useSiteNavigation();
  const [openDialog, setOpenDialog] = useState(false);

  const data = Array.isArray(installations) ? installations : [];
  const isDataEmpty = data.length === 0;
  const DASHBOARD_LIMIT = 2;
  const dashboardItems = data.slice(0, DASHBOARD_LIMIT);
  const remainingCount = data.length - DASHBOARD_LIMIT;

  const handleViewDetails = (item) => {
    goToLiveMonitoring({
      siteId: item.siteId || undefined,
      area: item.area,
      serialNumber: item.serialNumber || undefined,
      state: item.state,
      zone: item.zone,
      circle: item.circle,
      division: item.subDivision,
    });
  };

  const renderTimelineList = (items, isDialog = false) => (
    <Box className="pi-list">
      {items.map((item, index) => (
        <Box key={item.id || index} className="pi-item">
          <Box className="pi-dot-col">
            <Box className="pi-dot" />
            {index < items.length - 1 && <Box className="pi-line" />}
          </Box>
          <Box className="pi-item-body" onClick={() => handleViewDetails(item)} sx={isDialog ? { p: 0.75 } : undefined}>
            <Typography className="pi-item-area" color="text.primary" sx={isDialog ? { fontSize: '0.8rem !important' } : undefined}>
              {item.area}
            </Typography>
            <Box className="pi-reason">
              <Typography className="pi-reason-text" color="text.primary">{item.reason}</Typography>
            </Box>
            <Box className="pi-meta">
              {item.subDivision && (
                <Box className="pi-meta-item">
                  <LocationOn className="pi-meta-icon" color="action" />
                  <Typography className="pi-meta-text" color="text.secondary">{item.subDivision}</Typography>
                </Box>
              )}
              {item.circle && (
                <Box className="pi-meta-item">
                  <LocationOn className="pi-meta-icon" color="action" />
                  <Typography className="pi-meta-text" color="text.secondary">{item.circle}</Typography>
                </Box>
              )}
              {item.zone && (
                <Box className="pi-meta-item">
                  <LocationOn className="pi-meta-icon" color="action" />
                  <Typography className="pi-meta-text" color="text.secondary">{item.zone}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Card variant="outlined" className="pi-card" sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
        <CardContent className="pi-content">
          <Box className="pi-header">
            <Schedule className="pi-header-icon" color="primary" />
            <Typography className="pi-title" color="text.primary">Pending Installations</Typography>
          </Box>

          {isDataEmpty ? (
            <Box className="pi-empty" color="text.secondary">
              <InboxIcon sx={{ fontSize: 36, opacity: 0.4 }} />
              <Typography className="pi-empty-title">No pending installations</Typography>
              <Typography className="pi-empty-sub">There are no records to display at the moment</Typography>
            </Box>
          ) : (
            <>
              {renderTimelineList(dashboardItems)}
              {remainingCount > 0 && (
                <Box className="pi-view-all">
                  <Typography className="pi-view-all-link" onClick={() => setOpenDialog(true)}>
                    Click to view all
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, m: { xs: 1, sm: 2 } } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: 'primary.main', color: '#fff' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Schedule sx={{ fontSize: 18 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>All Pending Installations</Typography>
              <Typography sx={{ fontSize: '0.65rem', opacity: 0.85 }}>{data.length} total records awaiting action</Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ color: '#fff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ px: 2, py: 1.5, maxHeight: '65vh', display: 'flex', flexDirection: 'column' }}>
          {renderTimelineList(data, true)}
        </DialogContent>
        <Divider />
      </Dialog>
    </>
  );
};

export default PendingInstallations;
