import React from "react";
import { Box, Typography, Grid, useTheme, useMediaQuery } from "@mui/material";
import { AlertTriangle } from 'lucide-react';
import { tokens } from "../theme";

const FullAlertLayout = ({ serialNumber, siteId, alerts }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isLg = useMediaQuery(theme.breakpoints.down('xl'));

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case "high":
        return { backgroundColor: "rgb(255, 0, 0)", color: "#ffff" };
      case "medium":
        return { backgroundColor: "green", color: "#ffff" };
      case "low":
        return { backgroundColor: "rgb(255, 0, 0)", color: "#ffff" };
      default:
        return { backgroundColor: "#ECEFF1", color: "#455A64" };
    }
  };

  const getSeverityStyles1 = (severity) => {
    switch (severity) {
      case "high":
        return { backgroundColor: "#ffff", color: "rgb(183, 28, 28)" };
      case "medium":
        return { backgroundColor: "#ffff", color: "rgb(27, 94, 32)" };
      case "low":
        return { backgroundColor: "#ffff", color: "rgb(183, 28, 28)" };
      default:
        return { backgroundColor: "#ECEFF1", color: "#455A64" };
    }
  };

  return (
    <Box
      sx={{
        bgcolor: colors.primary[100],
        p: 2,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        // display="flex"
        // alignItems="center"
        // borderRadius="4px"
        
       
        top={0}
        zIndex={10}
        // sx={{
        //   height: "24px",
        //   p: 0,
        // //   bgcolor: "#191C24",
        // //   boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
        //   transition: 'background-color 0.3s ease-in-out',
        //   width: "100%",
        // }}
      >
        <Typography
  sx={{
    flex: 1,
    color: colors.primary[200],
    padding: isLg ? '0.5px 8px' : '2px 16px',
    fontSize: isLg ? '1rem' : '1.25rem',
    fontWeight: 'bold',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  }}
>
  <strong>Alarms Info</strong>
</Typography>
      </Box>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        gap={1.5}
        sx={{ padding: "0px 0px 0px 0px", width: "100%", flexWrap: "wrap" }}
      >
        {alerts.map((alert) => (
          <Grid item xs={12} sm={6} md={4} lg={2.2} xl={2.3} key={alert.id}>
            <Box
              sx={{
                borderRadius: 8,
                boxShadow: "0 1px 2px rgba(218, 218, 143, 0.66)",
                cursor: "pointer",
                minWidth: isLg ? 74 : 80,
                minHeight: 43,
                display: "flex",
                flexDirection: "row",
                overflow: "hidden",
                border: "1px solid rgba(218, 218, 143, 0.66)",
                '&:hover': {
                  transform: "scale(1.03)",
                },
              }}
            >
              <Box
                sx={{
                  width: "30%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0.5,
                  ...getSeverityStyles1(alert.severity),
                  backgroundColor: "#ffff",
                }}
              >
                <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {alert.IconComponent ? (
                    <alert.IconComponent style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <>
                      {alert.severity === "high" && (
                        <AlertTriangle size={20} style={{ color: "#B71C1C", width: '100%', height: '100%' }} />
                      )}
                      {alert.severity === "medium" && (
                        <AlertTriangle size={20} style={{ color: "#F57F17", width: '100%', height: '100%' }} />
                      )}
                      {alert.severity === "low" && (
                        <AlertTriangle size={20} style={{ color: "#0D47A1", width: '100%', height: '100%' }} />
                      )}
                    </>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  width: "70%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  ...getSeverityStyles(alert.severity),
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: isLg ? 8 : 10,
                    fontWeight: "bold",
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {alert.details} {alert.status}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FullAlertLayout;