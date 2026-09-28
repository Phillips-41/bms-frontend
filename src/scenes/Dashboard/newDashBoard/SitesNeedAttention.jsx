import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSiteNavigation } from './dashboardUtils';

const SubstationCard = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0.5),
  borderRadius: 1,
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: theme.shadows[1],
    borderColor: theme.palette.primary.main,
  },
}));

const MetricItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  padding: theme.spacing(0.4),
}));

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
    <SubstationCard
      onClick={() => handleSubstationClick(substation)}
      sx={{
        p: isDialog
          ? { xs: 1.25, sm: 1.5 }
          : { xs: 0.75, sm: 0.5, md: 0.5 },
      }}
      title="Open live monitoring"
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontSize: isDialog
            ? { xs: '0.85rem', sm: '0.9rem' }
            : { xs: '0.75rem', sm: '0.78rem', md: '0.8rem' },
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          mb: isDialog ? { xs: 1.5, sm: 2 } : { xs: 1, sm: 1.5 },
        }}
      >
        {substation.name}
      </Typography>

      <Box sx={{ display: 'flex' }}>
        <MetricItem>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: isDialog
                ? { xs: '0.65rem', sm: '0.7rem' }
                : { xs: '0.6rem', sm: '0.6rem', md: '0.6rem' },
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            SOC
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: getSOCColor(substation.soc),
              fontWeight: 600,
              fontSize: isDialog
                ? { xs: '1rem', sm: '1.1rem' }
                : { xs: '0.95rem', sm: '1rem', md: '1rem' },
              lineHeight: 1,
            }}
          >
            {substation.soc != null ? `${substation.soc}%` : 0}
          </Typography>
        </MetricItem>
        <MetricItem>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: isDialog
                ? { xs: '0.65rem', sm: '0.7rem' }
                : { xs: '0.6rem', sm: '0.6rem' },
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            CURRENT
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: isDialog
                ? { xs: '1rem', sm: '1.1rem' }
                : { xs: '0.95rem', sm: '1rem' },
              lineHeight: 1,
            }}
          >
            {substation.current ? `${substation.current}A` : 0}
          </Typography>
        </MetricItem>
      </Box>
    </SubstationCard>
  );

  return (
    <>
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
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1, sm: 1, md: 1 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            '&:last-child': { pb: { xs: 1, sm: 1 } },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: { xs: 0.75, sm: 1 },
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                letterSpacing: '0.3px',
              }}
            >
              SUBSTATIONS NEED ATTENTION
            </Typography>
            {hasData && remainingCount > 0 && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() => setOpenDialog(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: { xs: '0.65rem', sm: '0.65rem' },
                  minWidth: 'auto',
                  padding: { xs: '2px 8px', sm: '1px 8px' },
                  color: 'primary.main',
                }}
              >
                View all
              </Button>
            )}
          </Box>

          {!hasData ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: { xs: 3, sm: 4 },
                gap: 1,
                color: 'text.secondary',
              }}
            >
              <InfoIcon sx={{ fontSize: { xs: 28, sm: 32 }, opacity: 0.4 }} />
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
                No substations need attention right now
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 0.75, sm: 0.5 },
                minHeight: 0,
                width: '100%',
                '& > *': {
                  flex: {
                    xs: '1 1 auto',
                    sm:
                      dashboardItems.length === 1
                        ? '0 0 calc(33.333% - 4px)'
                        : dashboardItems.length === 2
                        ? '0 0 calc(50% - 2px)'
                        : '1 1 0',
                  },
                  minWidth: 0,
                },
              }}
            >
              {dashboardItems.map((substation) => (
                <Box key={substation.id} sx={{ height: { xs: 'auto', sm: '100%' }, minHeight: { xs: 72, sm: 0 } }}>
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
          PaperProps={{
            sx: {
              borderRadius: { xs: 2, sm: 2.5 },
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
              m: { xs: 1, sm: 2 },
              width: { xs: 'calc(100% - 16px)', sm: 'auto' },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.25, sm: 1.75 },
              bgcolor: 'primary.main',
              color: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
              <Box>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    lineHeight: 1.2,
                  }}
                >
                  All Substations Need Attention
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, opacity: 0.85 }}>
                  {data.length} substations requiring action
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setOpenDialog(false)}
              size="small"
              sx={{
                color: '#fff',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>

          <Divider />

          <DialogContent
            sx={{
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 1.5, sm: 2 },
              maxHeight: { xs: '70vh', sm: '65vh' },
              overflow: 'auto',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: { xs: 1, sm: 1 },
              }}
            >
              {data.map((substation) => (
                <Box key={substation.id}>
                  {renderSubstationCard(substation, true)}
                </Box>
              ))}
            </Box>
          </DialogContent>
          <Divider />
        </Dialog>
      )}
    </>
  );
};
