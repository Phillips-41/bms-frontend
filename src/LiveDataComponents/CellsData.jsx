import React, { useContext, useState } from "react";
import { Box, Typography, useTheme, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon
import Pictorial from "./CellsGraph/Pictorial";
import LineGraph from "./CellsGraph/LineGraph";
import CellTable from "./CellsGraph/CellTable";
import FullCellLayout from "./CellsGraph/Fullcelllayout"; // Import the FullCellLayout component
import { tokens } from "../theme";
import { AppContext } from "../services/AppContext";

const CellsData = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data, serialNumber, siteId } = useContext(AppContext);
  const device = data[0];
  const { cellVoltageTemperatureData, bmsAlarmsDTO } = device;
  const [activeView, setActiveView] = useState("Pictorial");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const viewComponents = {
    Pictorial: (
      <Pictorial
        serialNumber={serialNumber}
        siteId={siteId}
      />
    ),
    Graphical: <LineGraph data={cellVoltageTemperatureData} />,
    Tabular: <CellTable data={cellVoltageTemperatureData} />,
  };

  const toggleFullscreen = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
       // height: '100%', // Take full height of parent
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor:colors.primary[100], // Set background here, remove from Grid item
        borderRadius: '4px'
      }}
    >
      {/* Topbar */}
     <Box
        display="flex"
        alignItems="center"
        borderRadius="4px"
        border="1px solid black"
        position="sticky"
        top={0}
        zIndex={10}
        sx={{
          height:"24px",
          p: 0,
          backgroundImage: colors.primary[600],
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          transition: 'background-color 0.3s ease-in-out',
        }}
      >
        {/* Tab Buttons */}
        <Box display="flex" flex={1}>
          {['Pictorial', 'Graphical', 'Tabular'].map((text) => (
            <Box
              key={text}
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => setActiveView(text)}
              sx={{
                flex: 1,
                py: 1,
                cursor: 'pointer',
                borderRadius: 0,
                transition: 'all 0.3s ease-in-out',      
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: activeView === text ? 'bold' : 'bold',
                  color: activeView === text ? "rgb(239 248 10)" : colors.primary[900],
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Fullscreen Button */}
        <IconButton
          color="secondary"
          onClick={toggleFullscreen}
          sx={{
            mx: 1.5,
            '&:hover': {
              backgroundColor: colors.primary[600],
              color: colors.greenAccent[500],
              transform: 'scale(1.1)',
              transition: 'all 0.3s ease-in-out',
            },
          }}
        >
          <FullscreenIcon />
        </IconButton>
      </Box>


      {/* Active View */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'hidden',
        //  height: 'calc(100% - 24px)' // Adjust for topbar height
        }}
      >
        {viewComponents[activeView]}
      </Box>

      {/* Fullscreen Dialog */}
      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="lg" fullWidth>
        <IconButton
          onClick={closeDialog}
          color="secondary"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: colors.redAccent[500],
            borderRadius: '50%',
            padding: '4px',
            '&:hover': {
              backgroundColor: colors.redAccent[700]
            },
            transition: 'background-color 0.3s ease'
          }}
        >
          <CloseIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
        </IconButton>
        <DialogContent sx={{
          padding: '0px !important',
        }}>
          <FullCellLayout serialNumber={serialNumber} siteId={siteId} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CellsData;
