import { useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../services/AppContext';

export const useSiteNavigation = () => {
  const navigate = useNavigate();
  const { setSiteId, setArea, setSerialNumber, handleSearch } = useContext(AppContext);

  const goToLiveMonitoring = useCallback(async ({ siteId, area, serialNumber } = {}) => {
    // Set ALL values first, then wait a tick for context to propagate
    if (siteId != null) setSiteId?.(siteId);
    if (area != null) setArea?.(area);
    if (serialNumber != null) setSerialNumber?.(serialNumber);

    // Wait for React to flush context updates before running search
    await new Promise((r) => setTimeout(r, 0));

    const ok = await handleSearch?.();
    if (ok !== false) {
      navigate('/livemonitoring', { state: { from: '/' } });
    }
  }, [setSiteId, setArea, setSerialNumber, handleSearch, navigate]);

  return { goToLiveMonitoring };
};


export const DEFAULT_STATE = 'Maharastra';

export const ALARM_DEFS = [
  { key: 'inputMains',      label: 'Input Mains Fail',          check: (i) => !!i.inputMains },
  { key: 'inputPhase',      label: 'Input Phase Fail',          check: (i) => !!i.inputPhase },
  { key: 'chargerTrip',     label: 'Charger Trip',              check: (i) => !!i.chargerTrip },
  { key: 'dcEarth',         label: 'DC Voltage Fault',          check: (i) => i.dcVoltageOln === 0 || i.dcVoltageOln === 2 },
  { key: 'stringVoltage',   label: 'String Voltage Alarm',      check: (i) => i.stringVoltageLhn === 0 || i.stringVoltageLhn === 2 },
  { key: 'cellVoltageLn',   label: 'Cell Voltage Low',          check: (i) => !!i.cellVoltageLn },
  { key: 'cellVoltageNh',   label: 'Cell Voltage High',         check: (i) => !!i.cellVoltageNh },
  { key: 'socLn',           label: 'SOC Low',                   check: (i) => !!i.socLn },
  { key: 'rectifierFuse',   label: 'Rectifier Fuse',            check: (i) => !!i.rectifierFuse },
  { key: 'filterFuse',      label: 'Filter Fuse',               check: (i) => !!i.filterFuse },
  { key: 'outputMccb',      label: 'Output MCCB',               check: (i) => !!i.outputMccb },
  { key: 'outputFuse',      label: 'Output Fuse',               check: (i) => !!i.outputFuse },
  { key: 'batteryCondition',label: 'Battery Condition',         check: (i) => !!i.batteryCondition },
  { key: 'acVoltage',       label: 'AC Voltage Alarm',          check: (i) => i.acVoltageUln === 0 || i.acVoltageUln === 2 },
  { key: 'ambientTemp',     label: 'Ambient Temperature High',  check: (i) => !!i.ambientTemperatureHn },
  { key: 'cellTemp',        label: 'Cell Temperature High',     check: (i) => !!i.cellTemperatureHn },
  { key: 'cellComm',        label: 'Cell Communication Fail',   check: (i) => !!i.cellCommunicationFd },
  { key: 'bmsComm',         label: 'BMS Communication Fail',    check: (i) => !!i.bmsSedCommunication },
  { key: 'bankCycle',       label: 'Bank Cycle DC',             check: (i) => !!i.bankCycleDc },
  { key: 'buzzer',          label: 'Buzzer',                    check: (i) => !!i.buzzer },
  { key: 'chargerLoad',     label: 'Charger Load',              check: (i) => !!i.chargerLoad },
  { key: 'alarmSupply',     label: 'Alarm Supply Fuse',         check: (i) => !!i.alarmSupplyFuse },
];

const ALARM_PRIORITY = [
  'bmsComm',
  'cellComm',
  'inputMains',
  'outputMccb',
  'chargerTrip',
  'ambientTemp',
  'cellTemp',
];

const safeCheck = (def, item) => {
  try {
    return def.check(item);
  } catch {
    return false;
  }
};

export const countActiveAlarms = (item) => item ? ALARM_DEFS.filter((d) => safeCheck(d, item)).length : 0;

export const hasActiveAlarm = (item) => countActiveAlarms(item) > 0;

const eq = (a, b) =>
  String(a ?? '').trim().toLowerCase() === String(b ?? '').trim().toLowerCase();

const getField = (item, keys) => {
  for (const k of keys) {
    const parts = k.split('.');
    let v = item;
    for (const p of parts) v = v?.[p];
    if (v != null && v !== '') return v;
  }
  return '';
};

export const filterByHierarchy = (list = [], { zone, circle, division, area } = {}) => {
  if (!Array.isArray(list) || !list.length) return [];

  return list.filter((item) => {
    const z = getField(item, ['zone', 'siteLocationDTO.zone']);
    const c = getField(item, ['circle', 'siteLocationDTO.circle']);
    const d = getField(item, ['division', 'divison','siteLocationDTO.division', 'siteLocationDTO.divison']);
    const a = getField(item, ['area', 'siteLocationDTO.area', 'name']);

    if (zone && !eq(z, zone)) return false;
    if (circle && !eq(c, circle)) return false;
    if (division && !eq(d, division)) return false;
    if (area && !eq(a, area)) return false;
    return true;
  });
};


export const isCommunicating = (item) => {
  if (!item) return false;
  const flag = item.isNotCommunicating;
  if (flag === false || flag === 'false') return true;
  if (flag === true || flag === 'true') return false;
  return (
    item.statusType === 1 ||
    item.status === 1 ||
    item.communicating === true
  );
};

export const buildCircleStatus = (list = []) => {
  const totalSites = list.length;
  const communicating = list.filter(isCommunicating).length;
  const activeAlarms = list.filter(hasActiveAlarm).length;

  return {
    communicating,
    non_communicating: totalSites - communicating,
    totalMonitoredSites: totalSites,
    activeAlarms,
    modemCommsUptime:
      totalSites > 0 ? `${((communicating / totalSites) * 100).toFixed(1)}%` : '0%',
  };
};

const formatAlarmTime = (item) => {
  const raw =
    item.packetDateTime ||
    item.generalDataDTO?.packetDateTime ||
    item.alarmTime ||
    item.updatedAt;
  if (!raw) return '--';
  try {
    return new Date(raw).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return String(raw);
  }
};

const getAlarmSortKey = (item) => {
  const raw =
    item.packetDateTime ||
    item.generalDataDTO?.packetDateTime ||
    item.alarmTime ||
    item.lastAlarmTime ||
    item.lastUpdatedTime ||
    item.updatedAt ||
    0;
  return raw ? new Date(raw).getTime() || 0 : 0;
};

const pickRepresentativeAlarm = (activeDefs) =>
  ALARM_PRIORITY
    .map((k) => activeDefs.find((d) => d.key === k))
    .find(Boolean) || activeDefs[0];

export const getLatestActiveAlarms = (list = [], limit = 6) => {
  if (!Array.isArray(list) || !list.length) return [];

  const normalized = list
    .map((item) => {
      if (!item || typeof item !== 'object') return null;

      const siteId = item.siteId ?? item.siteID ?? null;
      const serialNumber = item.serialNumber ?? item.serialNo ?? null;
      const deviceKey = siteId || serialNumber;
      if (!deviceKey) return null;

      const activeDefs = ALARM_DEFS.filter((def) => safeCheck(def, item));
      if (activeDefs.length === 0) return null;

      const chosen = pickRepresentativeAlarm(activeDefs);

      return {
        deviceKey,
        id: `${deviceKey}-${chosen.key}`,
        type: chosen.label,
        site:
          item.area ||
          item.siteLocationDTO?.area ||
          item.name ||
          siteId ||
          'Unknown',
        siteId,
        serialNumber,
        time: formatAlarmTime(item),
        activeCount: activeDefs.length,
        _sort: getAlarmSortKey(item),
      };
    })
    .filter(Boolean);

  // Keep only the latest alarm row per device
  const latestByDevice = new Map();
  for (const row of normalized) {
    const existing = latestByDevice.get(row.deviceKey);
    if (!existing || row._sort > existing._sort) {
      latestByDevice.set(row.deviceKey, row);
    }
  }

  return Array.from(latestByDevice.values())
    .sort((a, b) => b._sort - a._sort)
    .slice(0, limit)
    .map(({ _sort, ...rest }) => rest);
};

export const applyFilterChange = (prev, key, value, defaults) => {
  if (key === 'clear') return { ...defaults };

  const next = { ...prev, [key]: value };

  if (key === 'state') {
    next.zone = next.circle = next.division = next.area = '';
  } else if (key === 'zone') {
    next.circle = next.division = next.area = '';
  } else if (key === 'circle') {
    next.division = next.area = '';
  } else if (key === 'division') {
    next.area = '';
  }

  return next;
};
