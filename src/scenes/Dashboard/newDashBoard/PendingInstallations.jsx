import { useState} from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Schedule,
  LocationOn,
  Close as CloseIcon,
  Inbox as InboxIcon,
} from '@mui/icons-material';
import { useSiteNavigation } from './dashboardUtils';

export const PendingInstallations = ({ installations = [] }) => {

  const { goToLiveMonitoring } = useSiteNavigation();

  const [openDialog, setOpenDialog] = useState(false);

  const data = Array.isArray(installations) ? installations : [];

  const isDataEmpty = data.length === 0;

  const DASHBOARD_LIMIT = 2;
  const dashboardItems = data.slice(0, DASHBOARD_LIMIT);
  const remainingCount = data.length - DASHBOARD_LIMIT;

  // Navigate to Live Monitoring
  const handleViewDetails = (item) => {
  goToLiveMonitoring({ siteId: item.siteId, area: item.area, serialNumber: item.serialNumber });
};

  // Reusable timeline list renderer
  const renderTimelineList = (items, isDialog = false) => (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        pl: 1,
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': {
          bgcolor: 'divider',
          borderRadius: '4px',
          '&:hover': { bgcolor: 'text.disabled' },
        },
      }}
    >
      {items.map((item, index) => (
        <Box
          key={item.id || index}
          sx={{ display: 'flex', gap: 1.5, position: 'relative', pb: 0.5 }}
        >
          {/* Timeline Dot + Line */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: isDialog ? 1.5 : 0.5,
            }}
          >
            <Box
              sx={{
                width: isDialog ? 10 : 8,
                height: isDialog ? 10 : 8,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                border: '2px solid',
                borderColor: 'primary.light',
                flexShrink: 0,
                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)',
              }}
            />
            {index < items.length - 1 && (
              <Box sx={{ width: '2px', flex: 1, bgcolor: 'divider', mt: 0.5 }} />
            )}
          </Box>

          {/* Content */}
          <Box
            onClick={() => handleViewDetails(item)}
            sx={{
              flex: 1,
              cursor: 'pointer',
              p: isDialog ? 1 : 0,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: isDialog ? 'action.hover' : 'transparent',
                '& .title': { color: 'primary.main' },
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 0.5,
                flexWrap: 'wrap',
              }}
            >
              <Typography
                className="title"
                sx={{
                  fontWeight: 600,
                  fontSize: isDialog ? '0.85rem' : '0.8rem',
                  color: 'text.primary',
                  transition: 'color 0.2s',
                }}
              >
                {item.area}
              </Typography>
            </Box>

            {/* Reason */}
            <Box
              sx={{
                mt: 0.5,
                mb: 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                px: 0.8,
                py: 0.3,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            >
              <Typography
                sx={{
                  fontSize: isDialog ? '0.82rem' : '0.76rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  lineHeight: 1.3,
                  letterSpacing: '0.2px',
                }}
              >
                {item.reason}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
              }}
            >
              {item.subDivision && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <LocationOn
                    sx={{ fontSize: isDialog ? 13 : 10, color: 'text.secondary' }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isDialog ? '0.72rem' : '0.7rem',
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {item.subDivision}
                  </Typography>
                </Box>
              )}

              {item.circle && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <LocationOn
                    sx={{ fontSize: isDialog ? 13 : 10, color: 'text.secondary' }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isDialog ? '0.72rem' : '0.7rem',
                      color: 'text.secondary',
                      fontWeight: 500,
                    }}
                  >
                    {item.circle}
                  </Typography>
                </Box>
              )}

              {item.zone && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <LocationOn
                    sx={{ fontSize: isDialog ? 13 : 10, color: 'text.secondary' }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isDialog ? '0.72rem' : '0.7rem',
                      color: 'text.secondary',
                    }}
                  >
                    {item.zone}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  // No-data state
  const renderEmptyState = () => (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 3,
        color: 'text.secondary',
      }}
    >
      <InboxIcon sx={{ fontSize: 40, opacity: 0.4 }} />
      <Typography
        sx={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        No pending installations
      </Typography>
      <Typography
        sx={{
          fontSize: '0.7rem',
          color: 'text.disabled',
          textAlign: 'center',
        }}
      >
        There are no records to display at the moment
      </Typography>
    </Box>
  );

  return (
    <>
      {/* Main Dashboard Card */}
      <Card
        variant="outlined"
        sx={{
          flexDirection: 'column',
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
        <CardContent
          sx={{
            p: 1,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
              mb: 1,
              pb: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: 18, color: 'primary.main' }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Pending Installations
              </Typography>
            </Box>
          </Box>

          {/* List or no-data state */}
          {isDataEmpty ? (
            renderEmptyState()
          ) : (
            <>
              {renderTimelineList(dashboardItems)}

              {remainingCount > 0 && (
                <Box
                  sx={{
                    pt: 1,
                    borderTop: '1px dashed',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    onClick={() => setOpenDialog(true)}
                    sx={{
                      fontSize: '0.7rem',
                      color: 'primary.main',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Click to view all
                  </Typography>
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View All Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
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
            <Schedule sx={{ fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
                All Pending Installations
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', opacity: 0.85 }}>
                {data.length} total records awaiting action
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
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderTimelineList(data, true)}
        </DialogContent>
        <Divider />
      </Dialog>
    </>
  );
};

export default PendingInstallations;