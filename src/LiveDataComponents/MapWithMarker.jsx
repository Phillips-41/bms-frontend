
import React, { useRef, useEffect, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { AppContext } from "../services/AppContext";
import { getMarkerIcon } from "../scenes/Dashboard/MapComponent";
import { Box } from "@mui/material";
import "leaflet/dist/leaflet.css";

// Fix for Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const MapWithMarker = () => {
  const { Mdata, status } = useContext(AppContext);
  const [selectedMarker, setSelectedMarker] = React.useState(false);
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = React.useState([0, 0]);

  const {
    customer = "",
    ahCapacity = "",
    latitude = 0,
    longitude = 0,
    location = "",
  } = Mdata;

  const lat = parseFloat(latitude) || 19.2403;
  const lng = parseFloat(longitude) || 73.1305;

  // Component to handle map panning
  const MapController = () => {
    const map = useMap();
    mapRef.current = map;

    useEffect(() => {
      if (lat && lng) {
        // setMapCenter([lat, lng]);
        map.panTo([lat, lng]);
      }
    }, [lat, lng, map]);

    useEffect(() => {
      if (mapRef.current) {
        const newLat = selectedMarker ? lat + 0.0025 : lat; // Pan down when marker selected
        map.panTo([newLat, lng]);
      }
    }, [selectedMarker, lat, lng, map]);

    return null;
  };

  const handleMarkerClick = () => setSelectedMarker(true);
  const handleClosePopup = () => setSelectedMarker(false);

  // Custom marker icon
  const customIcon = L.icon({
    iconUrl: getMarkerIcon(status),
    iconSize: [25, 41],
    iconAnchor: [12.5, 41], // Center horizontally, anchor at bottom
    popupAnchor: [0, -20], // Popup offset
  });

  return (
    <Box
      sx={{
        position: "relative",
        height: { lg: "200px", xl: "220px" },
        width: "100%",
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
        borderRadius: "8px",
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={10}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController />
        <Marker
          position={[lat, lng]}
          icon={customIcon}
          eventHandlers={{
            click: handleMarkerClick,
          }}
        >
          {selectedMarker && (
            <Popup
              offset={[0, -20]}
              closeButton={false}
              autoPan={false}
              onClose={handleClosePopup}
            >
              <div style={infoWindowStyle}>
                <button
                  style={closeButtonStyle}
                  onClick={handleClosePopup}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#e0e0e0")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5f5")
                  }
                >
                  ×
                </button>
                <div style={titleStyle}>{location || "Location"}</div>
                <div style={contentStyle}>
                  <div style={infoItemStyle}>
                    <strong style={labelStyle}>🔹 Customer</strong>
                    <span style={valueStyle}>:</span>
                    <span style={valueStyle}>{customer || "N/A"}</span>
                  </div>
                  <div style={infoItemStyle}>
                    <strong style={labelStyle}>🔹 Ah Capacity</strong>
                    <span style={valueStyle}>:</span>
                    <span style={valueStyle}>{ahCapacity || "N/A"} Ah</span>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </Box>
  );
};

// Updated styles with reduced padding
const infoWindowStyle = {
  background: "#ffffff",
  fontFamily: "'Roboto', sans-serif",
  padding: 0,
  margin: 0,
  position: "relative",
  borderRadius: "6px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  width: "200px",
  minWidth: "200px",
};

const closeButtonStyle = {
  position: "absolute",
  top: "0px",
  right: "30px",
  width: "20px",
  height: "20px",
  background: "#f5f5f5",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  color: "#757575",
  fontSize: "14px",
  border: "none",
  transition: "background-color 0.2s",
  zIndex: 1,
};

const titleStyle = {
  fontSize: "15px",
  fontWeight: "600",
  color: "#1a73e8",
  textAlign: "center",
  marginBottom: "8px",
  paddingRight: "25px",
};

const contentStyle = {
  color: "#424242",
  lineHeight: "1.5",
};

const infoItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
  padding: "0",
};

const labelStyle = {
  width: "90px",
  display: "inline-block",
  color: "#333",
  fontWeight: "500",
  fontSize: "9px",
};

const valueStyle = {
  color: "#000f89",
  fontWeight: "bold",
  marginLeft: "3px",
  fontSize: "9px",
};

export default MapWithMarker;