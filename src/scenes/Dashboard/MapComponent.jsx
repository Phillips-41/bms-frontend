import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { AppContext } from '../../services/AppContext'; 
import { tokens } from '../../theme';
import green from '../../assets/images/png/marker-icon-2x-green.png';
import red from '../../assets/images/png/marker-icon-2x-red.png';

export const getMarkerIcon = (statusType) => {
  switch (statusType) {
    case 1:
      return green;
    case 0:
      return red;
    default:
      return 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-gold.png';
  }
};

 const defaultCenter = [19.75, 75.71];


const getLeafletIcon = (statusType) => {
  const iconUrl = getMarkerIcon(statusType);
  return new L.Icon({
    iconUrl,
    iconSize: [18, 30],
    iconAnchor: [9, 30],
    popupAnchor: [0, -30],
  });
};


const FitToMarkers = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !markers || markers.length === 0) return;

    const bounds = markers.map((m) => [parseFloat(m.lat), parseFloat(m.lng)]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12, animate: true });
  }, [map, markers]);

  return null;
};

const MapComponent = ({ mapMarkers = [], selectedStatus , selectedCircle }) => {
  const { serialNumber } = useContext(AppContext); 
  const [selectedMarker, setSelectedMarker] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const markers = Array.isArray(mapMarkers) ? mapMarkers : [];

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleCloseInfoWindow = () => {
    setSelectedMarker(null);
  };

  const hideDefaultCloseButton = `
    .leaflet-popup-close-button {
      display: none !important;
    }
  `;

  const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});

useEffect(() => {
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);




   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('xl'));

  const { mapHeight, mapZoom } = useMemo(() => {
    if (isMobile) {
      return { mapHeight: '300px', mapZoom: 3 };
    }
    if (isTablet) {
      return { mapHeight: '400px', mapZoom: 4 };
    }
    if (isDesktop) {
      return { mapHeight: '550px', mapZoom: 5 };
    }
    return { mapHeight: '400px', mapZoom: 5 };
  }, [isMobile, isTablet, isDesktop, windowSize.width]);


  // Filter markers based on selected circle
const filteredMarkers = useMemo(() => {
  if (!markers?.length) return []; // prevent empty map flicker
  if (!selectedCircle || !selectedCircle.id) return markers;
  return markers.filter((m) => String(m.circleId) === String(selectedCircle.id));
}, [markers, selectedCircle]);

  // Updated function to prioritize the selected serialNumber from context
  const getSelectedSerialNumber = (serialNumberArray) => {
    if (Array.isArray(serialNumberArray) && serialNumberArray.length > 0) {
      // Check if the selected serialNumber from context exists in the array
      if (serialNumber && serialNumberArray.includes(serialNumber)) {
        return serialNumber; // Return the selected serialNumber
      }
      return serialNumberArray[0]; // Fallback to the first element if no match
    }
    return serialNumberArray || 'N/A'; // Fallback if not an array or empty
  };

  return (
    <>
      <style>{hideDefaultCloseButton}</style>
      <div style={{ borderColor: colors.primary[300], overflow: 'hidden'}}>
        <MapContainer
          center={defaultCenter}
          zoom={mapZoom}
         style={{ height: mapHeight }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
             {filteredMarkers.length > 0 && <FitToMarkers markers={filteredMarkers} />}
        
          {filteredMarkers.map((marker, index) => {
            const position = [parseFloat(marker.lat), parseFloat(marker.lng)];
            return (
              <React.Fragment key={index}>
                <Marker
                  position={position}
                  icon={getLeafletIcon(marker.statusType)}
                  eventHandlers={{ click: () => handleMarkerClick(marker) }}
                />
                {selectedMarker === marker && (
                  <Popup
                    position={position}
                    closeButton={false}
                    autoClose={false}
                    closeOnClick={false}
                  >
                    <div style={infoWindowStyle}>
                      <CloseIcon style={closeButtonStyle} onClick={handleCloseInfoWindow} />
                      <div style={titleStyle}>{marker.name}</div>
                      <div style={contentStyle}>
                        <span>
                          <div style={{ display: 'flex' }}>
                            <div><strong style={{ width: '85px', display: 'inline-block' }}>🔹Sub-Station ID</strong></div>
                            <div><strong>:</strong></div>
                            <div style={{ color: '#000f89', fontWeight: 'bold' }}>{marker.siteId}</div>
                          </div>
                        </span>
                        <span>
                          {/* <div style={{ display: 'flex' }}>
                            <div><strong style={{ width: '85px', display: 'inline-block' }}>🔹Customer</strong></div>
                            <div><strong>:</strong></div>
                            <div style={{ color: '#000f89', fontWeight: 'bold' }}>{marker.vendor || 'N/A'}</div>
                          </div> */}
                        </span>
                        <span>
                          <div style={{ display: 'flex' }}>
                            <div><strong style={{ width: '85px', display: 'inline-block' }}>🔹SerialNumber</strong></div>
                            <div><strong>:</strong></div>
                            <div style={{ color: '#000f89', fontWeight: 'bold' }}>
                              {getSelectedSerialNumber(marker.serialNumber)}
                            </div>
                          </div>
                        </span>
                      </div>
                    </div>
                  </Popup>
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default MapComponent;

const infoWindowStyle = {
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
  color: '#333',
  minWidth: '150px',
  padding: '1px',
  margin: '0',
};

const closeButtonStyle = {
  position: 'fixed',
  top: '1px',
  right: '5px',
  cursor: 'pointer',
  fontSize: '8px',
  fontWeight: 'bold',
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  zIndex: 1000,
};

const titleStyle = {
  fontSize: '15px',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#2c3e50',
  backgroundColor: '#FFC107',
  textAlign: 'center',
  padding: '5px',
  borderRadius: '4px',
};

const contentStyle = {
  display: 'flex',
  fontSize: '10px',
  fontWeight: '200',
  flexDirection: 'column',
  gap: '5px',
};