// import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import CloseIcon from '@mui/icons-material/Close';
// import { useTheme } from '@mui/material/styles';
// import { AppContext } from '../../services/AppContext';
// import { tokens } from '../../theme';
// import green from '../../assets/images/png/marker-icon-2x-green.png';
// import red from '../../assets/images/png/marker-icon-2x-red.png';

// export const getMarkerIcon = (statusType) => {
//   switch (statusType) {
//     case 1:
//       return green;
//     case 0:
//       return red;
//     default:
//       return 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-gold.png';
//   }
// };

// const getLeafletIcon = (statusType) =>
//   new L.Icon({
//     iconUrl: getMarkerIcon(statusType),
//     iconSize: [18, 30],
//     iconAnchor: [9, 30],
//     popupAnchor: [0, -30],
//   });

// const DEFAULT_CENTER = [19.0, 74.0];
// const DEFAULT_ZOOM = 7;

// // Fit map to markers + fix size after layout changes
// const MapEffects = ({ markers }) => {
//   const map = useMap();

//   // Fit bounds whenever markers change
//   useEffect(() => {
//     if (!map || !markers?.length) return;

//     const points = markers
//       .map((m) => [parseFloat(m.lat), parseFloat(m.lng)])
//       .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));

//     if (points.length === 0) return;

//     if (points.length === 1) {
//       map.setView(points[0], 12, { animate: true });
//     } else {
//       map.fitBounds(points, { padding: [40, 40], maxZoom: 12, animate: true });
//     }
//   }, [map, markers]);

//   // ResizeObserver – when parent grid cell changes size
//   useEffect(() => {
//     if (!map) return;
//     const container = map.getContainer();
//     if (!container) return;

//     const ro = new ResizeObserver(() => {
//       map.invalidateSize();
//     });
//     ro.observe(container);
//     return () => ro.disconnect();
//   }, [map]);

//   return null;
// };

// const MapComponent = ({ mapMarkers = [] }) => {
//   const { serialNumber } = useContext(AppContext);
//   const [selectedMarker, setSelectedMarker] = useState(null);
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   // Only keep markers with valid coordinates
//   const markers = useMemo(() => {
//     if (!Array.isArray(mapMarkers)) return [];
//     return mapMarkers.filter(
//       (m) => m &&
//         Number.isFinite(parseFloat(m.lat)) &&
//         Number.isFinite(parseFloat(m.lng))
//     );
//   }, [mapMarkers]);

//   const getSelectedSerialNumber = (serialNumberArray) => {
//     if (Array.isArray(serialNumberArray) && serialNumberArray.length > 0) {
//       if (serialNumber && serialNumberArray.includes(serialNumber)) {
//         return serialNumber;
//       }
//       return serialNumberArray[0];
//     }
//     return serialNumberArray || 'N/A';
//   };

//   return (
//     <>
//       <style>{`
//         .leaflet-popup-close-button { display: none !important; }
//         .leaflet-container { width: 100%; height: 100%; z-index: 0; }
//       `}</style>

//       {/* Parent must give this div a real height (see NewDashboard) */}
//       <div
//         style={{
//           width: '100%',
//           height: '100%',
//           minHeight: 200,
//           borderColor: colors.primary[300],
//           overflow: 'hidden',
//           borderRadius: 8,
//         }}
//       >
//         <MapContainer
//           center={DEFAULT_CENTER}
//           zoom={DEFAULT_ZOOM}
//           style={{ width: '100%', height: '100%' }}
//           scrollWheelZoom
//         >
//           <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//           <MapEffects markers={markers} />

//           {markers.map((marker, index) => {
//             const lat = parseFloat(marker.lat);
//             const lng = parseFloat(marker.lng);
//             const position = [lat, lng];

//             return (
//               <React.Fragment key={marker.siteId || `${lat}-${lng}-${index}`}>
//                 <Marker
//                   position={position}
//                   icon={getLeafletIcon(marker.statusType)}
//                   eventHandlers={{
//                     click: () => setSelectedMarker(marker),
//                   }}
//                 />
//                 {selectedMarker === marker && (
//                   <Popup
//                     position={position}
//                     closeButton={false}
//                     autoClose={false}
//                     closeOnClick={false}
//                   >
//                     <div style={infoWindowStyle}>
//                       <CloseIcon
//                         style={closeButtonStyle}
//                         onClick={() => setSelectedMarker(null)}
//                       />
//                       <div style={titleStyle}>{marker.name}</div>
//                       <div style={contentStyle}>
//                         <div style={{ display: 'flex' }}>
//                           <strong style={{ width: 85 }}>🔹Sub-Station ID</strong>
//                           <strong>:</strong>
//                           <span style={{ color: '#000f89', fontWeight: 'bold', marginLeft: 4 }}>
//                             {marker.siteId}
//                           </span>
//                         </div>
//                         <div style={{ display: 'flex' }}>
//                           <strong style={{ width: 85 }}>🔹SerialNumber</strong>
//                           <strong>:</strong>
//                           <span style={{ color: '#000f89', fontWeight: 'bold', marginLeft: 4 }}>
//                             {getSelectedSerialNumber(marker.serialNumber)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </Popup>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </MapContainer>
//       </div>
//     </>
//   );
// };

// export default MapComponent;

// const infoWindowStyle = {
//   fontSize: '14px',
//   fontFamily: 'Arial, sans-serif',
//   color: '#333',
//   minWidth: '150px',
//   padding: '1px',
//   margin: 0,
// };

// const closeButtonStyle = {
//   position: 'absolute',
//   top: 2,
//   right: 4,
//   cursor: 'pointer',
//   fontSize: 16,
//   zIndex: 1000,
// };

// const titleStyle = {
//   fontSize: '15px',
//   fontWeight: 'bold',
//   marginBottom: 8,
//   color: '#2c3e50',
//   backgroundColor: '#FFC107',
//   textAlign: 'center',
//   padding: 5,
//   borderRadius: 4,
// };

// const contentStyle = {
//   display: 'flex',
//   fontSize: 10,
//   flexDirection: 'column',
//   gap: 5,
// };




import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
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

const getLeafletIcon = (statusType) =>
  new L.Icon({
    iconUrl: getMarkerIcon(statusType),
    iconSize: [18, 30],
    iconAnchor: [9, 30],
    popupAnchor: [0, -30],
  });

const DEFAULT_CENTER = [19.0, 74.0];
const DEFAULT_ZOOM = 7;

// Fit map to markers + fix size after layout changes
const MapEffects = ({ markers }) => {
  const map = useMap();

  // Fit bounds whenever markers change
  useEffect(() => {
    if (!map || !markers?.length) return;

    const points = markers
      .map((m) => [parseFloat(m.lat), parseFloat(m.lng)])
      .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 12, { animate: true });
    } else {
      map.fitBounds(points, { padding: [40, 40], maxZoom: 12, animate: true });
    }
  }, [map, markers]);

  // ResizeObserver – when parent grid cell changes size
  useEffect(() => {
    if (!map) return;
    const container = map.getContainer();
    if (!container) return;

    const ro = new ResizeObserver(() => {
      map.invalidateSize();
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [map]);

  return null;
};

const MapComponent = ({ mapMarkers = [] }) => {
  const { serialNumber } = useContext(AppContext);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Filter to show ONLY non-communicating devices (statusType: 0) with valid coordinates
  const markers = useMemo(() => {
    if (!Array.isArray(mapMarkers)) return [];
    return mapMarkers.filter(
      (m) => m &&
        Number.isFinite(parseFloat(m.lat)) &&
        Number.isFinite(parseFloat(m.lng)) &&
        m.statusType === 0  // Only show non-communicating devices
    );
  }, [mapMarkers]);

  const getSelectedSerialNumber = (serialNumberArray) => {
    if (Array.isArray(serialNumberArray) && serialNumberArray.length > 0) {
      if (serialNumber && serialNumberArray.includes(serialNumber)) {
        return serialNumber;
      }
      return serialNumberArray[0];
    }
    return serialNumberArray || 'N/A';
  };

  // Count non-communicating devices for display
  const nonCommunicatingCount = markers.length;

  return (
    <>
      <style>{`
        .leaflet-popup-close-button { display: none !important; }
        .leaflet-container { width: 100%; height: 100%; z-index: 0; }
      `}</style>

      {/* Parent must give this div a real height (see NewDashboard) */}
      <div
        style={{
          width: '100%',
          height: '100%',
          minHeight: 200,
          borderColor: colors.primary[300],
          overflow: 'hidden',
          borderRadius: 8,
        }}
      >
        <MapContainer
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <MapEffects markers={markers} />

          {markers.map((marker, index) => {
            const lat = parseFloat(marker.lat);
            const lng = parseFloat(marker.lng);
            const position = [lat, lng];

            return (
              <React.Fragment key={marker.siteId || `${lat}-${lng}-${index}`}>
                <Marker
                  position={position}
                  icon={getLeafletIcon(marker.statusType)}
                  eventHandlers={{
                    click: () => setSelectedMarker(marker),
                  }}
                />
                {selectedMarker === marker && (
                  <Popup
                    position={position}
                    closeButton={false}
                    autoClose={false}
                    closeOnClick={false}
                  >
                    <div style={infoWindowStyle}>
                      <CloseIcon
                        style={closeButtonStyle}
                        onClick={() => setSelectedMarker(null)}
                      />
                      <div style={titleStyle}>{marker.name}</div>
                      <div style={contentStyle}>
                        <div style={{ display: 'flex' }}>
                          <strong style={{ width: 85 }}>🔹Sub-Station ID</strong>
                          <strong>:</strong>
                          <span style={{ color: '#000f89', fontWeight: 'bold', marginLeft: 4 }}>
                            {marker.siteId}
                          </span>
                        </div>
                        <div style={{ display: 'flex' }}>
                          <strong style={{ width: 85 }}>🔹SerialNumber</strong>
                          <strong>:</strong>
                          <span style={{ color: '#000f89', fontWeight: 'bold', marginLeft: 4 }}>
                            {getSelectedSerialNumber(marker.serialNumber)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', marginTop: 4 }}>
                          <strong style={{ width: 85 }}>🔹Status</strong>
                          <strong>:</strong>
                          <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: 4 }}>
                            Non-Communicating
                          </span>
                        </div>
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
  margin: 0,
};

const closeButtonStyle = {
  position: 'absolute',
  top: 2,
  right: 4,
  cursor: 'pointer',
  fontSize: 16,
  zIndex: 1000,
};

const titleStyle = {
  fontSize: '15px',
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#2c3e50',
  backgroundColor: '#FFC107',
  textAlign: 'center',
  padding: 5,
  borderRadius: 4,
};

const contentStyle = {
  display: 'flex',
  fontSize: 10,
  flexDirection: 'column',
  gap: 5,
};