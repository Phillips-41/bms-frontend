import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import axios from "axios";

const BASE_URL = "https://rbms.mahadiscom.in/mseb";

/**
 * Mandatory dialog for NEW LDAP users to select their location hierarchy.
 * State → Zone → Circle → Division → Area
 * Lower levels can be left empty (= full access under parent).
 *
 * Props:
 *   open          – show dialog
 *   onComplete    – called with new JWT after successful save
 *   token         – current JWT (for Authorization header)
 */
export default function LocationSetupDialog({ open, onComplete, token }) {
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [circles, setCircles] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [areas, setAreas] = useState([]);

  const [stateId, setStateId] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [circleId, setCircleId] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [areaId, setAreaId] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load states when dialog opens
  useEffect(() => {
    if (!open) return;
    setError("");
    setStateId("");
    setZoneId("");
    setCircleId("");
    setDivisionId("");
    setAreaId("");
    setZones([]);
    setCircles([]);
    setDivisions([]);
    setAreas([]);

    const loadStates = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/states`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        // Support both [{id, name}] and string[] shapes
        const data = res.data || [];
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === "string") {
          setStates(data.map((name, i) => ({ id: name, name })));
        } else {
          setStates(
            data.map((s) => ({
              id: s.id ?? s.stateId ?? s.name,
              name: s.name ?? s.stateName ?? String(s),
            }))
          );
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load states. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadStates();
  }, [open, token]);

  // Cascading loaders – adjust endpoints if your API uses different paths/params
  const loadZones = async (selectedState) => {
    setZones([]);
    setCircles([]);
    setDivisions([]);
    setAreas([]);
    setZoneId("");
    setCircleId("");
    setDivisionId("");
    setAreaId("");
    if (!selectedState) return;
    try {
      // Existing frontend uses fetchAllZones(stateName) – keep compatible
      const res = await axios.get(`${BASE_URL}/api/zones`, {
        params: { state: selectedState },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data || [];
      setZones(
        data.map((z) => ({
          id: z.id ?? z.zoneId ?? z.name,
          name: z.name ?? z.zoneName ?? String(z),
        }))
      );
    } catch (e) {
      // Fallback: try by state name path used elsewhere
      try {
        const res2 = await axios.get(`${BASE_URL}/api/getAllZones`, {
          params: { state: selectedState },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = res2.data || [];
        setZones(
          data.map((z) => ({
            id: z.id ?? z.zoneId ?? z,
            name: z.name ?? z.zoneName ?? String(z),
          }))
        );
      } catch (e2) {
        console.error("Failed to load zones", e2);
      }
    }
  };

  const loadCircles = async (selectedZone) => {
    setCircles([]);
    setDivisions([]);
    setAreas([]);
    setCircleId("");
    setDivisionId("");
    setAreaId("");
    if (!selectedZone) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/circles`, {
        params: { zone: selectedZone },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data || [];
      setCircles(
        data.map((c) => ({
          id: c.id ?? c.circleId ?? c.name,
          name: c.name ?? c.circleName ?? String(c),
        }))
      );
    } catch (e) {
      try {
        const res2 = await axios.get(`${BASE_URL}/api/getAllCircles`, {
          params: { zone: selectedZone },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = res2.data || [];
        setCircles(
          data.map((c) => ({
            id: c.id ?? c.circleId ?? c,
            name: c.name ?? c.circleName ?? String(c),
          }))
        );
      } catch (e2) {
        console.error("Failed to load circles", e2);
      }
    }
  };

  const loadDivisions = async (selectedCircle) => {
    setDivisions([]);
    setAreas([]);
    setDivisionId("");
    setAreaId("");
    if (!selectedCircle) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/divisions`, {
        params: { circle: selectedCircle },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data || [];
      setDivisions(
        data.map((d) => ({
          id: d.id ?? d.divisionId ?? d.name,
          name: d.name ?? d.divisionName ?? String(d),
        }))
      );
    } catch (e) {
      try {
        const res2 = await axios.get(`${BASE_URL}/api/getAllDivisions`, {
          params: { circle: selectedCircle },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = res2.data || [];
        setDivisions(
          data.map((d) => ({
            id: d.id ?? d.divisionId ?? d,
            name: d.name ?? d.divisionName ?? String(d),
          }))
        );
      } catch (e2) {
        console.error("Failed to load divisions", e2);
      }
    }
  };

  const loadAreas = async (selectedDivision) => {
    setAreas([]);
    setAreaId("");
    if (!selectedDivision) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/areas`, {
        params: { division: selectedDivision },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = res.data || [];
      setAreas(
        data.map((a) => ({
          id: a.id ?? a.areaId ?? a.name,
          name: a.name ?? a.areaName ?? String(a),
        }))
      );
    } catch (e) {
      try {
        const res2 = await axios.get(`${BASE_URL}/api/getAreaNames`, {
          params: { division: selectedDivision },
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = res2.data || [];
        setAreas(
          data.map((a) => ({
            id: a.id ?? a.areaId ?? a,
            name: a.name ?? a.areaName ?? String(a),
          }))
        );
      } catch (e2) {
        console.error("Failed to load areas", e2);
      }
    }
  };

  const handleStateChange = (e) => {
    const id = e.target.value;
    setStateId(id);
    const selected = states.find((s) => String(s.id) === String(id));
    loadZones(selected?.name ?? id);
  };

  const handleZoneChange = (e) => {
    const id = e.target.value;
    setZoneId(id);
    const selected = zones.find((z) => String(z.id) === String(id));
    loadCircles(selected?.name ?? id);
  };

  const handleCircleChange = (e) => {
    const id = e.target.value;
    setCircleId(id);
    const selected = circles.find((c) => String(c.id) === String(id));
    loadDivisions(selected?.name ?? id);
  };

  const handleDivisionChange = (e) => {
    const id = e.target.value;
    setDivisionId(id);
    const selected = divisions.find((d) => String(d.id) === String(id));
    loadAreas(selected?.name ?? id);
  };

  const handleSave = async () => {
    if (!stateId) {
      setError("Please select at least a State.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      // Send numeric ids when possible; backend expects Long ids
      const toLong = (v) => {
        if (v === "" || v == null) return null;
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
      };

      const body = {
        stateId: toLong(stateId) ?? stateId,
        zoneId: toLong(zoneId),
        circleId: toLong(circleId),
        divisionId: toLong(divisionId),
        areaId: toLong(areaId),
      };

      const res = await axios.post(`${BASE_URL}/api/user/location-access`, body, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const newJwt = res.data?.jwt ?? res.data?.token;
      if (!newJwt) {
        setError("Server did not return a new token. Please try again.");
        return;
      }
      onComplete?.(newJwt);
    } catch (e) {
      console.error(e);
      setError(
        e.response?.data?.message ||
          e.message ||
          "Failed to save location. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const selectSx = {
    minWidth: 220,
    "& .MuiInputBase-root": { height: 40, fontSize: 13 },
  };

  return (
    <Dialog
      open={open}
      // Mandatory – no close on backdrop / escape
      disableEscapeKeyDown
      onClose={() => {}}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          background: "linear-gradient(to right, #d82b27, #f09819)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
        }}
      >
        Select Your Location Access
      </DialogTitle>

      <DialogContent sx={{ pt: 2.5 }}>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          This is required for first-time login. Choose the highest level you
          manage. Leave lower levels empty for full access under that level.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <FormControl fullWidth size="small" required sx={selectSx}>
              <InputLabel>State *</InputLabel>
              <Select
                value={stateId}
                label="State *"
                onChange={handleStateChange}
              >
                {states.map((s) => (
                  <MenuItem key={String(s.id)} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={selectSx} disabled={!stateId}>
              <InputLabel>Zone (optional)</InputLabel>
              <Select
                value={zoneId}
                label="Zone (optional)"
                onChange={handleZoneChange}
              >
                <MenuItem value="">
                  <em>Full access under State</em>
                </MenuItem>
                {zones.map((z) => (
                  <MenuItem key={String(z.id)} value={z.id}>
                    {z.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={selectSx} disabled={!zoneId}>
              <InputLabel>Circle (optional)</InputLabel>
              <Select
                value={circleId}
                label="Circle (optional)"
                onChange={handleCircleChange}
              >
                <MenuItem value="">
                  <em>Full access under Zone</em>
                </MenuItem>
                {circles.map((c) => (
                  <MenuItem key={String(c.id)} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={selectSx}
              disabled={!circleId}
            >
              <InputLabel>Division (optional)</InputLabel>
              <Select
                value={divisionId}
                label="Division (optional)"
                onChange={handleDivisionChange}
              >
                <MenuItem value="">
                  <em>Full access under Circle</em>
                </MenuItem>
                {divisions.map((d) => (
                  <MenuItem key={String(d.id)} value={d.id}>
                    {d.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              size="small"
              sx={selectSx}
              disabled={!divisionId}
            >
              <InputLabel>Area (optional)</InputLabel>
              <Select
                value={areaId}
                label="Area (optional)"
                onChange={(e) => setAreaId(e.target.value)}
              >
                <MenuItem value="">
                  <em>Full access under Division</em>
                </MenuItem>
                {areas.map((a) => (
                  <MenuItem key={String(a.id)} value={a.id}>
                    {a.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || !stateId || loading}
          sx={{
            background: "#d82b27",
            textTransform: "none",
            fontWeight: 600,
            minWidth: 120,
            "&:hover": { background: "#b71c1c" },
          }}
        >
          {saving ? <CircularProgress size={20} color="inherit" /> : "Save & Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
