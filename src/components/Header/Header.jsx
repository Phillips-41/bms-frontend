import React, { useState,useContext } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,Divider,useTheme
} from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BMS from "../../assets/images/jpeg/26316.jpg"; // Importing the image
import mseb from "../../assets/images/MSEDCLlogo-removebg-preview.png"
import { AppContext } from '../../services/AppContext';
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useNavigate } from "react-router-dom"; 
import login from "../../assets/images/png/vajra.png";

import { getUsername } from '../../utils/ProtectedRoutes';
import { ColorModeContext, tokens } from '../../theme';
const Header = () => {
  const { handleLogout } = useContext(AppContext); // Use AppContext for logout
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const token = sessionStorage.getItem("token");
  const username = getUsername(token);
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleMenuClose();
    handleLogout(navigate); 
  };

  return (
   <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'linear-gradient(315deg, #0cbaba 0%, #380036 74%)', // Matches sidebar gradient
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '10px 20px',
    position: 'relative',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Slightly stronger shadow to match sidebar
    height: '64px', // Standard height that matches Material-UI AppBar
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Subtle divider
  }}
>
  {/* Logo Section (Left) */}
  <Box sx={{ 
    flexShrink: 0, 
    display: 'flex', 
    alignItems: 'center',
    gap: '20px'
  }}>
    <img 
      src={login} 
      width={120} 
      alt="Login Logo" 
  //    style={{ filter: 'brightness(0) invert(1)' }} // Makes logo white
    />
    <Divider 
      orientation="vertical" 
      flexItem 
      sx={{ 
        backgroundColor: 'rgba(255,255,255,0.3)', 
        height: '70px' 
      }} 
    />
    {/* <img 
      src={mseb}  
      alt="BMS Logo" 
      style={{ 
        height: 80,
        width: 100,
       // filter: 'brightness(0) invert(1)' // Makes logo white
      }} 
    /> */}
  </Box>

  {/* Title Section (Center) */}
  <Typography
    component="h1"
    sx={{
      flexGrow: 1,
      textAlign: 'center',
      fontSize: { xs: '16px', md: '20px',lg:'16px' },
      fontWeight: 'bold',
      color: '#fff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      px: 2,
    }}
  >
    IoT Based Remote Battery Monitoring System & Battery Charger Monitoring System
  </Typography>
<img 
      src={mseb}  
      alt="BMS Logo" 
      style={{ 
        height: 80,
        width: 100,
        marginRight: '50px',
       // filter: 'brightness(0) invert(1)' // Makes logo white
      }} 
    />
  {/* User Section (Right) */}
  <Box
    sx={{
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}
  >
     <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
    <Tooltip title="Sign Out" arrow>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '5px 12px',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
          transition: 'all 0.3s ease', // Matches sidebar transition
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: '#fff',
          }}
        >
          <AccountCircleIcon />
        </Avatar>
        <Typography
          sx={{
            color: '#fff',
            fontWeight: '500',
            fontSize: '14px',
            textTransform: 'capitalize',
          }}
        >
          {username}
        </Typography>
      </IconButton>
    </Tooltip>

    {/* Dropdown Menu */}
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: {
          mt: 1,
          backgroundColor: '#380036', // Matches sidebar dark color
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          minWidth: '200px',
        },
      }}
    >
      <MenuItem
        onClick={handleSignOut}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'rgba(12, 186, 186, 0.3)', // Matches sidebar teal
          },
        }}
      >
        <PowerSettingsNewIcon fontSize="small" />
        <Typography>Sign Out</Typography>
      </MenuItem>
    </Menu>
  </Box>
</Box>
  );
};
export default Header;
