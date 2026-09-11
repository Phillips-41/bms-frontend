
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import {
  DashboardOutlined,
  MonitorOutlined,
  AnalyticsOutlined,
  TimelineOutlined,
  AlarmOutlined,
  CalendarTodayOutlined,
  EventOutlined,
  BugReportOutlined,
  LocationOnOutlined,
  GroupOutlined,
  ExpandLess,
  ExpandMore,
  MenuOutlined,
} from "@mui/icons-material";
import { Link, useLocation, matchPath } from "react-router-dom";
import { getUserPermissions} from "../../utils/ProtectedRoutes";
import "react-pro-sidebar/dist/css/styles.css";

const Item = ({ title, to, icon, selected, setSelected, hasSubmenu, children, isOpen, isVisible }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Skip rendering if item is not visible
  if (!isVisible) {
    return null;
  }

  const isActive = to && matchPath(location.pathname, to);
  const hasActiveChild = children && React.Children.toArray(children).some(
    (child) => child.props.to && matchPath(location.pathname, child.props.to)
  );

  const handleClick = () => {
    if (hasSubmenu) {
      setOpen(!open);
    } else {
      setSelected(title);
    }
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          selected={selected === title || isActive || hasActiveChild}
          onClick={handleClick}
          sx={{
            py: 0.8,
            px: 1.5,
            color: "#ffffff",
            "&.Mui-selected": {
              backgroundColor: "rgba(149, 117, 205, 0.3)",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgba(126, 87, 194, 0.3)",
              },
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
          component={hasSubmenu ? "div" : Link}
          to={hasSubmenu ? undefined : to}
        >
          <ListItemIcon
            sx={{
              minWidth: 32,
              color: selected === title || isActive || hasActiveChild ? "#1976d2" : "#666",
            }}
          >
            {React.cloneElement(icon, { fontSize: "small" })}
          </ListItemIcon>
          {isOpen && (
            <>
              <ListItemText
                primary={title}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: "0.85rem",
                }}
              />
              {hasSubmenu && (open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />)}
            </>
          )}
        </ListItemButton>
      </ListItem>
      {hasSubmenu && isOpen && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {children}
          </List>
        </Collapse>
      )}
    </>
  );
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const token = sessionStorage.getItem("token");

  const permissions = getUserPermissions(token);

  

  // Determine if user is SUPERADMIN


  // Define menu items with their permission keys
  const menuItems = [
    { title: "Dashboard", to: "/", icon: <DashboardOutlined sx={{ color: "#ffff" }} />, permission: "dashboard" },
    { title: "Live Data", to: "/livemonitoring", icon: <MonitorOutlined sx={{ color: "#ffff" }} />, permission: "livemonitoring" },
    {
      title: "Analytics",
      icon: <AnalyticsOutlined sx={{ color: "#ffff" }} />,
      permission: ["historical", "alarms", "daywise", "monthly"],
      hasSubmenu: true,
      children: [
        { title: "RealTimeView", to: "/historical", icon: <TimelineOutlined sx={{ color: "#ffff" }} />, permission: "historical" },
        { title: "Alarm", to: "/alarms", icon: <AlarmOutlined sx={{ color: "#ffff" }} />, permission: "alarms" },
        { title: "DayWise", to: "/daywise", icon: <EventOutlined sx={{ color: "#ffff" }} />, permission: "daywise" },
        { title: "Monthly", to: "/monthly", icon: <CalendarTodayOutlined sx={{ color: "#ffff" }} />, permission: "monthly" },
      ],
    },
    { title: "Issue Tracking", to: "/issuetracking", icon: <BugReportOutlined sx={{ color: "#ffff" }} />, permission: "issuetracking" },
    { title: "Site Details", to: "/siteDetails", icon: <LocationOnOutlined sx={{ color: "#ffff" }} />, permission: "siteDetails" },
    { title: "Users", to: "/users", icon: <GroupOutlined sx={{ color: "#ffff" }} />, permission: "users" },
   // { title: "PacketViewer", to: "/packetviewer", icon: <GroupOutlined sx={{ color: "#ffff" }} />, permission: "packetviewer" },
  ];

  // Set selected item based on current path
  const getSelectedItem = () => {
    const paths = {
      "/": "Dashboard",
      "/livemonitoring": "Live Data",
      "/historical": "RealTimeView",
      "/alarms": "Alarm",
      "/daywise": "DayWise",
      "/monthly": "Monthly",
      "/issuetracking": "Issue Tracking",
      "/siteDetails": "Site Details",
      "/users": "Users",
      "/packetviewer": "PacketViewer",
    };
    return paths[location.pathname] || "Dashboard";
  };

  const [selected, setSelected] = useState(getSelectedItem());

  useEffect(() => {
    setSelected(getSelectedItem());
  }, [location.pathname]);

  const sidebarWidth = isOpen ? 170 : 56;

  // Check if Analytics submenu should be visible
  const hasAnalyticsAccess = permissions.historical || permissions.alarms || permissions.daywise || permissions.monthly;

  return (
    <Box
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        backgroundColor: "#0cbaba",
        backgroundImage: "linear-gradient(315deg, #0cbaba 0%, #380036 74%)",
        borderRight: "1px solid #e0e0e0",
        transition: "width 0.3s ease",
        boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", p: 1, justifyContent: isOpen ? "space-between" : "center" }}>
        {isOpen && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1976d2", fontSize: "1.1rem" }}></Typography>
        )}
        <IconButton onClick={() => setIsOpen(!isOpen)} sx={{ p: 0.5 }}>
          <MenuOutlined sx={{ color: "#ffff", fontSize: "20px" }} />
        </IconButton>
      </Box>
      <Divider />
      <List sx={{ py: 0.5, flex: 1 }}>
        {menuItems.map((item) => {
        
          // For non-SUPERADMIN, check permissions
          const isVisible = item.hasSubmenu
            ? item.permission.some((perm) => permissions[perm])
            : permissions[item.permission];

          return (
            <Item
              key={item.title}
              title={item.title}
              to={item.to}
              icon={item.icon}
              selected={selected}
              setSelected={setSelected}
              isOpen={isOpen}
              hasSubmenu={item.hasSubmenu}
              isVisible={isVisible}
            >
              {item.hasSubmenu &&
                item.children.map((child) => (
                  <Item
                    key={child.title}
                    title={child.title}
                    to={child.to}
                    icon={child.icon}
                    selected={selected}
                    setSelected={setSelected}
                    isOpen={isOpen}
                    isVisible={permissions[child.permission]}
                  />
                ))}
            </Item>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;