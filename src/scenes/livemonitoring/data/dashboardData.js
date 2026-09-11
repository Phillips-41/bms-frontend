// -----------------------------------------------------------------------------
// TEMPORARY MOCK TELEMETRY
// Every value the dashboard renders lives here so that a real API/websocket feed
// can replace this single module without touching any component.
// -----------------------------------------------------------------------------

/** Cell status keys used by CellsPanel badges */
export const CELL_STATUS = {
  NORMAL: "normal",
  HIGH_VOLTAGE: "high_voltage",
  HIGH_TEMPERATURE: "high_temperature",
  LOW_VOLTAGE: "low_voltage",
  ABOUT_TO_DIE: "about_to_die",
  OPEN_BATTERY: "open_battery",
};

/** 15 battery cells: [voltage (V), temperature (°C), status] */
export const cells = [
  [2.217, 30, "normal"],
  [2.202, 30, "normal"],
  [2.146, 31, "low_voltage"],
  [2.196, 30, "normal"],
  [2.208, 29, "normal"],
  [2.187, 30, "normal"],
  [2.163, 31, "high_temperature"],
  [2.225, 30, "high_voltage"],
  [2.198, 29, "normal"],
  [2.214, 30, "normal"],
  [2.189, 31, "normal"],
  [2.201, 30, "normal"],
  [2.196, 29, "about_to_die"],
  [2.219, 30, "normal"],
  [2.233, 29, "open_battery"],
];

export const cellsSummary = {
  total: 15,
  normal: 11,
  average: "2.199 V",
  delta: "Δ 87 mV",
};

/**
 * Cascading location hierarchy for the Header filters.
 * Shape: state → zone → circle → subDivision → substation[]
 * Replace with API responses later.
 */
export const locationHierarchy = {
  Maharashtra: {
    Jalgaon: {
      Jalgaon: {
        "AMALNER-II": ["33/11 KV Amalner", "33/11 KV Chopda", "11 KV Dharangaon"],
        "BHUSAWAL": ["33/11 KV Bhusawal", "11 KV Deepnagar"],
      },
      "Muktainagar": {
        "MUKTAINAGAR": ["33/11 KV Muktainagar", "11 KV Kurha"],
      },
    },
    Nagpur: {
      Nagpur: {
        "NAGPUR URBAN": ["33/11 KV Civil Lines", "11 KV Sitabuldi"],
        "KAMPTEE": ["33/11 KV Kamptee"],
      },
    },
    Pune: {
      Pune: {
        "PUNE CITY": ["33/11 KV Shivajinagar", "11 KV Kothrud"],
      },
    },
  },
  Gujarat: {
    Surat: {
      Surat: {
        "SURAT CITY": ["33/11 KV Adajan", "11 KV Vesu"],
      },
    },
  },
};

export const device = {
  id: "VJMDBMC250942",
  timestamp: "07/09/2026  10:55:27",
  timestampISO: "2026-09-07T10:55:27",
  connected: true,
  live: true,
};

export const deviceDetails = [
  ["Serial Number", "AAJCO0942"],
  ["Manufacturer", "AAJCO"],
  ["Battery Type", "TUBULAR"],
  ["Capacity", "100 Ah"],
  ["Design Voltage", "30 V"],
  ["Individual Cell", "2.0 V"],
  ["First Used Date", "2026-04-21"],
  ["KVA Rating", "33/11 KV"],
];

export const health = {
  state: "Normal",
  items: [
    ["Cells", "15/15"],
    ["Communication", "15/15"],
    ["Active alarms", "0"],
  ],
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
    ["AC voltage", "243.97 V"],
    ["AC current", "1.11 A"],
    ["AC energy", "431.73 kWh"],
    ["Frequency", "50.00 Hz"],
  ],
};

export const cumulative = [
  ["Cycle count", "39"],
  ["Ampere hour in", "755.526 Ah"],
  ["Ampere hour out", "233.719 Ah"],
  ["Charging energy", "25.8736 kWh"],
  ["Discharging energy", "1.1594 kWh"],
  ["Battery run hours", "03:42:50"],
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
