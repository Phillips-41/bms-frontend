import React, { useState, useContext, useEffect } from 'react';
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
    goToLiveMonitoring({ area: substation.name || substation.site });
  };

  const getSOCColor = (soc) => {
    if (soc >= 70) return '#4caf50';
    if (soc >= 50) return '#ff9800';
    return '#f44336';
  };

  const renderSubstationCard = (substation, isDialog = false) => (
    <SubstationCard
      onClick={() => handleSubstationClick(substation)}
      sx={isDialog ? { p: 1.5 } : {}}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          fontSize: isDialog ? '0.9rem' : '0.8rem',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          mb: isDialog ? 2 : 1.5,
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
              fontSize: isDialog ? '0.7rem' : '0.6rem',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            VOLTAGE
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: isDialog ? '1.1rem' : '1rem',
              lineHeight: 1,
            }}
          >
            {substation.voltage ? `${substation.voltage}` : 'N/A'}
          </Typography>
        </MetricItem>

        <MetricItem>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: isDialog ? '0.7rem' : '0.6rem',
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
              fontSize: isDialog ? '1.1rem' : '1rem',
              lineHeight: 1,
            }}
          >
            {substation.soc != null ? `${substation.soc}%` : 'N/A'}
          </Typography>
        </MetricItem>

        <MetricItem>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              fontSize: isDialog ? '0.7rem' : '0.6rem',
              textTransform: 'uppercase',
              mb: 0.5,
            }}
          >
            Temp
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
              fontSize: isDialog ? '1.1rem' : '1rem',
              lineHeight: 1,
            }}
          >
            {substation.batteryTemp != null ? `${substation.batteryTemp}°C` : 'N/A'}
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
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            p: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            '&:last-child': { pb: 1 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.primary',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.3px',
              }}
            >
              SUBSTATIONS NEED ATTENTION
            </Typography>
            {hasData && remainingCount > 0 && (
              <Button
                size="small"
                variant="text"
                color="primary"
                onClick={() => setOpenDialog(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  minWidth: 'auto',
                  padding: '1px 8px',
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
                py: 4,
                gap: 1,
                color: 'text.secondary',
              }}
            >
              <InfoIcon sx={{ fontSize: 32, opacity: 0.4 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                No Data Available
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7 }}>
                No substations need attention right now
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                gap: 0.5,
                minHeight: 0,
                width: '100%',
                '& > *': {
                  flex:
                    dashboardItems.length === 1
                      ? '0 0 calc(33.333% - 4px)'
                      : dashboardItems.length === 2
                      ? '0 0 calc(50% - 2px)'
                      : '1 1 0',
                  minWidth: 0,
                },
              }}
            >
              {dashboardItems.map((substation) => (
                <Box key={substation.id} sx={{ height: '100%' }}>
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
              borderRadius: 2.5,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2.5,
              py: 1.75,
              bgcolor: 'primary.main',
              color: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon sx={{ fontSize: 20 }} />
              <Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}
                >
                  All Substations Need Attention
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', opacity: 0.85 }}>
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
              px: 2.5,
              py: 2,
              maxHeight: '65vh',
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'divider',
                borderRadius: '4px',
                '&:hover': { bgcolor: 'text.disabled' },
              },
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
                gap: 1,
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