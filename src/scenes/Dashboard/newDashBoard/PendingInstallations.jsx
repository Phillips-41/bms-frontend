import { useState } from 'react';
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
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        pl: { xs: 0.5, sm: 1 },
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
          sx={{
            display: 'flex',
            gap: { xs: 1, sm: 1.5 },
            position: 'relative',
            pb: { xs: 0.75, sm: 0.5 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              pt: isDialog ? { xs: 1, sm: 1.5 } : { xs: 0.5, sm: 0.5 },
            }}
          >
            <Box
              sx={{
                width: isDialog ? { xs: 9, sm: 10 } : { xs: 8, sm: 8 },
                height: isDialog ? { xs: 9, sm: 10 } : { xs: 8, sm: 8 },
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

          <Box
            onClick={() => handleViewDetails(item)}
            sx={{
              flex: 1,
              cursor: 'pointer',
              p: isDialog ? { xs: 0.75, sm: 1 } : 0,
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
                  fontSize: isDialog
                    ? { xs: '0.8rem', sm: '0.85rem' }
                    : { xs: '0.75rem', sm: '0.8rem' },
                  color: 'text.primary',
                  transition: 'color 0.2s',
                }}
              >
                {item.area}
              </Typography>
            </Box>

            <Box
              sx={{
                mt: 0.5,
                mb: 0.5,
                display: 'inline-flex',
                alignItems: 'center',
                px: { xs: 0.7, sm: 0.8 },
                py: { xs: 0.25, sm: 0.3 },
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'action.hover',
              }}
            >
              <Typography
                sx={{
                  fontSize: isDialog
                    ? { xs: '0.75rem', sm: '0.82rem' }
                    : { xs: '0.7rem', sm: '0.76rem' },
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
                gap: { xs: 1, sm: 1.5 },
                flexWrap: 'wrap',
              }}
            >
              {item.subDivision && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                  <LocationOn
                    sx={{
                      fontSize: isDialog ? { xs: 12, sm: 13 } : { xs: 11, sm: 10 },
                      color: 'text.secondary',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isDialog
                        ? { xs: '0.68rem', sm: '0.72rem' }
                        : { xs: '0.65rem', sm: '0.7rem' },
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
                    sx={{
                      fontSize: isDialog ? { xs: 12, sm: 13 } : { xs: 11, sm: 10 },
                      color: 'text.secondary',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isDialog
                        ? { xs: '0.68rem', sm: '0.72rem' }
                        : { xs: '0.65rem', sm: '0.7rem' },
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
                    sx={{
                      fontSize: isDialog ? { xs: 12, sm: 13 } : { xs: 11, sm: 10 },
                      color: 'text.secondary',
                    }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: isDialog
                        ? { xs: '0.68rem', sm: '0.72rem' }
                        : { xs: '0.65rem', sm: '0.7rem' },
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

  const renderEmptyState = () => (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: { xs: 2.5, sm: 3 },
        color: 'text.secondary',
      }}
    >
      <InboxIcon sx={{ fontSize: { xs: 36, sm: 40 }, opacity: 0.4 }} />
      <Typography
        sx={{
          fontSize: { xs: '0.75rem', sm: '0.8rem' },
          fontWeight: 600,
          color: 'text.secondary',
        }}
      >
        No pending installations
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '0.65rem', sm: '0.7rem' },
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
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: { xs: 1.5, sm: 2 },
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent
          sx={{
            p: { xs: 1, sm: 1 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            '&:last-child': { pb: { xs: 1, sm: 1 } },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid',
              borderColor: 'divider',
              mb: { xs: 0.75, sm: 1 },
              pb: { xs: 0.75, sm: 1 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: { xs: 16, sm: 18 }, color: 'primary.main' }} />
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Pending Installations
              </Typography>
            </Box>
          </Box>

          {isDataEmpty ? (
            renderEmptyState()
          ) : (
            <>
              {renderTimelineList(dashboardItems)}

              {remainingCount > 0 && (
                <Box
                  sx={{
                    pt: { xs: 0.75, sm: 1 },
                    borderTop: '1px dashed',
                    borderColor: 'divider',
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    onClick={() => setOpenDialog(true)}
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.7rem' },
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

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
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
            <Schedule sx={{ fontSize: { xs: 18, sm: 20 } }} />
            <Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  lineHeight: 1.2,
                }}
              >
                All Pending Installations
              </Typography>
              <Typography sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' }, opacity: 0.85 }}>
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
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.5, sm: 2 },
            maxHeight: { xs: '70vh', sm: '65vh' },
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
