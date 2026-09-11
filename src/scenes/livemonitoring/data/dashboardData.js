// -----------------------------------------------------------------------------
// TEMPORARY MOCK TELEMETRY
// Every value the dashboard renders lives here so that a real API/websocket feed
// can replace this single module without touching any component.
// -----------------------------------------------------------------------------

/** 15 battery cells: [voltage (V), temperature (°C), specific gravity] */
export const cells = [
  [2.217, 30, 1.357], [2.202, 30, 1.354], [2.146, 31, 1.349],
  [2.196, 30, 1.352], [2.208, 29, 1.355], [2.187, 30, 1.351],
  [2.163, 31, 1.340], [2.225, 30, 1.358], [2.198, 29, 1.353],
  [2.214, 30, 1.356], [2.189, 31, 1.350], [2.201, 30, 1.354],
  [2.196, 29, 1.352], [2.219, 30, 1.357], [2.233, 29, 1.359],
];

export const cellsSummary = { total: 15, normal: 15, average: "2.199 V", delta: "Δ 87 mV" };

/** Header hierarchy filters: Region → Location → Site → Substation → Voltage level */
export const filters = ["Maharashtra", "Jalgaon", "Jalgaon", "AMALNER-II", "33/11 KV"];

export const device = {
  id: "VJMDBMC250942",
  timestamp: "07/09/2026  10:55:27",
  timestampISO: "2026-09-07T10:55:27",
  connected: true,
  live: true,
};

export const deviceDetails = [
  ["Serial Number", "AAJCO0942"], ["Manufacturer", "AAJCO"], ["Battery Type", "TUBULAR"],
  ["Capacity", "100 Ah"], ["Design Voltage", "30 V"], ["Individual Cell", "2.0 V"],
  ["First Used Date", "2026-04-21"], ["KVA Rating", "33/11 KV"],
];

export const health = {
  state: "Normal",
  items: [["Cells", "15/15"], ["Communication", "15/15"], ["Active alarms", "0"]],
  subsystems: ["BMS", "Charger", "Thermal"],
};

/** Live battery status: [label, value, unit] */
export const liveMetrics = [
  ["Voltage", "32.81", "V"],
  ["Current", "0", "A"],
  ["Temperature", "30.11", "°C"],
];

export const stateOfCharge = { soc: 100, dod: 0 };

export const charger = {
  status: "charging", // "charging" | "idle" | "fault"
  readings: [
    ["AC voltage", "243.97 V"], ["AC current", "1.11 A"],
    ["AC energy", "431.73 kWh"], ["Frequency", "50.00 Hz"],
  ],
};

export const cumulative = [
  ["Cycle count", "39"], ["Ampere hour in", "755.526 Ah"], ["Ampere hour out", "233.719 Ah"],
  ["Charging energy", "25.8736 kWh"], ["Discharging energy", "1.1594 kWh"], ["Battery run hours", "03:42:50"],
];

export const cycles = {
  charge: { peak: "2.5 A", runtime: "122:53" },
  discharge: { peak: "2.2 A", runtime: "00:13" },
};

export const dischargeChart = [
  { label: "Average", value: "0.084 A", height: 30 },
  { label: "Peak", value: "2.0538 A", height: 78 },
];

export const ampereHourChart = [
  { label: "Ah In", value: "10.327", height: 84 },
  { label: "Ah Out", value: "0.445", height: 22 },
];

/** Only backend-raised alarms belong here. Empty array = system normal. */
export const alarms = [];
