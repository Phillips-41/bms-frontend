import React, { useState, useEffect, useContext, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CloseIcon from '@mui/icons-material/Close';
import { Box, useTheme } from '@mui/material';
import { AppContext } from '../../services/AppContext';
import { tokens } from '../../theme';
import green from '../../assets/images/png/marker-icon-2x-green.png';
import red from '../../assets/images/png/marker-icon-2x-red.png';

export const getMarkerIcon = (statusType) => {
  switch (statusType) {
    case 0:
      return green;
    case 1:
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

const MapEffects = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !markers?.length) return;

    const points = markers
      .map((m) => [parseFloat(m.lat), parseFloat(m.lng)])
      .filter(([lat, lng]) => Number.isFinite(lat) && Number.isFinite(lng));

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 12, { animate: true });
    } else {
      map.fitBounds(points, { padding: [30, 30], maxZoom: 12, animate: true });
    }
  }, [map, markers]);

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

  const markers = useMemo(() => {
    if (!Array.isArray(mapMarkers)) return [];
    return mapMarkers.filter(
      (m) =>
        m &&
        Number.isFinite(parseFloat(m.lat)) &&
        Number.isFinite(parseFloat(m.lng))
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

  return (
    <>
      <style>{`
        .leaflet-popup-close-button { display: none !important; }
        .leaflet-container { width: 100%; height: 100%; z-index: 0; }
      `}</style>

      <Box
        sx={{
          width: '100%',
          height: '100%',
          minHeight: { xs: 240, sm: 280, md: 320, lg: 200 },
          borderColor: colors.primary[300],
          overflow: 'hidden',
          borderRadius: { xs: 1.5, sm: 2, md: 2 },
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
                    <Box
                      sx={{
                        fontSize: { xs: '12px', sm: '13px', md: '14px' },
                        fontFamily: 'Arial, sans-serif',
                        color: '#333',
                        minWidth: { xs: 130, sm: 150 },
                        p: '1px',
                        m: 0,
                        position: 'relative',
                      }}
                    >
                      <CloseIcon
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 4,
                          cursor: 'pointer',
                          fontSize: { xs: 14, sm: 16 },
                          zIndex: 1000,
                        }}
                        onClick={() => setSelectedMarker(null)}
                      />
                      <Box
                        sx={{
                          fontSize: { xs: '13px', sm: '14px', md: '15px' },
                          fontWeight: 'bold',
                          mb: 1,
                          color: '#2c3e50',
                          backgroundColor: '#FFC107',
                          textAlign: 'center',
                          p: { xs: 0.5, sm: 0.75 },
                          borderRadius: 1,
                        }}
                      >
                        {marker.name}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          fontSize: { xs: 9, sm: 10 },
                          flexDirection: 'column',
                          gap: 0.75,
                        }}
                      >
                        <Box sx={{ display: 'flex' }}>
                          <strong style={{ width: 85 }}>🔹Sub-Station ID</strong>
                          <strong>:</strong>
                          <span style={{ color: '#000f89', fontWeight: 'bold', marginLeft: 4 }}>
                            {marker.siteId}
                          </span>
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                          <strong style={{ width: 85 }}>🔹SerialNumber</strong>
                          <strong>:</strong>
                          <span style={{ color: '#000f89', fontWeight: 'bold', marginLeft: 4 }}>
                            {getSelectedSerialNumber(marker.serialNumber)}
                          </span>
                        </Box>
                      </Box>
                    </Box>
                  </Popup>
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </Box>
    </>
  );
};

export default MapComponent;
