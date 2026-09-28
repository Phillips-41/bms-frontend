import React, { useState } from 'react';
import {
  Card, CardContent, Typography, Box, Button,
  Dialog, DialogTitle, DialogContent, IconButton, Divider,
} from '@mui/material';
import { Close as CloseIcon, Warning as WarningIcon, InfoOutlined as InfoIcon } from '@mui/icons-material';
import { useSiteNavigation } from './dashboardUtils';
import './SitesNeedAttention.css';

export const SitesNeedAttention = ({ substations = [] }) => {
  const { goToLiveMonitoring } = useSiteNavigation();
  const [openDialog, setOpenDialog] = useState(false);

  const data = Array.isArray(substations) ? substations : [];
  const hasData = data.length > 0;
  const DASHBOARD_LIMIT = 3;
  const dashboardItems = data.slice(0, DASHBOARD_LIMIT);
  const remainingCount = Math.max(0, data.length - DASHBOARD_LIMIT);

  const handleSubstationClick = (substation) => {
    goToLiveMonitoring({
      area: substation.name,
      division: substation.subDivision,
      circle: substation.circle,
      zone: substation.zone,
      serialNumber: substation.serialNumber || undefined,
      siteId: substation.siteId || undefined,
    });
  };

  const getSOCColor = (soc) => {
    if (soc >= 70) return '#4caf50';
    if (soc >= 50) return '#ff9800';
    return '#f44336';
  };

  const renderSubstationCard = (substation, isDialog = false) => (
    <Box
      className="sna-item-card"
      onClick={() => handleSubstationClick(substation)}
      title="Open live monitoring"
      sx={isDialog ? { p: 1.25 } : undefined}
    >
      <Typography className="sna-item-name" color="text.primary" sx={isDialog ? { fontSize: '0.85rem !important', mb: 1.5 } : undefined}>
        {substation.name}
      </Typography>
      <Box className="sna-metrics">
        <Box className="sna-metric">
          <Typography className="sna-metric-label" color="text.secondary">SOC</Typography>
          <Typography className="sna-metric-value" sx={{ color: getSOCColor(substation.soc) }}>
            {substation.soc != null ? `${substation.soc}%` : 0}
          </Typography>
        </Box>
        <Box className="sna-metric">
          <Typography className="sna-metric-label" color="text.secondary">CURRENT</Typography>
          <Typography className="sna-metric-value" color="text.secondary">
            {substation.current ? `${substation.current}A` : 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Card variant="outlined" className="sna-card" sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}>
        <CardContent className="sna-content">
          <Box className="sna-header">
            <Typography className="sna-title" color="text.primary">
              SUBSTATIONS NEED ATTENTION
            </Typography>
            {hasData && remainingCount > 0 && (
              <Button size="small" variant="outlined" color="primary" onClick={() => setOpenDialog(true)} className="sna-view-btn">
                View all
              </Button>
            )}
          </Box>

          {!hasData ? (
            <Box className="sna-empty" color="text.secondary">
              <InfoIcon sx={{ fontSize: 28, opacity: 0.4 }} />
              <Typography className="sna-empty-title">No Data Available</Typography>
              <Typography className="sna-empty-sub">No substations need attention right now</Typography>
            </Box>
          ) : (
            <Box
              className="sna-list"
              sx={{
                '& > *': {
                  flex: {
                    xs: '1 1 auto',
                    sm: dashboardItems.length === 1 ? '0 0 33%' : dashboardItems.length === 2 ? '0 0 50%' : '1 1 0',
                  },
                  minWidth: 0,
                },
              }}
            >
              {dashboardItems.map((substation) => (
                <Box key={substation.id} sx={{ height: { xs: 'auto', sm: '100%' } }}>
                  {renderSubstationCard(substation)}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {hasData && (
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{ sx: { borderRadius: 2, m: { xs: 1, sm: 2 } } }}
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, bgcolor: 'primary.main', color: '#fff' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon sx={{ fontSize: 18 }} />
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>All Substations Need Attention</Typography>
                <Typography sx={{ fontSize: '0.65rem', opacity: 0.85 }}>{data.length} substations requiring action</Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ px: 2, py: 1.5, maxHeight: '65vh', overflow: 'auto' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1 }}>
              {data.map((substation) => (
                <Box key={substation.id}>{renderSubstationCard(substation, true)}</Box>
              ))}
            </Box>
          </DialogContent>
          <Divider />
        </Dialog>
      )}
    </>
  );
};
