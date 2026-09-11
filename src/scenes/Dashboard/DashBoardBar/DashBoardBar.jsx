import { Box, TextField, Autocomplete,Tooltip, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../services/AppContext";
import {
  fetchStatesDetails,
  fetchAllSiteIds,
  fetchAreasDetails,
  fetchMapBySite,
  fetchMapByState,
  fetchMapByCircle,
  fetchMapByArea,
  fetchCommunicationStatus,
  fetchMapByZone,
  fetchCommunicationDevices,
  fetchMapByDivision,
} from "../../../services/apiService";
import clear from '../../../assets/images/png/brush.png';

import useMediaQuery from '@mui/material/useMediaQuery';
import { Button } from '@mui/material';
import { tokens } from "../../../theme";
import { getUsername } from "../../../utils/ProtectedRoutes";
import { set } from "lodash";
const DashBoardBar = ({totalData,setmarkers,updateMapMarkers}) => {
  const {
    // serialNumberOptions,
    // siteId,
    // serialNumber,
    // setSiteId,
    // setSerialNumber,
     stateOptions,siteOptions, setSiteOptions
  } = useContext(AppContext);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const[zoneOptions,setZoneOptions]=useState([]);
  const[zone,setZone]=useState("");
  const [circleOptions, setCircleOptions] = useState([]);
  const[divisionOptions,setDivisionOptions]=useState([]);
  const[division,setDivision]=useState("");
  const [areaOptions, setAreaOptions] = useState([]);
  const [state, setState] = useState("");
  const [circle, setCircle] = useState("");
  const [area, setArea] = useState("");
  const [siteId, setSiteId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [serialNumberOptions, setSerialNumberOptions] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  // const [siteOptions, setSiteOptions] = useState([]);

  // Function to fetch initial/default data and set map markers
  const fetchInitialData =async () => {
    try {
      // const marginMinutes = 60; // Adjust this value as needed
      // const commStatusData = await fetchCommunicationDevices(marginMinutes);
      // const markers = [];
      //    if(commStatusData || Array.isArray(commStatusData)){
      //     commStatusData.forEach((item) => {
      //     markers.push({
      //                 lat: item.latitude,
      //                 lng: item.longitude,
      //                 name: item.area || "Unnamed Site",
      //                 vendor: item.vendorName || "",
      //                 statusType: item.status? 1:0,
      //                 siteId : item.siteId,
      //                 serialNumber : item.serialNumber,
      //               });
      //             });
      //     setmarkers(markers);
      //           }

      // if (totolData && totolData.length > 0) {
      //   totolData.forEach((item) => {
      //     if (item.siteLocationDTO) {
      //       const { latitude, longitude, area, vendorName, siteId } = item.siteLocationDTO;
      //       if (latitude && longitude) {
      //         let serialNumber = null;

      //         // Check if deviceDataDTO exists and is an array
      //         if (
      //           item.generalDataDTO &&
      //           item.generalDataDTO.deviceDataDTO &&
      //           item.generalDataDTO.deviceDataDTO.length > 0
      //         ) {
      //           serialNumber = item.generalDataDTO.deviceDataDTO[0].serialNumber; // Get the first device's serial number
      //         }

      //         markers.push({
      //           lat: latitude,
      //           lng: longitude,
      //           name: area || "Unnamed Site",
      //           vendor: vendorName,
      //           statusType: item.statusType,
      //           siteId: siteId,
      //           serialNumber: serialNumber || "N/A", // Default to "N/A" if no serial number is found
      //         });
      //       }
      //     }
      //   });
      // }

      // setmarkers(markers.length > 0 ? markers : []);

      updateMapMarkers(totalData); // Call the function to update map markers with the default data

      
    } catch (error) {
      console.error("Error fetching initial communication status:", error);
      setmarkers([]);
    }
  };


  // Updated clearOptions to reset filters and fetch default data
  const clearOptions = async () => {
    setSiteId("");
    setSerialNumber("");
    setState("");
    setCircle("");
    setDivision("");
    setArea("");
    setZone("");
    setZoneOptions([]);
    setSiteOptions([]);
    setCircleOptions([]);
    setDivisionOptions([])
    setAreaOptions([]);
     fetchInitialData(); // Fetch default data and update map markers
  };

 // Fetch states and initial data on component mount
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setSiteId("");
  //       setSerialNumber("");
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);


//  useEffect(() => {
//   const fetchData = async () => {
//     if (state === "" || circle === "") {
//       setSiteId("");
//       setSerialNumber("");
//       await fetchInitialData();
//     }
//   };

//   fetchData();
// }, [state, circle, area]); // Add fetchInitialData if it's not memoized

  // Handle state selection
  const handleStateChange = async (event, newValue) => {
    setZoneOptions([]);
    setCircleOptions([]);
    setSiteOptions([]);
    setSiteId("")
    setZone("")
    setSerialNumber("")
    setCircle("");
    setState(newValue);
    try {
      const token = sessionStorage.getItem("token");
      const mapData = await fetchMapByState(newValue,getUsername(token));
      const zone = mapData.map((site) => site.zone);
      const uniqueZones = [...new Set(zone)];
      setZoneOptions(uniqueZones);
      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData
          .filter((site) => site.latitude && site.longitude)
          .map((site) => ({
            lat: site.latitude,
            lng: site.longitude,
            name: site.area || "Unnamed site",
            vendor: site.vendorName,
            statusType: site.statusType,
            siteId: site.siteId,
            serialNumber: site.serialNumber || "N/A",
          }));
        if (updatedMarkers.length > 0) {
          setmarkers(updatedMarkers);
        } else {
          setmarkers([]);
        }
      } else {
        console.log("No map data found for the selected state.");
        setmarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map data for state: ", error);
      if (error.response && error.response.status === 500) {
        setErrorDialogOpen(true);
        setmarkers([]);
      }
    }
  };

  const handleZoneChange = async (event, newValue) => {
    setCircleOptions([]);
    setSiteOptions([]);
    setSiteId("")
    setSerialNumber("")
    setCircle("");
    setZone("")
    setZone(newValue);
    try {
      const token = sessionStorage.getItem("token");
      const mapData = await fetchMapByZone(newValue,getUsername(token));
      const circles = mapData.map((site) => site.circle);
      const uniqueCircles = [...new Set(circles)];
      setCircleOptions(uniqueCircles);
      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData
          .filter((site) => site.latitude && site.longitude)
          .map((site) => ({
            lat: site.latitude,
            lng: site.longitude,
            name: site.area || "Unnamed site",
            vendor: site.vendorName,
            statusType: site.statusType,
            siteId: site.siteId,
            serialNumber: site.serialNumber || "N/A",
          }));
        if (updatedMarkers.length > 0) {
          setmarkers(updatedMarkers);
        } else {
          setmarkers([]);
        }
      } else {
        console.log("No map data found for the selected state.");
        setmarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map data for state: ", error);
      if (error.response && error.response.status === 500) {
        setErrorDialogOpen(true);
        setmarkers([]);
      }
    }

  }

  // Handle circle selection
  const handleCircleChange = async (event, newValue) => {
    setSiteOptions([]);
    setSiteId("")
    setSerialNumber("")
    setCircle(newValue);
    try {
      const mapData = await fetchMapByCircle(newValue);
      const division = mapData.map((site) => site.divison);
      const uniqueDivision = [...new Set(division)];
      setDivisionOptions(uniqueDivision);
     // setSiteOptions(mapData);
      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData
          .filter((site) => site.latitude && site.longitude)
          .map((site) => ({
            lat: site.latitude,
            lng: site.longitude,
            name: site.area || "Unnamed site",
            vendor: site.vendorName,
            statusType: site.statusType,
            siteId: site.siteId,
            serialNumber: site.serialNumber || "N/A",
          }));
        if (updatedMarkers.length > 0) {
          setmarkers(updatedMarkers);
        } else {
          setmarkers([]);
        }
      } else {
        console.log("No map data found for the selected circle.");
        setmarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map data for circle: ", error);
      if (error.response && error.response.status === 500) {
        setErrorDialogOpen(true);
        setmarkers([]);
      }
    }
  };

   const handleDivisionChange = async (event, newValue) => {
    setSiteOptions([]);
    setSiteId("")
    setSerialNumber("")
    setDivision(newValue);
    try {
      const mapData = await fetchMapByDivision(newValue);
      setSiteOptions(mapData);
      if (mapData && mapData.length > 0) {
        const updatedMarkers = mapData
          .filter((site) => site.latitude && site.longitude)
          .map((site) => ({
            lat: site.latitude,
            lng: site.longitude,
            name: site.area || "Unnamed site",
            vendor: site.vendorName,
            statusType: site.statusType,
            siteId: site.siteId,
            serialNumber: site.serialNumber || "N/A",
          }));
        if (updatedMarkers.length > 0) {
          setmarkers(updatedMarkers);
        } else {
          setmarkers([]);
        }
      } else {
        console.log("No map data found for the selected circle.");
        setmarkers([]);
      }
    } catch (error) {
      console.error("Error fetching map data for circle: ", error);
      if (error.response && error.response.status === 500) {
        setErrorDialogOpen(true);
        setmarkers([]);
      }
    }
  };

  const handleAreaChange= async(newValue)=>{
     try {
            setArea(newValue);
              const mapData = await fetchMapByArea(newValue);
              if (mapData) {
                const { latitude, longitude, area, vendorName, statusType, serialNumber,siteId } = mapData;
                if (latitude && longitude) {
                  const updatedMarkers = [
                    {
                      lat: latitude,
                      lng: longitude,
                      name: area || 'Unnamed site',
                      vendor: vendorName,
                      statusType: statusType,
                      siteId: siteId,
                      serialNumber: serialNumber || 'N/A',
                    },
                  ];
                  setmarkers(updatedMarkers);
                } else {
                  setmarkers([]);
                }
              } else {
                setmarkers([]);
              }
            } 
            catch (error) {
              console.error('Error fetching map data: ', error);
              if (error.response && error.response.status === 500) {
                setErrorDialogOpen(true);
                setmarkers([]);
              }
            }
  }


  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm')); // Detect screens smaller than 600px

  const renderHighlightedOption = (props, option, value) => {
    // Destructure key from props and create a new object without it
    const { key, ...otherProps } = props;
    
    return (
      <li
        key={key}
        {...otherProps}
        style={{
          backgroundColor: value === option ? "#d82b27" : "inherit",
          color: value === option ? "#ffffff" : "inherit",
        }}
      >
        {option}
      </li>
    );
  };

  return (
   <Box
      display="grid"
      gridTemplateColumns={isMobile ? '1fr' : 'repeat(2, 1fr)'}
      gap={1.5}
      sx={{ width: '100%', maxWidth: isMobile ? '100%' : '800px', pb: 1 ,pt:{ xs: 1, sm: 1,  md: 1, lg:0 ,xl:1}}}
    >
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? '1fr' : 'repeat(6, 1fr)'}
        gap={{ xs: 1, sm: 1,  md: 1, lg:2 ,xl:6 }}
      >
        {/* State */}
        <Autocomplete
          disablePortal
          options={stateOptions.map((state) => state.name)}
          value={state}
          onChange={handleStateChange}
          renderOption={(props, option) => renderHighlightedOption(props, option, state)}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="State"
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
                  width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiInputLabel-root': {
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  top: '-2px',
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#75767B',
                },
                '& .MuiInputBase-input::placeholder': {
                   color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
              }}
            />
          )}
          sx={{
            width: { xs: '100%', sm: 120, md: 140 },
            '& .MuiAutocomplete-popper': {
              backgroundColor: '#1a1a1a',
            color: colors.primary[200],
              '& .MuiAutocomplete-option': {
              color: colors.primary[200],
                fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                '&:hover': {
                  backgroundColor: '#333',
                },
              },
              '& .MuiPaper-root': {
                backgroundColor: '#1a1a1a',
             color: colors.primary[200],
              }
            },
          }}
        />

         <Autocomplete
          disablePortal
          options={zoneOptions}
          value={zone}
          onChange={handleZoneChange}
          renderOption={(props, option) => renderHighlightedOption(props, option, state)}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Zone"
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
                  width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiInputLabel-root': {
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  top: '-2px',
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#75767B',
                },
                '& .MuiInputBase-input::placeholder': {
                   color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
              }}
            />
          )}
          sx={{
            width: { xs: '100%', sm: 120, md: 140 },
            '& .MuiAutocomplete-popper': {
              backgroundColor: '#1a1a1a',
            color: colors.primary[200],
              '& .MuiAutocomplete-option': {
              color: colors.primary[200],
                fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                '&:hover': {
                  backgroundColor: '#333',
                },
              },
              '& .MuiPaper-root': {
                backgroundColor: '#1a1a1a',
             color: colors.primary[200],
              }
            },
          }}
        />

        {/* Circle */}
        <Autocomplete
          disablePortal
          options={circleOptions}
          value={circle}
          onChange={handleCircleChange}
          renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Circle"
              InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
              sx={{
                '& .MuiInputBase-root': {
                 height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
                   width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
                 fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiInputLabel-root': {
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  top: '-2px',
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#75767B',
                },
                '& .MuiInputBase-input::placeholder': {
                   color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
              }}
            />
          )}
          sx={{
            width: { xs: '100%', sm: 120, md: 140 },
            '& .MuiAutocomplete-popper': {
              backgroundColor: '#1a1a1a',
              color: colors.primary[200],
              '& .MuiAutocomplete-option': {
               color: colors.primary[200],
                fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                '&:hover': {
                  backgroundColor: '#333',
                },
              },
              '& .MuiPaper-root': {
                backgroundColor: '#1a1a1a',
               color: colors.primary[200],
              },
            },
          }}
        />

         <Autocomplete
            disablePortal
            options={divisionOptions}
            value={division}
            onChange={handleDivisionChange}
            renderOption={(props, option) => renderHighlightedOption(props, option, circle)}
            disableClearable
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Sub Division"
                InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
                sx={{
                  '& .MuiInputBase-root': {
                  height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
                    width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                    color: colors.primary[200],
                    borderColor: '#75767B',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                    top: '-2px',
                    color: colors.primary[200],
                    borderColor: '#75767B',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#75767B',
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: colors.primary[200], // White placeholder color
                      opacity: 1, // Ensure full opacity for visibility
                    },
                }}
              />
            )}
            sx={{
              width: { xs: '100%', sm: 120, md: 140 },
              '& .MuiAutocomplete-popper': {
                backgroundColor: '#1a1a1a',
                color: colors.primary[200],
                '& .MuiAutocomplete-option': {
                color: colors.primary[200],
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  '&:hover': {
                    backgroundColor: '#333',
                  },
                },
                '& .MuiPaper-root': {
                  backgroundColor: '#1a1a1a',
                color: colors.primary[200],
                },
              },
            }}
          />

         <Autocomplete
          disablePortal
          options={siteOptions.map((site) =>site.area )}
          value={area}
          onChange={(event, newValue) => handleAreaChange(newValue)}
          disableClearable
          renderOption={(props, option) => renderHighlightedOption(props, option, siteId)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Area"
              InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
                   width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiInputLabel-root': {
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  top: '-2px',
                  color: colors.primary[200],
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#75767B',
                },
                '& .MuiInputBase-input::placeholder': {
                    color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
              }}
            />
          )}
          sx={{
            width: { xs: '100%', sm: 120, md: 140 },
            '& .MuiAutocomplete-popper': {
              backgroundColor: '#1a1a1a',
              color: colors.primary[200],
              '& .MuiAutocomplete-option': {
                color: colors.primary[200],
                fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                '&:hover': {
                  backgroundColor: '#333',
                },
              },
              '& .MuiPaper-root': {
                backgroundColor: '#1a1a1a',
                color: colors.primary[200],
              },
            },
          }}
        />

        {/* SubStation ID */}
        {/* <Autocomplete
          disablePortal
          options={siteOptions.map((site) => site.siteId)}
          value={siteId}
          onChange={async (event, newValue) => {
            try {
              setSiteId(newValue);
              const selectedSerial = siteOptions.find((site) => site.siteId === newValue);
              if (selectedSerial) {
                setSerialNumberOptions(selectedSerial?.serialNumber|| []); // Use optional chaining to avoid errors if serialNumberList is undefined
              } else {
                setSerialNumberOptions([]);
              }
            } catch (error) {
              console.error('Error fetching map data: ', error);
              if (error.response && error.response.status === 500) {
                setErrorDialogOpen(true);
                setmarkers([]);
              }
            }
          }}
          disableClearable
          renderOption={(props, option) => renderHighlightedOption(props, option, siteId)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="SubStation ID"
              InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
                   width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiInputLabel-root': {
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  top: '-2px',
                  color: colors.primary[200],
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#75767B',
                },
                '& .MuiInputBase-input::placeholder': {
                    color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
              }}
            />
          )}
          sx={{
            width: { xs: '100%', sm: 120, md: 140 },
            '& .MuiAutocomplete-popper': {
              backgroundColor: '#1a1a1a',
              color: colors.primary[200],
              '& .MuiAutocomplete-option': {
                color: colors.primary[200],
                fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                '&:hover': {
                  backgroundColor: '#333',
                },
              },
              '& .MuiPaper-root': {
                backgroundColor: '#1a1a1a',
                color: colors.primary[200],
              },
            },
          }}
        /> */}

        {/* Serial Number */}
        {/* <Autocomplete
          disablePortal
          options={serialNumberOptions}
          value={serialNumber}
          disableClearable
          onChange={async (event, newValue) => {
            try {
              setSerialNumber(newValue);
              const mapData = await fetchMapBySite(siteId, newValue);
              if (mapData) {
                const { latitude, longitude, area, vendorName, statusType, serialNumber } = mapData;
                if (latitude && longitude) {
                  const updatedMarkers = [
                    {
                      lat: latitude,
                      lng: longitude,
                      name: area || 'Unnamed site',
                      vendor: vendorName,
                      statusType: statusType,
                      siteId: siteId,
                      serialNumber: serialNumber || 'N/A',
                    },
                  ];
                  setmarkers(updatedMarkers);
                } else {
                  setmarkers([]);
                }
              } else {
                setmarkers([]);
              }
            } catch (error) {
              console.error('Error fetching map data: ', error);
              if (error.response && error.response.status === 500) {
                setErrorDialogOpen(true);
                setmarkers([]);
              }
            }
          }}
          renderOption={(props, option) => renderHighlightedOption(props, option, serialNumber)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Serial Number"
              InputLabelProps={{ sx: { fontWeight: 'bold', fontSize: '0.85rem' } }}
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 20, sm: 20,  md: 30, lg:32 ,xl:40},
                   width:{xs: 100, sm: 100,  md: 120, lg:150 ,xl:180},
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                 color: colors.primary[200],
                  borderColor: '#75767B',
                },
                '& .MuiInputLabel-root': {
                  fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                  top: '-2px',
                  color: colors.primary[200],
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#75767B',
                },
                '& .MuiInputBase-input::placeholder': {
                    color: colors.primary[200], // White placeholder color
                    opacity: 1, // Ensure full opacity for visibility
                  },
              }}
            />
          )}
          sx={{
            width: { xs: '100%', sm: 120, md: 140 },
            '& .MuiAutocomplete-popper': {
              backgroundColor: '#1a1a1a',
              color: colors.primary[200],
              '& .MuiAutocomplete-option': {
               color: colors.primary[200],
                fontSize: {xs: '0.5rem', sm: '0.5rem',  md: '0.6rem', lg:'0.7rem' ,xl:"1rem"},
                '&:hover': {
                  backgroundColor: '#333',
                },
              },
              '& .MuiPaper-root': {
                backgroundColor: '#1a1a1a',
                color: colors.primary[200],
              },
            },
          }}
        /> */}

        {/* Clear Button */}
        <Button
          color="error"
          onClick={clearOptions}
          size="small"
          sx={{
            border: 'none',
            color: '#fff',
            minWidth: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem', xl: '2rem' },
            height: { xs: '1.625rem', sm: '1.75rem', md: '1.875rem', lg: '1.875rem', xl: '1.875rem' },
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': {
              backgroundColor: 'white',
            },
          }}
        >
          <Tooltip
            title="Clear"
            placement="bottom"
            arrow
            sx={{
              '& .MuiTooltip-tooltip': {
                fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem', lg: '0.7rem', xl: '0.75rem' },
                backgroundColor: theme.palette.error.light,
                color: '#fff',
                padding: { xs: '0.25rem 0.5rem', sm: '0.3rem 0.6rem', md: '0.4rem 0.8rem' },
              },
              '& .MuiTooltip-arrow': {
                color: theme.palette.error.light,
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img src={clear} alt="Clear" height="20" width="20" />
            </Box>
          </Tooltip>
        </Button>
      </Box>
    </Box>
  );
};

export default DashBoardBar;