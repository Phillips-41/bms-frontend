import React, { useState, useEffect, useContext, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material';
import { AppContext } from '../../services/AppContext';
import { tokens } from '../../theme';
import green from '../../assets/images/png/marker-icon-2x-green.png';
import red from '../../assets/images/png/marker-icon-2x-red.png';
import './MapComponent.css';

export const getMarkerIcon = (statusType) => {
  switch (statusType) {
    case 0: return green;
    case 1: return red;
    default: return 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-2x-gold.png';
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
    const ro = new ResizeObserver(() => map.invalidateSize());
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
      (m) => m && Number.isFinite(parseFloat(m.lat)) && Number.isFinite(parseFloat(m.lng))
    );
  }, [mapMarkers]);

  const getSelectedSerialNumber = (serialNumberArray) => {
    if (Array.isArray(serialNumberArray) && serialNumberArray.length > 0) {
      if (serialNumber && serialNumberArray.includes(serialNumber)) return serialNumber;
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

      <div className="map-wrap" style={{ borderColor: colors.primary[300] }}>
        <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ width: '100%', height: '100%' }} scrollWheelZoom>
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
                  eventHandlers={{ click: () => setSelectedMarker(marker) }}
                />
                {selectedMarker === marker && (
                  <Popup position={position} closeButton={false} autoClose={false} closeOnClick={false}>
                    <div className="map-popup">
                      <CloseIcon className="map-popup-close" onClick={() => setSelectedMarker(null)} />
                      <div className="map-popup-title">{marker.name}</div>
                      <div className="map-popup-body">
                        <div className="map-popup-row">
                          <strong className="label">🔹Sub-Station ID</strong>
                          <strong>:</strong>
                          <span className="val">{marker.siteId}</span>
                        </div>
                        <div className="map-popup-row">
                          <strong className="label">🔹SerialNumber</strong>
                          <strong>:</strong>
                          <span className="val">{getSelectedSerialNumber(marker.serialNumber)}</span>
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
