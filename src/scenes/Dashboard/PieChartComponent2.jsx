// src/components/PieChartComponent2.jsx
import React, { useState, useContext ,useEffect,useMemo} from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatToTime } from "../../services/AppContext";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TablePagination, Paper, Button, Dialog,
  DialogTitle, DialogContent, DialogActions,useTheme
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { AppContext } from "../../services/AppContext";
import { useNavigate } from "react-router-dom";
import { fetchCommunicationStatus } from '../../services/apiService';
import { CustomLabel, CustomTooltip } from './PieChartComponent';
import { circle } from 'leaflet';
import { tokens } from '../../theme';

const PieChartComponent2 = ({ totolData,data1, handlePieClickCommu,device }) => {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const { siteId,setSiteId, serialNumber,setSerialNumber, handleSearch ,setState,setCircle,setArea,area} = useContext(AppContext);
  const [clickedSection, setClickedSection] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const navigate = useNavigate();
  const [clickedItem, setClickedItem] = useState(null);
  // Constants 
  const CHART_SIZE = 200;
  const CHART_SIZE_W =200
  const OUTER_RADIUS = 75;
  const INNER_RADIUS = 25;
  const TITLE_GRADIENT = 'linear-gradient(90deg, rgb(0, 212, 255) 0%, rgb(9, 9, 121) 35%, rgb(0, 212, 255) 100%)';
  const HEADER_GRADIENT = 'linear-gradient(to bottom, #d82b27, #f09819)';
  const BUTTON_COLOR = 'rgb(216, 43, 39)';
  const BUTTON_HOVER_COLOR = 'rgb(180, 30, 28)';


  const TABLE_HEADERS = [
    "Substation ID", 
    "Serial Number", 
   // "Vendor", 
    "Location",
  //   "Cells Connected",
    // "String Voltage",
    //  "Instantaneous Current", 
    //  "Ambient Temperature", 
    //  "Battery Run Hours",
    //  "Packet Date Time"
  ];

  const TABLE_CELL_STYLE = {
    color: 'black',
    fontWeight: 'bold',
    background: 'linear-gradient(to bottom, rgb(73 196 53), rgb(50 128 63))',
    padding: '3px',
    minWidth: '150px',
    whiteSpace: 'nowrap',
    textAlign: 'center'
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


//   const filteredData = data1.filter((item, index, self) => {
//   const currentSerial = item.generalDataDTO.deviceDataDTO[0].serialNumber;
//   return index === self.findIndex((i) => 
//     i.generalDataDTO.deviceDataDTO[0].serialNumber === currentSerial
//   );
// });


  // Pie chart click handler
  const handleClick = async (data, index) => {
    setClickedSection(data.name);
    setIsDialogOpen(true);

    try {
     // const response = await fetchCommunicationStatus(marginMinutes);
      const filteredData = device
      .filter(item => data.name === 'Communicating' ? !item.isNotCommunicating : item.isNotCommunicating)
      .map(item => ({
        siteId: item?.siteId || '--',
        serialNumber: item?.serialNumber || 'N/A',
        statusType: item?.status  ? 'Communicating' : 'Non-Communicating',
       // vendor: item?.siteLocationDTO?.vendorName || '--',
       location: item?.area || '--',
       // cellsConnectedCount: item?.generalDataDTO?.deviceDataDTO?.[0]?.cellsConnectedCount || 0,
      //  stringVoltage: item?.generalDataDTO?.deviceDataDTO?.[0]?.stringvoltage || 0,
       // instantaneousCurrent: item?.generalDataDTO?.deviceDataDTO?.[0]?.instantaneousCurrent || 0,
       // ambientTemperature: item?.generalDataDTO?.deviceDataDTO?.[0]?.ambientTemperature || 0,
      //  batteryRunHours: item?.generalDataDTO?.deviceDataDTO?.[0]?.batteryRunHours || 0,
      //  state: item?.siteLocationDTO?.state || '--',
      //  circle: item?.siteLocationDTO?.circle || '--',
        // packetDateTime: item?.generalDataDTO?.packetDateTime
        //   ? new Date(item?.generalDataDTO?.packetDateTime).toLocaleString('en-GB', {
        //       day: 'numeric',
        //       month: 'numeric',
        //       year: 'numeric',
        //       hour: 'numeric',
        //       minute: 'numeric',
        //       second: 'numeric',
        //       hour12: false
        //     })
        //   : 'No time available'
      }));
      setTableData(filteredData);
    } catch (error) {
      console.error("Error processing data:", error);
      setTableData([]);
    }

    handlePieClickCommu?.(data, index);
  };
useEffect(() => {
    let mounted = true;

    const performSearchAndNavigate = async () => {
      if (mounted) {
        const result = await handleSearch();
        if (result) {
          navigate("/livemonitoring", { state: { from: "/" } });
        }
      }
    };

    if (clickedItem && siteId === clickedItem.siteId && serialNumber === clickedItem.serialNumber) {
      performSearchAndNavigate();
      setClickedItem(null);
    }

    return () => {
      mounted = false;
    };
  }, [siteId, serialNumber, handleSearch, navigate, clickedItem]);
  // Row click handler
  // const handleRowClick = async (item) => {
  //   setSiteId(item.siteId);
  //   setSerialNumber(item.serialNumber);
  //   setState(item.state);
  //   setCircle(item.circle);
  //   const data = await handleSearch();
  //   if (data) navigate("/livemonitoring", { state: { from: '/' } });
  // };

  const handleRowClick = (item) => {
      setSiteId(item.siteId);
      setSerialNumber(item.serialNumber);
   //   setState(item.state);
    //  setCircle(item.circle);
      setArea(item.location)
      setClickedItem(item);
    };

  const handleCloseDialog = () => setIsDialogOpen(false);

  const renderDialog = () => (
   <Dialog
  open={isDialogOpen}
  onClose={handleCloseDialog}
  maxWidth="lg"
  fullWidth
  sx={{
    '& .MuiPaper-root': {
      bgcolor: colors.primary[100], // ✅ Correct syntax
    },
  }}
>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: TITLE_GRADIENT, color: 'white', borderRadius: '4px', padding: '10px' }}>
          <Typography variant="h6">{clickedSection} Devices</Typography>
        </Box>
      </DialogTitle>
      <DialogContent> 
        <TableContainer component={Paper}
        sx={{
          height: "400px", // Fixed height for the entire table
          overflow: "auto", // Enable horizontal scrolling if needed
          display: "flex",
          flexDirection: "column", // Stack header, body, and footer vertically
          border: "0.5px solid #75767B",
          borderRadius: "8px",
          background:"#191C24"
        }}
        >
          <Table sx={{ tableLayout: "fixed", minWidth: "100%" }}>
            <TableHead sx={{ 
              position: "sticky", // Fix header at the top
              top: 0,
              zIndex: 1,
            }}>
              <TableRow>
                {TABLE_HEADERS.map((header, index) => (
                  <TableCell key={index} sx={TABLE_CELL_STYLE}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody  sx={{ 
              flex: 1,
              overflowY: "auto",
            }}>
              {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index}>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" ,color:"white", border: colors.primary[300] }}>
                    <span
                      style={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer",
                        padding: "3px",
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                       // border: "0.5px solid rgba(255, 255, 255, 0.25)"
                      }}
                      title="tap here"
                      onClick={() => handleRowClick(row)}
                    >
                      {row.siteId}
                    </span>
                  </TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" ,color: colors.primary[200], border: colors.primary[300]}}>{row.serialNumber}</TableCell>
                  {/* <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center",color: colors.primary[200] ,border: colors.primary[300]}}>{row.vendor}</TableCell> */}
                  <TableCell style={{ padding: "3px", fontWeight: "bold",maxWidth: "150px", textAlign: "center" ,color: colors.primary[200],border: colors.primary[300]}}>{row.location}</TableCell>
                  {/* <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" ,color: colors.primary[200],border: colors.primary[300]}}>{row.cellsConnectedCount}</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center",color: colors.primary[200],border: colors.primary[300]}}>{row.stringVoltage} V</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" ,color: colors.primary[200],border: colors.primary[300]}}>{row.instantaneousCurrent} A</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center",color: colors.primary[200],border: colors.primary[300]}}>{row.ambientTemperature} °C</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center" ,color: colors.primary[200],border: colors.primary[300]}}>{formatToTime(row.batteryRunHours)}</TableCell>
                  <TableCell style={{ padding: "3px", fontWeight: "bold", whiteSpace: "nowrap", textAlign: "center",color: colors.primary[200],border: colors.primary[300]}}>{row.packetDateTime}</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
           borderTop: "0.5px solid rgba(255, 255, 255, 0.25)",
  bgcolor: colors.primary[100],
  color: colors.primary[200],
  position: "sticky",
  bottom: 0,
  zIndex: 1,
  flexShrink: 0 // Prevent pagination from shrinking
          }}
        />
        </TableContainer>
      
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleCloseDialog}
          sx={{ backgroundColor: BUTTON_COLOR, color: 'white', '&:hover': { backgroundColor: BUTTON_HOVER_COLOR } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
//     const [windowSize, setWindowSize] = useState({
//     width: window.innerWidth,
//     height: window.innerHeight,
//   });
//   useEffect(() => {
//   const handleResize = () => {
//     setWindowSize({
//       width: window.innerWidth,
//       height: window.innerHeight,
//     });
//   };

//   window.addEventListener('resize', handleResize);
//   return () => window.removeEventListener('resize', handleResize);
// }, []);

//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const isTablet = useMediaQuery(theme.breakpoints.between('lg','xl'));
//   const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

//   const { chartSize, chartSizew,innerRadius, outerRadius} = useMemo(() => {
//     if (isMobile) {
//       return { chartSize: 200, chartSizew: 200, innerRadius: 20,outerRadius:65};
//     }
//     if (isTablet) {
//       console.log("lg tablet")
//       return { chartSize: 250, chartSizew: 300, innerRadius: 30,outerRadius:120 };
//     }
//     if (isDesktop) {
//       return { chartSize: 295, chartSizew: 300, innerRadius: 35,outerRadius:120};
//     }
//     return { chartSize: 200, chartSizew: 200, innerRadius: 20,outerRadius:65 };
//   }, [isMobile, isTablet, isDesktop, windowSize.width]);

  const isXs = useMediaQuery(theme.breakpoints.down('sm')); // < 600px
  const isSm = useMediaQuery(theme.breakpoints.between('sm', 'md')); // 600px - 900px
  const isMd = useMediaQuery(theme.breakpoints.between('md', 'lg')); // 900px - 1200px
  const isLg = useMediaQuery(theme.breakpoints.between('lg', 'xl')); // 1200px - 1536px
  const isXl = useMediaQuery(theme.breakpoints.up('xl')); // ≥ 1536px


 // 1. Keep your media query hooks

// 2. Define the variables using let with their fallback/default values
let chartSize = 150;
let chartSizew = 180;
let innerRadius = 60;
let outerRadius = 70;

// 3. Assign sizes dynamically based on the active breakpoint
if (isXs) {
  chartSize = 120;
  chartSizew = 120;
  innerRadius = 40;
  outerRadius = 50;
} else if (isSm) {
  chartSize = 150;
  chartSizew = 150;
  innerRadius = 15;
  outerRadius = 40;
} else if (isMd) {
  chartSize = 160;
  chartSizew = 160;
  innerRadius = 15;
  outerRadius = 45;
} else if (isLg) {
  chartSize = 180;
  chartSizew = 190;
  innerRadius = 15;
  outerRadius = 55;
} else if (isXl) {
  chartSize = 250;
  chartSizew = 290;
  innerRadius = 20;
  outerRadius = 80;
}

// 4. Delete the entire useState declarations and useEffect block completely!


  return (
    <Box
      border={1}
      // borderColor="#FFFF00"
      borderRadius={2}
      bgcolor={colors.primary[100]} // ✅ Background color
      color={colors.primary[200]}   // ✅ Text color (same as background)
      // padding="1px 20px 15px 18px"
      boxShadow={3}
      display="flex"
      flexDirection="column"
      //marginRight={10}
      alignItems="center"
      sx={{
        padding: {
          xs: '1px 10px 10px 10px',
          sm: '1px 15px 12px 15px',
          md: '1px 10px 10px 10px',
          lg: '1px 10px 1px 10px',
          xl: '1px 10px 10px 10px',
        },
        height: {
          xs: '180px',
          sm: '165px',
          md: '165px',
          lg: '230px',
          // lg:'160px',
          xl: '280px',
        },
        width: {
          xs: '280px',
          sm: '300px',
          md: '190px',
        // lg: '260px',
          lg: '530px',
          // xl: '330px',
          xl: '670px',
        },
      }}
    >
      <Typography
      variant="h5"
      sx={{
        fontWeight: {
          xs: 600, // Slightly lighter for mobile
          sm: 700, // Standard bold for tablets
          md: 700,
          lg: 700,
        },
        fontSize: {
          xs: '1rem', // Mobile (smaller than h5 default)
          sm: '1rem', // Small tablets
          md: '1rem', // Medium screens (closer to h5 default)
          lg: '1.0rem', // Large screens (slightly larger)
          xl: '1.3rem'
        },
        mb: {
          xs: 0.5, // Smaller margin-bottom for mobile
          sm: 0.75,
          md: 1,
          lg: 0, // Default gutterBottom spacing
          xl: 0.1,
        },
        lineHeight: 1.2, // Consistent line height for readability
      }}
    >
      Device Status
      </Typography>
      <Box 
        display="flex"
        justifyContent="center"
        alignItems="center"
        mt={{ xs: -1, sm: -2, md: -3, lg: -3 }} // Responsive top margin
        sx={{
          flexDirection: "column", // Stack vertically on mobile
          gap: { xs: 1, sm: '1px', md: 0, lg: "0px" }, // Responsive gap between chart and legend
        // width: '100%',
        // maxWidth: { xs: '100%', sm: '600px', md: '500px', lg: '1200px' }, // Responsive container width
          mx: 'auto',
        }}
        >
          <PieChart width={chartSizew} height={chartSize}>
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0, 0, 0, 0.7)" />
              </filter>
              <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0d900b" />
                <stop offset="50%" stopColor="#02DEB2" />
                <stop offset="100%" stopColor="#62B816" />
              </linearGradient>
              <linearGradient id="notcommuGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e41c38" />
                <stop offset="100%" stopColor="#F71735" />
              </linearGradient>
            </defs>
            <Pie
              data={data1}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              paddingAngle={5}
              cornerRadius={5}
              outerRadius={outerRadius}
              label={({ name, value, cx, cy, midAngle, outerRadius }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 20; // Adjust label position
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    // Calculate font size based on chartSize
                    const fontSize = chartSize * 0.06; // Adjust multiplier (e.g., 0.04) for desired scaling
                    return (
                      <text
                          x={x}
                          y={y}
                          fill={colors.primary[200]} // ✅ Proper JSX curly braces
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                          style={{ fontSize: `${fontSize}px`, fontWeight: "bold" }}
                        >

                        {value}
                      </text>
                  );
              }}
              labelLine={true}
              onClick={handleClick}
              style={{ filter: 'url(#shadow)' }}
            >
              {data1.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? 'url(#greenGradient)' : 'url(#notcommuGradient)'} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip/>} />
          </PieChart>

          <Box
            ml={2}
            display="flex"
            flexDirection="row"
            justifyContent="center"
            sx={{
              // width: '100%',
              maxWidth: { xs: '100%', sm: '300px', md: '250px', lg: '400px' }, // Responsive width
            }}
          >
              {data1.map((entry, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  mb={{ xs: 0.5, sm: 0.75, md: 0.5, lg: 0 }} // Responsive margin-bottom
                  pr={1}
                >
                  <Box
                    width={{ xs: 8, sm: 9, md: 10, lg: 13 }} // Responsive circle size
                    height={{ xs: 8, sm: 9, md: 10, lg: 13 }}
                    borderRadius="50%"
                  //  mr={{ xs: 0.5, sm: 0.75, md: 1, lg}} // Responsive margin-right
                    sx={{
                      background: `linear-gradient(to right, ${
                        index === 0 ? '#0d900b, #02DEB2, #62B816' : '#b5e41c", #71f717'
                      })`,
                    }}
                  />
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                      
                        fontSize: {
                          xs: '0.75rem', // Mobile
                          sm: '0.65rem', // Small tablets
                          md: '0.55rem', // Medium screens
                          lg: '0.7rem', // Large screens
                          xl: '0.9rem'
                        },
                      }}
                    >
                      {entry.name}
                    </Typography>
                  </Box>
              ))}
          </Box>
      </Box>

      {renderDialog()}
    </Box>
  );
};

export default PieChartComponent2;