// import { Box, TextField, Autocomplete,Tooltip, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { AppContext } from "../../../services/AppContext";
// import {
//   fetchStatesDetails,
//   fetchAllSiteIds,
//   fetchAreasDetails,
//   fetchMapBySite,
//   fetchMapByState,
//   fetchMapByCircle,
//   fetchMapByArea,
//   fetchCommunicationStatus,
//   fetchMapByZone,
//   fetchCommunicationDevices,
//   fetchMapByDivision,
// } from "../../../services/apiService";
// import clear from '../../../assets/images/png/brush.png';

// import useMediaQuery from '@mui/material/useMediaQuery';
// import { Button } from '@mui/material';
// import { tokens } from "../../../theme";
// import { getUsername } from "../../../utils/ProtectedRoutes";
// import { set } from "lodash";
// const DashBoardBar = ({totalData,setmarkers,updateMapMarkers, filters = {}, onFilterChange,}) => {
//   const {
//     // serialNumberOptions,
//     // siteId,
//     // serialNumber,
//     // setSiteId,
//     // setSerialNumber,
//      stateOptions,siteOptions, setSiteOptions
//   } = useContext(AppContext);

//   const DEFAULT_STATE = "Maharastra";

//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   const[zoneOptions,setZoneOptions]=useState([]);
//   const [circleOptions, setCircleOptions] = useState([]);
//   const[divisionOptions,setDivisionOptions]=useState([]);
//   const[division,setDivision]=useState("");
//   const [areaOptions, setAreaOptions] = useState([]);
//   const [state, setState] = useState(DEFAULT_STATE);
//   const[zone,setZone]=useState(filters.zone || "");
//   const [circle, setCircle] = useState(filters.circle || "");
//   const [area, setArea] = useState("");
//   const [siteId, setSiteId] = useState("");
//   const [serialNumber, setSerialNumber] = useState("");
//   const [serialNumberOptions, setSerialNumberOptions] = useState([]);
//   const [errorDialogOpen, setErrorDialogOpen] = useState(false);
//   // const [siteOptions, setSiteOptions] = useState([]);

//   // Function to fetch initial/default data and set map markers
//   const fetchInitialData =async () => {
//     try {
//       // const marginMinutes = 60; // Adjust this value as needed
//       // const commStatusData = await fetchCommunicationDevices(marginMinutes);
//       // const markers = [];
//       //    if(commStatusData || Array.isArray(commStatusData)){
//       //     commStatusData.forEach((item) => {
//       //     markers.push({
//       //                 lat: item.latitude,
//       //                 lng: item.longitude,
//       //                 name: item.area || "Unnamed Site",
//       //                 vendor: item.vendorName || "",
//       //                 statusType: item.status? 1:0,
//       //                 siteId : item.siteId,
//       //                 serialNumber : item.serialNumber,
//       //               });
//       //             });
//       //     setmarkers(markers);
//       //           }

//       // if (totolData && totolData.length > 0) {
//       //   totolData.forEach((item) => {
//       //     if (item.siteLocationDTO) {
//       //       const { latitude, longitude, area, vendorName, siteId } = item.siteLocationDTO;
//       //       if (latitude && longitude) {
//       //         let serialNumber = null;

//       //         // Check if deviceDataDTO exists and is an array
//       //         if (
//       //           item.generalDataDTO &&
//       //           item.generalDataDTO.deviceDataDTO &&
//       //           item.generalDataDTO.deviceDataDTO.length > 0
//       //         ) {
//       //           serialNumber = item.generalDataDTO.deviceDataDTO[0].serialNumber; // Get the first device's serial number
//       //         }

//       //         markers.push({
//       //           lat: latitude,
//       //           lng: longitude,
//       //           name: area || "Unnamed Site",
//       //           vendor: vendorName,
//       //           statusType: item.statusType,
//       //           siteId: siteId,
//       //           serialNumber: serialNumber || "N/A", // Default to "N/A" if no serial number is found
//       //         });
//       //       }
//       //     }
//       //   });
//       // }

//       // setmarkers(markers.length > 0 ? markers : []);

//       updateMapMarkers(totalData); // Call the function to update map markers with the default data

      
//     } catch (error) {
//       console.error("Error fetching initial communication status:", error);
//       setmarkers([]);
//     }
//   };

//   const loadZoneOptions = async () => {
//     try {
//       const token = sessionStorage.getItem('token');
//       const mapData = await fetchMapByState(DEFAULT_STATE, getUsername(token));
//       const zones = (mapData || []).map((site) => site.zone).filter(Boolean);
//       setZoneOptions([...new Set(zones)]);
//     } catch (err) {
//       console.error('Failed to load zones', err);
//     }
//   };

//   useEffect(() => {
//     loadZoneOptions();
//   }, []);


//   // Updated clearOptions to reset filters and fetch default data
//   const clearOptions = async () => {
//     setSiteId('');
//     setSerialNumber('');
//     setState(DEFAULT_STATE);
//     setZone('');
//     setCircle('');
//     setDivision('');
//     setArea('');
//     setCircleOptions([]);
//     setDivisionOptions([]);
//     setAreaOptions([]);
//     setSiteOptions([]);
//     onFilterChange?.('clear');
//     await loadZoneOptions();
//   };

//   useEffect(() => {
//     setState(DEFAULT_STATE);      
//     setZone(filters.zone || "");
//     setCircle(filters.circle || "");
//   }, [filters.zone, filters.circle]);

//  // Fetch states and initial data on component mount
//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setSiteId("");
//   //       setSerialNumber("");
//   //     } catch (error) {
//   //       console.error("Error fetching data:", error);
//   //     }
//   //   };

//   //   fetchData();
//   // }, []);


// //  useEffect(() => {
// //   const fetchData = async () => {
// //     if (state === "" || circle === "") {
// //       setSiteId("");
// //       setSerialNumber("");
// //       await fetchInitialData();
// //     }
// //   };

// //   fetchData();
// // }, [state, circle, area]); // Add fetchInitialData if it's not memoized

//   // Handle state selection
//   const handleStateChange = async (event, newValue) => {
//     setZoneOptions([]);
//     setCircleOptions([]);
//     setSiteOptions([]);
//     setSiteId("")
//     setZone("")
//     setSerialNumber("")
//     setCircle("");
//     setState(newValue);
//     onFilterChange?.("state", newValue);
//     try {
//       const token = sessionStorage.getItem("token");
//       const mapData = await fetchMapByState(newValue,getUsername(token));
//       const zone = mapData.map((site) => site.zone);
//       const uniqueZones = [...new Set(zone)];
//       setZoneOptions(uniqueZones);
//       if (mapData && mapData.length > 0) {
//         const updatedMarkers = mapData
//           .filter((site) => site.latitude && site.longitude)
//           .map((site) => ({
//             lat: site.latitude,
//             lng: site.longitude,
//             name: site.area || "Unnamed site",
//             vendor: site.vendorName,
//             statusType: site.statusType,
//             siteId: site.siteId,
//             serialNumber: site.serialNumber || "N/A",
//           }));
//         if (updatedMarkers.length > 0) {
//           setmarkers(updatedMarkers);
//         } else {
//           setmarkers([]);
//         }
//       } else {
//         console.log("No map data found for the selected state.");
//         setmarkers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching map data for state: ", error);
//       if (error.response && error.response.status === 500) {
//         setErrorDialogOpen(true);
//         setmarkers([]);
//       }
//     }
//   };

//   const handleZoneChange = async (event, newValue) => {
//     setCircleOptions([]);
//     setDivisionOptions([]);
//     setSiteOptions?.([]);
//     setSiteId('');
//     setSerialNumber('');
//     setCircle('');
//     setDivision('');
//     setArea('');
//     setZone(newValue);
//     onFilterChange?.('zone', newValue);
//     try {
//       const token = sessionStorage.getItem('token');
//       const mapData = await fetchMapByZone(newValue, getUsername(token));
//       const circles = (mapData || []).map((s) => s.circle).filter(Boolean);
//       setCircleOptions([...new Set(circles)]);
//       if (mapData && mapData.length > 0) {
//         const updatedMarkers = mapData
//           .filter((site) => site.latitude && site.longitude)
//           .map((site) => ({
//             lat: site.latitude,
//             lng: site.longitude,
//             name: site.area || "Unnamed site",
//             vendor: site.vendorName,
//             statusType: site.statusType,
//             siteId: site.siteId,
//             serialNumber: site.serialNumber || "N/A",
//           }));
//         if (updatedMarkers.length > 0) {
//           setmarkers(updatedMarkers);
//         } else {
//           setmarkers([]);
//         }
//       } else {
//         console.log("No map data found for the selected state.");
//         setmarkers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching map data for state: ", error);
//       if (error.response && error.response.status === 500) {
//         setErrorDialogOpen(true);
//         setmarkers([]);
//       }
//     }

//   }

//   // Handle circle selection
//   const handleCircleChange = async (event, newValue) => {
//     setSiteOptions([]);
//     setSiteId("")
//     setDivision("");
//     setArea("");
//     setSerialNumber("")
//     setCircle(newValue);
//     onFilterChange?.('circle', newValue);
//     try {
//       const mapData = await fetchMapByCircle(newValue);
//       const division = mapData.map((site) => site.divison);
//       const uniqueDivision = [...new Set(division)];
//       setDivisionOptions(uniqueDivision);
//      // setSiteOptions(mapData);
//       if (mapData && mapData.length > 0) {
//         const updatedMarkers = mapData
//           .filter((site) => site.latitude && site.longitude)
//           .map((site) => ({
//             lat: site.latitude,
//             lng: site.longitude,
//             name: site.area || "Unnamed site",
//             vendor: site.vendorName,
//             statusType: site.statusType,
//             siteId: site.siteId,
//             serialNumber: site.serialNumber || "N/A",
//           }));
//         if (updatedMarkers.length > 0) {
//           setmarkers(updatedMarkers);
//         } else {
//           setmarkers([]);
//         }
//       } else {
//         console.log("No map data found for the selected circle.");
//         setmarkers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching map data for circle: ", error);
//       if (error.response && error.response.status === 500) {
//         setErrorDialogOpen(true);
//         setmarkers([]);
//       }
//     }
//   };

//    const handleDivisionChange = async (event, newValue) => {
//     setSiteOptions([]);
//     setSiteId("");
//     setSerialNumber("")
//     setArea('');
//     setDivision(newValue);
//     onFilterChange?.('division', newValue);
//     try {
//       const mapData = await fetchMapByDivision(newValue);
//       setSiteOptions(mapData);
//       if (mapData && mapData.length > 0) {
//         const updatedMarkers = mapData
//           .filter((site) => site.latitude && site.longitude)
//           .map((site) => ({
//             lat: site.latitude,
//             lng: site.longitude,
//             name: site.area || "Unnamed site",
//             vendor: site.vendorName,
//             statusType: site.statusType,
//             siteId: site.siteId,
//             serialNumber: site.serialNumber || "N/A",
//           }));
//         if (updatedMarkers.length > 0) {
//           setmarkers(updatedMarkers);
//         } else {
//           setmarkers([]);
//         }
//       } else {
//         console.log("No map data found for the selected circle.");
//         setmarkers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching map data for circle: ", error);
//       if (error.response && error.response.status === 500) {
//         setErrorDialogOpen(true);
//         setmarkers([]);
//       }
//     }
//   };

//   const handleAreaChange= async(newValue)=>{
//      try {
//             setArea(newValue);
//             onFilterChange?.('area', newValue);
            
//               const mapData = await fetchMapByArea(newValue);
//               if (mapData) {
//                 const { latitude, longitude, area, vendorName, statusType, serialNumber,siteId } = mapData;
//                 if (latitude && longitude) {
//                   const updatedMarkers = [
//                     {
//                       lat: latitude,
//                       lng: longitude,
//                       name: area || 'Unnamed site',
//                       vendor: vendorName,
//                       statusType: statusType,
//                       siteId: siteId,
//                       serialNumber: serialNumber || 'N/A',
//                     },
//                   ];
//                   setmarkers(updatedMarkers);
//                 } else {
//                   setmarkers([]);
//                 }
//               } else {
//                 setmarkers([]);
//               }
//             } 
//             catch (error) {
//               console.error('Error fetching map data: ', error);
//               if (error.response && error.response.status === 500) {
//                 setErrorDialogOpen(true);
//                 setmarkers([]);
//               }
//             }
//   }


//   const muiTheme = useTheme();
//   const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm')); // Detect screens smaller than 600px

//   const renderHighlightedOption = (props, option, value) => {
//     // Destructure key from props and create a new object without it
//     const { key, ...otherProps } = props;
    
//     return (
//       <li
//         key={key}
//         {...otherProps}
//         style={{
//           backgroundColor: value === option ? "#d82b27" : "inherit",
//           color: value === option ? "#ffffff" : "inherit",
//         }}
//       >
//         {option}
//       </li>
//     );
//   };

//   return (
//    <Box
//       display="grid"
//       gridTemplateColumns={isMobile ? '1fr' : 'repeat(2, 1fr)'}
//       gap={1.5}
//       sx={{ width: '100%', maxWidth: isMobile ? '100%' : '800px', pb: 1 ,pt:{ xs: 1, sm: 1,  md: 1, lg:0 ,xl:1}}}
//     >
//       <Box
//         display="grid"
//         gridTemplateColumns={isMobile ? '1fr' : 'repeat(6, 1fr)'}
//         gap={{ xs: 1, sm: 1,  md: 1, lg:2 ,xl:6 }}
//       >
//         {/* State */}
//         <Autocomplete
//           disablePortal
//           options={[DEFAULT_STATE]}
//           value={DEFAULT_STATE}
//           onChange={handleStateChange}
//           renderOption={(props, option) => renderHighlightedOption(props, option, state)}
//           disabled
//           disableClearable
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="State"
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
//                   width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   top: '-2px',
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputBase-input::placeholder': {
//                    color: colors.primary[200], // White placeholder color
//                     opacity: 1, // Ensure full opacity for visibility
//                   },
//               }}
//             />
//           )}
//           sx={{
//             width: { xs: '100%', sm: 120, md: 140 },
//             '& .MuiAutocomplete-popper': {
//               backgroundColor: '#1a1a1a',
//             color: colors.primary[200],
//               '& .MuiAutocomplete-option': {
//               color: colors.primary[200],
//                 fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                 '&:hover': {
//                   backgroundColor: '#333',
//                 },
//               },
//               '& .MuiPaper-root': {
//                 backgroundColor: '#1a1a1a',
//              color: colors.primary[200],
//               }
//             },
//           }}
//         />

//          <Autocomplete
//           disablePortal
//           options={zoneOptions}
//           value={zone}
//           onChange={handleZoneChange}
//           renderOption={(props, option) => renderHighlightedOption(props, option, state)}
//           disableClearable
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Zone"
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
//                   width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   top: '-2px',
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputBase-input::placeholder': {
//                    color: colors.primary[200], // White placeholder color
//                     opacity: 1, // Ensure full opacity for visibility
//                   },
//               }}
//             />
//           )}
//           sx={{
//             width: { xs: '100%', sm: 120, md: 140 },
//             '& .MuiAutocomplete-popper': {
//               backgroundColor: '#1a1a1a',
//             color: colors.primary[200],
//               '& .MuiAutocomplete-option': {
//               color: colors.primary[200],
//                 fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                 '&:hover': {
//                   backgroundColor: '#333',
//                 },
//               },
//               '& .MuiPaper-root': {
//                 backgroundColor: '#1a1a1a',
//              color: colors.primary[200],
//               }
//             },
//           }}
//         />

//         {/* Circle */}
//         <Autocomplete
//           disablePortal
//           options={circleOptions}
//           value={circle}
//           onChange={handleCircleChange}
//           renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
//           disableClearable
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Circle"
//               InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
//               sx={{
//                 '& .MuiInputBase-root': {
//                  height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
//                    width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
//                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   top: '-2px',
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputBase-input::placeholder': {
//                    color: colors.primary[200], // White placeholder color
//                     opacity: 1, // Ensure full opacity for visibility
//                   },
//               }}
//             />
//           )}
//           sx={{
//             width: { xs: '100%', sm: 120, md: 140 },
//             '& .MuiAutocomplete-popper': {
//               backgroundColor: '#1a1a1a',
//               color: colors.primary[200],
//               '& .MuiAutocomplete-option': {
//                color: colors.primary[200],
//                 fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                 '&:hover': {
//                   backgroundColor: '#333',
//                 },
//               },
//               '& .MuiPaper-root': {
//                 backgroundColor: '#1a1a1a',
//                color: colors.primary[200],
//               },
//             },
//           }}
//         />

//          <Autocomplete
//             disablePortal
//             options={divisionOptions}
//             value={division}
//             onChange={handleDivisionChange}
//             renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
//             disableClearable
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 placeholder="Sub Division"
//                 InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
//                 sx={{
//                   '& .MuiInputBase-root': {
//                   height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
//                     width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                     color: colors.primary[200],
//                     borderColor: '#75767B',
//                   },
//                   '& .MuiInputLabel-root': {
//                     fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                     top: '-2px',
//                     color: colors.primary[200],
//                     borderColor: '#75767B',
//                   },
//                   '& .MuiOutlinedInput-notchedOutline': {
//                     borderColor: '#75767B',
//                   },
//                   '& .MuiInputBase-input::placeholder': {
//                     color: colors.primary[200], // White placeholder color
//                       opacity: 1, // Ensure full opacity for visibility
//                     },
//                 }}
//               />
//             )}
//             sx={{
//               width: { xs: '100%', sm: 120, md: 140 },
//               '& .MuiAutocomplete-popper': {
//                 backgroundColor: '#1a1a1a',
//                 color: colors.primary[200],
//                 '& .MuiAutocomplete-option': {
//                 color: colors.primary[200],
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   '&:hover': {
//                     backgroundColor: '#333',
//                   },
//                 },
//                 '& .MuiPaper-root': {
//                   backgroundColor: '#1a1a1a',
//                 color: colors.primary[200],
//                 },
//               },
//             }}
//           />

//          <Autocomplete
//           disablePortal
//           options={siteOptions.map((site) =>site.area )}
//           value={area}
//           onChange={(event, newValue) => handleAreaChange(newValue)}
//           disableClearable
//           renderOption={(props, option) => renderHighlightedOption(props, option, siteId)}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Area"
//               InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
//                    width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   top: '-2px',
//                   color: colors.primary[200],
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputBase-input::placeholder': {
//                     color: colors.primary[200], // White placeholder color
//                     opacity: 1, // Ensure full opacity for visibility
//                   },
//               }}
//             />
//           )}
//           sx={{
//             width: { xs: '100%', sm: 120, md: 140 },
//             '& .MuiAutocomplete-popper': {
//               backgroundColor: '#1a1a1a',
//               color: colors.primary[200],
//               '& .MuiAutocomplete-option': {
//                 color: colors.primary[200],
//                 fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                 '&:hover': {
//                   backgroundColor: '#333',
//                 },
//               },
//               '& .MuiPaper-root': {
//                 backgroundColor: '#1a1a1a',
//                 color: colors.primary[200],
//               },
//             },
//           }}
//         />

//         {/* SubStation ID */}
//         {/* <Autocomplete
//           disablePortal
//           options={siteOptions.map((site) => site.siteId)}
//           value={siteId}
//           onChange={async (event, newValue) => {
//             try {
//               setSiteId(newValue);
//               const selectedSerial = siteOptions.find((site) => site.siteId === newValue);
//               if (selectedSerial) {
//                 setSerialNumberOptions(selectedSerial?.serialNumber|| []); // Use optional chaining to avoid errors if serialNumberList is undefined
//               } else {
//                 setSerialNumberOptions([]);
//               }
//             } catch (error) {
//               console.error('Error fetching map data: ', error);
//               if (error.response && error.response.status === 500) {
//                 setErrorDialogOpen(true);
//                 setmarkers([]);
//               }
//             }
//           }}
//           disableClearable
//           renderOption={(props, option) => renderHighlightedOption(props, option, siteId)}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="SubStation ID"
//               InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
//                    width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   top: '-2px',
//                   color: colors.primary[200],
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputBase-input::placeholder': {
//                     color: colors.primary[200], // White placeholder color
//                     opacity: 1, // Ensure full opacity for visibility
//                   },
//               }}
//             />
//           )}
//           sx={{
//             width: { xs: '100%', sm: 120, md: 140 },
//             '& .MuiAutocomplete-popper': {
//               backgroundColor: '#1a1a1a',
//               color: colors.primary[200],
//               '& .MuiAutocomplete-option': {
//                 color: colors.primary[200],
//                 fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                 '&:hover': {
//                   backgroundColor: '#333',
//                 },
//               },
//               '& .MuiPaper-root': {
//                 backgroundColor: '#1a1a1a',
//                 color: colors.primary[200],
//               },
//             },
//           }}
//         /> */}

//         {/* Serial Number */}
//         {/* <Autocomplete
//           disablePortal
//           options={serialNumberOptions}
//           value={serialNumber}
//           disableClearable
//           onChange={async (event, newValue) => {
//             try {
//               setSerialNumber(newValue);
//               const mapData = await fetchMapBySite(siteId, newValue);
//               if (mapData) {
//                 const { latitude, longitude, area, vendorName, statusType, serialNumber } = mapData;
//                 if (latitude && longitude) {
//                   const updatedMarkers = [
//                     {
//                       lat: latitude,
//                       lng: longitude,
//                       name: area || 'Unnamed site',
//                       vendor: vendorName,
//                       statusType: statusType,
//                       siteId: siteId,
//                       serialNumber: serialNumber || 'N/A',
//                     },
//                   ];
//                   setmarkers(updatedMarkers);
//                 } else {
//                   setmarkers([]);
//                 }
//               } else {
//                 setmarkers([]);
//               }
//             } catch (error) {
//               console.error('Error fetching map data: ', error);
//               if (error.response && error.response.status === 500) {
//                 setErrorDialogOpen(true);
//                 setmarkers([]);
//               }
//             }
//           }}
//           renderOption={(props, option) => renderHighlightedOption(props, option, serialNumber)}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               placeholder="Serial Number"
//               InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
//                    width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                  color: colors.primary[200],
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputLabel-root': {
//                   fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                   top: '-2px',
//                   color: colors.primary[200],
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#75767B',
//                 },
//                 '& .MuiInputBase-input::placeholder': {
//                     color: colors.primary[200], // White placeholder color
//                     opacity: 1, // Ensure full opacity for visibility
//                   },
//               }}
//             />
//           )}
//           sx={{
//             width: { xs: '100%', sm: 120, md: 140 },
//             '& .MuiAutocomplete-popper': {
//               backgroundColor: '#1a1a1a',
//               color: colors.primary[200],
//               '& .MuiAutocomplete-option': {
//                color: colors.primary[200],
//                 fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
//                 '&:hover': {
//                   backgroundColor: '#333',
//                 },
//               },
//               '& .MuiPaper-root': {
//                 backgroundColor: '#1a1a1a',
//                 color: colors.primary[200],
//               },
//             },
//           }}
//         /> */}

//         {/* Clear Button */}
//         <Button
//           color="error"
//           onClick={clearOptions}
//           size="small"
//           sx={{
//             border: 'none',
//             color: '#fff',
//             minWidth: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem', xl: '2rem' },
//             height: { xs: '1.625rem', sm: '1.75rem', md: '1.875rem', lg: '1.875rem', xl: '1.875rem' },
//             padding: 0,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             '&:hover': {
//               backgroundColor: 'white',
//             },
//           }}
//         >
//           <Tooltip
//             title="Clear"
//             placement="bottom"
//             arrow
//             sx={{
//               '& .MuiTooltip-tooltip': {
//                 fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' },
//                 backgroundColor: theme.palette.error.light,
//                 color: '#fff',
//                 padding: { xs: '0.25rem 0.5rem', sm: '0.3rem 0.6rem', md: '0.4rem 0.8rem' },
//               },
//               '& .MuiTooltip-arrow': {
//                 color: theme.palette.error.light,
//               },
//             }}
//           >
//             <Box
//               sx={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <img src={clear} alt="Clear" height="20" width="20" />
//             </Box>
//           </Tooltip>
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default DashBoardBar;




// DashBoardBar.jsx
import { Box, TextField, Autocomplete, Tooltip, useTheme, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useContext, useEffect, useState, useCallback, useMemo } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  fetchMapByState,
  fetchMapByCircle,
  fetchMapByArea,
  fetchMapByZone,
  fetchMapByDivision,
} from "../../../services/apiService";
import clear from '../../../assets/images/png/brush.png';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from '@mui/material';
import { tokens } from "../../../theme";
import { getUsername } from "../../../utils/ProtectedRoutes";
import { DEFAULT_STATE } from "../newDashBoard/dashboardUtils";

const DashBoardBar = ({ filters = {}, onFilterChange, userAccess }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { setSiteOptions } = useContext(AppContext);

  const acc = userAccess || {};
  const stateAcc    = acc.state    || { value: "", locked: false, options: [] };
  const zoneAcc     = acc.zone     || { value: "", locked: false, options: [] };
  const circleAcc   = acc.circle   || { value: "", locked: false, options: [] };
  const divisionAcc = acc.division || { value: "", locked: false, options: [] };
  const areaAcc     = acc.area     || { value: "", locked: false, options: [] };

  // Local state
  const [zoneOptions, setZoneOptions] = useState([]);
  const [circleOptions, setCircleOptions] = useState([]);
  const [divisionOptions, setDivisionOptions] = useState([]);
  const [siteOptions, setLocalSiteOptions] = useState([]);
  
  // Selected values - initialize with user topics or empty
  const [state, setState]       = useState(DEFAULT_STATE);
  const [zone, setZone]         = useState(zoneAcc.value || "");
  const [circle, setCircle]     = useState(circleAcc.value || "");
  const [division, setDivision] = useState(divisionAcc.value || "");
  const [area, setArea]         = useState(areaAcc.value || "");
  
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // SEED DROPDOWN OPTIONS FROM ACCESS
    useEffect(() => {
    if (zoneAcc.locked || zoneAcc.options.length > 0) {
      setZoneOptions(zoneAcc.locked ? [zoneAcc.value] : zoneAcc.options);
    }
    if (zoneAcc.locked) setZone(zoneAcc.value);

    if (circleAcc.locked) {
      setCircleOptions([circleAcc.value]);
      setCircle(circleAcc.value);
    }
    if (divisionAcc.locked) {
      setDivisionOptions([divisionAcc.value]);
      setDivision(divisionAcc.value);
    }
    if (areaAcc.locked) {
      setArea(areaAcc.value);
    }
  }, [
    zoneAcc.locked, zoneAcc.value, zoneAcc.options.join("|"),
    circleAcc.locked, circleAcc.value,
    divisionAcc.locked, divisionAcc.value,
    areaAcc.locked, areaAcc.value,
  ]);

   // LOAD ZONES
  const loadZoneOptions = useCallback(async () => {
    // If locked → already set from access; don't fetch
    if (zoneAcc.locked) {
      setZoneOptions([zoneAcc.value]);
      setZone(zoneAcc.value);
      return;
    }
    // If access gives multiple allowed zones → use them, don't fetch all
    if (zoneAcc.options.length > 0) {
      setZoneOptions(zoneAcc.options);
      return;
    }
    // free user → fetch normally
    try {
      const token = sessionStorage.getItem("token");
      const mapData = await fetchMapByState(DEFAULT_STATE, getUsername(token));
      const zones = (mapData || []).map((s) => s.zone).filter(Boolean);
      setZoneOptions([...new Set(zones)]);
      if (filters.zone) setZone(filters.zone);
    } catch (err) {
      console.error("Failed to load zones", err);
    }
  }, [zoneAcc.locked, zoneAcc.value, zoneAcc.options, filters.zone]);

   // LOAD CIRCLES
  const loadCircleOptions = useCallback(
    async (zoneValue) => {
      if (circleAcc.locked) {
        setCircleOptions([circleAcc.value]);
        setCircle(circleAcc.value);
        return;
      }
      if (circleAcc.options.length > 0) {
        setCircleOptions(circleAcc.options);
        return;
      }
      if (!zoneValue) {
        setCircleOptions([]);
        setCircle("");
        return;
      }
      try {
        const token = sessionStorage.getItem("token");
        const mapData = await fetchMapByZone(zoneValue, getUsername(token));
        const circles = (mapData || []).map((s) => s.circle).filter(Boolean);
        setCircleOptions([...new Set(circles)]);
        if (filters.circle) setCircle(filters.circle);
      } catch (err) {
        console.error("Failed to load circles", err);
      }
    },
    [circleAcc.locked, circleAcc.value, circleAcc.options, filters.circle]
  );

  // LOAD DIVISIONS
  const loadDivisionOptions = useCallback(
    async (circleValue) => {
      if (divisionAcc.locked) {
        setDivisionOptions([divisionAcc.value]);
        setDivision(divisionAcc.value);
        return;
      }
      if (divisionAcc.options.length > 0) {
        setDivisionOptions(divisionAcc.options);
        return;
      }
      if (!circleValue) {
        setDivisionOptions([]);
        setDivision("");
        return;
      }
      try {
        const mapData = await fetchMapByCircle(circleValue);
        const divisions = (mapData || []).map((s) => s.divison).filter(Boolean);
        setDivisionOptions([...new Set(divisions)]);
        if (filters.division) setDivision(filters.division);
      } catch (err) {
        console.error("Failed to load divisions", err);
      }
    },
    [divisionAcc.locked, divisionAcc.value, divisionAcc.options, filters.division]
  );

  // Load site options - only if user doesn't have specific area value
  const loadSiteOptions = useCallback(
    async (divisionValue) => {
      // area locked → fetch that specific area
      if (areaAcc.locked) {
        try {
          const mapData = await fetchMapByArea(areaAcc.value);
          const list = Array.isArray(mapData) ? mapData : mapData ? [mapData] : [];
          setLocalSiteOptions(list);
          setSiteOptions?.(list);
          setArea(areaAcc.value);

          const markers = list
            .filter((s) => s.latitude && s.longitude)
            .map((s) => ({
              lat: s.latitude,
              lng: s.longitude,
              name: s.area || "Unnamed site",
              vendor: s.vendorName,
              statusType: s.statusType,
              siteId: s.siteId,
              serialNumber: s.serialNumber || "N/A",
            }));
          onFilterChange?.("area", areaAcc.value, markers);
        } catch (err) {
          console.error("Error fetching locked area data:", err);
        }
        return;
      }

      if (!divisionValue) {
        setLocalSiteOptions([]);
        setSiteOptions?.([]);
        setArea("");
        return;
      }

      try {
        const mapData = await fetchMapByDivision(divisionValue);
        let list = mapData || [];

        // If access restricts areas to specific ones → filter
        if (areaAcc.options.length > 0) {
          list = list.filter((s) => areaAcc.options.includes(s.area));
        }

        setLocalSiteOptions(list);
        setSiteOptions?.(list);
        if (filters.area) setArea(filters.area);
      } catch (err) {
        console.error("Failed to load sites", err);
      }
    },
    [
      areaAcc.locked, areaAcc.value, areaAcc.options,
      setSiteOptions, onFilterChange, filters.area,
    ]
  );

  // Initialize all filters based on user topics
  useEffect(() => {
    const init = async () => {
      await loadZoneOptions();

      const zoneValue = zoneAcc.locked
        ? zoneAcc.value
        : filters.zone || zone;

      await loadCircleOptions(zoneValue);

      const circleValue = circleAcc.locked
        ? circleAcc.value
        : filters.circle || circle;

      await loadDivisionOptions(circleValue);

      const divisionValue = divisionAcc.locked
        ? divisionAcc.value
        : filters.division || division;

      await loadSiteOptions(divisionValue);

      setIsInitialized(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Clear all filters
  const clearOptions = useCallback(async () => {
    // locked fields stay locked; free fields reset
    if (!zoneAcc.locked) {
      setZone("");
      setCircleOptions([]);
    }
    if (!circleAcc.locked) {
      setCircle("");
      setDivisionOptions([]);
    }
    if (!divisionAcc.locked) {
      setDivision("");
      setLocalSiteOptions([]);
      setSiteOptions?.([]);
    }
    if (!areaAcc.locked) {
      setArea("");
    }
    onFilterChange?.("clear");
  }, [
    onFilterChange, setSiteOptions,
    zoneAcc.locked, circleAcc.locked, divisionAcc.locked, areaAcc.locked,
  ]);

   //  CHANGE HANDLERS 
  const handleZoneChange = useCallback(
    async (_e, newValue) => {
      if (zoneAcc.locked) return;
      setCircleOptions([]);
      setDivisionOptions([]);
      setLocalSiteOptions([]);
      setCircle("");
      setDivision("");
      setArea("");
      setZone(newValue || "");
      onFilterChange?.("zone", newValue || "");

      if (!newValue) return;
      try {
        const token = sessionStorage.getItem("token");
        const mapData = await fetchMapByZone(newValue, getUsername(token));
        let circles = (mapData || []).map((s) => s.circle).filter(Boolean);
        if (circleAcc.options.length > 0) {
          circles = circles.filter((c) => circleAcc.options.includes(c));
        }
        setCircleOptions([...new Set(circles)]);
      } catch (err) {
        console.error("zone change failed", err);
      }
    },
    [zoneAcc.locked, circleAcc.options, onFilterChange]
  );

  const handleCircleChange = useCallback(
    async (_e, newValue) => {
      if (circleAcc.locked) return;
      setDivisionOptions([]);
      setLocalSiteOptions([]);
      setDivision("");
      setArea("");
      setCircle(newValue || "");
      onFilterChange?.("circle", newValue || "");

      if (!newValue) return;
      try {
        const mapData = await fetchMapByCircle(newValue);
        let divisions = (mapData || []).map((s) => s.divison).filter(Boolean);
        if (divisionAcc.options.length > 0) {
          divisions = divisions.filter((d) => divisionAcc.options.includes(d));
        }
        setDivisionOptions([...new Set(divisions)]);
      } catch (err) {
        console.error("circle change failed", err);
      }
    },
    [circleAcc.locked, divisionAcc.options, onFilterChange]
  );

  const handleDivisionChange = useCallback(
    async (_e, newValue) => {
      if (divisionAcc.locked) return;
      setLocalSiteOptions([]);
      setArea("");
      setDivision(newValue || "");
      onFilterChange?.("division", newValue || "");

      if (!newValue) {
        setSiteOptions?.([]);
        return;
      }
      try {
        const mapData = await fetchMapByDivision(newValue);
        let list = mapData || [];
        if (areaAcc.options.length > 0) {
          list = list.filter((s) => areaAcc.options.includes(s.area));
        }
        setLocalSiteOptions(list);
        setSiteOptions?.(list);
      } catch (err) {
        console.error("division change failed", err);
      }
    },
    [divisionAcc.locked, areaAcc.options, onFilterChange, setSiteOptions]
  );

  const handleAreaChange = useCallback(
    async (_e, newValue) => {
      if (areaAcc.locked) return;
      setArea(newValue || "");
      onFilterChange?.("area", newValue || "");
      if (!newValue) return;

      const selectedSite = siteOptions.find((s) => s.area === newValue);
      if (selectedSite?.latitude && selectedSite?.longitude) {
        onFilterChange?.("area", newValue, [
          {
            lat: selectedSite.latitude,
            lng: selectedSite.longitude,
            name: selectedSite.area || "Unnamed site",
            vendor: selectedSite.vendorName,
            statusType: selectedSite.statusType,
            siteId: selectedSite.siteId,
            serialNumber: selectedSite.serialNumber || "N/A",
          },
        ]);
      }
    },
    [areaAcc.locked, onFilterChange, siteOptions]
  );


  const renderHighlightedOption = useCallback((props, option, value) => {
    const { key, ...otherProps } = props;
    const label =
      option == null
        ? "No options available"
        : typeof option === "object"
        ? option.label || option.area || option.value || ""
        : option;

    const isSelected = label === value;
    return (
      <li
        key={key}
        {...otherProps}
        style={{
          backgroundColor: isSelected ? "#d82b27" : "inherit",
          color: isSelected ? "#ffffff" : "inherit",
        }}
      >
        {label}
      </li>
    );
  }, []);

  const autocompleteStyles = useMemo(
    () => ({
      root: {
        width: { xs: "100%", sm: 120, md: 140 },
        "& .MuiAutocomplete-popper": {
          backgroundColor: "#1a1a1a",
          color: colors.primary[200],
          "& .MuiAutocomplete-option": {
            color: colors.primary[200],
            fontSize: { xs: "0.5rem", sm: "0.5rem", md: "0.6rem", lg: "0.7rem", xl: "1rem" },
            "&:hover": { backgroundColor: "#333" },
          },
          "& .MuiPaper-root": {
            backgroundColor: "#1a1a1a",
            color: colors.primary[200],
          },
        },
      },
      input: {
        "& .MuiInputBase-root": {
          height: { xs: 20, sm: 20, md: 30, lg: 32, xl: 40 },
          width: { xs: 100, sm: 100, md: 120, lg: 150, xl: 180 },
          fontSize: { xs: "0.5rem", sm: "0.5rem", md: "0.6rem", lg: "0.7rem", xl: "1rem" },
          color: colors.primary[200],
          borderColor: "#75767B",
        },
        "& .MuiInputLabel-root": {
          fontSize: { xs: "0.5rem", sm: "0.5rem", md: "0.6rem", lg: "0.7rem", xl: "1rem" },
          top: "-2px",
          color: colors.primary[200],
          borderColor: "#75767B",
        },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "#75767B" },
        "& .MuiInputBase-input::placeholder": {
          color: colors.primary[200],
          opacity: 1,
        },
      },
    }),
    [colors]
  );

  const areaOptions = useMemo(() => {
    if (!siteOptions || siteOptions.length === 0) {
      return areaAcc.options.length > 0 ? areaAcc.options : [];
    }
    let areas = siteOptions.map((s) => s.area).filter(Boolean);
    if (areaAcc.options.length > 0) {
      areas = areas.filter((a) => areaAcc.options.includes(a));
    }
    return [...new Set(areas)];
  }, [siteOptions, areaAcc.options]);

  return (
    <Box
      display="grid"
      gridTemplateColumns={isMobile ? "1fr" : "repeat(2, 1fr)"}
      gap={1.5}
      sx={{
        width: "100%",
        maxWidth: isMobile ? "100%" : "800px",
        pb: 1,
        pt: { xs: 1, sm: 1, md: 1, lg: 0, xl: 1 },
      }}
    >
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "1fr" : "repeat(6, 1fr)"}
        gap={{ xs: 1, sm: 1, md: 1, lg: 2, xl: 6 }}
      >
        {/* STATE */}
        <Autocomplete
          disablePortal
          options={stateAcc.options.length ? stateAcc.options : [DEFAULT_STATE]}
          value={stateAcc.locked ? stateAcc.value : DEFAULT_STATE}
          disabled
          disableClearable
          renderOption={(p, o) => renderHighlightedOption(p, o, state)}
          renderInput={(params) => (
            <TextField {...params} placeholder="State" sx={autocompleteStyles.input} />
          )}
          sx={autocompleteStyles.root}
        />

        {/* ZONE */}
        <Autocomplete
          disablePortal
          options={zoneOptions}
          value={zoneAcc.locked ? zoneAcc.value : zone || null}
          onChange={handleZoneChange}
          disabled={zoneAcc.locked}
          disableClearable={zoneAcc.locked}
          renderOption={(p, o) => renderHighlightedOption(p, o, zone)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Zone" sx={autocompleteStyles.input} />
          )}
          sx={autocompleteStyles.root}
        />

        {/* CIRCLE */}
        <Autocomplete
          disablePortal
          options={circleOptions}
          value={circleAcc.locked ? circleAcc.value : circle || null}
          onChange={handleCircleChange}
          disabled={circleAcc.locked}
          disableClearable={circleAcc.locked}
          renderOption={(p, o) => renderHighlightedOption(p, o, circle)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Circle" sx={autocompleteStyles.input} />
          )}
          sx={autocompleteStyles.root}
        />

        {/* DIVISION */}
        <Autocomplete
          disablePortal
          options={divisionOptions}
          value={divisionAcc.locked ? divisionAcc.value : division || null}
          onChange={handleDivisionChange}
          disabled={divisionAcc.locked}
          disableClearable={divisionAcc.locked}
          renderOption={(p, o) => renderHighlightedOption(p, o, division)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Sub Division" sx={autocompleteStyles.input} />
          )}
          sx={autocompleteStyles.root}
        />

        {/* AREA */}
        <Autocomplete
          disablePortal
          options={areaOptions}
          value={areaAcc.locked ? areaAcc.value : area || null}
          onChange={handleAreaChange}
          disabled={areaAcc.locked}
          disableClearable={areaAcc.locked}
          renderOption={(p, o) => renderHighlightedOption(p, o, area)}
          renderInput={(params) => (
            <TextField {...params} placeholder="Area" sx={autocompleteStyles.input} />
          )}
          sx={autocompleteStyles.root}
        />

        {/* CLEAR BUTTON */}
        <Button
          color="error"
          onClick={clearOptions}
          size="small"
          sx={{
            border: "none",
            color: "#fff",
            minWidth: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            height: { xs: "1.625rem", sm: "1.75rem", md: "1.875rem" },
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "&:hover": { backgroundColor: "white" },
          }}
        >
          <Tooltip
            title="Clear"
            placement="bottom"
            arrow
            sx={{
              "& .MuiTooltip-tooltip": {
                fontSize: { xs: "0.6rem", sm: "0.65rem", md: "0.7rem" },
                backgroundColor: theme.palette.error.light,
                color: "#fff",
              },
              "& .MuiTooltip-arrow": { color: theme.palette.error.light },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src={clear} alt="Clear" height="20" width="20" />
            </Box>
          </Tooltip>
        </Button>
      </Box>

      {/* ERROR DIALOG */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>Failed to load data. Please try again.</DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashBoardBar;